'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Crown,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  FileText,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function ProPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'membership' | 'stocks' | 'tax' | 'investors' | 'network' | 'legal' | 'cashflow'>('membership');
  const [loading, setLoading] = useState(true);

  // Pro Pricing & Subscription
  const [pricing, setPricing] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  // Stocks
  const [stocksData, setStocksData] = useState<any>({ holdings: [], summary: {} });
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [stockForm, setStockForm] = useState({
    symbol: '',
    companyName: '',
    shares: '',
    buyPrice: '',
    currentPrice: '',
    holdingType: 'EQUITY',
  });

  // Tax Report
  const [taxReport, setTaxReport] = useState<any>(null);

  // Investors
  const [investors, setInvestors] = useState<any[]>([]);

  // Business Network
  const [network, setNetwork] = useState<any[]>([]);

  // Legal Templates
  const [legalTemplates, setLegalTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upcoming Payments
  const [upcomingCashflow, setUpcomingCashflow] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, sRes, tRes, iRes, nRes, lRes, cRes] = await Promise.all([
        fetchApi<any>('/pro/price').catch(() => null),
        fetchApi<any>('/pro/stocks').catch(() => ({ holdings: [], summary: {} })),
        fetchApi<any>('/pro/tax-report').catch(() => null),
        fetchApi<any[]>('/pro/investors').catch(() => []),
        fetchApi<any[]>('/pro/network').catch(() => []),
        fetchApi<any[]>('/pro/legal-templates').catch(() => []),
        fetchApi<any>('/pro/upcoming-payments').catch(() => null),
      ]);

      setPricing(pRes);
      setStocksData(sRes);
      setTaxReport(tRes);
      setInvestors(iRes || []);
      setNetwork(nRes || []);
      setLegalTemplates(lRes || []);
      if (lRes && lRes.length > 0) setSelectedTemplate(lRes[0]);
      setUpcomingCashflow(cRes);
    } catch (err) {
      console.error('Failed to load pro data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const fakeOrderId = 'PAYPAL-TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      await fetchApi('/pro/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          paypalOrderId: fakeOrderId,
          currency: pricing?.localCurrency || 'USD',
          amount: pricing?.localPrice || 1.00,
        }),
      });
      setSubscribeSuccess(true);
      await refreshUser();
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (err) {
      alert('Subscription activation failed');
    } finally {
      setSubscribing(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/pro/stocks', {
        method: 'POST',
        body: JSON.stringify({
          symbol: stockForm.symbol.toUpperCase(),
          companyName: stockForm.companyName,
          shares: parseFloat(stockForm.shares),
          buyPrice: parseFloat(stockForm.buyPrice),
          currentPrice: parseFloat(stockForm.currentPrice),
          holdingType: stockForm.holdingType,
        }),
      });
      setShowAddStockModal(false);
      setStockForm({ symbol: '', companyName: '', shares: '', buyPrice: '', currentPrice: '', holdingType: 'EQUITY' });
      const refreshed = await fetchApi<any>('/pro/stocks');
      setStocksData(refreshed);
    } catch (err) {
      alert('Failed to save stock');
    }
  };

  const handleDeleteStock = async (id: number) => {
    if (!confirm('Remove this holding from your portfolio?')) return;
    try {
      await fetchApi(`/pro/stocks/${id}`, { method: 'DELETE' });
      const refreshed = await fetchApi<any>('/pro/stocks');
      setStocksData(refreshed);
    } catch (err) {
      alert('Failed to remove stock');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const symbol = user?.primaryCurrencySymbol || '$';
  const isPro = Boolean(user?.proMember);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-brand-cyan/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 mb-1.5 shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>GLOBAL BUSINESS & INVESTOR SUITE</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            KANJOO PRO Hub
            {isPro ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVE MEMBER
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1$ / Month Trial
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional-grade wealth tools: Stock tax-loss harvesting, startup VC database, business leaders network, legal SAFE/NDAs & proactive AI cashflow management.
          </p>
        </div>

        {/* Pro Action Button */}
        {!isPro && (
          <button
            onClick={() => setActiveTab('membership')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-brand-cyan text-navy-950 font-bold text-xs shadow-lg hover:shadow-amber-500/25 transition-all self-start sm:self-auto"
          >
            <Crown className="w-4 h-4" />
            Upgrade to PRO ({pricing?.formatted || '$1.00'}/mo)
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-white/5 scrollbar-none text-xs">
        {[
          { id: 'membership', label: 'Pro Membership', icon: Crown },
          { id: 'stocks', label: 'Stocks & Tax Reduction', icon: TrendingUp },
          { id: 'tax', label: 'Tax Filing Report', icon: FileText },
          { id: 'investors', label: 'Startup Investors (VCs)', icon: Briefcase },
          { id: 'network', label: 'Business Network (LinkedIn)', icon: Users },
          { id: 'legal', label: 'Legal & Contracts', icon: ShieldCheck },
          { id: 'cashflow', label: 'AI Cashflow Due Dates', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all font-medium ${
                active
                  ? 'bg-brand-cyan text-navy-950 font-bold shadow-md shadow-brand-cyan/20'
                  : 'bg-navy-900/60 text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MEMBERSHIP & PAYPAL SUBSCRIPTION */}
      {activeTab === 'membership' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription Box */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-panel relative overflow-hidden border border-amber-500/20">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">KANJOO PRO Subscription</h2>
                    <p className="text-xs text-slate-400">Institutional Power for Founders & Investors</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-brand-cyan font-mono">
                    {pricing?.formatted || '$1.00'}
                  </span>
                  <span className="text-xs text-slate-400 block">/ month</span>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-300">
                  Globally standardized pricing: Exactly <strong>$1.00 USD</strong> or your local domestic equivalent (<strong>{pricing?.formatted || '$1.00'}</strong>) dynamically converted via central bank foreign exchange rates.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  {[
                    'Portfolio Stock Tracking & Tax-Loss Harvesting Engine',
                    'Verified Startup Investors & VCs Directory with Pitch Templates',
                    'Business Founders & High-Net-Worth Network (Direct LinkedIn Links)',
                    'Official Ready-to-Execute Legal Contracts (SAFE, NDA, Advisory)',
                    'Smart Tax Filing Comparison (Old vs New Regime Optimization)',
                    'AI Cashflow Pro Assistant: Automatic 30-Day Due Date Forecaster',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PayPal Payment & QR Code Section */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <div className="p-5 rounded-2xl bg-navy-900/90 border border-brand-cyan/20 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                    <div className="relative p-2.5 rounded-2xl bg-white shadow-2xl flex-shrink-0">
                      <img
                        src="/paypal-qr.jpg"
                        alt="Official PayPal QR Code"
                        className="w-36 h-36 rounded-xl object-contain"
                      />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0070BA] text-white text-[9px] font-extrabold tracking-wider shadow">
                        PAYPAL QR
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-brand-cyan text-xs font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Direct Scan & Pay with PayPal</span>
                      </div>
                      <h4 className="text-base font-bold text-white">KANJOO Official PayPal Merchant</h4>
                      <p className="text-xs text-slate-300 mt-1 max-w-sm">
                        Scan this official PayPal QR code with your mobile camera or PayPal app to transfer <strong>$1.00 USD</strong> (or your local equivalent <strong>{pricing?.formatted || '$1.00'}</strong>).
                      </p>
                      <span className="inline-block mt-2 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Instant Auto-Activation Enabled
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-2 w-full md:w-auto">
                    {isPro ? (
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> PRO Subscription Active
                      </div>
                    ) : (
                      <button
                        disabled={subscribing}
                        onClick={handleSubscribe}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-brand-cyan text-navy-950 font-extrabold text-xs shadow-lg hover:shadow-brand-cyan/25 transition-all"
                      >
                        <Crown className="w-4 h-4" />
                        {subscribing ? 'Activating Membership...' : `I've Scanned & Paid — Activate PRO`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                    <span>Account Recipient: <strong>KANJOO Billing (billing@kanjoo.ai)</strong></span>
                  </div>
                  {!isPro && (
                    <button
                      disabled={subscribing}
                      onClick={handleSubscribe}
                      className="text-xs text-brand-cyan hover:underline font-semibold"
                    >
                      Or 1-Click Instant Express Activation →
                    </button>
                  )}
                </div>
              </div>

              {subscribeSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Congratulations! Your KANJOO PRO membership has been activated successfully.</span>
                </div>
              )}
            </div>

            {/* Pro Credential Box */}
            <div className="p-6 rounded-2xl glass-panel space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Your Account Status
              </h3>
              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Account Tier:</span>
                  <p className="font-bold text-white text-sm mt-0.5">
                    {isPro ? 'KANJOO PRO VIP' : 'Free Standard Account'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Member ID:</span>
                  <p className="font-mono text-slate-300 text-xs mt-0.5">{user?.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Primary Currency:</span>
                  <p className="font-bold text-brand-cyan text-xs mt-0.5">
                    {pricing?.localCurrency} ({symbol})
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-[11px] text-brand-cyan">
                <strong>Need testing credentials?</strong><br />
                Login anytime with pre-seeded Pro account: <code className="text-white">pro@kanjoo.ai</code> (Password: <code className="text-white">Password@123</code>).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOCKS & TAX REDUCTION */}
      {activeTab === 'stocks' && (
        <div className="mt-6 space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-[11px] text-slate-400">Total Invested</span>
              <p className="text-lg font-bold text-white font-mono mt-1">
                {symbol} {Number(stocksData?.summary?.totalInvested || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-[11px] text-slate-400">Current Value</span>
              <p className="text-lg font-bold text-brand-cyan font-mono mt-1">
                {symbol} {Number(stocksData?.summary?.currentValue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl glass-panel">
              <span className="text-[11px] text-slate-400">Unrealized P&L</span>
              <p className={`text-lg font-bold font-mono mt-1 ${Number(stocksData?.summary?.unrealizedPnL || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {Number(stocksData?.summary?.unrealizedPnL || 0) >= 0 ? '+' : ''}
                {symbol} {Number(stocksData?.summary?.unrealizedPnL || 0).toLocaleString()} ({Number(stocksData?.summary?.unrealizedPnLPercent || 0).toFixed(2)}%)
              </p>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Tax Savings Potential
              </span>
              <p className="text-lg font-bold text-emerald-300 font-mono mt-1">
                {symbol} {Number(stocksData?.summary?.taxLossHarvestable || 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400">Harvestable unrealized losses</span>
            </div>
          </div>

          {/* Tax-Loss Harvesting Strategy Box */}
          <div className="p-4 rounded-xl bg-navy-900 border border-brand-cyan/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                AI Tax-Loss Harvesting Recommendation
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {Number(stocksData?.summary?.taxLossHarvestable || 0) > 0
                  ? `You have ${symbol} ${Number(stocksData?.summary?.taxLossHarvestable || 0).toLocaleString()} in capital losses that can offset short-term capital gains tax (STCG) before financial year close.`
                  : 'All your stock positions are currently in profit or neutral. No tax-loss harvest needed at this time.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddStockModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs whitespace-nowrap shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stock Holding
            </button>
          </div>

          {/* Holdings Table */}
          <div className="p-6 rounded-2xl glass-panel">
            <h3 className="text-sm font-bold text-white mb-4">Stock Holdings & Real-Time Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-left">
                    <th className="pb-3 font-semibold">Ticker / Symbol</th>
                    <th className="pb-3 font-semibold">Company</th>
                    <th className="pb-3 font-semibold text-right">Shares</th>
                    <th className="pb-3 font-semibold text-right">Avg Buy Price</th>
                    <th className="pb-3 font-semibold text-right">Current Price</th>
                    <th className="pb-3 font-semibold text-right">P&L</th>
                    <th className="pb-3 font-semibold text-center">Tax Action</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(stocksData?.holdings || []).map((s: any) => {
                    const pnl = Number(s.unrealizedPnL || 0);
                    const isLoss = pnl < 0;
                    return (
                      <tr key={s.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-bold text-brand-cyan font-mono">{s.symbol}</td>
                        <td className="py-3 text-slate-300">{s.companyName}</td>
                        <td className="py-3 text-right font-mono text-white">{s.shares}</td>
                        <td className="py-3 text-right font-mono text-slate-400">{symbol}{Number(s.buyPrice).toFixed(2)}</td>
                        <td className="py-3 text-right font-mono text-white">{symbol}{Number(s.currentPrice).toFixed(2)}</td>
                        <td className={`py-3 text-right font-mono font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pnl >= 0 ? '+' : ''}{symbol}{pnl.toFixed(2)}
                        </td>
                        <td className="py-3 text-center">
                          {isLoss ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Harvest Loss
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                              Holding Gain
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteStock(s.id)}
                            className="text-slate-400 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {(!stocksData?.holdings || stocksData.holdings.length === 0) && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No stock holdings recorded yet. Click "Add Stock Holding" above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TAX FILING REPORT */}
      {activeTab === 'tax' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Old vs New Regime Box */}
            <div className="p-6 rounded-2xl glass-panel space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-cyan" />
                Income Tax Filing Optimization
              </h2>
              <p className="text-xs text-slate-400">
                Detailed assessment between Old Tax Regime and New Concessional Regime based on your profile deductions.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className={`p-4 rounded-xl border ${taxReport?.recommendedRegime === 'OLD' ? 'border-brand-cyan bg-brand-cyan/10' : 'border-white/10 bg-navy-900'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Old Regime</span>
                    {taxReport?.recommendedRegime === 'OLD' && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-cyan text-navy-950 text-[10px] font-extrabold">RECOMMENDED</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Estimated Tax Payable:</span>
                  <p className="text-lg font-bold text-white font-mono mt-1">
                    {symbol} {Number(taxReport?.oldRegimeTax || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Deductions claimed: 80C, 80D Insurance, Standard Deduction</p>
                </div>

                <div className={`p-4 rounded-xl border ${taxReport?.recommendedRegime === 'NEW' ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 bg-navy-900'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">New Regime</span>
                    {taxReport?.recommendedRegime === 'NEW' && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-navy-950 text-[10px] font-extrabold">RECOMMENDED</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Estimated Tax Payable:</span>
                  <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
                    {symbol} {Number(taxReport?.newRegimeTax || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Standard ₹75k exemption + lowered progressive slabs</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <strong>Recommendation:</strong> Switch to the <strong>{taxReport?.recommendedRegime || 'NEW'} Regime</strong> to save approximately <strong>{symbol} {Number(taxReport?.savingsAmount || 0).toLocaleString()}</strong> in net annual tax liability.
              </div>
            </div>

            {/* Deductions Breakdown */}
            <div className="p-6 rounded-2xl glass-panel space-y-4">
              <h3 className="text-sm font-bold text-white">Eligible Deductions Breakdown</h3>
              <div className="space-y-3 text-xs">
                {(taxReport?.deductions || []).map((d: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{d.section}</span>
                      <p className="text-[11px] text-slate-400">{d.description}</p>
                    </div>
                    <span className="font-mono font-bold text-brand-cyan">
                      {symbol} {Number(d.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STARTUP INVESTORS (VCs & ANGELS) */}
      {activeTab === 'investors' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Venture Capital & Angel Investor Directory</h2>
              <p className="text-xs text-slate-400">Curated contacts for startup fundraising with direct LinkedIn URLs and pitch emails</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investors.map((inv: any) => (
              <div key={inv.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 hover:border-brand-cyan/40 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{inv.name}</h3>
                    <p className="text-xs text-brand-cyan font-medium">{inv.fundName}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-white/10">
                    {inv.stage}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-400">
                  <p><strong>Sectors:</strong> {inv.sectors}</p>
                  <p><strong>Ticket Size:</strong> <span className="text-white font-mono">{inv.ticketSize}</span></p>
                  <p><strong>Location:</strong> {inv.countryCode} ({inv.location})</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={inv.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-brand-cyan hover:underline font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> LinkedIn Profile
                  </a>

                  <a
                    href={`mailto:${inv.pitchEmail}?subject=Pitch%20Deck%20-%20KANJOO%20PRO%20Startup`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-white/10 text-white text-xs font-semibold"
                  >
                    Send Pitch
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BUSINESS & FOUNDERS NETWORK */}
      {activeTab === 'network' && (
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white">Global Founders & Executive Directory</h2>
            <p className="text-xs text-slate-400">Direct networking channels to scale your venture and cross-pollinate business synergy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {network.map((b: any) => (
              <div key={b.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 hover:border-brand-cyan/40 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{b.fullName}</h3>
                    <p className="text-xs text-amber-300">{b.title}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {b.industry}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-400">
                  <p><strong>Company:</strong> <span className="text-white">{b.company}</span></p>
                  <p><strong>Valuation:</strong> <span className="font-mono text-brand-cyan">{b.valuation}</span></p>
                  <p className="text-[11px] text-slate-300 italic">"{b.synergyBio}"</p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <a
                    href={b.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Connect on LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LEGAL & COMPLIANCE CONTRACTS */}
      {activeTab === 'legal' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Legal Contract</h3>
            {legalTemplates.map((t: any) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedTemplate?.id === t.id
                    ? 'border-brand-cyan bg-brand-cyan/10'
                    : 'border-white/10 bg-navy-900/60 hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.title}</span>
                  <FileText className="w-3.5 h-3.5 text-brand-cyan" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{t.category}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
            {selectedTemplate ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h2 className="text-sm font-bold text-white">{selectedTemplate.title}</h2>
                    <p className="text-xs text-slate-400">{selectedTemplate.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedTemplate.id, selectedTemplate.contractContent)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-white/10 text-brand-cyan text-xs font-bold"
                  >
                    {copiedId === selectedTemplate.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Contract
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-navy-950 border border-white/5 font-mono text-[11px] text-slate-300 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {selectedTemplate.contractContent}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">Select a template to view contract text</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: AI CASHFLOW & UPCOMING PAYMENTS */}
      {activeTab === 'cashflow' && (
        <div className="mt-6 space-y-6">
          <div className="p-4 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-cyan" />
              <div>
                <h3 className="text-xs font-bold text-white">Upcoming 30-Day Cash Commitments</h3>
                <p className="text-[11px] text-slate-400">Total required cash reserve to fulfill all bills & investments</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-brand-cyan font-mono">
                {symbol} {Number(upcomingCashflow?.totalDueNext30Days || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel">
            <h3 className="text-sm font-bold text-white mb-4">Cashflow Obligations Timeline</h3>
            <div className="space-y-3">
              {(upcomingCashflow?.schedule || []).map((bill: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-800 text-slate-300 border border-white/10">
                      {bill.itemType}
                    </span>
                    <div>
                      <span className="font-bold text-white">{bill.title}</span>
                      <p className="text-[11px] text-slate-400">Due: {bill.dueDate}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">
                    {symbol} {Number(bill.amount).toLocaleString()}
                  </span>
                </div>
              ))}
              {(!upcomingCashflow?.schedule || upcomingCashflow.schedule.length === 0) && (
                <p className="text-center py-6 text-slate-500 text-xs">No upcoming dues scheduled for the next 30 days.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Add Stock Holding</h3>
            <form onSubmit={handleAddStock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Ticker / Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RELIANCE, TCS, AAPL, NVDA"
                  value={stockForm.symbol}
                  onChange={(e) => setStockForm({ ...stockForm, symbol: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Industries Ltd"
                  value={stockForm.companyName}
                  onChange={(e) => setStockForm({ ...stockForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="10"
                    value={stockForm.shares}
                    onChange={(e) => setStockForm({ ...stockForm, shares: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Buy Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2500"
                    value={stockForm.buyPrice}
                    onChange={(e) => setStockForm({ ...stockForm, buyPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Current Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2450"
                    value={stockForm.currentPrice}
                    onChange={(e) => setStockForm({ ...stockForm, currentPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-cyan text-navy-950 font-bold"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
