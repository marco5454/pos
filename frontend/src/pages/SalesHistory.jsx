import { useState, useEffect } from 'react';
import { salesAPI } from '../utils/api';

/**
 * Sales History Page Component
 * View, filter, edit dates, and delete past sales transactions
 * Features: Transaction list, date editing, filtering, delete functionality
 */
const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Fetch sales on component mount and when filter changes
  useEffect(() => {
    fetchSales();
  }, [filter]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on filter
      let params = {};
      if (filter !== 'all') {
        const now = new Date();
        const startDate = new Date();
        
        if (filter === 'today') {
          startDate.setHours(0, 0, 0, 0);
        } else if (filter === 'week') {
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
        } else if (filter === 'month') {
          startDate.setMonth(now.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
        }
        
        params.startDate = startDate.toISOString();
        params.endDate = now.toISOString();
      }
      
      const response = await salesAPI.getAll(params);
      setSales(response.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
      alert('Failed to load sales history. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Start editing sale date
  const startEditing = (sale) => {
    setEditingId(sale._id);
    setEditDate(formatDateForInput(sale.saleDate));
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditDate('');
  };

  // Save edited date
  const saveDate = async (id) => {
    if (!editDate) {
      alert('Please select a valid date.');
      return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(editDate);
    const now = new Date();
    if (selectedDate > now) {
      alert('Sale date cannot be in the future.');
      return;
    }

    try {
      await salesAPI.update(id, { saleDate: editDate });
      setEditingId(null);
      setEditDate('');
      fetchSales();
      alert('Sale date updated successfully! ✅');
    } catch (err) {
      console.error('Error updating sale:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Failed to update sale date. Please try again.');
      }
    }
  };

  // Delete sale
  const handleDelete = async (id, total) => {
    if (!confirm(`Delete sale of ₱${total.toFixed(2)}?`)) {
      return;
    }

    try {
      await salesAPI.delete(id);
      fetchSales();
      alert('Sale deleted successfully.');
    } catch (err) {
      console.error('Error deleting sale:', err);
      alert('Failed to delete sale. Please try again.');
    }
  };

  // Toggle expanded view
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Calculate total revenue
  const calculateTotal = () => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Page Title and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Sales History</h2>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === 'today'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === 'week'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === 'month'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Summary Card */}
      {sales.length > 0 && (
        <div className="card bg-primary text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-bold mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Total Sales</div>
              <div className="text-3xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>₱{calculateTotal().toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Transactions</div>
              <div className="text-3xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>{sales.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Sales List */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Transactions {filter !== 'all' && `(${filter})`}
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading sales...</div>
        ) : sales.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Sales Yet</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Start making sales in the POS to see them here.'
                : `No sales found for ${filter}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <div
                key={sale._id}
                className="bg-background p-4 rounded-lg border-2 border-accent"
              >
                {/* Sale Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    {editingId === sale._id ? (
                      // Edit Mode
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Edit Sale Date
                        </label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="input-field"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveDate(sale._id)}
                            className="btn-primary text-sm py-2 px-4"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn-secondary text-sm py-2 px-4"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="text-sm text-gray-600 mb-1">
                          {formatDate(sale.saleDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {editingId !== sale._id && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-2">
                        ₱{sale.total.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleExpanded(sale._id)}
                          className="text-sm text-secondary hover:text-primary font-semibold"
                        >
                          {expandedId === sale._id ? 'Hide' : 'Details'}
                        </button>
                        <button
                          onClick={() => startEditing(sale)}
                          className="text-sm text-secondary hover:text-primary font-semibold"
                        >
                          Edit Date
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id, sale.total)}
                          className="text-sm text-red-500 hover:text-red-700 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedId === sale._id && (
                  <div className="mt-4 pt-4 border-t-2 border-accent">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Items:</div>
                    <div className="space-y-2">
                      {sale.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-2 rounded"
                        >
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs text-gray-600">
                              ₱{item.price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                          <div className="font-bold text-primary">
                            ₱{item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;