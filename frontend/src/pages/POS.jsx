import { useState, useEffect } from 'react';
import { menuItemsAPI, salesAPI } from '../utils/api';

/**
 * POS Page Component
 * Point of Sale interface for processing ice crumble sales
 * Features: Menu grid, cart management, order processing
 */
const POS = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
        quantity: 1
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

  // Remove item from cart
  const removeFromCart = (menuItemId) => {
    setCart(cart.filter(item => item.menuItemId !== menuItemId));
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

    try {
      await salesAPI.create({ items: cart });
      setSuccessMessage('Sale completed successfully! 🎉');
      setCart([]);
      
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
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                className="flex items-center justify-between bg-background p-3 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">₱{item.price.toFixed(2)} each</div>
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
                
                <div className="ml-4 font-bold text-lg">
                  ₱{(item.price * item.quantity).toFixed(2)}
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