const mongoose = require('mongoose');

/**
 * Sale Schema
 * Represents a completed transaction from the POS panel
 * Tracks items sold, quantities, and total revenue
 */
const saleSchema = new mongoose.Schema({
  // Array of items in this sale
  items: [{
    // Reference to the menu item
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    
    // Name of the item (stored for historical record even if menu item is deleted)
    name: {
      type: String,
      required: true
    },
    
    // Price at time of sale (stored for historical accuracy)
    price: {
      type: Number,
      required: true,
      min: 0
    },
    
    // Quantity sold
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    
    // Subtotal for this item (price * quantity)
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // Total amount for the entire sale
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0
  },
  
  // Timestamp of when the sale was completed
  saleDate: {
    type: Date,
    default: Date.now
  }
});

// Calculate total before saving
saleSchema.pre('save', function(next) {
  // Calculate total from items if not already set
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema);