'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Award,
  Wallet,
  Receipt,
  FileSpreadsheet,
  ScanLine,
  PieChart,
  Bot,
  TrendingDown,
  AlertTriangle,
  Search,
  TrendingUp,
  Scale,
  ShieldAlert,
  Target,
  Sparkles,
  Compass,
  GraduationCap,
  Smartphone,
  Users,
  Crown,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
    highlightPro?: boolean;
    highlight?: boolean;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Intelligence Score', href: '/intelligence-score', icon: Award, badge: '84/100', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      { name: 'Personal Net Worth', href: '/net-worth', icon: Wallet },
    ],
  },
  {
    title: 'Money Management',
    items: [
      { name: 'My Expenses', href: '/expenses', icon: Receipt },
      { name: 'Bank Statements', href: '/statements', icon: FileSpreadsheet, badge: 'CSV/PDF' },
      { name: 'Receipt Scanner', href: '/receipt-scanner', icon: ScanLine, badge: 'AI OCR' },
      { name: 'Budget Planner', href: '/budgets', icon: PieChart },
    ],
  },
  {
    title: 'AI Intelligence',
    items: [
      { name: 'KANJOO AI Assistant', href: '/ai-assistant', icon: Bot, highlight: true },
      { name: 'Cash Flow Forecast', href: '/cashflow-forecast', icon: TrendingDown, badge: 'Predictive' },
      { name: 'Anomaly Detection', href: '/anomalies', icon: AlertTriangle, badge: 'Surveillance' },
      { name: 'Money Leak Detector', href: '/money-leak', icon: Search, badge: 'Signature' },
    ],
  },
  {
    title: 'Wealth & Investments',
    items: [
      { name: 'Investments & SIP', href: '/investments', icon: TrendingUp },
      { name: 'Debt Optimizer', href: '/debts', icon: Scale, badge: 'Snowball' },
      { name: 'Emergency Cushion', href: '/emergency-fund', icon: ShieldCheck, badge: 'Resilience' },
    ],
  },
  {
    title: 'Financial Planning',
    items: [
      { name: 'Financial Goals', href: '/goals', icon: Target, badge: 'Accelerator' },
      { name: 'Before You Spend', href: '/before-you-spend', icon: ShieldAlert, badge: 'Signature' },
      { name: 'My KANJOO Plan', href: '/kanjoo-plan', icon: Compass },
      { name: 'Scholarships & Grants', href: '/scholarships', icon: GraduationCap, badge: 'Govt Portal' },
      { name: 'Recharge Optimizer', href: '/recharge-optimizer', icon: Smartphone, badge: 'Smart' },
    ],
  },
  {
    title: 'Family Finance',
    items: [
      { name: 'Family Mode', href: '/family', icon: Users, badge: 'Private' },
    ],
  },
  {
    title: 'KANJOO PRO',
    items: [
      { name: 'Founder & PRO Hub', href: '/pro', icon: Crown, highlightPro: true, badge: 'PRO' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { name: 'Settings & Security', href: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-navy-900/95 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-3 flex-1 overflow-y-auto space-y-5 scrollbar-thin">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-cyan/20 to-brand-blue/10 text-brand-cyan border border-brand-cyan/30 shadow-sm'
                      : item.highlightPro
                      ? 'bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-brand-blue/15 text-amber-300 border border-amber-500/30 hover:border-amber-400/50'
                      : item.highlight
                      ? 'bg-brand-indigo/15 text-indigo-300 border border-brand-indigo/25 hover:bg-brand-indigo/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? 'text-brand-cyan'
                          : item.highlightPro
                          ? 'text-amber-400'
                          : item.highlight
                          ? 'text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider flex-shrink-0 ${
                        item.badgeColor
                          ? item.badgeColor
                          : item.badge === 'PRO'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold shadow-sm shadow-amber-500/20'
                          : item.badge === 'Signature'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/10 bg-navy-950/70">
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">Global Intelligence Active</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">ISO 4217 Decimal Precision Engine</p>
      </div>
    </aside>
  );
}
