const express = require('express');
const router = express.Router();
const coinGeckoService = require('../service/coingecko');

// Crypto Routes
router.get('/crypto/list', async (req, res) => {
  try {
    const { vs_currency, order, per_page, page, sparkline, price_change_percentage } = req.query;
    
    const data = await coinGeckoService.getCryptoList({
      vs_currency,
      order,
      per_page: per_page ? parseInt(per_page) : undefined,
      page: page ? parseInt(page) : undefined,
      sparkline: sparkline === 'true',
      price_change_percentage
    });

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/crypto/details/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const data = await coinGeckoService.getCryptoDetails(coinId);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/crypto/trending', async (req, res) => {
  try {
    const data = await coinGeckoService.getTrendingCrypto();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/crypto/chart/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const { vs_currency, days, interval } = req.query;

    const data = await coinGeckoService.getCryptoMarketChart(coinId, {
      vs_currency,
      days: days ? parseInt(days) : undefined,
      interval
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// NFT Routes
router.get('/nft/list', async (req, res) => {
  try {
    const { order, per_page, page } = req.query;
    
    const data = await coinGeckoService.getNFTList({
      order,
      per_page: per_page ? parseInt(per_page) : undefined,
      page: page ? parseInt(page) : undefined
    });

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/nft/details/:nftId', async (req, res) => {
  try {
    const { nftId } = req.params;
    const data = await coinGeckoService.getNFTDetails(nftId);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/nft/trending', async (req, res) => {
  try {
    const data = await coinGeckoService.getTrendingNFTs();

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/nft/chart/:nftId', async (req, res) => {
  try {
    const { nftId } = req.params;
    const { days } = req.query;

    const data = await coinGeckoService.getNFTMarketChart(nftId, {
      days: days ? parseInt(days) : undefined
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Global Market Data
router.get('/global', async (req, res) => {
  try {
    const data = await coinGeckoService.getGlobalMarketData();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
