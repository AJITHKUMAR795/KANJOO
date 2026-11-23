'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Plus,
  AlertTriangle,
  Receipt,
  CreditCard,
  DollarSign,
  PieChart as PieIcon,
  Bot,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>('/dashboard/overview')
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('Failed to load dashboard:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs text-slate-400">Loading KANJOO Financial Cockpit...</p>
        </div>
      </AppLayout>
    );
  }

  const fin = data?.financialOverview || {};
  const health = data?.healthScore || {};
  const leaks = data?.leakSummary || {};
  const symbol = data?.user?.currencySymbol || '$';
  const currCode = data?.user?.primaryCurrency || 'USD';

  const chartData = [
    { name: 'Income', amount: Number(fin.monthlyIncome || 0) },
    { name: 'Expenses', amount: Number(fin.totalExpenses || 0) },
    { name: 'Savings Target', amount: Number(fin.monthlySavingsTarget || 0) },
  ];

  const COLORS = ['#38BDF8', '#818CF8', '#34D399', '#FBBF24', '#F87171'];

  return (
    <AppLayout>
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-[11px] font-semibold text-brand-cyan mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Autonomous Intelligence Active</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {data?.user?.fullName || 'Financial Leader'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Financial ecosystem configured for <strong className="text-slate-200">{data?.user?.country}</strong> in{' '}
            <strong className="text-brand-cyan">{currCode} ({symbol})</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/expenses"
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700/80 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Transaction
          </Link>
          <Link
            href="/ai-assistant"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-cyan/20 hover:opacity-95 transition-all"
          >
            <Bot className="w-3.5 h-3.5" /> Ask KANJOO AI
          </Link>
        </div>
      </div>

      {/* Financial Health Score & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {/* Metric: Income */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Verified Income</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {symbol} {Number(fin.monthlyIncome || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Monthly recurring cash inflow</span>
        </div>

        {/* Metric: Outflow */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Expenses</span>
            <span className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-3 h-3" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-200 mt-2">
            {symbol} {Number(fin.totalExpenses || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Current monthly spend</span>
        </div>

        {/* Metric: Available Balance */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Available Balance</span>
            <span className="p-1 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              <CreditCard className="w-3 h-3" />
            </span>
          </div>
          <p className={`text-2xl font-bold mt-2 ${Number(fin.availableBalance || 0) >= 0 ? 'text-brand-cyan' : 'text-rose-400'}`}>
            {symbol} {Number(fin.availableBalance || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Disposable surplus</span>
        </div>

        {/* Health Score Card */}
        <div className="p-5 rounded-2xl glass-panel border-brand-cyan/30 bg-gradient-to-br from-navy-850 to-brand-blue/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Financial Health Score</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
              {health.ratingTier || 'GOOD'}
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{health.overallScore || 75}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-brand-blue via-brand-cyan to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${health.overallScore || 75}%` }}
            />
          </div>
        </div>
      </div>

      {/* Signature Alert Bar: Money Leaks Detected */}
      {leaks.totalLeaksFound > 0 && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-navy-850 to-navy-850 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                Money Leak Detector Found {leaks.totalLeaksFound} Immediate Optimization(s)
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Recover up to <strong className="text-amber-300">{symbol} {Number(leaks.potentialMonthlySavings).toLocaleString()}/month</strong> ({symbol} {Number(leaks.potentialAnnualSavings).toLocaleString()}/year) in unused telecom data & inactive subscriptions.
              </p>
            </div>
          </div>
          <Link
            href="/money-leak"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            Review Leaks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Middle Analytics & Quick Signature Portals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Spending & Cash Flow Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Monthly Cash Flow Comparison</h2>
              <p className="text-[11px] text-slate-400">Income vs Outflow vs Target Savings</p>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              {currCode} Standards
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${symbol}${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#38BDF8', fontSize: '12px' }}
                  formatter={(val: any) => [`${symbol} ${val.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Signature Portals */}
        <div className="space-y-4">
          {/* Portal: Before You Spend */}
          <Link href="/before-you-spend" className="block p-5 rounded-2xl glass-panel glass-panel-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Before You Spend
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Planning to purchase an item? Simulate impact against your emergency fund and cash flow before paying.
            </p>
          </Link>

          {/* Portal: Recharge Optimizer */}
          <Link href="/recharge-optimizer" className="block p-5 rounded-2xl glass-panel glass-panel-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-brand-cyan" />
                Recharge Optimizer
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multi-SIM analysis calculating daily cost and incoming service preservation on Wi-Fi.
            </p>
          </Link>

          {/* Portal: My KANJOO Plan */}
          <Link href="/kanjoo-plan" className="block p-5 rounded-2xl glass-panel glass-panel-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                My KANJOO Plan
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your personalized blueprint of chosen optimizations, student discounts, and monthly budgets.
            </p>
          </Link>
        </div>
      </div>

      {/* KANJOO 2.0 Institutional Cockpit Grid */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-white mb-3">Institutional Intelligence Cockpit</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <Link href="/cashflow-forecast" className="p-4 rounded-xl glass-panel hover:border-brand-cyan/30 transition-all flex flex-col justify-between">
            <span className="text-[10px] font-bold text-brand-cyan uppercase">Forecasting</span>
            <span className="font-bold text-white mt-1">Predictive Cash Flow</span>
            <span className="text-[10px] text-slate-400 mt-1">7, 30, 60, 90-day balance burn simulator</span>
          </Link>
          <Link href="/net-worth" className="p-4 rounded-xl glass-panel hover:border-brand-cyan/30 transition-all flex flex-col justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Balance Sheet</span>
            <span className="font-bold text-white mt-1">Net Worth Tracker</span>
            <span className="text-[10px] text-slate-400 mt-1">Liquid assets, equity & debt balance</span>
          </Link>
          <Link href="/statements" className="p-4 rounded-xl glass-panel hover:border-brand-cyan/30 transition-all flex flex-col justify-between">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Automated Ingestion</span>
            <span className="font-bold text-white mt-1">Bank Statement Importer</span>
            <span className="text-[10px] text-slate-400 mt-1">CSV, XLSX & PDF parser with auto-tagging</span>
          </Link>
          <Link href="/anomalies" className="p-4 rounded-xl glass-panel hover:border-brand-cyan/30 transition-all flex flex-col justify-between">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Surveillance</span>
            <span className="font-bold text-white mt-1">Anomaly Detection</span>
            <span className="text-[10px] text-slate-400 mt-1">Duplicate charges & unexpected hikes</span>
          </Link>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
            <p className="text-[11px] text-slate-400">All amounts preserved in original & primary currency</p>
          </div>
          <Link href="/expenses" className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-semibold">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Original Amount</th>
                <th className="pb-3 font-semibold text-right">Primary Currency ({symbol})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(data?.recentExpenses || []).map((exp: any) => (
                <tr key={exp.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 text-slate-300 font-mono text-[11px]">{exp.expenseDate}</td>
                  <td className="py-3 font-medium text-white">{exp.category?.name || 'General'}</td>
                  <td className="py-3 text-slate-300">{exp.description || '—'}</td>
                  <td className="py-3 text-slate-400 font-mono">
                    {exp.originalCurrency?.code} {Number(exp.amount).toFixed(2)}
                  </td>
                  <td className="py-3 font-bold text-slate-100 text-right font-mono">
                    {symbol} {Number(exp.primaryAmount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
