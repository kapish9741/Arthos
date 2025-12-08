const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

router.get('/latest', authenticateToken, async (req, res) => {
    try {
        const apiKey = process.env.COINDESK_API_KEY;
        const { page = 0, limit = 20, search = '' } = req.query;

        let response;

        if (search) {
            const symbols = search.toUpperCase().split(' ').join(','); 

            response = await axios.get('https://min-api.cryptocompare.com/data/pricemultifull', {
                params: {
                    fsyms: symbols,
                    tsyms: 'USD',
                    api_key: apiKey
                }
            });

            if (response.data.Message && response.data.Message.startsWith('Error')) {

                return res.json([]);
            }

            const rawData = response.data.RAW;
            if (!rawData) return res.json([]);

            const formattedData = Object.keys(rawData).map(key => {
                const coin = rawData[key].USD;
                const displayInfo = response.data.DISPLAY ? response.data.DISPLAY[key]?.USD : {};

                return {
                    id: key,
                    name: key,
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

router.get('/portfolio-history', authenticateToken, async (req, res) => {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const assets = await prisma.asset.findMany({
            where: {
                userId: req.user.id,
                type: 'crypto',
                symbol: { not: null }
            }
        });

        if (assets.length === 0) {
            return res.json([]); 
        }

        const apiKey = process.env.COINDESK_API_KEY;
        const historyDataMap = {}; 

        const uniqueSymbols = [...new Set(assets.map(a => a.symbol))];

        await Promise.all(uniqueSymbols.map(async (symbol) => {
            try {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histohour`, {
                    params: {
                        fsym: symbol,
                        tsym: 'USD',
                        limit: 24,
                        api_key: apiKey
                    }
                });

                if (response.data.Message === 'Success') {
                    historyDataMap[symbol] = response.data.Data.Data;
                }
            } catch (err) {
                console.error(`Failed to fetch history for ${symbol}`, err.message);
            }
        }));


        const aggregatedHistory = [];
        const getPriceAtIdx = (symbol, idx) => {
            const history = historyDataMap[symbol];
            if (!history || !history[idx]) return 0;
            return history[idx].close;
        };
        const assetQuantities = assets.map(asset => {
            const history = historyDataMap[asset.symbol];
            if (!history || history.length === 0) return { asset, qty: 0 };

            const currentPrice = history[history.length - 1].close; 
            const qty = currentPrice > 0 ? asset.value / currentPrice : 0;
            return { asset, qty };
        });

        for (let i = 0; i <= 24; i++) {
            let totalValueAtTime = 0;
            let timestamp = 0;

            assetQuantities.forEach(({ asset, qty }) => {
                const history = historyDataMap[asset.symbol];
                if (history && history[i]) {
                    totalValueAtTime += qty * history[i].close;
                    timestamp = history[i].time;
                } else {
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
