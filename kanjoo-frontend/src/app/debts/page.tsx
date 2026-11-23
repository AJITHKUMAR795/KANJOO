'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  CreditCard,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Zap,
  Info,
} from 'lucide-react';

export default function DebtOptimizerPage() {
  const { user } = useAuth();
  const [extraPayment, setExtraPayment] = useState<number>(3000);
  const [activeStrategy, setActiveStrategy] = useState<'avalanche' | 'snowball' | 'standard'>('avalanche');
  const [debtData, setDebtData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (extra: number) => {
    try {
      setLoading(true);
      const data = await fetchApi<any>(`/debts?extraPayment=${extra}`);
      setDebtData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(extraPayment);
  }, [extraPayment, user]);

  const symbol = user?.primaryCurrencySymbol || '₹';

  const selectedPlan =
    activeStrategy === 'avalanche'
      ? debtData?.avalanchePlan
      : activeStrategy === 'snowball'
      ? debtData?.snowballPlan
      : debtData?.standardPlan;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-[11px] font-bold text-brand-cyan mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DEBT MANAGEMENT & LOAN OPTIMIZER (MODULE 4)</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-cyan" />
            Debt Elimination & Repayment Optimizer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare Debt Snowball vs Debt Avalanche strategies, simulate early payoff, and maximize interest savings
          </p>
        </div>
      </div>

      {/* KPI Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Total Outstanding Debt</span>
          <p className="text-xl font-bold text-white font-mono mt-1">
            {symbol} {Number(debtData?.totalDebtBalance || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Across 3 active obligations</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Monthly Contractual EMI</span>
          <p className="text-xl font-bold text-amber-400 font-mono mt-1">
            {symbol} {Number(debtData?.totalMonthlyEmiObligation || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Fixed monthly debt drain</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Weighted Average APR</span>
          <p className="text-xl font-bold text-brand-cyan font-mono mt-1">
            {debtData?.weightedAverageInterestRate || 12.95}% p.a.
          </p>
          <span className="text-[10px] text-slate-500">Blended loan cost</span>
        </div>
      </div>

      {/* Strategy Selector & Extra Payment Slider */}
      <div className="mt-6 p-6 rounded-2xl glass-panel space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <h2 className="text-sm font-bold text-white">Select Acceleration Strategy</h2>
            <p className="text-xs text-slate-400">Choose between mathematical interest minimization or psychological momentum</p>
          </div>

          <div className="flex items-center gap-2 bg-navy-950 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveStrategy('avalanche')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStrategy === 'avalanche'
                  ? 'bg-brand-cyan text-navy-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Debt Avalanche (Recommended)
            </button>
            <button
              onClick={() => setActiveStrategy('snowball')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStrategy === 'snowball'
                  ? 'bg-amber-400 text-navy-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Debt Snowball
            </button>
            <button
              onClick={() => setActiveStrategy('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStrategy === 'standard'
                  ? 'bg-navy-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Minimum Only
            </button>
          </div>
        </div>

        {/* Prepayment Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-300 font-medium">Extra Monthly Prepayment Contribution</span>
            <span className="text-brand-cyan font-bold font-mono text-sm">
              +{symbol} {extraPayment.toLocaleString()} / month
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            value={extraPayment}
            onChange={(e) => setExtraPayment(parseInt(e.target.value, 10))}
            className="w-full accent-brand-cyan cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Diverting unallocated monthly cash flow to prepay debt accelerates your debt-free milestone.
          </span>
        </div>

        {/* Strategy Outcome Comparison Box */}
        {selectedPlan && (
          <div className="p-5 rounded-2xl bg-navy-900 border border-brand-cyan/30 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] text-slate-400 block">Projected Debt-Free Date</span>
              <p className="text-lg font-bold text-white font-mono mt-0.5">{selectedPlan.debtFreeDate}</p>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {selectedPlan.monthsSavedVsStandard > 0 ? `${selectedPlan.monthsSavedVsStandard} Months Earlier!` : 'Standard pace'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Total Interest Paid</span>
              <p className="text-lg font-bold text-slate-200 font-mono mt-0.5">
                {symbol} {Number(selectedPlan.totalInterestPaid).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">Over entire repayment cycle</span>
            </div>

            <div className="sm:col-span-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Total Interest Saved
              </span>
              <p className="text-xl font-extrabold text-emerald-300 font-mono mt-0.5">
                {symbol} {Number(selectedPlan.interestSavedVsStandard).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-300 mt-1">{selectedPlan.strategyPhilosophy}</p>
            </div>
          </div>
        )}
      </div>

      {/* Active Debts Table */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h3 className="text-sm font-bold text-white mb-4">Active Liabilities Portfolio</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-left">
                <th className="pb-3 font-semibold">Liability Name</th>
                <th className="pb-3 font-semibold">Lender</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold text-right">Principal Left</th>
                <th className="pb-3 font-semibold text-right">Interest Rate (APR)</th>
                <th className="pb-3 font-semibold text-right">Monthly EMI</th>
                <th className="pb-3 font-semibold text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(debtData?.debts || []).map((d: any) => (
                <tr key={d.debtId} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-bold text-white">{d.debtName}</td>
                  <td className="py-3 text-slate-400">{d.lenderName}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 text-[10px] font-bold">
                      {d.debtType}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-white">
                    {symbol} {Number(d.principalRemaining).toLocaleString()}
                  </td>
                  <td className={`py-3 text-right font-mono font-bold ${d.interestRatePercent > 20 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {d.interestRatePercent}%
                  </td>
                  <td className="py-3 text-right font-mono text-amber-300">
                    {symbol} {Number(d.monthlyEmi).toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    {d.interestRatePercent > 20 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-extrabold border border-rose-500/30">
                        CRITICAL TARGET
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        Normal EMI
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisory Insights */}
      <div className="mt-6 p-6 rounded-2xl glass-panel space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Autonomous Debt Optimizer Insights
        </h3>
        <div className="space-y-2 text-xs">
          {(debtData?.optimizationInsights || []).map((ins: string, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-navy-900 border border-white/5 text-slate-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{ins}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
