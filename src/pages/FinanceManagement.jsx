import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Receipt } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader, Segmented, Pill, EmptyState } from '../components/ui';

const FinanceManagement = () => {
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

  const PIE_COLORS = ['#10B981', '#0ea5e9', '#6366F1', '#8B5CF6', '#EC4899'];
  const formatCompact = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${Math.round(n / 1000)}k` : n;
  const tooltipStyle = { borderRadius: 14, border: 'none', boxShadow: '0 8px 32px rgba(16,24,40,0.15)', fontSize: 13 };

  const StatCard = ({ title, value, icon: Icon, tint, valueClass = 'text-gray-900' }) => (
    <div className="card flex items-center gap-3 p-4">
      <span className={`icon-tile h-11 w-11 rounded-xl ${tint}`}><Icon className="h-5 w-5" /></span>
      <div className="min-w-0">
        <p className="text-[13px] text-gray-500">{title}</p>
        <h3 className={`truncate text-xl font-bold tabular tracking-tight ${valueClass}`}>₹{value.toLocaleString()}</h3>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Finance" subtitle="Revenue, expenses and transactions" back backTo="/admin" />

      <div className="mx-auto max-w-5xl space-y-5 px-4 pb-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard title="Total revenue" value={financialData.totalRevenue} icon={DollarSign} tint="bg-emerald-500" />
          <StatCard title="Total expenses" value={financialData.totalExpenses} icon={TrendingDown} tint="bg-red-500" />
          <StatCard title="Net profit" value={financialData.netProfit} icon={TrendingUp} tint="bg-primary-500" valueClass="text-emerald-600" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-gray-900">Revenue vs expenses</h2>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" />Expenses</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={financialData.monthlyData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={formatCompact} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h2 className="mb-2 text-[17px] font-bold text-gray-900">Expense distribution</h2>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={financialData.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={4}
                  cornerRadius={6}
                  stroke="none"
                  dataKey="value"
                >
                  {financialData.expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {financialData.expenseBreakdown.map((e, i) => (
                <div key={e.name} className="flex items-center gap-2 text-[13px]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % 5] }} />
                  <span className="flex-1 text-gray-600">{e.name}</span>
                  <span className="font-semibold tabular text-gray-900">₹{formatCompact(e.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="px-1 text-[22px] font-bold text-gray-900">Transactions</h2>
            <label className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-ios ring-1 ring-black/[0.03]">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-[13px] font-medium text-gray-700 focus:outline-none"
              />
            </label>
          </div>

          <Segmented
            id="txn-filter"
            value={selectedFilter}
            onChange={setSelectedFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'revenue', label: 'Revenue' },
              { value: 'expense', label: 'Expenses' },
            ]}
            className="mb-3"
          />

          {filteredTransactions.length > 0 ? (
            <div className="list-group">
              {filteredTransactions.map((transaction) => {
                const income = transaction.type === 'revenue'
                return (
                  <div key={transaction.id} className="list-row py-3.5">
                    <span className={`icon-tile h-10 w-10 rounded-xl ${income ? 'bg-emerald-500' : 'bg-red-400'}`}>
                      {income ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-semibold text-gray-900">{transaction.category}</h3>
                      <p className="truncate text-[13px] text-gray-500">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[16px] font-bold tabular ${income ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {income ? '+' : '−'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <Pill tone={income ? 'green' : 'red'}>{income ? 'Revenue' : 'Expense'}</Pill>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card"><EmptyState icon={Receipt} title="No transactions" message="Nothing to show for this filter." /></div>
          )}
        </section>
      </div>
    </>
  );
};

export default FinanceManagement;
