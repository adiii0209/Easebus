import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinanceManagement = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock financial data
  const [financialData] = useState({
    monthlyData: [
      { month: 'Jan', revenue: 250000, expenses: 180000 },
      { month: 'Feb', revenue: 280000, expenses: 190000 },
      { month: 'Mar', revenue: 300000, expenses: 200000 },
      { month: 'Apr', revenue: 320000, expenses: 210000 },
      { month: 'May', revenue: 340000, expenses: 220000 },
      { month: 'Jun', revenue: 360000, expenses: 230000 },
    ],
    expenseBreakdown: [
      { name: 'Fuel', value: 350000 },
      { name: 'Maintenance', value: 250000 },
      { name: 'Salary', value: 800000 },
      { name: 'Insurance', value: 200000 },
      { name: 'Other', value: 200000 },
    ],
    totalRevenue: 2500000,
    totalExpenses: 1800000,
    netProfit: 700000,
    transactions: [
      {
        id: 1,
        type: 'revenue',
        category: 'Ticket Sales',
        amount: 25000,
        date: '2024-01-15',
        description: 'Daily ticket revenue'
      },
      {
        id: 2,
        type: 'expense',
        category: 'Maintenance',
        amount: 15000,
        date: '2024-01-15',
        description: 'Bus AC repair - KL-01-1234'
      },
      {
        id: 3,
        type: 'expense',
        category: 'Fuel',
        amount: 35000,
        date: '2024-01-15',
        description: 'Diesel refill for 10 buses'
      },
      {
        id: 4,
        type: 'revenue',
        category: 'Pass Sales',
        amount: 45000,
        date: '2024-01-15',
        description: 'Monthly pass renewals'
      },
      {
        id: 5,
        type: 'expense',
        category: 'Salary',
        amount: 250000,
        date: '2024-01-15',
        description: 'Staff salary payments'
      }
    ]
  });

  const filteredTransactions = financialData.transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const StatCard = ({ title, value, icon, type }) => (
    <div className={`backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/40`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className={`text-2xl font-bold ${type === 'profit' ? 'text-green-600' : type === 'loss' ? 'text-red-600' : 'text-gray-900'}`}>
            ₹{value.toLocaleString()}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${type === 'profit' ? 'bg-green-100 text-green-600' : type === 'loss' ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 transition hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          <p className="mt-1 text-gray-600">Track and manage all financial transactions</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <StatCard
            title="Total Revenue"
            value={financialData.totalRevenue}
            icon={<DollarSign className="h-6 w-6" />}
            type="profit"
          />
          <StatCard
            title="Total Expenses"
            value={financialData.totalExpenses}
            icon={<TrendingDown className="h-6 w-6" />}
            type="loss"
          />
          <StatCard
            title="Net Profit"
            value={financialData.netProfit}
            icon={<TrendingUp className="h-6 w-6" />}
            type="profit"
          />
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Revenue vs Expenses Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialData.monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Expense Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {financialData.expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[
                      '#10B981',
                      '#3B82F6',
                      '#6366F1',
                      '#8B5CF6',
                      '#EC4899',
                    ][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-none bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border-none bg-transparent focus:outline-none"
                >
                  <option value="all">All Transactions</option>
                  <option value="revenue">Revenue Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Category</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-4 text-sm text-gray-900">{transaction.date}</td>
                    <td className="py-4 text-sm text-gray-900">{transaction.category}</td>
                    <td className="py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className="py-4 text-sm text-gray-900">₹{transaction.amount.toLocaleString()}</td>
                    <td className="py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${transaction.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;