'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Smartphone,
  Plus,
  Wifi,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function RechargeOptimizerPage() {
  const { user } = useAuth();
  const [sims, setSims] = useState<any[]>([]);
  const [optimization, setOptimization] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    operatorId: 1,
    phoneNumber: '',
    simSlot: 'PRIMARY',
    currentPlanId: 1,
    planExpiryDate: '2026-12-31',
    dailyDataUsedGb: 1.0,
    hasWifiAccess: true,
  });

  const loadData = async () => {
    try {
      const [simsData, optData, opsData, plansData] = await Promise.all([
        fetchApi<any[]>('/telecom/sim-cards'),
        fetchApi<any[]>('/telecom/optimize'),
        fetchApi<any[]>('/telecom/operators'),
        fetchApi<any[]>('/telecom/plans'),
      ]);
      setSims(simsData);
      setOptimization(optData);
      setOperators(opsData);
      setPlans(plansData);
      if (opsData.length > 0) setForm((f) => ({ ...f, operatorId: opsData[0].id }));
      if (plansData.length > 0) setForm((f) => ({ ...f, currentPlanId: plansData[0].id }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddSim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/telecom/sim-cards', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setShowAddModal(false);
      loadData();
    } catch {
      alert('Failed to add SIM');
    }
  };

  const handleDeleteSim = async (id: number) => {
    if (!confirm('Delete this SIM card configuration?')) return;
    try {
      await fetchApi(`/telecom/sim-cards/${id}`, { method: 'DELETE' });
      loadData();
    } catch {
      alert('Failed to delete SIM');
    }
  };

  const symbol = user?.primaryCurrencySymbol || '$';

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-[11px] font-semibold text-brand-cyan mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Country-Aware Tariff Intelligence</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-cyan" />
            Smart Recharge Optimizer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate multi-SIM configurations, calculate effective daily costs, and eliminate wasteful data packs
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-cyan/20 hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add SIM Card
        </button>
      </div>

      {/* Multi-SIM Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {optimization.map((opt: any) => {
          const sim = opt.simCard;
          const currentPlan = opt.currentPlan;
          const recPlan = opt.recommendedPlan;
          const isOptimized = opt.isOptimized;

          return (
            <div
              key={sim.id}
              className={`p-6 rounded-2xl glass-panel relative overflow-hidden ${
                !isOptimized ? 'border-amber-500/40 bg-gradient-to-b from-navy-850 to-amber-500/5' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-md"
                    style={{ backgroundColor: sim.operator?.logoColor || '#3B82F6' }}
                  >
                    {sim.operator?.name?.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{sim.operator?.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sim.simSlot === 'PRIMARY'
                          ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {sim.simSlot} SIM
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{sim.phoneNumber || 'Number not set'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSim(sim.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Current Metrics */}
              <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-navy-900/60 border border-white/5 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Daily Cost</span>
                  <p className="text-xs font-bold text-white mt-0.5 font-mono">
                    {symbol} {Number(opt.currentMetrics.dailyCost).toFixed(2)}/day
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Monthly Equivalent</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 font-mono">
                    {symbol} {Number(opt.currentMetrics.monthlyEquivalent).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Cost / GB</span>
                  <p className="text-xs font-bold text-brand-cyan mt-0.5 font-mono">
                    {symbol} {Number(opt.currentMetrics.costPerGb).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Wi-Fi & Usage Context */}
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
                <Wifi className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Wi-Fi Access: <strong className="text-white">{sim.hasWifiAccess ? 'Available' : 'No'}</strong></span>
                <span className="text-slate-600">|</span>
                <span>Data Used: <strong className="text-white">{sim.dailyDataUsedGb} GB/day</strong></span>
              </div>

              {/* Recommendation Panel */}
              {!isOptimized ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                    <span>Optimization Opportunity</span>
                    <span className="text-xs font-extrabold bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
                      Save {symbol} {Number(opt.potentialMonthlySavings).toFixed(2)}/mo
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-1">{opt.reasoning}</p>

                  <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Switch to: <strong className="text-white">{recPlan.planName}</strong></span>
                    <span className="text-emerald-400 font-bold">
                      +{symbol} {Number(opt.potentialAnnualSavings).toFixed(2)}/year
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>This SIM plan is already optimized for your usage pattern and Wi-Fi environment.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Plans Catalog for Country */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h2 className="text-sm font-bold text-white mb-1">
          Verified Market Tariffs for {user?.countryCode || 'Your Country'}
        </h2>
        <p className="text-[11px] text-slate-400 mb-4">
          All recharge options verified with official telecom operator sources
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const daily = Number(p.price) / p.validityDays;
            return (
              <div key={p.id} className="p-4 rounded-xl bg-navy-900 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                      {p.planType}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {symbol} {Number(p.price).toFixed(2)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-xs mb-1">{p.planName}</h3>
                  <p className="text-[11px] text-slate-400">
                    Validity: <strong className="text-slate-200">{p.validityDays} Days</strong> | Data:{' '}
                    <strong className="text-slate-200">{p.dailyDataGb > 0 ? `${p.dailyDataGb}GB/day` : `${p.totalDataGb}GB`}</strong>
                  </p>
                  {p.bundledPerks && (
                    <p className="text-[10px] text-slate-500 mt-2 bg-navy-950 p-1.5 rounded">
                      Perks: {p.bundledPerks}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Daily Rate: <strong className="text-brand-cyan">{symbol}{daily.toFixed(2)}/day</strong></span>
                  {p.officialSourceUrl && (
                    <a href={p.officialSourceUrl} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline text-[10px]">
                      Official Source
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add SIM Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl shadow-2xl relative border border-white/10">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-brand-cyan" /> Configure SIM Card
            </h2>

            <form onSubmit={handleAddSim} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Telecom Operator</label>
                <select
                  value={form.operatorId}
                  onChange={(e) => setForm({ ...form, operatorId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name} ({op.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SIM Slot</label>
                  <select
                    value={form.simSlot}
                    onChange={(e) => setForm({ ...form, simSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                  >
                    <option value="PRIMARY">PRIMARY (Main Calling & Data)</option>
                    <option value="SECONDARY">SECONDARY (Incoming / Backup)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    placeholder="+91 / +1 / +44 ..."
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Recharge Plan</label>
                <select
                  value={form.currentPlanId}
                  onChange={(e) => setForm({ ...form, currentPlanId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.planName} - {symbol}{p.price} ({p.validityDays}d)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="wifi"
                  checked={form.hasWifiAccess}
                  onChange={(e) => setForm({ ...form, hasWifiAccess: e.target.checked })}
                  className="rounded bg-navy-900 border-white/10 text-brand-cyan"
                />
                <label htmlFor="wifi" className="text-xs text-slate-300 cursor-pointer">
                  Has regular Wi-Fi access at home or office
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs hover:opacity-90 shadow-md shadow-brand-cyan/20"
                >
                  Save SIM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
