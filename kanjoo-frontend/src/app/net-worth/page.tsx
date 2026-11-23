'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  Plus,
  Trash2,
  DollarSign,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function NetWorthPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any>('/net-worth');
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const symbol = user?.primaryCurrencySymbol || '₹';

  const chartData = (data?.history || []).map((h: any) => ({
    month: h.monthLabel,
    netWorth: Number(h.netWorth),
    assets: Number(h.totalAssets),
    liabilities: Number(h.totalLiabilities),
  }));

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-[11px] font-bold text-brand-cyan mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NET WORTH TRACKER & ASSET BALANCE SHEET (MODULE 7)</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-brand-cyan" />
            Personal Net Worth & Balance Sheet
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Total Wealth = Total Productive Assets minus Total Outstanding Liabilities
          </p>
        </div>
      </div>

      {/* Main Net Worth KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <div className="p-5 rounded-2xl glass-panel border border-brand-cyan/30">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Net Worth</span>
          <p className={`text-2xl font-extrabold font-mono mt-1 ${Number(data?.netWorth || 0) >= 0 ? 'text-brand-cyan' : 'text-amber-400'}`}>
            {symbol} {Number(data?.netWorth || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-400 mt-1 block">
            +{symbol}{Number(data?.monthlyChangeAmount || 0).toLocaleString()} (+{data?.monthlyChangePercent || 0}%) this month
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Assets</span>
          <p className="text-2xl font-bold text-white font-mono mt-1">
            {symbol} {Number(data?.totalAssets || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Cash, FDs, Stocks, Gold</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Liabilities</span>
          <p className="text-2xl font-bold text-rose-400 font-mono mt-1">
            {symbol} {Number(data?.totalLiabilities || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Loans, Credit Cards</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Debt-to-Asset Ratio</span>
          <p className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {(Number(data?.totalLiabilities || 1) / Math.max(1, Number(data?.totalAssets || 1))).toFixed(2)}x
          </p>
          <span className="text-[10px] text-slate-500">Benchmark: Target &lt; 0.5x</span>
        </div>
      </div>

      {/* Historical Net Worth Trajectory Chart */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Historical Net Worth Trajectory</h2>
            <p className="text-[11px] text-slate-400">Monthly progress tracking steady asset accumulation and liability paydown</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `${symbol}${val}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
                formatter={(val: any) => [`${symbol} ${Number(val).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="netWorth" stroke="#38BDF8" strokeWidth={2.5} fillOpacity={1} fill="url(#nwGrad)" name="Net Worth" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset vs Liability Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Assets Portfolio */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
              Assets & Holdings ({symbol}{Number(data?.totalAssets || 0).toLocaleString()})
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {(data?.assets || []).map((a: any) => (
              <div key={a.id} className="p-3.5 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{a.name}</span>
                  <p className="text-[11px] text-slate-400">{a.institution} • {a.lastUpdated}</p>
                </div>
                <span className="font-mono font-bold text-brand-cyan">
                  {symbol} {Number(a.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Portfolio */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              Liabilities & Debt ({symbol}{Number(data?.totalLiabilities || 0).toLocaleString()})
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {(data?.liabilities || []).map((l: any) => (
              <div key={l.id} className="p-3.5 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{l.name}</span>
                  <p className="text-[11px] text-slate-400">{l.lender} • {l.interestRatePercent}% APR</p>
                </div>
                <span className="font-mono font-bold text-rose-400">
                  {symbol} {Number(l.balance).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
