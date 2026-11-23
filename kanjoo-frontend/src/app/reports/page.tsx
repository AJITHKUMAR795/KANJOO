'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  BarChart3,
  Download,
  Calendar,
  PieChart as PieIcon,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function ReportsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>(`/reports/analytics?timeFrame=${timeframe}`)
      .then(setAnalytics)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [timeframe, user]);

  const downloadCsv = () => {
    const token = localStorage.getItem('kanjoo_token');
    window.open(`http://localhost:8080/api/reports/export-csv?auth=${token}`, '_blank');
  };

  const symbol = analytics?.currencySymbol || '$';
  const currCode = analytics?.currency || 'USD';

  // Format category data for Pie Chart
  const pieData = Object.entries(analytics?.categoryBreakdown || {}).map(([name, val]) => ({
    name,
    value: Number(val),
  }));

  // Format monthly trend data for Bar Chart
  const trendData = Object.entries(analytics?.monthlyTrends || {}).map(([name, val]) => ({
    month: name,
    spending: Number(val),
  }));

  const COLORS = ['#38BDF8', '#818CF8', '#34D399', '#FBBF24', '#F87171', '#C084FC', '#FB923C'];

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-cyan" />
            Financial Reports & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive spending trends, category distributions, and CSV data export in {currCode} ({symbol})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setTimeframe('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'MONTHLY' ? 'bg-brand-cyan text-navy-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('YEARLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'YEARLY' ? 'bg-brand-cyan text-navy-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>

          <button
            onClick={downloadCsv}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-cyan/20 hover:opacity-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Aggregate Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Total Analyzed Expenses</span>
          <p className="text-xl font-bold text-white mt-1 font-mono">
            {symbol} {Number(analytics?.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Annual Run-Rate Income</span>
          <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {symbol} {Number(analytics?.annualIncome || 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Primary Reporting Standard</span>
          <p className="text-xl font-bold text-brand-cyan mt-1 font-mono">
            ISO 4217 ({currCode})
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Category Breakdown Pie Chart */}
        <div className="p-6 rounded-2xl glass-panel">
          <h2 className="text-sm font-bold text-white mb-1">Expense Distribution by Category</h2>
          <p className="text-[11px] text-slate-400 mb-4">Relative weight of monthly living expenditures</p>

          <div className="h-72 w-full">
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                No category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                    formatter={(val: any) => [`${symbol} ${val.toLocaleString()}`, 'Spent']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Spending Trend Bar Chart */}
        <div className="p-6 rounded-2xl glass-panel">
          <h2 className="text-sm font-bold text-white mb-1">Monthly Spending Trend</h2>
          <p className="text-[11px] text-slate-400 mb-4">Historical outflows in primary currency</p>

          <div className="h-72 w-full">
            {trendData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                No historical trend data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${symbol}${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#38BDF8', fontSize: '12px' }}
                    formatter={(val: any) => [`${symbol} ${val.toLocaleString()}`, 'Outflow']}
                  />
                  <Bar dataKey="spending" fill="#38BDF8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
