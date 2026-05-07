import { useState, useEffect } from 'react';
import { menuItemsAPI, salesAPI } from '../utils/api';

/**
 * POS Page Component
 * Point of Sale interface for processing ice crumble sales
 * Features: Menu grid, cart management, order processing with custom pricing
 */
const POS = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingItemId, setEditingItemId] = useState(null);

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuItemsAPI.getAll();
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load menu items. Please refresh the page.');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart or increase quantity
  const addToCart = (menuItem) => {
    const existingItem = cart.find(item => item.menuItemId === menuItem._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuItemId === menuItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        originalPrice: menuItem.price, // Store original price for reference
        quantity: 1,
        customNote: '' // For tracking customizations
      }]);
    }
  };

  // Update item quantity in cart
  const updateQuantity = (menuItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCart(cart.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Update item price (for custom pricing)
  const updatePrice = (menuItemId, newPrice) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;
    
    setCart(cart.map(item =>
      item.menuItemId === menuItemId
        ? { ...item, price: price }
        : item
    ));
  };

  // Update item custom note
  const updateCustomNote = (menuItemId, note) => {
    setCart(cart.map(item =>
      item.menuItemId === menuItemId
        ? { ...item, customNote: note }
        : item
    ));
  };

  // Toggle edit mode for an item
  const toggleEditMode = (menuItemId) => {
    setEditingItemId(editingItemId === menuItemId ? null : menuItemId);
  };

  // Reset item to original price
  const resetToOriginalPrice = (menuItemId) => {
    setCart(cart.map(item =>
      item.menuItemId === menuItemId
        ? { ...item, price: item.originalPrice, customNote: '' }
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (menuItemId) => {
    setCart(cart.filter(item => item.menuItemId !== menuItemId));
    if (editingItemId === menuItemId) {
      setEditingItemId(null);
    }
  };

  // Calculate cart total
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Process sale
  const confirmSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty. Add items before confirming sale.');
      return;
    }

    // Validate sale date is not in the future
    const selectedDate = new Date(saleDate);
    const now = new Date();
    if (selectedDate > now) {
      alert('Sale date cannot be in the future.');
      return;
    }

    try {
      // Prepare items with custom notes in the name if applicable
      const itemsToSend = cart.map(item => ({
        menuItemId: item.menuItemId,
        name: item.customNote ? `${item.name} (${item.customNote})` : item.name,
        price: item.price,
        quantity: item.quantity
      }));

      await salesAPI.create({ 
        items: itemsToSend,
        saleDate: saleDate 
      });
      setSuccessMessage('Sale completed successfully! 🎉');
      setCart([]);
      setEditingItemId(null);
      setSaleDate(new Date().toISOString().split('T')[0]); // Reset to current date
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to process sale. Please try again.');
      console.error('Error creating sale:', err);
    }
  };

  // Clear cart
  const clearCart = () => {
    if (cart.length > 0 && confirm('Clear all items from cart?')) {
      setCart([]);
      setEditingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600" style={{ fontFamily: 'Verdana, sans-serif' }}>Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'Verdana, sans-serif' }}>
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Point of Sale</h2>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-accent hover:text-primary transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-secondary text-white p-4 rounded-lg text-center font-semibold">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Menu Items</h3>
        {menuItems.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No menu items available. Add items in Settings.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {menuItems.map((item) => (
              <button
                key={item._id}
                onClick={() => addToCart(item)}
                className="bg-background hover:bg-secondary hover:text-white border-2 border-accent p-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="text-lg font-bold mb-2">{item.name}</div>
                <div className="text-xl font-semibold">₱{item.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sale Date Picker */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Sale Date</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">
            Date:
          </label>
          <input
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="input-field flex-1"
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          💡 Select a past date for late entries. Future dates are not allowed.
        </p>
      </div>

      {/* Cart */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Cart {cart.length > 0 && `(${cart.length} items)`}
        </h3>
        
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Cart is empty</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.menuItemId}
                className="bg-background p-3 rounded-lg border-2 border-transparent hover:border-accent transition-colors"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{item.name}</div>
                    {item.customNote && (
                      <div className="text-xs text-accent mt-1">
                        📝 {item.customNote}
                      </div>
                    )}
                    {item.price !== item.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        Original: ₱{item.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleEditMode(item.menuItemId)}
                    className="text-sm px-3 py-1 bg-accent text-white rounded hover:bg-primary transition-colors"
                  >
                    {editingItemId === item.menuItemId ? 'Done' : 'Edit'}
                  </button>
                </div>

                {/* Edit Mode */}
                {editingItemId === item.menuItemId && (
                  <div className="mb-3 p-3 bg-white rounded border border-accent space-y-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Custom Price (₱):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => updatePrice(item.menuItemId, e.target.value)}
                        className="input-field w-full text-sm"
                        placeholder="Enter custom price"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Customization Note:
                      </label>
                      <input
                        type="text"
                        value={item.customNote}
                        onChange={(e) => updateCustomNote(item.menuItemId, e.target.value)}
                        className="input-field w-full text-sm"
                        placeholder="e.g., no toppings, extra syrup"
                      />
                    </div>

                    {item.price !== item.originalPrice && (
                      <button
                        onClick={() => resetToOriginalPrice(item.menuItemId)}
                        className="text-xs text-secondary hover:text-primary underline"
                      >
                        Reset to original price
                      </button>
                    )}
                  </div>
                )}

                {/* Quantity Controls and Price */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    ₱{item.price.toFixed(2)} each
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="w-8 h-8 bg-accent text-white rounded-full hover:bg-primary transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="w-8 h-8 bg-accent text-white rounded-full hover:bg-primary transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="ml-2 text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="font-bold text-lg">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Total */}
            <div className="border-t-2 border-accent pt-3 mt-3">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">₱{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            {/* Confirm Sale Button */}
            <button
              onClick={confirmSale}
              className="btn-primary w-full text-lg py-4"
            >
              Confirm Sale
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;