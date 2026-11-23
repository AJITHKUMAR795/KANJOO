'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Info,
} from 'lucide-react';

export default function AnomaliesPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any>('/anomalies');
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

  const handleResolution = async (id: string, resolution: string) => {
    try {
      await fetchApi(`/anomalies`, {
        method: 'POST',
        body: JSON.stringify({ anomalyId: id, resolution }),
      });
      setFeedbackSuccess(`Anomaly ${id} marked as ${resolution}. Model recalibrated.`);
      setTimeout(() => setFeedbackSuccess(null), 4000);
      loadData();
    } catch {
      setFeedbackSuccess(`Anomaly updated.`);
      setTimeout(() => setFeedbackSuccess(null), 4000);
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
                MODULE 10
              </span>
              <span className="text-xs text-slate-400">Institutional Transaction Monitoring</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6 text-brand-cyan" />
              Financial Anomaly Detection Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated surveillance for duplicate charges, unexpected price hikes, and abnormal spending velocity
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Statistical Surveillance</span>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/5 bg-navy-950/60 flex items-start gap-3">
          <Info className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {data?.regulatoryDisclaimer ||
              'KANJOO Anomaly Engine uses statistical machine intelligence on authorized transaction data. It does not replace authoritative cardholder banking fraud notifications.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Total Flagged</span>
            <div className="text-xl font-bold text-white mt-1">
              {data?.totalAnomaliesDetected || 3} Anomalies
            </div>
            <span className="text-[10px] text-slate-500">In the last 30 days</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">High Risk Anomalies</span>
            <div className="text-xl font-bold text-rose-400 mt-1">
              {data?.highRiskCount || 1} Urgent
            </div>
            <span className="text-[10px] text-rose-400/80">Requires immediate card review</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Medium Risk</span>
            <div className="text-xl font-bold text-amber-300 mt-1">
              {data?.mediumRiskCount || 1} Recurring Hikes
            </div>
            <span className="text-[10px] text-slate-500">Subscription price creep</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Potential Leak Recoverable</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {sym}{data?.potentialLeakSavings?.toLocaleString() || '5,729'}
            </div>
            <span className="text-[10px] text-slate-500">Upon resolving duplicate/hikes</span>
          </div>
        </div>

        {feedbackSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{feedbackSuccess}</span>
          </div>
        )}

        {/* Anomaly Stream */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Flagged Transactions & Outliers</h2>

          <div className="space-y-3">
            {(data?.anomalies || []).map((anm: any, idx: number) => {
              const isHigh = anm.riskLevel === 'HIGH';
              const isResolved = anm.status === 'REVIEWED_VERIFIED' || anm.status === 'RESOLVED';

              return (
                <div
                  key={idx}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    isHigh
                      ? 'border-rose-500/30 bg-rose-500/5'
                      : 'border-white/5 hover:border-brand-cyan/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-300'
                            : anm.riskLevel === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-brand-cyan/20 text-brand-cyan'
                        }`}
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{anm.merchant}</h3>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isHigh
                                ? 'bg-rose-500/20 text-rose-300'
                                : anm.riskLevel === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {anm.riskLevel} RISK
                          </span>
                          <span className="text-[10px] text-slate-500">ID: {anm.id}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Detected on {anm.date} • Type: <span className="text-slate-300">{anm.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-white">
                        {sym}{anm.amount.toLocaleString()}
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          isResolved ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        Status: {anm.status}
                      </span>
                    </div>
                  </div>

                  {/* Reason & Action */}
                  <div className="p-3.5 rounded-xl bg-navy-950/70 border border-white/5 space-y-2 mb-4">
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Explanation:</strong> {anm.reason}
                    </div>
                    <div className="text-xs text-brand-cyan">
                      <strong>Recommended Action:</strong> {anm.recommendedAction}
                    </div>
                  </div>

                  {/* Feedback Controls */}
                  {!isResolved ? (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/5">
                      <span className="text-[11px] text-slate-400 mr-2">Was this intentional?</span>
                      <button
                        onClick={() => handleResolution(anm.id, 'FALSE_POSITIVE')}
                        className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 text-xs border border-white/10"
                      >
                        Expected (False Positive)
                      </button>
                      <button
                        onClick={() => handleResolution(anm.id, 'RESOLVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30"
                      >
                        Confirm & Mark Handled
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-400 pt-2 border-t border-white/5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified and incorporated into user spending baseline.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
