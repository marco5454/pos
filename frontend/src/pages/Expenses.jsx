import { useState, useEffect } from 'react';
import { expensesAPI } from '../utils/api';

/**
 * Expenses Page Component
 * Track and manage business expenses (ingredients, packaging, others)
 * Features: Add expense form, expense history, delete functionality
 */
const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Ingredients',
    expenseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expensesAPI.getAll();
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      alert('Failed to load expenses. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please provide valid expense name and amount.');
      return;
    }

    try {
      await expensesAPI.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Reset form
      setFormData({
        name: '',
        amount: '',
        category: 'Ingredients',
        expenseDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      // Refresh expenses list
      fetchExpenses();
      alert('Expense added successfully! ✅');
    } catch (err) {
      console.error('Error creating expense:', err);
      alert('Failed to add expense. Please try again.');
    }
  };

  // Delete expense
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete expense "${name}"?`)) {
      return;
    }

    try {
      await expensesAPI.delete(id);
      fetchExpenses();
      alert('Expense deleted successfully.');
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Failed to delete expense. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate total expenses
  const calculateTotal = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Ingredients':
        return 'bg-primary';
      case 'Packaging':
        return 'bg-secondary';
      case 'Others':
        return 'bg-accent';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800">Expense Tracker</h2>

      {/* Add Expense Form */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Add New Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Expense Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Mango puree, Plastic cups"
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Amount (₱) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="Ingredients">Ingredients</option>
                <option value="Packaging">Packaging</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Date *
            </label>
            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional details..."
              rows="3"
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense History */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Expense History</h3>
          {expenses.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-xl font-bold text-primary">
                ₱{calculateTotal().toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No expenses recorded yet. Add your first expense above.
          </p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="bg-background p-4 rounded-lg border-l-4"
                style={{ borderLeftColor: getCategoryColor(expense.category).replace('bg-', '#') }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{expense.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`${getCategoryColor(expense.category)} text-white text-xs px-2 py-1 rounded`}>
                        {expense.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(expense.expenseDate)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ₱{expense.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleDelete(expense._id, expense.name)}
                      className="text-sm text-red-500 hover:text-red-700 mt-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {expense.notes && (
                  <div className="text-sm text-gray-600 mt-2 italic">
                    {expense.notes}
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

export default Expenses;