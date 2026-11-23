'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  PieChart as PieIcon,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export default function BudgetPlannerPage() {
  const { user } = useAuth();
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allocations, setAllocations] = useState<{ [key: number]: number }>({});

  const loadData = async () => {
    try {
      const data = await fetchApi<any>('/budgets/current');
      setBudget(data);
      const initial: { [key: number]: number } = {};
      (data.categoryAllocations || []).forEach((c: any) => {
        initial[c.categoryId] = Number(c.allocatedAmount || 0);
      });
      setAllocations(initial);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAllocationChange = (catId: number, val: number) => {
    setAllocations((prev) => ({ ...prev, [catId]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const list = Object.keys(allocations).map((id) => ({
        categoryId: parseInt(id),
        allocatedAmount: allocations[parseInt(id)],
      }));

      await fetchApi('/budgets', {
        method: 'POST',
        body: JSON.stringify({
          monthYear: budget.monthYear,
          savingsTarget: budget.savingsTarget,
          allocations: list,
        }),
      });
      await loadData();
      alert('Budget allocations saved successfully!');
    } catch {
      alert('Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const symbol = user?.primaryCurrencySymbol || '$';
  const totalAllocated = Object.values(allocations).reduce((sum, v) => sum + v, 0);
  const income = Number(budget?.totalIncome || 0);
  const remainingCash = income - totalAllocated - Number(budget?.savingsTarget || 0);

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-brand-cyan" />
            AI Smart Budget Planner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic monthly allocation based on verified cash flow, lifestyle, and goals ({budget?.monthYear || 'Current Month'})
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs hover:opacity-90 shadow-md shadow-brand-cyan/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Allocations'}
        </button>
      </div>

      {/* Top Cash Flow Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Monthly Income</span>
          <p className="text-lg font-bold text-white mt-1 font-mono">{symbol} {income.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Total Allocated Budget</span>
          <p className="text-lg font-bold text-brand-cyan mt-1 font-mono">{symbol} {totalAllocated.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Target Savings</span>
          <p className="text-lg font-bold text-emerald-400 mt-1 font-mono">{symbol} {Number(budget?.savingsTarget || 0).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Unallocated Surplus</span>
          <p className={`text-lg font-bold mt-1 font-mono ${remainingCash >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {symbol} {remainingCash.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Allocations List */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h2 className="text-sm font-bold text-white mb-1">Category Spending Limits</h2>
        <p className="text-[11px] text-slate-400 mb-6">
          Adjust monthly spending caps to maintain cash flow discipline
        </p>

        <div className="space-y-5">
          {(budget?.categoryAllocations || []).map((cat: any) => {
            const currentAlloc = allocations[cat.categoryId] ?? Number(cat.allocatedAmount || 0);
            const spent = Number(cat.spentAmount || 0);
            const pct = currentAlloc > 0 ? (spent / currentAlloc) * 100 : (spent > 0 ? 100 : 0);
            const isExceeded = spent > currentAlloc;

            return (
              <div key={cat.categoryId} className="p-4 rounded-xl bg-navy-900 border border-white/5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">{cat.categoryName}</span>
                    {isExceeded && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Over Budget
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">
                      Spent: <strong className="text-white">{symbol}{spent.toLocaleString()}</strong>
                    </span>
                    <span className="text-slate-600">/</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Cap:</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={currentAlloc === 0 ? '' : currentAlloc}
                        onChange={(e) => {
                          const val = e.target.value.replace(/^0+(?=\d)/, '');
                          handleAllocationChange(cat.categoryId, val === '' ? 0 : parseFloat(val) || 0);
                        }}
                        className="w-24 px-2 py-1 rounded-lg bg-navy-950 border border-white/10 text-brand-cyan text-xs font-bold text-right font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct > 100 ? 'bg-rose-500' : pct > 80 ? 'bg-amber-400' : 'bg-brand-cyan'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
