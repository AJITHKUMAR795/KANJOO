'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function KanjooPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [planData, dashData] = await Promise.all([
        fetchApi<any>('/intelligence/kanjoo-plan'),
        fetchApi<any>('/dashboard/overview'),
      ]);
      setPlan(planData);
      setDashboardData(dashData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const toggleItem = async (id: number) => {
    try {
      await fetchApi(`/intelligence/kanjoo-plan/items/${id}/toggle`, { method: 'PATCH' });
      loadData();
    } catch {
      alert('Failed to toggle item');
    }
  };

  const items = plan?.items || [];
  const implementedCount = items.filter((i: any) => i.implemented).length;
  const realizedMonthlySavings = items
    .filter((i: any) => i.implemented)
    .reduce((sum: number, i: any) => sum + Number(i.potentialMonthlySavings || 0), 0);
  const totalPotentialMonthlySavings = items.reduce(
    (sum: number, i: any) => sum + Number(i.potentialMonthlySavings || 0),
    0
  );

  const symbol = user?.primaryCurrencySymbol || '$';
  const fin = dashboardData?.financialOverview || {};

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-[11px] font-semibold text-brand-cyan mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Central Action Blueprint</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-cyan" />
            MY KANJOO PLAN
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            User-approved optimizations, student discounts, and monthly wealth targets
          </p>
        </div>
      </div>

      {/* Progress & Realized Savings Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-xs text-slate-400 font-medium">Realized Monthly Savings</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
            {symbol} {realizedMonthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Active plugged leaks</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-xs text-slate-400 font-medium">Potential Additional Savings</span>
          <p className="text-2xl font-extrabold text-brand-cyan mt-1 font-mono">
            {symbol} {(totalPotentialMonthlySavings - realizedMonthlySavings).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Pending approved items</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Implementation Progress</span>
            <span className="font-bold text-white">{implementedCount} / {items.length} Done</span>
          </div>
          <div className="w-full bg-navy-950 rounded-full h-2 my-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-brand-blue to-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${items.length > 0 ? (implementedCount / items.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">Every decision requires explicit user approval</span>
        </div>
      </div>

      {/* Monthly Cash Flow Blueprint Breakdown */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h2 className="text-sm font-bold text-white mb-1">Monthly Financial Blueprint</h2>
        <p className="text-[11px] text-slate-400 mb-4">
          Integrated cash flow accounting after applied recommendations
        </p>

        <div className="p-4 rounded-xl bg-navy-900 border border-white/5 space-y-2.5 font-mono text-xs">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-300">Monthly Verified Income</span>
            <span className="text-white font-bold">+{symbol} {Number(fin.monthlyIncome || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
            <span>Essential Living Commitments (Rent & Utilities)</span>
            <span className="text-rose-400">- {symbol} {(Number(fin.totalExpenses || 0) * 0.6).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
            <span>Optimized Telecom Costs</span>
            <span className="text-rose-400">- {symbol} 998</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
            <span>Active Essential Subscriptions</span>
            <span className="text-rose-400">- {symbol} 418</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
            <span>Target Wealth SIP & Emergency Reserve</span>
            <span className="text-emerald-400">- {symbol} {Number(fin.monthlySavingsTarget || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 pt-3 font-bold text-sm">
            <span className="text-brand-cyan">Net Monthly Free Surplus</span>
            <span className="text-brand-cyan">={symbol} {Number(fin.availableBalance || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Actionable Plan Checklist */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h2 className="text-sm font-bold text-white mb-1">Optimization Action Items</h2>
        <p className="text-[11px] text-slate-400 mb-6">
          Check off items as you execute plan changes with operators or service providers
        </p>

        {items.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No items in your plan yet. Add recommendations from the <strong>Money Leak Detector</strong> or <strong>Recharge Optimizer</strong>.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  item.implemented
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                    : 'bg-navy-900 border-white/10 hover:border-brand-cyan/40 text-white'
                }`}
              >
                <div className="mt-0.5">
                  {item.implemented ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${item.implemented ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +{symbol} {Number(item.potentialMonthlySavings).toFixed(2)}/mo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
