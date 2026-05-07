import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salesAPI, expensesAPI, settingsAPI } from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * Dashboard Page Component
 * Analytics and insights for revenue, expenses, profit, and cash balance
 * Features: Period toggle, statistics cards, expense breakdown chart, current balance tracking
 */
const Dashboard = () => {
  const [period, setPeriod] = useState('today');
  const [salesStats, setSalesStats] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingCapital, setStartingCapital] = useState(0);
  const [allTimeSales, setAllTimeSales] = useState(0);
  const [allTimeExpenses, setAllTimeExpenses] = useState(0);

  // Fetch statistics when period changes
  useEffect(() => {
    fetchStats();
    fetchAllTimeStats();
    fetchSettings();
  }, [period]);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setStartingCapital(response.data.startingCapital || 0);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const fetchAllTimeStats = async () => {
    try {
      const [salesResponse, expensesResponse] = await Promise.all([
        salesAPI.getStats('all'),
        expensesAPI.getStats('all')
      ]);
      setAllTimeSales(salesResponse.data.totalRevenue || 0);
      setAllTimeExpenses(expensesResponse.data.totalExpenses || 0);
    } catch (err) {
      console.error('Error fetching all-time statistics:', err);
    }
  };

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
        <div className="text-xl text-accent font-bold">Loading dashboard...</div>
      </div>
    );
  }

  const profit = calculateProfit();
  const expenseChartData = getExpenseChartData();
  const currentBalance = startingCapital + allTimeSales - allTimeExpenses;

  return (
    <div className="space-y-6">
      {/* Page Title and Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-black">Dashboard</h2>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setPeriod('today')}
            className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
              period === 'today'
                ? 'bg-primary text-white'
                : 'bg-white text-black border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
              period === 'week'
                ? 'bg-primary text-white'
                : 'bg-white text-black border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
              period === 'month'
                ? 'bg-primary text-white'
                : 'bg-white text-black border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
              period === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-black border-2 border-accent hover:bg-accent hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Current Cash Balance Card - Always Visible */}
      <div className="card bg-gradient-to-br from-secondary to-primary border-4 border-accent shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black drop-shadow-md">💰 Current Cash Balance</h3>
          <Link 
            to="/settings" 
            className="text-xs bg-white hover:bg-background px-3 py-1 rounded-lg transition-colors font-semibold text-black"
          >
            Set Capital
          </Link>
        </div>
        
        <div className="text-6xl font-bold mb-4 text-black drop-shadow-lg">
          ₱{currentBalance.toFixed(2)}
        </div>
        
        <div className="bg-white rounded-lg p-4 space-y-2 text-sm border-2 border-accent">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-black">Starting Capital:</span>
            <span className="font-bold text-black">₱{startingCapital.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-black">Total Sales (All Time):</span>
            <span className="font-bold text-secondary">+₱{allTimeSales.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-black">Total Expenses (All Time):</span>
            <span className="font-bold text-primary">-₱{allTimeExpenses.toFixed(2)}</span>
          </div>
          <div className="border-t-2 border-accent pt-2 mt-2 flex justify-between items-center">
            <span className="font-bold text-base text-black">Available Balance:</span>
            <span className="font-bold text-2xl text-accent">₱{currentBalance.toFixed(2)}</span>
          </div>
        </div>
        
        {startingCapital === 0 && (
          <div className="mt-4 bg-white rounded-lg p-3 text-sm border-2 border-accent">
            <p className="font-semibold text-black">⚠️ Set your starting capital in Settings to track your balance accurately.</p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="bg-primary border-4 border-secondary rounded-xl shadow-md p-5">
          <div className="text-base font-bold mb-3 text-white drop-shadow-md">Total Revenue</div>
          <div className="text-5xl font-bold mb-3 text-white drop-shadow-lg">
            ₱{salesStats?.totalRevenue.toFixed(2) || '0.00'}
          </div>
          <div className="text-lg font-bold text-white drop-shadow-md">
            {salesStats?.totalSales || 0} sales {getPeriodLabel().toLowerCase()}
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-accent border-4 border-primary rounded-xl shadow-md p-5">
          <div className="text-base font-bold mb-3 text-white drop-shadow-md">Total Expenses</div>
          <div className="text-5xl font-bold mb-3 text-white drop-shadow-lg">
            ₱{expenseStats?.totalExpenses.toFixed(2) || '0.00'}
          </div>
          <div className="text-lg font-bold text-white drop-shadow-md">
            {expenseStats?.totalCount || 0} expenses {getPeriodLabel().toLowerCase()}
          </div>
        </div>

        {/* Profit Card */}
        <div className={`border-4 rounded-xl shadow-md p-5 ${
          profit >= 0 
            ? 'bg-secondary border-primary' 
            : 'bg-primary border-accent'
        }`}>
          <div className="text-base font-bold mb-3 text-white drop-shadow-md">Net Profit</div>
          <div className="text-5xl font-bold mb-3 text-white drop-shadow-lg">
            ₱{profit.toFixed(2)}
          </div>
          <div className="text-lg font-bold text-white drop-shadow-md">
            {profit >= 0 ? '📈 Profitable' : '📉 Loss'}
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      {salesStats?.bestSellers && salesStats.bestSellers.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-black">
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
                    <div className="font-semibold text-black">{item.name}</div>
                    <div className="text-sm text-accent">
                      {item.quantity} sold
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    ₱{item.revenue.toFixed(2)}
                  </div>
                  <div className="text-xs text-accent">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Breakdown Chart */}
      {expenseChartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-black">
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
                  labelStyle={{ fill: '#374151', fontWeight: 'bold', fontSize: '14px' }}
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
            <div className="text-center p-3 bg-background rounded-lg border-2 border-primary">
              <div className="text-sm text-black font-bold">Ingredients</div>
              <div className="text-2xl font-bold text-primary">
                ₱{expenseStats.categoryBreakdown.Ingredients.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border-2 border-secondary">
              <div className="text-sm text-black font-bold">Packaging</div>
              <div className="text-2xl font-bold text-secondary">
                ₱{expenseStats.categoryBreakdown.Packaging.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border-2 border-accent">
              <div className="text-sm text-black font-bold">Others</div>
              <div className="text-2xl font-bold text-accent">
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
          <h3 className="text-xl font-bold text-black mb-2">No Data Yet</h3>
          <p className="text-accent">
            Start recording sales and expenses to see your dashboard analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;