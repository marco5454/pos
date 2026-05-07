const mongoose = require('mongoose');

/**
 * Settings Schema
 * Stores application-wide settings including starting capital
 * Single document approach - only one settings record exists
 */
const settingsSchema = new mongoose.Schema({
  // Starting capital/initial investment for the business
  startingCapital: {
    type: Number,
    required: [true, 'Starting capital is required'],
    min: [0, 'Starting capital cannot be negative'],
    default: 0
  },
  
  // Track when settings were last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
settingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);