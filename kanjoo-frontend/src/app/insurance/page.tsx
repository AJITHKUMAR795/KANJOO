'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  ShieldCheck,
  ShieldAlert,
  HeartPulse,
  Users,
  Car,
  Home,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles,
  Calendar,
  Lock,
} from 'lucide-react';

export default function InsurancePage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    policyType: 'HEALTH',
    providerName: '',
    policyNumber: '',
    sumInsured: '',
    annualPremium: '',
    currencyCode: user?.primaryCurrencyCode || 'INR',
    renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const loadData = async () => {
    try {
      const res = await fetchApi<any>('/insurance');
      setData(res);
      if (user?.primaryCurrencyCode) {
        setForm((f) => ({ ...f, currencyCode: user.primaryCurrencyCode }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/insurance', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          sumInsured: parseFloat(form.sumInsured) || 0,
          annualPremium: parseFloat(form.annualPremium) || 0,
        }),
      });
      setShowAddModal(false);
      setForm({
        policyType: 'HEALTH',
        providerName: '',
        policyNumber: '',
        sumInsured: '',
        annualPremium: '',
        currencyCode: user?.primaryCurrencyCode || 'INR',
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      loadData();
    } catch {
      alert('Failed to save policy');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this insurance policy?')) return;
    try {
      await fetchApi(`/insurance/${id}`, { method: 'DELETE' });
      loadData();
    } catch {
      alert('Failed to delete policy');
    }
  };

  const symbol = user?.primaryCurrencySymbol || '₹';

  return (
    <AppLayout>
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Autonomous Risk & Safety Net Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Insurance & Financial Protection
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate your family safety net against the 12x income term rule and hospitalization benchmarks
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Policy / Coverage
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Auditing insurance adequacy...</div>
      ) : (
        <div className="space-y-6 mt-6">
          {/* Quick Check: Do You Have Insurance? */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl glass-panel border ${data?.hasHealthInsurance ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className={`w-4 h-4 ${data?.hasHealthInsurance ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className="text-xs font-bold text-white">Health / Medical</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data?.hasHealthInsurance ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {data?.hasHealthInsurance ? 'Protected' : 'Missing!'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Coverage: <strong className="text-white">{symbol} {Number(data?.totalHealthCoverage || 0).toLocaleString()}</strong>
              </p>
            </div>

            <div className={`p-4 rounded-2xl glass-panel border ${data?.hasLifeInsurance ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className={`w-4 h-4 ${data?.hasLifeInsurance ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span className="text-xs font-bold text-white">Term Life Cover</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data?.hasLifeInsurance ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {data?.hasLifeInsurance ? 'Protected' : 'Unprotected'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Coverage: <strong className="text-white">{symbol} {Number(data?.totalLifeCoverage || 0).toLocaleString()}</strong>
              </p>
            </div>

            <div className={`p-4 rounded-2xl glass-panel border ${data?.hasVehicleInsurance ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Vehicle Cover</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {data?.hasVehicleInsurance ? 'Active' : 'Not Configured'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Comprehensive motor insurance</p>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-brand-cyan/20 bg-gradient-to-br from-navy-850 to-brand-blue/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-brand-cyan" />
                  <span className="text-xs font-bold text-white">Tax Deductions (80D)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan">
                  Tax Saved
                </span>
              </div>
              <p className="text-lg font-bold text-brand-cyan mt-1">
                {symbol} {Number(data?.estimatedTaxSavings || 0).toLocaleString()}/yr
              </p>
            </div>
          </div>

          {/* Critical Gaps & Strengths */}
          {data?.criticalGaps?.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-rose-200">Critical Safety Net Gaps Detected</h3>
                <ul className="mt-1 space-y-1 text-[11px] text-rose-300">
                  {data.criticalGaps.map((g: string, i: number) => (
                    <li key={i}>• {g}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Policy List */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Your Active Policies ({data?.policies?.length || 0})</span>
              <span className="text-xs text-slate-400">Total Annual Outflow: {symbol} {Number(data?.totalAnnualPremium || 0).toLocaleString()}</span>
            </h2>

            {data?.policies?.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No insurance policies recorded yet.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                >
                  Add Your Health or Term Life Cover
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Provider</th>
                      <th className="pb-3">Policy Number</th>
                      <th className="pb-3 text-right">Sum Insured</th>
                      <th className="pb-3 text-right">Annual Premium</th>
                      <th className="pb-3">Renewal Date</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data?.policies?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-white">
                          <span className="inline-block px-2 py-0.5 rounded bg-navy-800 border border-white/10 text-[10px]">
                            {p.policyType}
                          </span>
                        </td>
                        <td className="py-3 text-slate-200">{p.providerName}</td>
                        <td className="py-3 text-slate-400 font-mono text-[11px]">{p.policyNumber || 'N/A'}</td>
                        <td className="py-3 text-right font-bold text-white">
                          {symbol} {Number(p.primarySumInsured).toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-emerald-400 font-mono">
                          {symbol} {Number(p.primaryAnnualPremium).toLocaleString()}/yr
                        </td>
                        <td className="py-3 text-slate-300">
                          {p.renewalDate}
                          <span className={`ml-2 text-[10px] ${p.daysUntilRenewal <= 30 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                            ({p.daysUntilRenewal}d left)
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Curated Recommendations */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Verified Top-Tier Recommendations for {user?.countryCode || 'Your Country'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data?.recommendedPlans?.map((rec: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-900/60 border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                      <span>{rec.provider}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {rec.policyType}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white">{rec.planName}</h3>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{rec.coverageHighlights}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">{rec.taxBenefitSection}</span>
                      <span className="text-xs font-bold text-white">~{symbol} {Number(rec.estimatedAnnualCost).toLocaleString()}/yr</span>
                    </div>
                    <a
                      href={rec.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-white/10"
                    >
                      Compare <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel bg-navy-950 border border-white/15 space-y-4">
            <h3 className="text-sm font-bold text-white">Add Insurance Policy</h3>
            <form onSubmit={handleAddPolicy} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Coverage Type</label>
                <select
                  value={form.policyType}
                  onChange={(e) => setForm({ ...form, policyType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  <option value="HEALTH">Health / Medical Hospitalization</option>
                  <option value="LIFE_TERM">Pure Term Life Cover</option>
                  <option value="VEHICLE">Motor / Vehicle Insurance</option>
                  <option value="HOME">Home / Renters Insurance</option>
                  <option value="ACCIDENTAL">Personal Accidental Cover</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Insurance Provider Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC ERGO, Tata AIA, Blue Cross"
                  value={form.providerName}
                  onChange={(e) => setForm({ ...form, providerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Policy Number (Optional)</label>
                <input
                  type="text"
                  placeholder="POL-123456"
                  value={form.policyNumber}
                  onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Sum Insured ({symbol})</label>
                  <input
                    type="text"
                    required
                    placeholder="1000000"
                    value={form.sumInsured}
                    onChange={(e) => setForm({ ...form, sumInsured: e.target.value.replace(/^0+(?=\d)/, '') })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Annual Premium ({symbol})</label>
                  <input
                    type="text"
                    required
                    placeholder="14500"
                    value={form.annualPremium}
                    onChange={(e) => setForm({ ...form, annualPremium: e.target.value.replace(/^0+(?=\d)/, '') })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Renewal Date</label>
                <input
                  type="date"
                  required
                  value={form.renewalDate}
                  onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
