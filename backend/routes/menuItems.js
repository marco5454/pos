const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

/**
 * Menu Items Routes
 * Handles CRUD operations for ice crumble variants
 */

// GET /api/menu-items - Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ 
      message: 'Failed to fetch menu items', 
      error: error.message 
    });
  }
});

// GET /api/menu-items/:id - Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ 
      message: 'Failed to fetch menu item', 
      error: error.message 
    });
  }
});

// POST /api/menu-items - Create new menu item
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body;
    
    // Validate required fields
    if (!name || price === undefined) {
      return res.status(400).json({ 
        message: 'Name and price are required' 
      });
    }
    
    // Check if item with same name already exists
    const existingItem = await MenuItem.findOne({ name: name.trim() });
    if (existingItem) {
      return res.status(400).json({ 
        message: 'Menu item with this name already exists' 
      });
    }
    
    const menuItem = new MenuItem({
      name: name.trim(),
      price: parseFloat(price)
    });
    
    const savedItem = await menuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ 
      message: 'Failed to create menu item', 
      error: error.message 
    });
  }
});

// PUT /api/menu-items/:id - Update menu item
router.put('/:id', async (req, res) => {
  try {
    const { name, price } = req.body;
    
    // Validate required fields
    if (!name || price === undefined) {
      return res.status(400).json({ 
        message: 'Name and price are required' 
      });
    }
    
    // Check if another item with same name exists
    const existingItem = await MenuItem.findOne({ 
      name: name.trim(),
      _id: { $ne: req.params.id }
    });
    
    if (existingItem) {
      return res.status(400).json({ 
        message: 'Another menu item with this name already exists' 
      });
    }
    
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { 
        name: name.trim(), 
        price: parseFloat(price),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ 
      message: 'Failed to update menu item', 
      error: error.message 
    });
  }
});

// DELETE /api/menu-items/:id - Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ 
      message: 'Menu item deleted successfully',
      deletedItem 
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ 
      message: 'Failed to delete menu item', 
      error: error.message 
    });
  }
});

module.exports = router;