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
} from 'lucide-react';

export default function LandingPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'EUR' | 'JPY' | 'GBP'>('USD');

  const currencyExamples = {
    USD: { symbol: '$', income: '$4,500', expenses: '$2,800', leakSaved: '$340/yr', telecomOpt: '$15/mo saver' },
    INR: { symbol: '₹', income: '₹45,000', expenses: '₹28,000', leakSaved: '₹14,200/yr', telecomOpt: '₹107 saver' },
    EUR: { symbol: '€', income: '€3,800', expenses: '€2,400', leakSaved: '€310/yr', telecomOpt: '€12/mo saver' },
    JPY: { symbol: '¥', income: '¥450,000', expenses: '¥280,000', leakSaved: '¥48,000/yr', telecomOpt: '¥990 saver' },
    GBP: { symbol: '£', income: '£3,200', expenses: '£2,100', leakSaved: '£290/yr', telecomOpt: '£10/mo saver' },
  };

  const activeEx = currencyExamples[selectedCurrency];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="w-full border-b border-white/10 bg-navy-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/20">
            <span className="font-extrabold text-white text-lg tracking-wider">K</span>
          </div>
          <span className="font-bold text-white text-xl tracking-wider">KANJOO</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 rounded-xl transition-all shadow-md shadow-brand-cyan/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-medium mb-6">
          <Globe className="w-3.5 h-3.5" />
          <span>True Global Currency & Financial Ecosystem Support</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Your Money. Your Needs.{' '}
          <span className="bg-gradient-to-r from-brand-cyan via-indigo-300 to-brand-blue bg-clip-text text-transparent">
            Your Smarter Decisions.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Traditional expense trackers only record where money went. KANJOO is an intelligent system that
          understands your real lifestyle needs, eliminates money leaks, optimizes telecom and subscriptions,
          and guides every purchase before you spend.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-semibold text-sm hover:opacity-95 shadow-lg shadow-brand-cyan/25 flex items-center justify-center gap-2"
          >
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-navy-800 border border-white/10 text-slate-200 font-semibold text-sm hover:bg-navy-700/80 transition-all flex items-center justify-center gap-2"
          >
            Explore Demo User
          </Link>
        </div>

        {/* Interactive Global Currency Demonstration */}
        <div className="mt-16 w-full max-w-4xl p-6 sm:p-8 rounded-2xl glass-panel text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-brand-cyan">Foundational Feature</p>
              <h2 className="text-lg font-bold text-white mt-0.5">Global Country & ISO 4217 Currency Engine</h2>
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
              <p className="text-xl font-bold text-white mt-1">{activeEx.income}</p>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">Exact Decimal Precision</span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">Monthly Outflow</span>
              <p className="text-xl font-bold text-slate-200 mt-1">{activeEx.expenses}</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Primary Currency Standard</span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">Recoverable Money Leaks</span>
              <p className="text-xl font-bold text-brand-cyan mt-1">{activeEx.leakSaved}</p>
              <span className="text-[10px] text-cyan-300/80 mt-0.5 block">Unused Subscriptions & Perks</span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">Telecom Optimizer</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{activeEx.telecomOpt}</p>
              <span className="text-[10px] text-emerald-300/80 mt-0.5 block">Multi-SIM Wi-Fi Aware</span>
            </div>
          </div>
        </div>

        {/* Signature Features Grid */}
        <div className="mt-20 w-full max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-wider font-semibold text-brand-cyan">Autonomous Financial Intelligence</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Built to Protect and Grow Your Net Worth</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Money Leak Detector</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automatically scans for inactive subscriptions, overpriced secondary recharge tariffs, student discounts you qualify for but don't claim, and sneaky auto-debits.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Before You Spend</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Test planned purchases against cash reserves and goals. KANJOO analyzes affordability without judgment and recommends a cooling-off period if appropriate.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-indigo-400 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Multi-SIM Telecom Optimizer</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Calculates daily, monthly, and annual equivalent costs. Distinguishes recharge validity from incoming service preservation for secondary SIMs in Wi-Fi environments.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-navy-950 py-8 px-6 text-center text-xs text-slate-500">
        <p>KANJOO Financial Intelligence System. ISO 4217 Compliant.</p>
        <p className="mt-1">"Never recommend a product simply because it is available. Recommend it only when it matches actual need."</p>
      </footer>
    </div>
  );
}
