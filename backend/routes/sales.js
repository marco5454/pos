const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const MenuItem = require('../models/MenuItem');

/**
 * Sales Routes
 * Handles sale transactions from POS panel
 */

// GET /api/sales - Get all sales with optional date filtering
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) {
        query.saleDate.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }
    
    const sales = await Sale.find(query)
      .sort({ saleDate: -1 })
      .populate('items.menuItemId', 'name price');
    
    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ 
      message: 'Failed to fetch sales', 
      error: error.message 
    });
  }
});

// GET /api/sales/stats/summary - Get sales statistics
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
      
      query = { saleDate: { $gte: startDate, $lte: now } };
    }
    
    // Get sales in date range
    const sales = await Sale.find(query);
    
    // Calculate total revenue
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Calculate best-selling items
    const itemStats = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        itemStats[item.name].quantity += item.quantity;
        itemStats[item.name].revenue += item.subtotal;
      });
    });
    
    const bestSellers = Object.values(itemStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    
    res.json({
      period,
      totalRevenue,
      totalSales: sales.length,
      bestSellers
    });
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch sales statistics', 
      error: error.message 
    });
  }
});

// GET /api/sales/:id - Get single sale
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('items.menuItemId', 'name price');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ 
      message: 'Failed to fetch sale', 
      error: error.message 
    });
  }
});

// POST /api/sales - Create new sale
router.post('/', async (req, res) => {
  try {
    const { items, saleDate } = req.body;
    
    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        message: 'Sale must contain at least one item' 
      });
    }
    
    // Validate and enrich each item with current menu data
    const enrichedItems = [];
    let total = 0;
    
    for (const item of items) {
      // Verify menu item exists
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ 
          message: `Menu item ${item.menuItemId} not found` 
        });
      }
      
      // Calculate subtotal
      const quantity = parseInt(item.quantity);
      const price = parseFloat(menuItem.price);
      const subtotal = price * quantity;
      
      enrichedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: price,
        quantity: quantity,
        subtotal: subtotal
      });
      
      total += subtotal;
    }
    
    // Create sale record
    const sale = new Sale({
      items: enrichedItems,
      total: total,
      saleDate: saleDate ? new Date(saleDate) : new Date()
    });
    
    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ 
      message: 'Failed to create sale', 
      error: error.message 
    });
  }
});

// PUT /api/sales/:id - Update sale (for date corrections)
router.put('/:id', async (req, res) => {
  try {
    const { saleDate } = req.body;
    
    // Validate sale date
    if (!saleDate) {
      return res.status(400).json({ 
        message: 'Sale date is required' 
      });
    }
    
    const newDate = new Date(saleDate);
    const now = new Date();
    
    // Prevent future dates
    if (newDate > now) {
      return res.status(400).json({ 
        message: 'Sale date cannot be in the future' 
      });
    }
    
    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      { saleDate: newDate },
      { new: true, runValidators: true }
    ).populate('items.menuItemId', 'name price');
    
    if (!updatedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json(updatedSale);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ 
      message: 'Failed to update sale', 
      error: error.message 
    });
  }
});

// DELETE /api/sales/:id - Delete sale (for corrections)
router.delete('/:id', async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    
    if (!deletedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json({ 
      message: 'Sale deleted successfully',
      deletedSale 
    });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ 
      message: 'Failed to delete sale', 
      error: error.message 
    });
  }
});


module.exports = router;