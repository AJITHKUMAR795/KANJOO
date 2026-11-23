'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  TrendingUp,
  Calculator,
  Plus,
  Trash2,
  PieChart as PieIcon,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function InvestmentsPage() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // SIP Calculator state
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipReturn, setSipReturn] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);
  const [sipResult, setSipResult] = useState<any>(null);

  const loadData = async () => {
    try {
      const data = await fetchApi<any[]>('/investments');
      setInvestments(data);
      calculateSip(sipMonthly, sipReturn, sipYears);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSip = async (monthly: number, ret: number, years: number) => {
    try {
      const res = await fetchApi<any>('/investments/sip-calculate', {
        method: 'POST',
        body: JSON.stringify({
          monthlyInvestment: monthly,
          expectedAnnualReturn: ret,
          durationYears: years,
        }),
      });
      setSipResult(res);
    } catch (err) {
      console.error('SIP calculation failed', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSipChange = (monthly: number, ret: number, years: number) => {
    setSipMonthly(monthly);
    setSipReturn(ret);
    setSipYears(years);
    calculateSip(monthly, ret, years);
  };

  const symbol = user?.primaryCurrencySymbol || '$';

  const chartData = (sipResult?.yearlyBreakdown || []).map((y: any) => ({
    year: `Yr ${y.year}`,
    invested: Number(y.totalInvested),
    estimatedWealth: Number(y.estimatedWealth),
  }));

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-cyan" />
            Investment Intelligence & SIP Calculator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Country-specific portfolio tracking (SIP, ETFs, Mutual Funds, NISA, ISAs) and compound growth simulation
          </p>
        </div>
      </div>

      {/* Portfolio Overview & SIP Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* SIP Calculator Controls */}
        <div className="p-6 rounded-2xl glass-panel space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Calculator className="w-4 h-4 text-brand-cyan" />
            <h2 className="text-sm font-bold text-white">Disciplined SIP Simulator</h2>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Monthly Contribution</span>
              <span className="text-white font-bold font-mono">{symbol} {sipMonthly.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={sipMonthly}
              onChange={(e) => handleSipChange(parseInt(e.target.value), sipReturn, sipYears)}
              className="w-full accent-brand-cyan cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Expected Annual Return</span>
              <span className="text-emerald-400 font-bold font-mono">{sipReturn}% p.a.</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={sipReturn}
              onChange={(e) => handleSipChange(sipMonthly, parseFloat(e.target.value), sipYears)}
              className="w-full accent-brand-cyan cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Time Horizon</span>
              <span className="text-brand-cyan font-bold font-mono">{sipYears} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={35}
              step={1}
              value={sipYears}
              onChange={(e) => handleSipChange(sipMonthly, sipReturn, parseInt(e.target.value))}
              className="w-full accent-brand-cyan cursor-pointer"
            />
          </div>

          {/* Results Summary */}
          {sipResult && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="p-3 rounded-xl bg-navy-900 border border-white/5">
                <span className="text-[10px] text-slate-400">Total Invested Capital</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5 font-mono">
                  {symbol} {Number(sipResult.totalInvested).toLocaleString()}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                <span className="text-[10px] text-brand-cyan font-semibold">Estimated Future Value</span>
                <p className="text-lg font-extrabold text-white mt-0.5 font-mono">
                  {symbol} {Number(sipResult.estimatedFutureValue).toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-400 mt-0.5 block">
                  Gain: +{symbol} {Number(sipResult.totalEstimatedReturns).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Compounding Growth Curve Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Wealth Accumulation Trajectory</h2>
                <p className="text-[11px] text-slate-400">Invested principal vs Compounded growth</p>
              </div>
              <span className="text-[10px] text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                Hypothetical Illustration
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${symbol}${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                    formatter={(val: any) => [`${symbol} ${val.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="estimatedWealth" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#wealthGrad)" name="Total Wealth" />
                  <Area type="monotone" dataKey="invested" stroke="#818CF8" strokeWidth={2} fillOpacity={1} fill="url(#investedGrad)" name="Invested Capital" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-navy-900/60 border border-white/5 flex items-start gap-2 text-[10px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{sipResult?.disclaimer}</span>
          </div>
        </div>
      </div>

      {/* Active Investment Records */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h2 className="text-sm font-bold text-white mb-1">Your Investment Assets</h2>
        <p className="text-[11px] text-slate-400 mb-4">Tracked across mutual funds, ETFs, and index SIPs</p>

        {investments.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No investments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Asset Type</th>
                  <th className="pb-3 font-semibold">Instrument Name</th>
                  <th className="pb-3 font-semibold">Invested Principal</th>
                  <th className="pb-3 font-semibold">Current Value</th>
                  <th className="pb-3 font-semibold text-right">P&L (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {investments.map((inv) => {
                  const diff = Number(inv.currentValue) - Number(inv.investedAmount);
                  const pct = Number(inv.investedAmount) > 0 ? (diff / Number(inv.investedAmount)) * 100 : 0;
                  return (
                    <tr key={inv.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                          {inv.assetType}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-white">{inv.name}</td>
                      <td className="py-3 text-slate-300 font-mono">
                        {symbol} {Number(inv.investedAmount).toLocaleString()}
                      </td>
                      <td className="py-3 text-white font-bold font-mono">
                        {symbol} {Number(inv.currentValue).toLocaleString()}
                      </td>
                      <td className={`py-3 text-right font-bold font-mono ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {diff >= 0 ? '+' : ''}{pct.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
