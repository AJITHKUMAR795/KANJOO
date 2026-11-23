'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export default function BeforeYouSpendPage() {
  const { user } = useAuth();
  const [itemName, setItemName] = useState('High-End Laptop');
  const [amount, setAmount] = useState('800');
  const [category, setCategory] = useState('SHOPPING');
  const [urgency, setUrgency] = useState('NORMAL');
  const [result, setResult] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setEvaluating(true);

    try {
      const res = await fetchApi<any>('/intelligence/before-you-spend', {
        method: 'POST',
        body: JSON.stringify({
          itemName,
          amount: parseFloat(amount),
          category,
          urgency,
        }),
      });
      setResult(res);
    } catch {
      alert('Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const symbol = user?.primaryCurrencySymbol || '$';

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-300 mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Signature Financial Protection Feature</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            BEFORE YOU SPEND
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test planned purchases against real cash surplus and emergency cushions before committing funds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Input Form */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h2 className="text-sm font-bold text-white mb-2">Simulate Planned Purchase</h2>

          <form onSubmit={handleEvaluate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Planned Item / Service</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Laptop, Noise Cancelling Headphones, Vacation..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Cost ({user?.primaryCurrencyCode} - {symbol})
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  <option value="SHOPPING">Shopping / Tech / Gadgets</option>
                  <option value="ENTERTAINMENT">Leisure & Travel</option>
                  <option value="EDUCATION">Educational Course / Degree</option>
                  <option value="HEALTHCARE">Healthcare & Wellness</option>
                  <option value="OTHER">Other Discretionary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  <option value="NORMAL">Standard Planned Buy</option>
                  <option value="HIGH">Time-Sensitive / Discounted</option>
                  <option value="EMERGENCY">Critical Emergency</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={evaluating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:opacity-95 text-navy-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {evaluating ? 'Analyzing Cash Flow...' : 'Evaluate Affordability & Impact'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Results Verdict Panel */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h2 className="text-sm font-bold text-white">KANJOO Decision Verdict</h2>
              {result && (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  result.classification === 'SAFE_TO_BUY' || result.classification === 'ESSENTIAL'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : result.classification === 'DELAY_AND_SAVE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {result.classification}
                </span>
              )}
            </div>

            {!result ? (
              <div className="py-16 text-center text-xs text-slate-400">
                Enter your planned purchase amount and click <strong>Evaluate Affordability</strong> to receive a non-judgmental cash flow impact analysis.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2">
                    {result.affordableWithoutDebt ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                    <span className="font-bold text-white text-xs">Analysis Summary</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{result.verdictReasoning}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400">Available Surplus</span>
                    <p className="text-sm font-bold text-white mt-0.5 font-mono">
                      {symbol} {Number(result.availableMonthlySurplus).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400">Emergency Cushion</span>
                    <p className="text-sm font-bold text-brand-cyan mt-0.5 font-mono">
                      {Number(result.emergencyFundRatio).toFixed(1)} Months
                    </p>
                  </div>
                </div>

                {result.recommendedWaitingDays > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300">
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Recommended Cooling Period: {result.recommendedWaitingDays} Days</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Prevent impulse spending. Wait {result.recommendedWaitingDays} days to confirm persistent utility.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-xs text-slate-400">
                  <strong className="text-slate-200">Alternative Strategy:</strong> {result.alternativeAction}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-slate-500">
            KANJOO does not judge spending preferences. We empower you to make informed purchases without jeopardizing long-term solvency.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
