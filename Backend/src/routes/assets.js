const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const assets = await prisma.asset.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, type, value, symbol, imageUrl } = req.body;
        const asset = await prisma.asset.create({
            data: {
                name,
                type,
                value: parseFloat(value),
                symbol,
                imageUrl,
                userId: req.user.id,
            },
        });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/buy', async (req, res) => {
    try {
        const { name, type, value, symbol, imageUrl, useWallet } = req.body;
        const purchaseValue = parseFloat(value);
        const userId = req.user.id;

        if (useWallet) {
            const cashAssets = await prisma.asset.findMany({
                where: { userId, type: 'CASH' }
            });
            const totalCash = cashAssets.reduce((acc, curr) => acc + curr.value, 0);

            if (totalCash < purchaseValue) {
                return res.status(400).json({ error: 'Insufficient wallet funds' });
            }

            const [newAsset, deduction] = await prisma.$transaction([
                prisma.asset.create({
                    data: {
                        name,
                        type,
                        value: purchaseValue,
                        symbol,
                        imageUrl,
                        userId
                    }
                }),
                prisma.asset.create({
                    data: {
                        name: `Bought ${name}`,
                        type: 'CASH',
                        value: -purchaseValue,
                        symbol: 'USD',
                        userId
                    }
                })
            ]);

            return res.json({ asset: newAsset, deduction });
        } else {
            const asset = await prisma.asset.create({
                data: {
                    name,
                    type,
                    value: purchaseValue,
                    symbol,
                    imageUrl,
                    userId
                }
            });
            return res.json(asset);
        }

    } catch (error) {
        console.error("Buy Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, value, symbol, imageUrl } = req.body;
        const asset = await prisma.asset.update({
            where: { id: parseInt(id) },
            data: {
                name,
                type,
                value: parseFloat(value),
                symbol,
                imageUrl,
            },
        });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.asset.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Asset deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
