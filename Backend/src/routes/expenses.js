const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Get all expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            where: { userId: req.user.id },
            orderBy: { date: 'desc' }
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add expense
router.post('/', async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        const expense = await prisma.expense.create({
            data: {
                title,
                amount: parseFloat(amount),
                category,
                date: date ? new Date(date) : new Date(),
                userId: req.user.id,
            },
        });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update expense
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, date } = req.body;
        const expense = await prisma.expense.update({
            where: { id: parseInt(id) },
            data: {
                title,
                amount: parseFloat(amount),
                category,
                date: date ? new Date(date) : undefined,
            },
        });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete expense
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.expense.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
