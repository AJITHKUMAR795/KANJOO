'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function EmergencyFundPage() {
  const { user } = useAuth();
  const [monthsTarget, setMonthsTarget] = useState<number>(6);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (months: number) => {
    try {
      setLoading(true);
      const data = await fetchApi<any>(`/emergency-fund/plan?monthsTarget=${months}`);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(monthsTarget);
  }, [monthsTarget, user]);

  const symbol = user?.primaryCurrencySymbol || '₹';

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-[11px] font-bold text-brand-cyan mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EMERGENCY FUND & FINANCIAL RESILIENCE (MODULE 5)</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-cyan" />
            Emergency Fund & Recession Immunity Planner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate your essential subsistence floor, customize your safety buffer, and track your liquidity runway
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Current Liquid Cushion</span>
          <p className="text-xl font-bold text-white font-mono mt-1">
            {symbol} {Number(plan?.currentEmergencySavings || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Instant-access funds</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Monthly Subsistence Floor</span>
          <p className="text-xl font-bold text-amber-400 font-mono mt-1">
            {symbol} {Number(plan?.monthlyEssentialLivingCost || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Rent, food, EMI, bills</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Runway Months Covered</span>
          <p className="text-xl font-bold text-brand-cyan font-mono mt-1">
            {plan?.monthsOfRunwayCovered || 1.4} Months
          </p>
          <span className="text-[10px] text-slate-500">Survival duration with zero income</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400">Resilience Rating</span>
          <p className="text-sm font-bold text-emerald-400 mt-1 truncate">
            {plan?.resilienceGrade || 'B+'}
          </p>
          <span className="text-[10px] text-slate-500">Shock absorption capacity</span>
        </div>
      </div>

      {/* Interactive Target Customizer & Progress Bar */}
      <div className="mt-6 p-6 rounded-2xl glass-panel space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <h2 className="text-sm font-bold text-white">Target Emergency Buffer Goal</h2>
            <p className="text-xs text-slate-400">Adjust the target number of months you wish to hedge against unexpected events</p>
          </div>

          <div className="flex items-center gap-1.5 bg-navy-950 p-1.5 rounded-xl border border-white/10">
            {([3, 6, 9, 12] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMonthsTarget(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  monthsTarget === m
                    ? 'bg-brand-cyan text-navy-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">
              Progress to {monthsTarget}-Month Goal ({symbol}{Number(plan?.targetEmergencyFundAmount || 0).toLocaleString()})
            </span>
            <span className="font-mono font-bold text-brand-cyan">
              {plan?.fundingProgressPercent || 0}% Funded
            </span>
          </div>

          <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-brand-blue via-brand-cyan to-emerald-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, plan?.fundingProgressPercent || 0)}%` }}
            />
          </div>
        </div>

        {/* Action Strategy Card */}
        <div className="p-4 rounded-xl bg-navy-900 border border-brand-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-white block">Recommended Monthly Savings Pace</span>
            <p className="text-xs text-slate-400 mt-0.5">
              Saving <strong>{symbol}{Number(plan?.recommendedMonthlyContribution || 4000).toLocaleString()}/month</strong> achieves full resilience in <strong>{plan?.estimatedMonthsToTarget || 6} months</strong>.
            </p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs font-bold whitespace-nowrap">
            Auto-Transfer Advised
          </span>
        </div>
      </div>

      {/* Resilience Factors & Action Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 rounded-2xl glass-panel space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Key Resilience Factors
          </h3>
          <div className="space-y-2 text-xs">
            {(plan?.resilienceFactors || []).map((f: string, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-navy-900 border border-white/5 text-slate-300">
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-cyan" /> Immediate Action Roadmap
          </h3>
          <div className="space-y-2 text-xs">
            {(plan?.actionRoadmap || []).map((r: string, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-navy-900 border border-white/5 text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
