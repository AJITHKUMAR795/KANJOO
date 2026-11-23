'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  GraduationCap,
  Tv,
  Cloud,
  Check,
} from 'lucide-react';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [userSubs, setUserSubs] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    serviceName: '',
    price: '',
    currencyCode: user?.primaryCurrencyCode || 'USD',
    billingCycle: 'MONTHLY',
    activelyUsed: true,
    category: 'ENTERTAINMENT',
  });

  const loadData = async () => {
    try {
      const [subsData, catData, evalData] = await Promise.all([
        fetchApi<any[]>('/subscriptions/user'),
        fetchApi<any[]>('/subscriptions/catalog'),
        fetchApi<any[]>('/subscriptions/evaluate'),
      ]);
      setUserSubs(subsData);
      setCatalog(catData);
      setEvaluations(evalData);
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/subscriptions/user', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
        }),
      });
      setShowAddModal(false);
      setForm((f) => ({ ...f, serviceName: '', price: '' }));
      loadData();
    } catch {
      alert('Failed to add subscription');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Cancel or remove this subscription from tracking?')) return;
    try {
      await fetchApi(`/subscriptions/user/${id}`, { method: 'DELETE' });
      loadData();
    } catch {
      alert('Failed to delete subscription');
    }
  };

  const symbol = user?.primaryCurrencySymbol || '$';

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-cyan" />
            Subscriptions & Benefits Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify duplicate services, claim verified student discounts, and eliminate zero-usage auto-debits
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-cyan/20 hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Subscription
        </button>
      </div>

      {/* AI Evaluations / Leaks Alert */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          AI Need-Based Evaluation & Optimization
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluations.map((ev: any, idx: number) => {
            const sub = ev.userSubscription;
            const isLeak = ev.isUnusedLeak;
            const hasSavings = Number(ev.monthlySavings) > 0;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl glass-panel relative border ${
                  isLeak
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : hasSavings
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-navy-800 text-brand-cyan flex items-center justify-center font-bold text-xs">
                      {sub.serviceName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs">{sub.serviceName}</h3>
                      <span className="text-[10px] text-slate-400">
                        Paying: {sub.currency?.code} {Number(sub.price).toFixed(2)}/mo
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isLeak
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : hasSavings
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {ev.eligibilityStatus}
                  </span>
                </div>

                <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                  {ev.recommendationNote}
                </p>

                {hasSavings && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Potential Savings:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      +{symbol} {Number(ev.monthlySavings).toFixed(2)}/mo ({symbol} {Number(ev.annualSavings).toFixed(2)}/yr)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Global Offers for User Country */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h2 className="text-sm font-bold text-white mb-1">
          Verified Student & Platform Benefits in {user?.countryCode}
        </h2>
        <p className="text-[11px] text-slate-400 mb-4">
          Never pay full price for developer tools, cloud suites, and streaming platforms
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {catalog.map((offer: any) => (
            <div key={offer.id} className="p-4 rounded-xl bg-navy-900 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                    {offer.category}
                  </span>
                  {offer.studentOnly && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /> Student
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-xs mb-1">{offer.serviceName}</h3>
                <p className="text-[11px] text-slate-400 mb-2">{offer.benefitsSummary}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {offer.currency?.symbol} {Number(offer.discountedPrice).toFixed(2)}/{offer.billingPeriod.toLowerCase()}
                  </span>
                  {Number(offer.originalPrice) > Number(offer.discountedPrice) && (
                    <span className="text-[10px] text-slate-500 line-through font-mono">
                      {offer.currency?.symbol} {Number(offer.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Verified official link</span>
                {offer.officialSourceUrl && (
                  <a
                    href={offer.officialSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-semibold"
                  >
                    Claim Offer <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl shadow-2xl relative border border-white/10">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-cyan" /> Add Subscription
            </h2>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={form.serviceName}
                  onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                  placeholder="Netflix, Spotify, AWS, GitHub..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Cycle</label>
                  <select
                    value={form.billingCycle}
                    onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="ANNUAL">Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  <option value="ENTERTAINMENT">Entertainment & Media</option>
                  <option value="EDUCATION">Education & Books</option>
                  <option value="CLOUD">Cloud & Hosting</option>
                  <option value="TOOLS">Software Tools & AI</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="used"
                  checked={form.activelyUsed}
                  onChange={(e) => setForm({ ...form, activelyUsed: e.target.checked })}
                  className="rounded bg-navy-900 border-white/10 text-brand-cyan"
                />
                <label htmlFor="used" className="text-xs text-slate-300 cursor-pointer">
                  I actively use this service weekly
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
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
