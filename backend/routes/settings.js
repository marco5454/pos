const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

/**
 * Settings Routes
 * Manages application settings including starting capital
 */

// GET /api/settings - Get current settings
router.get('/', async (req, res) => {
  try {
    // Find the single settings document, or create default if none exists
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        startingCapital: 0
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch settings', 
      error: error.message 
    });
  }
});

// PUT /api/settings - Update settings
router.put('/', async (req, res) => {
  try {
    const { startingCapital } = req.body;
    
    // Validate starting capital
    if (startingCapital === undefined || startingCapital === null) {
      return res.status(400).json({ 
        message: 'Starting capital is required' 
      });
    }
    
    const capitalValue = parseFloat(startingCapital);
    if (isNaN(capitalValue) || capitalValue < 0) {
      return res.status(400).json({ 
        message: 'Starting capital must be a non-negative number' 
      });
    }
    
    // Find existing settings or create new
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings document
      settings = new Settings({
        startingCapital: capitalValue
      });
    } else {
      // Update existing settings
      settings.startingCapital = capitalValue;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ 
      message: 'Failed to update settings', 
      error: error.message 
    });
  }
});

module.exports = router;