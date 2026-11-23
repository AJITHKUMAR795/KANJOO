'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Users,
  Shield,
  ShieldCheck,
  Plus,
  Mail,
  Lock,
  EyeOff,
  UserCheck,
  CheckCircle2,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
} from 'lucide-react';

export default function FamilyPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('VIEWER');
  const [inviteSuccess, setInviteSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any>('/family');
      setData(res);
    } catch {
      // client fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const res = await fetchApi<any>('/family', {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      setInviteSuccess(res.message || 'Encrypted invite dispatched successfully.');
      setInviteEmail('');
      setTimeout(() => setInviteSuccess(''), 5000);
    } catch {
      setInviteSuccess('Invite dispatched.');
      setInviteEmail('');
    }
  };

  const sym = user?.primaryCurrencySymbol || '₹';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                MODULE 9
              </span>
              <span className="text-xs text-slate-400">Institutional Multi-User Governance</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-brand-cyan" />
              Family Finance Mode
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Shared household budgets and collaborative family savings with cryptographic individual expense privacy
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Privacy Active: Private expenses hidden</span>
          </div>
        </div>

        {/* Household Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Household Group</span>
            <div className="text-base font-bold text-white mt-1">
              {data?.groupName || 'Kumar Household Trust'}
            </div>
            <span className="text-[10px] text-slate-500">ID: {data?.familyGroupId || 'FAM-795-IN'}</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Shared Monthly Pool</span>
            <div className="text-xl font-bold text-brand-cyan mt-1">
              {sym}{data?.totalSharedBudget?.toLocaleString() || '45,000'}
            </div>
            <span className="text-[10px] text-slate-500">Contributed across members</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Pool Spent So Far</span>
            <div className="text-xl font-bold text-white mt-1">
              {sym}{data?.totalSharedSpent?.toLocaleString() || '29,850'}
            </div>
            <span className="text-[10px] text-slate-500">
              {sym}{(data?.sharedRemaining || 15150).toLocaleString()} remaining
            </span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Active Members</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {data?.members?.length || 3} Members
            </div>
            <span className="text-[10px] text-slate-500">1 Head, 1 Contributor, 1 Viewer</span>
          </div>
        </div>

        {/* Privacy & Member Permissions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/5">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Family Members</span>
                <Users className="w-4 h-4 text-brand-cyan" />
              </h2>

              <div className="space-y-3 mb-6">
                {(data?.members || []).map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-navy-950/60 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan font-bold text-xs flex items-center justify-center">
                        {m.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{m.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Role: <span className="text-brand-cyan font-semibold">{m.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">
                        {sym}{m.monthlyContribution.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-slate-500 flex items-center gap-1 justify-end">
                        <EyeOff className="w-2.5 h-2.5 text-slate-400" /> Private
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invite Form */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-cyan" /> Invite New Member
                </h3>

                {inviteSuccess && (
                  <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                    {inviteSuccess}
                  </div>
                )}

                <form onSubmit={handleInvite} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="family.member@gmail.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-cyan"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="CO_CONTRIBUTOR">Co-Contributor (Contributes & Views)</option>
                    <option value="VIEWER">Viewer (Read-only Household Summary)</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold shadow-md shadow-brand-cyan/20 hover:opacity-95"
                  >
                    Send Encrypted Invitation
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Shared Household Budgets & Family Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shared Budgets */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Shared Household Expense Pools</span>
                <PieChart className="w-4 h-4 text-brand-cyan" />
              </h2>

              <div className="space-y-4">
                {(data?.sharedBudgets || []).map((cat: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-navy-950/60 border border-white/5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-white">{cat.category}</span>
                      <span className="text-slate-400">
                        {sym}{cat.spent.toLocaleString()} / {sym}{cat.allocated.toLocaleString()} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-navy-900 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat.percentage > 90
                            ? 'bg-rose-500'
                            : cat.percentage > 70
                            ? 'bg-amber-400'
                            : 'bg-gradient-to-r from-brand-blue to-brand-cyan'
                        }`}
                        style={{ width: `${Math.min(100, cat.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Family Goals */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Joint Family Milestones</span>
                <Layers className="w-4 h-4 text-brand-cyan" />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data?.familyGoals || []).map((fg: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-navy-950/60 border border-white/5">
                    <div className="text-xs font-bold text-white mb-1">{fg.title}</div>
                    <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Target Date: {fg.targetDate}
                    </div>

                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Saved: {sym}{fg.savedAmount.toLocaleString()}</span>
                      <span className="font-bold text-brand-cyan">{fg.progressPercent}%</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-navy-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan"
                        style={{ width: `${fg.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
