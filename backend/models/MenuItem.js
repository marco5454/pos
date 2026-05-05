const mongoose = require('mongoose');

/**
 * MenuItem Schema
 * Represents an ice crumble variant with name and price
 * Used in POS panel for sale processing
 */
const menuItemSchema = new mongoose.Schema({
  // Name of the ice crumble variant (e.g., "Mango Crumble", "Strawberry Delight")
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    unique: true
  },
  
  // Selling price per unit (fully editable by owner)
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Track when item was added to menu
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Track last price update
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
menuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);