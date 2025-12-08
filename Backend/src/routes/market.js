const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

// Get latest market data
// Utilizing the "COINDESK_API_KEY" via CryptoCompare API as it matches the key format best.
router.get('/latest', authenticateToken, async (req, res) => {
    try {
        const apiKey = process.env.COINDESK_API_KEY;
        const { page = 0, limit = 20, search = '' } = req.query;

        let response;

        if (search) {
            // If search is provided, we try to find specific coins by Symbol
            // The top list endpoint doesn't support search well, so we use pricemultifull for specific symbols
            // We assume the user types a symbol (e.g., "BTC", "ETH"). 
            // We can also try the 'all/coinlist' but it's heavy. Let's try direct symbol lookup.
            const symbols = search.toUpperCase().split(' ').join(','); // basic comma separation if multiple

            response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: symbols,
                    tsyms: 'USD',
                    api_key: apiKey
                }
            });

            if (response.data.Message && response.data.Message.startsWith('Error')) {
                // Try to fallback or return empty if symbol not found
                return res.json([]);
            }

            // specific format for pricemultifull is different: RAW: { BTC: { USD: { ... } } }
            // We need to map it to our standardized array format
            const rawData = response.data.RAW;
            if (!rawData) return res.json([]);

            const formattedData = Object.keys(rawData).map(key => {
                const coin = rawData[key].USD;
                // We need to fetch Display info for image/fullname if possible, but RAW has some.
                // Actually RAW data usually lacks FullName/ImageUrl in simple form unless we use the 'display' user
                // Let's check DISPLAY object if available
                const displayInfo = response.data.DISPLAY ? response.data.DISPLAY[key]?.USD : {};

                return {
                    id: key,
                    name: key, // FullName missing in this endpoint easily, using Symbol
                    symbol: key,
                    price: coin.PRICE || 0,
                    change24h: coin.CHANGEPCT24HOUR || 0,
                    marketCap: coin.MKTCAP || 0,
                    volume24h: coin.VOLUME24HOUR || 0,
                    imageUrl: displayInfo.IMAGEURL ? `https://www.cryptocompare.com${displayInfo.IMAGEURL}` : ''
                };
            });

            return res.json(formattedData);

        } else {
            // Standard Top List with Pagination
            response = await axios.get('https://min-api.cryptocompare.com/data/top/mktcapfull', {
                params: {
                    limit: limit,
                    page: page,
                    tsym: 'USD',
                    api_key: apiKey
                }
            });

            if (response.data.Message === 'Success') {
                const formattedData = response.data.Data.map(coin => ({
                    id: coin.CoinInfo.Name,
                    name: coin.CoinInfo.FullName,
                    symbol: coin.CoinInfo.Name,
                    price: coin.RAW?.USD?.PRICE || 0,
                    change24h: coin.RAW?.USD?.CHANGEPCT24HOUR || 0,
                    marketCap: coin.RAW?.USD?.MKTCAP || 0,
                    volume24h: coin.RAW?.USD?.VOLUME24HOUR || 0,
                    imageUrl: `https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`
                }));
                res.json(formattedData);
            } else {
                console.error('Crypto API Error:', response.data);
                res.status(500).json({ error: 'Failed to fetch market data' });
            }
        }

    } catch (error) {
        console.error('Market Route Error:', error.message);
        res.status(500).json({ error: 'Internal server error while fetching market data' });
    }
});

// Get historical portfolio value (Last 24h)
router.get('/portfolio-history', authenticateToken, async (req, res) => {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        // 1. Fetch user's assets that have a symbol (Cryptos)
        const assets = await prisma.asset.findMany({
            where: {
                userId: req.user.id,
                type: 'crypto',
                symbol: { not: null }
            }
        });

        if (assets.length === 0) {
            return res.json([]); // No crypto assets
        }

        const apiKey = process.env.COINDESK_API_KEY;
        const historyDataMap = {}; // symbol -> [price history]

        // 2. Fetch history for each unique symbol
        const uniqueSymbols = [...new Set(assets.map(a => a.symbol))];

        await Promise.all(uniqueSymbols.map(async (symbol) => {
            try {
                // Fetch last 24h hourly data
                const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histohour`, {
                    params: {
                        fsym: symbol,
                        tsym: 'USD',
                        limit: 24,
                        api_key: apiKey
                    }
                });

                if (response.data.Message === 'Success') {
                    historyDataMap[symbol] = response.data.Data.Data; // Array of { time, close, ... }
                }
            } catch (err) {
                console.error(`Failed to fetch history for ${symbol}`, err.message);
            }
        }));

        // 3. Aggregate Portfolio Value over time
        // We assume we have 25 data points (limit 24 + current)
        // If fetch failed, we skip that asset or use current value flat

        const aggregatedHistory = [];

        // Helper: Get price for symbol at specific index (0 = oldest, 24 = newest)
        const getPriceAtIdx = (symbol, idx) => {
            const history = historyDataMap[symbol];
            if (!history || !history[idx]) return 0; // Should fallback to current price maybe?
            return history[idx].close;
        };

        // We need the *current* price to determine quantity
        // Quantity = Asset.value (User Entered) / Current Price (from API latest or just history[last])

        const assetQuantities = assets.map(asset => {
            const history = historyDataMap[asset.symbol];
            if (!history || history.length === 0) return { asset, qty: 0 };

            const currentPrice = history[history.length - 1].close; // Recent close price ~ current
            const qty = currentPrice > 0 ? asset.value / currentPrice : 0;
            return { asset, qty };
        });

        // 25 Hours of data points
        for (let i = 0; i <= 24; i++) {
            let totalValueAtTime = 0;
            let timestamp = 0;

            assetQuantities.forEach(({ asset, qty }) => {
                const history = historyDataMap[asset.symbol];
                if (history && history[i]) {
                    totalValueAtTime += qty * history[i].close;
                    timestamp = history[i].time;
                } else {
                    // Fallback: if no history found, just add current value (flat line assumption for missing data)
                    totalValueAtTime += asset.value;
                }
            });

            if (timestamp > 0) {
                aggregatedHistory.push({
                    time: timestamp,
                    value: totalValueAtTime
                });
            }
        }

        res.json(aggregatedHistory);

    } catch (error) {
        console.error('Portfolio History Error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio history' });
    }
});

module.exports = router;
