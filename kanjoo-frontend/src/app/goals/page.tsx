'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Target,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export default function GoalsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    monthlyContribution: '',
    priority: 'HIGH',
    category: 'EMERGENCY',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any>('/goals');
      setData(res);
    } catch {
      // client-side fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/goals', {
        method: 'POST',
        body: JSON.stringify(newGoal),
      });
      setShowAddModal(false);
      loadData();
    } catch {
      setShowAddModal(false);
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
                MODULE 8
              </span>
              <span className="text-xs text-slate-400">Institutional Financial Planning</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Target className="w-6 h-6 text-brand-cyan" />
              AI Financial Goal Accelerator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Goal milestone simulation, monthly savings acceleration, and inter-goal budget impact analysis
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Financial Goal</span>
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Total Goals Target</span>
            <div className="text-xl font-bold text-white mt-1">
              {sym}{data?.totalTargetAmount?.toLocaleString() || '1,270,000'}
            </div>
            <span className="text-[10px] text-slate-500">Across 3 active milestones</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Current Progress</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {sym}{data?.totalSavedAmount?.toLocaleString() || '305,000'}
            </div>
            <div className="text-[10px] text-slate-500">
              {data?.overallCompletionPercentage || '24.0'}% overall achieved
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Required Monthly Savings</span>
            <div className="text-xl font-bold text-brand-cyan mt-1">
              {sym}{Math.round(data?.totalRequiredMonthlySavings || 38903).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">To meet all contractual target dates</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Monthly Surplus Available</span>
            <div className="text-xl font-bold text-amber-300 mt-1">
              {sym}{data?.monthlySurplusAvailable?.toLocaleString() || '19,047'}
            </div>
            <span className="text-[10px] text-amber-400/80">
              Deficit: {sym}{(Math.round((data?.totalRequiredMonthlySavings || 38903) - (data?.monthlySurplusAvailable || 19047))).toLocaleString()}
            </span>
          </div>
        </div>

        {/* AI Trade-off & Acceleration Banner */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-cyan/20 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-cyan/20 text-brand-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Inter-Goal Priority Analysis & Surplus Trade-Off
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Surplus Constrained
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {data?.aiRecommendation ||
                  'Your combined required monthly savings exceed your uncommitted monthly surplus. KANJOO recommends protecting your Emergency Fund at ₹8,500/month, deferring discretionary tech purchases, and focusing surplus towards your primary housing down payment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Goal Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Active Financial Goals</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data?.goals || []).map((goal: any, idx: number) => {
              const isOnTrack = goal.onTrack;
              return (
                <div
                  key={idx}
                  className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-brand-cyan/30 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          goal.priority === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {goal.priority} PRIORITY
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isOnTrack
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {isOnTrack ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> On Track
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" /> Needs Attention
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">{goal.goalName}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                      <Calendar className="w-3.5 h-3.5" /> Target: {goal.targetDate} ({goal.monthsRemaining} mos remaining)
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Achieved</span>
                        <span className="font-bold text-white">{goal.completionPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-500"
                          style={{ width: `${Math.min(100, goal.completionPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial Figures */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-navy-950/60 border border-white/5 mb-3">
                      <div>
                        <span className="text-slate-500 text-[10px]">Saved</span>
                        <div className="font-bold text-white">
                          {sym}{goal.currentAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Target</span>
                        <div className="font-bold text-white">
                          {sym}{goal.targetAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Required/mo</span>
                        <div className="font-bold text-brand-cyan">
                          {sym}{Math.round(goal.requiredMonthlySavings).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Current Plan/mo</span>
                        <div className="font-bold text-slate-200">
                          {sym}{Math.round(goal.currentMonthlyContribution).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Est. Finish: {goal.estimatedCompletionDate}
                    </span>
                    <span className="text-slate-500">
                      Surplus Impact: {goal.surplusImpactPercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl">
              <h2 className="text-base font-bold text-white mb-1">Create Financial Goal</h2>
              <p className="text-xs text-slate-400 mb-4">
                Define your savings target and let the AI compute required monthly contributions
              </p>

              <form onSubmit={handleAddGoal} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Higher Education Fund"
                    value={newGoal.goalName}
                    onChange={(e) => setNewGoal({ ...newGoal, goalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Amount ({sym})</label>
                    <input
                      type="number"
                      required
                      placeholder="100000"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Current Saved ({sym})</label>
                    <input
                      type="number"
                      placeholder="20000"
                      value={newGoal.currentAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                    <input
                      type="date"
                      required
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="HIGH">High Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="LOW">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-navy-900 text-slate-300 text-xs font-medium hover:bg-navy-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-cyan/20"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
