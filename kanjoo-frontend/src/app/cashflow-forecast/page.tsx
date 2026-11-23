'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Info,
  DollarSign,
  Activity,
  Zap,
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

export default function CashflowForecastPage() {
  const { user } = useAuth();
  const [horizon, setHorizon] = useState<7 | 30 | 60 | 90>(30);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadForecast = async (days: number) => {
    try {
      setLoading(true);
      const data = await fetchApi<any>(`/cashflow/forecast?horizon=${days}`);
      setForecast(data);
    } catch (err) {
      console.error('Failed to load forecast', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast(horizon);
  }, [horizon, user]);

  const symbol = user?.primaryCurrencySymbol || '₹';

  const chartData = (forecast?.trajectory || []).map((t: any) => ({
    date: t.date,
    balance: t.projectedBalance,
    inflow: t.dailyInflow,
    outflow: t.dailyOutflow,
    events: t.keyEvents,
  }));

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-[11px] font-bold text-brand-cyan mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI PREDICTIVE CASH FLOW ENGINE (MODULE 1)</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-cyan" />
            Multi-Horizon Liquidity Forecasting
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic probabilistic cash flow simulation powered by historical burn rate, salary cycles, and recurring commitments
          </p>
        </div>

        {/* Horizon Picker */}
        <div className="flex items-center gap-1.5 bg-navy-950 p-1.5 rounded-xl border border-white/10">
          {([7, 30, 60, 90] as const).map((days) => (
            <button
              key={days}
              onClick={() => setHorizon(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                horizon === days
                  ? 'bg-brand-cyan text-navy-950 shadow-md shadow-brand-cyan/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Starting Liquidity</span>
          <p className="text-lg font-bold text-white font-mono mt-1">
            {symbol} {Number(forecast?.startingBalance || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Current baseline buffer</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Ending Projected Balance</span>
          <p className={`text-lg font-bold font-mono mt-1 ${Number(forecast?.endingProjectedBalance || 0) >= Number(forecast?.startingBalance || 0) ? 'text-emerald-400' : 'text-amber-400'}`}>
            {symbol} {Number(forecast?.endingProjectedBalance || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">At end of {horizon} days</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Lowest Cash Point (Trough)</span>
          <p className={`text-lg font-bold font-mono mt-1 ${forecast?.hasShortageRisk ? 'text-rose-400' : 'text-brand-cyan'}`}>
            {symbol} {Number(forecast?.lowestProjectedBalance || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Occurs on {forecast?.lowestBalanceDate || 'N/A'}</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Projected Net Change</span>
          <p className={`text-lg font-bold font-mono mt-1 ${Number(forecast?.projectedNetSavings || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {Number(forecast?.projectedNetSavings || 0) >= 0 ? '+' : ''}
            {symbol} {Number(forecast?.projectedNetSavings || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Net cumulative savings</span>
        </div>

        <div className="p-4 rounded-xl glass-panel col-span-2 lg:col-span-1">
          <span className="text-[11px] text-slate-400">Model Confidence</span>
          <p className="text-lg font-bold text-amber-300 font-mono mt-1">
            {forecast?.confidencePercent || 88}%
          </p>
          <span className="text-[10px] text-slate-500">Statistical reliability</span>
        </div>
      </div>

      {/* Shortage Risk Banner */}
      <div className={`mt-6 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
        forecast?.hasShortageRisk
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      }`}>
        <div className="flex items-center gap-3">
          {forecast?.hasShortageRisk ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <div>
            <h3 className="text-xs font-bold text-white">
              {forecast?.hasShortageRisk ? 'Liquidity Shortage Alert' : 'Solvency & Cash Flow Stability Verified'}
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">{forecast?.shortageWarningMessage}</p>
          </div>
        </div>
      </div>

      {/* Trajectory Area Chart */}
      <div className="mt-6 p-6 rounded-2xl glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Simulated Account Balance Trajectory ({horizon} Days)</h2>
            <p className="text-[11px] text-slate-400">Deterministic cash balance projection tracking income credits and scheduled disbursements</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
            {horizon}-Day Horizon
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${symbol}${Number(val).toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
                formatter={(val: any) => [`${symbol} ${Number(val).toLocaleString()}`, 'Projected Balance']}
                labelFormatter={(lbl, items) => {
                  const ev = items && items[0]?.payload?.events;
                  return `${lbl} — ${ev || 'Normal Day'}`;
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#balanceGrad)"
                name="Projected Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Assumptions Footer */}
        <div className="mt-4 p-3 rounded-xl bg-navy-900 border border-white/5 flex items-start gap-2.5 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
          <span><strong>Forecast Assumptions:</strong> {forecast?.assumptionsExplanation}</span>
        </div>
      </div>

      {/* Advisory Notes */}
      <div className="mt-6 p-6 rounded-2xl glass-panel space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Personalized Cashflow Strategy Notes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {(forecast?.personalizedAdvice || []).map((adv: string, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-navy-900/60 border border-white/5 flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{adv}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
