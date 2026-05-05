const mongoose = require('mongoose');

/**
 * Expense Schema
 * Tracks all business expenses including ingredients, packaging, and other costs
 * Used for profit calculation and expense analysis
 */
const expenseSchema = new mongoose.Schema({
  // Name/description of the expense item
  name: {
    type: String,
    required: [true, 'Expense name is required'],
    trim: true
  },
  
  // Cost amount
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  
  // Category for expense classification
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Ingredients', 'Packaging', 'Others'],
      message: 'Category must be Ingredients, Packaging, or Others'
    }
  },
  
  // Date of the expense
  expenseDate: {
    type: Date,
    required: [true, 'Expense date is required'],
    default: Date.now
  },
  
  // Optional notes about the expense
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Track when expense was recorded
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster date-based queries (for daily/weekly reports)
expenseSchema.index({ expenseDate: -1 });

module.exports = mongoose.model('Expense', expenseSchema);