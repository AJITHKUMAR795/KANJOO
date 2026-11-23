'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  ScanLine,
  Scale,
  Users,
  Wallet,
  Rocket,
  Briefcase,
  Search,
  GraduationCap,
  Bot,
  Crown,
  DollarSign,
  CheckCircle2,
  Globe,
  Sliders,
  Zap,
} from 'lucide-react';

export default function ServicesPage() {
  const { user } = useAuth();
  const [servicesData, setServicesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [monthlyIncomeInput, setMonthlyIncomeInput] = useState<number>(48000);

  useEffect(() => {
    fetchApi<any>('/services')
      .then(setServicesData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sym = user?.primaryCurrencySymbol || '₹';
  const isUSD = user?.primaryCurrencyCode === 'USD';

  // Dynamic savings estimation based on slider
  const income = monthlyIncomeInput;
  const leakSavings = Math.round(income * 0.035 * 12);
  const telecomSavings = isUSD ? 180 : 2500;
  const debtInterestSavings = Math.round(income * 0.08 * 12);
  const taxHarvesting = Math.round(Math.min(income * 0.05 * 12, isUSD ? 3000 : 45000));
  const totalAnnualValue = leakSavings + telecomSavings + debtInterestSavings + taxHarvesting;

  const categories = ['ALL', 'AI Intelligence', 'Wealth Strategy', 'Automation', 'KANJOO PRO', 'Financial Planning'];

  const services = servicesData?.services || [];
  const filteredServices = selectedCategory === 'ALL'
    ? services
    : services.filter((s: any) => s.category === selectedCategory);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* World-Class Hero Banner */}
        <div className="relative overflow-hidden p-8 rounded-3xl glass-panel border border-brand-cyan/20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Institutional FinTech Services Catalog</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              World-Class Financial Intelligence Services
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Every tool and intelligence capability in KANJOO is engineered to deliver measurable, automated financial growth for individuals, families, and startup founders globally.
            </p>

            {/* Value Guarantees */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Zero Banking Passwords Stored
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-4 h-4 text-brand-cyan" /> ISO 4217 Decimal Precision
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" /> Deterministic Math + Grounded AI
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Value & ROI Calculator */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-navy-900/60">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-cyan" />
                  <span>Your Monthly Income</span>
                </label>
                <span className="text-lg font-extrabold text-brand-cyan font-mono">
                  {sym}{monthlyIncomeInput.toLocaleString()} / month
                </span>
              </div>

              <input
                type="range"
                min={isUSD ? 500 : 15000}
                max={isUSD ? 20000 : 300000}
                step={isUSD ? 250 : 2500}
                value={monthlyIncomeInput}
                onChange={(e) => setMonthlyIncomeInput(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-navy-950 accent-brand-cyan cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{sym}{isUSD ? '500' : '15,000'}/mo</span>
                <span>{sym}{isUSD ? '10,000' : '1,50,000'}/mo</span>
                <span>{sym}{isUSD ? '20,000' : '3,00,000'}/mo</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/80 border border-brand-cyan/20 text-center sm:text-right min-w-[260px]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Net Value Delivered</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                +{sym}{totalAnnualValue.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> / year</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Leaks: {sym}{leakSavings.toLocaleString()} • Debt: {sym}{debtInterestSavings.toLocaleString()} • Tax: {sym}{taxHarvesting.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                selectedCategory === cat
                  ? 'bg-brand-cyan text-navy-950 shadow-md shadow-brand-cyan/20'
                  : 'bg-navy-900 border border-white/5 text-slate-400 hover:text-white hover:bg-navy-850'
              }`}
            >
              {cat === 'ALL' ? 'All Services (12)' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((svc: any) => (
            <div
              key={svc.id}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-brand-cyan/30 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${svc.badgeColor}`}>
                    {svc.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{svc.category}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {svc.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {svc.description}
                </p>

                {/* Highlights */}
                <div className="mt-4 space-y-1.5 pt-3 border-t border-white/5">
                  {(svc.highlights || []).map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">User Benefit</span>
                  <span className="text-xs font-bold text-emerald-400">{svc.estimatedSavings}</span>
                </div>

                <Link
                  href={svc.actionUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs hover:opacity-95 shadow-md shadow-brand-cyan/20 transition-all"
                >
                  <span>{svc.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global Pro Membership Showcase Banner */}
        <div className="p-6 rounded-2xl glass-panel border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-navy-900 to-brand-cyan/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Unlock All Advanced Services with KANJOO PRO</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Startup Runway, ESOP Cap Table, Tax-Loss Harvesting, Direct VC Intros & Legal Contracts for just <strong>$1.00 USD/month</strong> (or local domestic equivalent).
              </p>
            </div>
          </div>

          <Link
            href="/pro"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all"
          >
            Upgrade to PRO ($1/mo) →
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
