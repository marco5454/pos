import { useState, useEffect } from 'react';
import { menuItemsAPI } from '../utils/api';

/**
 * Settings Page Component
 * Menu management - Add, edit, delete ice crumble variants
 * Features: Menu item CRUD, inline editing, price management
 */
const Settings = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: ''
  });

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuItemsAPI.getAll();
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      alert('Failed to load menu items. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Handle add form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new menu item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || parseFloat(formData.price) <= 0) {
      alert('Please provide valid item name and price.');
      return;
    }

    try {
      await menuItemsAPI.create({
        name: formData.name.trim(),
        price: parseFloat(formData.price)
      });
      
      setFormData({ name: '', price: '' });
      fetchMenuItems();
      alert('Menu item added successfully! ✅');
    } catch (err) {
      console.error('Error creating menu item:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Failed to add menu item. Please try again.');
      }
    }
  };

  // Start editing an item
  const startEditing = (item) => {
    setEditingId(item._id);
    setEditFormData({
      name: item.name,
      price: item.price.toString()
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({ name: '', price: '' });
  };

  // Save edited item
  const saveEdit = async (id) => {
    if (!editFormData.name.trim() || !editFormData.price || parseFloat(editFormData.price) <= 0) {
      alert('Please provide valid item name and price.');
      return;
    }

    try {
      await menuItemsAPI.update(id, {
        name: editFormData.name.trim(),
        price: parseFloat(editFormData.price)
      });
      
      setEditingId(null);
      fetchMenuItems();
      alert('Menu item updated successfully! ✅');
    } catch (err) {
      console.error('Error updating menu item:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Failed to update menu item. Please try again.');
      }
    }
  };

  // Delete menu item
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" from menu?`)) {
      return;
    }

    try {
      await menuItemsAPI.delete(id);
      fetchMenuItems();
      alert('Menu item deleted successfully.');
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {/* Add New Menu Item */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Add New Menu Item</h3>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Mango Crumble"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Price (₱) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input-field"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            Add Menu Item
          </button>
        </form>
      </div>

      {/* Menu Items List */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Menu Items ({menuItems.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading menu items...</div>
        ) : menuItems.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No menu items yet. Add your first item above.
          </p>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-background p-4 rounded-lg border-2 border-accent"
              >
                {editingId === item._id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        className="input-field"
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditInputChange}
                        className="input-field"
                        placeholder="Price"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(item._id)}
                        className="btn-primary flex-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Added: {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold text-primary">
                          ₱{item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(item)}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App Information */}
      <div className="card bg-gradient-to-br from-primary to-secondary text-white">
        <h3 className="text-lg font-bold mb-3">🧊 Ice Crumble POS</h3>
        <div className="space-y-2 text-sm opacity-90">
          <p>Version 1.0.0</p>
          <p>Mobile-first Point of Sale System</p>
          <p>Built with MERN Stack</p>
          <p className="pt-2 border-t border-white/20">
            Design: Summer-Autumn Palette | Verdana Font
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;