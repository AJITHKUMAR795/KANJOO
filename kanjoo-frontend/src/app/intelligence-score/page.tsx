'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Info,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';

export default function IntelligenceScorePage() {
  const { user } = useAuth();
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadScore = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<any>('/intelligence-score/current');
      setScoreData(data);
    } catch (err) {
      console.error('Failed to load score', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScore();
  }, [user]);

  const score = scoreData?.totalScore || 88;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-brand-cyan/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 mb-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>SIGNATURE FINTECH CAPABILITY</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            KANJOO Financial Intelligence Score
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent 7-pillar evaluation of personal cash flow stability, savings discipline, debt ratio, and emergency resilience
          </p>
        </div>
      </div>

      {/* Main Score & Tier Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Score Ring / Radial Card */}
        <div className="p-8 rounded-3xl glass-panel border border-brand-cyan/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-40 h-40 rounded-full border-8 border-navy-800 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-8 border-brand-cyan border-t-transparent border-l-transparent -rotate-45" />
            <div className="text-center">
              <span className="text-4xl font-extrabold text-white font-mono">{score}</span>
              <span className="text-xs text-slate-400 block font-sans">out of 100</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold inline-block">
              {scoreData?.tier || 'Tier 1: Institutional Elite'}
            </span>
            <p className="text-xs text-slate-400 mt-2 max-w-xs">
              {scoreData?.tierDescription}
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Core Financial Strengths
            </h3>
            <div className="space-y-2 text-xs">
              {(scoreData?.keyStrengths || []).map((s: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-navy-900 border border-white/5 text-slate-300">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Optimization Opportunities
            </h3>
            <div className="space-y-2 text-xs">
              {(scoreData?.criticalWeaknesses || []).map((w: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-navy-900 border border-white/5 text-slate-300">
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="md:col-span-2 p-4 rounded-xl bg-navy-900 border border-brand-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-cyan" />
                Immediate Financial Improvement Roadmap
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Execute prioritized actions to raise your score toward the 95+ institutional benchmark.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Pillars Breakdown */}
      <div className="mt-8 p-6 rounded-2xl glass-panel">
        <h2 className="text-sm font-bold text-white mb-4">Detailed 7-Pillar Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(scoreData?.pillars || []).map((p: any) => {
            const pct = Math.round((p.score / p.maxScore) * 100);
            return (
              <div key={p.pillarCode} className="p-4 rounded-xl bg-navy-900 border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{p.pillarName}</span>
                  <span className="font-mono text-xs font-bold text-brand-cyan">
                    {p.score} / {p.maxScore}
                  </span>
                </div>

                <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">{p.explanation}</p>
                <p className="text-[10px] text-emerald-400 italic">💡 {p.actionableAdvice}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regulatory Non-Credit Score Disclaimer */}
      <div className="mt-6 p-4 rounded-xl bg-navy-900/60 border border-white/5 flex items-start gap-2.5 text-[11px] text-slate-500">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <span>{scoreData?.disclaimer}</span>
      </div>
    </AppLayout>
  );
}
