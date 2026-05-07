const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

/**
 * Expenses Routes
 * Handles expense tracking for ingredients, packaging, and other costs
 */

// GET /api/expenses - Get all expenses with optional date filtering
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let query = {};
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) {
        query.expenseDate.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.expenseDate.$lte = end;
      }
    }
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    const expenses = await Expense.find(query).sort({ expenseDate: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ 
      message: 'Failed to fetch expenses', 
      error: error.message 
    });
  }
});

// GET /api/expenses/stats/summary - Get expense statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { period = 'today' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let query = {};
    
    if (period === 'all') {
      // No date filter for all-time stats
      query = {};
    } else {
      let startDate = new Date();
      
      if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
      }
      
      query = { expenseDate: { $gte: startDate, $lte: now } };
    }
    
    // Get expenses in date range
    const expenses = await Expense.find(query);
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate expenses by category
    const categoryBreakdown = {
      Ingredients: 0,
      Packaging: 0,
      Others: 0
    };
    
    expenses.forEach(expense => {
      categoryBreakdown[expense.category] += expense.amount;
    });
    
    res.json({
      period,
      totalExpenses,
      totalCount: expenses.length,
      categoryBreakdown
    });
  } catch (error) {
    console.error('Error fetching expense stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch expense statistics', 
      error: error.message 
    });
  }
});

// GET /api/expenses/:id - Get single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ 
      message: 'Failed to fetch expense', 
      error: error.message 
    });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const { name, amount, category, expenseDate, notes } = req.body;
    
    // Validate required fields
    if (!name || amount === undefined || !category) {
      return res.status(400).json({ 
        message: 'Name, amount, and category are required' 
      });
    }
    
    // Validate category
    const validCategories = ['Ingredients', 'Packaging', 'Others'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Category must be Ingredients, Packaging, or Others' 
      });
    }
    
    const expense = new Expense({
      name: name.trim(),
      amount: parseFloat(amount),
      category,
      expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
      notes: notes ? notes.trim() : ''
    });
    
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ 
      message: 'Failed to create expense', 
      error: error.message 
    });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req, res) => {
  try {
    const { name, amount, category, expenseDate, notes } = req.body;
    
    // Validate required fields
    if (!name || amount === undefined || !category) {
      return res.status(400).json({ 
        message: 'Name, amount, and category are required' 
      });
    }
    
    // Validate category
    const validCategories = ['Ingredients', 'Packaging', 'Others'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Category must be Ingredients, Packaging, or Others' 
      });
    }
    
    const updateData = {
      name: name.trim(),
      amount: parseFloat(amount),
      category,
      notes: notes ? notes.trim() : ''
    };
    
    if (expenseDate) {
      updateData.expenseDate = new Date(expenseDate);
    }
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ 
      message: 'Failed to update expense', 
      error: error.message 
    });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json({ 
      message: 'Expense deleted successfully',
      deletedExpense 
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ 
      message: 'Failed to delete expense', 
      error: error.message 
    });
  }
});


module.exports = router;