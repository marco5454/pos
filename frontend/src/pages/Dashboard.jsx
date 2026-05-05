import { useState, useEffect } from 'react';
import { salesAPI, expensesAPI } from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * Dashboard Page Component
 * Analytics and insights for revenue, expenses, and profit
 * Features: Period toggle, statistics cards, expense breakdown chart
 */
const Dashboard = () => {
  const [period, setPeriod] = useState('today');
  const [salesStats, setSalesStats] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch statistics when period changes
  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [salesResponse, expensesResponse] = await Promise.all([
        salesAPI.getStats(period),
        expensesAPI.getStats(period)
      ]);
      setSalesStats(salesResponse.data);
      setExpenseStats(expensesResponse.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      alert('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate net profit
  const calculateProfit = () => {
    if (!salesStats || !expenseStats) return 0;
    return salesStats.totalRevenue - expenseStats.totalExpenses;
  };

  // Prepare data for expense breakdown chart
  const getExpenseChartData = () => {
    if (!expenseStats || !expenseStats.categoryBreakdown) return [];
    
    const { categoryBreakdown } = expenseStats;
    return [
      { name: 'Ingredients', value: categoryBreakdown.Ingredients, color: '#FF6B6B' },
      { name: 'Packaging', value: categoryBreakdown.Packaging, color: '#FFB347' },
      { name: 'Others', value: categoryBreakdown.Others, color: '#C1785A' }
    ].filter(item => item.value > 0);
  };

  // Get period label
  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      default:
        return 'Today';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const profit = calculateProfit();
  const expenseChartData = getExpenseChartData();

  return (
    <div className="space-y-6">
      {/* Page Title and Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('today')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              period === 'today'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              period === 'week'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              period === 'month'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-white">
          <div className="text-sm font-semibold mb-2">Total Revenue</div>
          <div className="text-3xl font-bold mb-1">
            ₱{salesStats?.totalRevenue.toFixed(2) || '0.00'}
          </div>
          <div className="text-sm opacity-90">
            {salesStats?.totalSales || 0} sales {getPeriodLabel().toLowerCase()}
          </div>
        </div>

        {/* Expenses Card */}
        <div className="card bg-gradient-to-br from-accent to-secondary text-white">
          <div className="text-sm font-semibold mb-2">Total Expenses</div>
          <div className="text-3xl font-bold mb-1">
            ₱{expenseStats?.totalExpenses.toFixed(2) || '0.00'}
          </div>
          <div className="text-sm opacity-90">
            {expenseStats?.totalCount || 0} expenses {getPeriodLabel().toLowerCase()}
          </div>
        </div>

        {/* Profit Card */}
        <div className={`card text-white ${
          profit >= 0 
            ? 'bg-gradient-to-br from-green-500 to-green-600' 
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="text-sm font-semibold mb-2">Net Profit</div>
          <div className="text-3xl font-bold mb-1">
            ₱{profit.toFixed(2)}
          </div>
          <div className="text-sm opacity-90">
            {profit >= 0 ? '📈 Profitable' : '📉 Loss'}
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      {salesStats?.bestSellers && salesStats.bestSellers.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Best Sellers ({getPeriodLabel()})
          </h3>
          <div className="space-y-3">
            {salesStats.bestSellers.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-background p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} sold
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    ₱{item.revenue.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Breakdown Chart */}
      {expenseChartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Expense Breakdown ({getPeriodLabel()})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₱${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Category Details */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-sm text-gray-600">Ingredients</div>
              <div className="text-lg font-bold text-primary">
                ₱{expenseStats.categoryBreakdown.Ingredients.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-sm text-gray-600">Packaging</div>
              <div className="text-lg font-bold text-secondary">
                ₱{expenseStats.categoryBreakdown.Packaging.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-sm text-gray-600">Others</div>
              <div className="text-lg font-bold text-accent">
                ₱{expenseStats.categoryBreakdown.Others.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {salesStats?.totalSales === 0 && expenseStats?.totalCount === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Yet</h3>
          <p className="text-gray-600">
            Start recording sales and expenses to see your dashboard analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;