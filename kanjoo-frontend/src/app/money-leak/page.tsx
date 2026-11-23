'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export default function MoneyLeakDetectorPage() {
  const { user } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingPlanId, setAddingPlanId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchApi<any>('/intelligence/money-leaks');
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddToPlan = async (leak: any) => {
    setAddingPlanId(leak.id);
    try {
      await fetchApi('/intelligence/kanjoo-plan/items', {
        method: 'POST',
        body: JSON.stringify({
          itemType: leak.category,
          title: leak.problem,
          description: leak.suggestedAlternative,
          potentialMonthlySavings: leak.potentialMonthlySavings,
          potentialAnnualSavings: leak.potentialAnnualSavings,
        }),
      });
      alert('Optimization added to your central KANJOO Plan!');
    } catch {
      alert('Failed to add item to plan');
    } finally {
      setAddingPlanId(null);
    }
  };

  const symbol = user?.primaryCurrencySymbol || '$';

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-300 mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Autonomous Signature Leak Scanner</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            MONEY LEAK DETECTOR
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous identification of duplicate subscriptions, expensive secondary SIM recharges, and unnoticed auto-debits
          </p>
        </div>
      </div>

      {/* Aggregate Savings Spotlight Banner */}
      <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-navy-850 to-navy-850 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Total Recoverable Capital
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">
                {symbol} {Number(report?.totalPotentialMonthlySavings || 0).toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                ({symbol} {Number(report?.totalPotentialAnnualSavings || 0).toLocaleString()} / year)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Plugging these {report?.leaks?.length || 0} leak(s) frees up cash flow immediately without impacting daily lifestyle.
            </p>
          </div>

          <a
            href="/kanjoo-plan"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
          >
            Open KANJOO Plan <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Leaks Detailed List */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Identified Money Leaks & Suggested Alternatives
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Scanning financial accounts for leaks...</div>
        ) : (report?.leaks || []).length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No money leaks detected. Your recurring subscriptions and telecom tariffs are well-optimized!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.leaks.map((leak: any) => (
              <div key={leak.id} className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan uppercase">
                      {leak.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      leak.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {leak.severity} LEAK
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs mt-3">{leak.problem}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{leak.explanation}</p>

                  <div className="mt-3 p-3 rounded-xl bg-navy-900 border border-white/5 text-[11px]">
                    <span className="text-slate-400 font-semibold">Suggested Alternative:</span>
                    <p className="text-slate-200 mt-0.5">{leak.suggestedAlternative}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500">Potential Savings:</span>
                    <p className="text-xs font-bold text-emerald-400 font-mono">
                      +{symbol} {Number(leak.potentialMonthlySavings).toFixed(2)}/mo
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToPlan(leak)}
                    disabled={addingPlanId === leak.id}
                    className="px-3.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-brand-cyan text-xs font-semibold flex items-center gap-1.5 transition-colors border border-brand-cyan/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {addingPlanId === leak.id ? 'Adding...' : 'Add to Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
