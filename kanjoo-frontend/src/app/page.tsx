'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Crown,
  Bot,
  Briefcase,
  Users,
  FileText,
  DollarSign,
  HeartPulse,
} from 'lucide-react';

export default function LandingPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'EUR' | 'JPY' | 'GBP'>('USD');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSampleQuery, setAiSampleQuery] = useState('');

  const currencyExamples = {
    USD: { symbol: '$', income: '$4,500', expenses: '$2,800', leakSaved: '$340/yr', telecomOpt: '$15/mo saver', proPrice: '$1.00' },
    INR: { symbol: '₹', income: '₹45,000', expenses: '₹28,000', leakSaved: '₹14,200/yr', telecomOpt: '₹107 saver', proPrice: '₹83.50' },
    EUR: { symbol: '€', income: '€3,800', expenses: '€2,400', leakSaved: '€310/yr', telecomOpt: '€12/mo saver', proPrice: '€0.92' },
    JPY: { symbol: '¥', income: '¥450,000', expenses: '¥280,000', leakSaved: '¥48,000/yr', telecomOpt: '¥990 saver', proPrice: '¥155.00' },
    GBP: { symbol: '£', income: '£3,200', expenses: '£2,100', leakSaved: '£290/yr', telecomOpt: '£10/mo saver', proPrice: '£0.79' },
  };

  const activeEx = currencyExamples[selectedCurrency];

  const quickPrompts = [
    'What bills or subscriptions are due in the next 14 days?',
    'Am I eligible to start investing in mutual funds or SIP?',
    'How much can I save by harvesting tax losses on my stocks?',
    'Is my health and term life insurance coverage adequate?',
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="w-full border-b border-white/10 bg-navy-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/20">
            <span className="font-extrabold text-white text-lg tracking-wider">K</span>
          </div>
          <span className="font-bold text-white text-xl tracking-wider">KANJOO</span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
            Institutional FinTech
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Assistant Quick Pill */}
          <button
            onClick={() => setAiModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/20 text-xs font-bold transition-all"
          >
            <Bot className="w-4 h-4 text-brand-cyan animate-pulse" />
            <span>AI Assistant</span>
          </button>

          {/* Pro Pill */}
          <Link
            href="/pro"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-brand-cyan/20 border border-amber-500/40 text-amber-300 hover:border-amber-400 text-xs font-bold transition-all shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>PRO ($1)</span>
          </Link>

          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-xs font-bold text-navy-950 bg-gradient-to-r from-brand-cyan to-indigo-300 hover:opacity-95 rounded-xl transition-all shadow-md shadow-brand-cyan/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-6">
          <Globe className="w-3.5 h-3.5" />
          <span>True Global Currency & Institutional Multi-Ecosystem Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Intelligent Wealth Protection.{' '}
          <span className="bg-gradient-to-r from-brand-cyan via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            Built for Smart People & Founders.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Traditional trackers only record where money went. KANJOO proactively protects your surplus: eliminates money leaks, verifies insurance adequacy, enforces investment eligibility, and connects founders to top VCs and legal tools.
        </p>

        {/* Action Buttons with AI Assistant Highlight */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-sm hover:opacity-95 shadow-xl shadow-brand-cyan/25 flex items-center justify-center gap-2"
          >
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setAiModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700/80 border border-brand-cyan/40 text-brand-cyan font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Bot className="w-4 h-4 text-brand-cyan" />
            Ask KANJOO AI Assistant
          </button>

          <Link
            href="/pro"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-brand-cyan/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Explore KANJOO PRO ($1)
          </Link>
        </div>

        {/* Global Multi-Currency Showcase */}
        <div className="mt-16 w-full max-w-4xl p-6 sm:p-8 rounded-2xl glass-panel text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-brand-cyan">Foundational Architecture</p>
              <h2 className="text-lg font-bold text-white mt-0.5">Global ISO 4217 Currency & Financial System</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-navy-950/80 p-1 rounded-xl border border-white/10">
              {(['USD', 'INR', 'EUR', 'GBP', 'JPY'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCurrency === curr
                      ? 'bg-brand-cyan text-navy-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">Monthly Verified Income</span>
              <p className="text-xl font-bold text-white mt-1 font-mono">{activeEx.income}</p>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">Exact Decimal Precision</span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">Monthly Outflow</span>
              <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{activeEx.expenses}</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Primary Standard</span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">Recoverable Leaks</span>
              <p className="text-xl font-bold text-brand-cyan mt-1 font-mono">{activeEx.leakSaved}</p>
              <span className="text-[10px] text-cyan-300/80 mt-0.5 block">Auto-detected Savings</span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">PRO Subscription</span>
              <p className="text-xl font-bold text-amber-400 mt-1 font-mono">{activeEx.proPrice}/mo</p>
              <span className="text-[10px] text-amber-300/80 mt-0.5 block">PayPal Express Global</span>
            </div>
          </div>
        </div>

        {/* KANJOO PRO SHOWCASE SECTION */}
        <div className="mt-20 w-full max-w-6xl text-left">
          <div className="p-8 rounded-3xl glass-panel border border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-brand-cyan/10 to-transparent blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-white/10 gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>PREMIUM BUSINESS SUITE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  KANJOO PRO — The $1/Month Institutional Tier
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                  Tailored specifically for founders, retail investors, and ambitious professionals. Priced at exactly <strong>$1.00 USD</strong> (or local currency equivalent) paid via PayPal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  href="/pro"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-brand-cyan text-navy-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
                >
                  Explore PRO Benefits
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-3 rounded-xl bg-navy-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Demo Account (pro@kanjoo.ai)
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="p-5 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Stock Tax-Loss Harvesting</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track stock holdings and automatically compute harvestable capital losses to offset short-term capital gains tax before year-end.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Startup Investor Directory</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Curated database of premier venture capital funds (Peak XV, Y Combinator, Sequoia, Blume) with investment stages, pitch emails & LinkedIn URLs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/20 text-[#38BDF8] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Founders & Business Network</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect directly on LinkedIn with proven founders (Kunal Shah, Nithin Kamath, Brian Chesky) for venture growth synergies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Legal & Compliance Suite</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Execute contracts instantly: YC-standard SAFE notes, Mutual NDAs, Independent Contractor agreements, and Advisor share agreements.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Tax Filing Optimizer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dynamic side-by-side comparison of Old vs New Tax Regimes with 80C, 80D insurance deductions and concrete filing advice.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">AI Pro Cashflow Assistant</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Proactively predicts 30-day cash outflow across SIM recharges, SaaS subscriptions, insurance premiums, and SIP mandates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core System Highlights Grid */}
        <div className="mt-20 w-full max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-wider font-semibold text-brand-cyan">Autonomous Financial Intelligence</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Built to Protect and Multiply Your Net Worth</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Money Leak Detector</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automatically scans for inactive subscriptions, overpriced secondary recharge tariffs, student discounts you qualify for, and sneaky auto-debits.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Before You Spend & Investment Readiness</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Test planned purchases against emergency cushions and evaluate your investment eligibility before committing funds into risky assets.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Insurance Adequacy Analyzer</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Evaluates health and 12x term life insurance coverage, computes 80D tax deductions, and flags critical protection deficits.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive AI Assistant Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl shadow-2xl space-y-4 border border-brand-cyan/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">KANJOO AI Financial Assistant</h3>
                  <p className="text-[11px] text-slate-400">Context-aware personal finance advisor</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">Try asking your AI Assistant anything about your cashflow, protection, or investments:</p>
              <div className="space-y-1.5 pt-1">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiSampleQuery(p)}
                    className="w-full text-left p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-white/5 text-slate-300 hover:text-white transition-all text-xs flex items-center justify-between group"
                  >
                    <span>"{p}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <Link
                href="/login"
                className="flex-1 py-2.5 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs text-center shadow-lg"
              >
                Sign In to Query Your Live Portfolio
              </Link>
              <Link
                href="/register"
                className="py-2.5 px-4 rounded-xl bg-navy-800 border border-white/10 text-white text-xs font-semibold"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-navy-950 py-8 px-6 text-center text-xs text-slate-500">
        <p>KANJOO Institutional Financial Platform. ISO 4217 Standard Compliant.</p>
        <p className="mt-1">"Never recommend a product simply because it is available. Recommend it only when it matches actual need."</p>
      </footer>
    </div>
  );
}
