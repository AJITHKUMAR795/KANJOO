'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Smartphone,
  Sparkles,
  GraduationCap,
  TrendingUp,
  PieChart,
  Bot,
  ShieldAlert,
  Search,
  Compass,
  BarChart3,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Expenses', href: '/expenses', icon: Receipt },
  { name: 'Recharge Optimizer', href: '/recharge-optimizer', icon: Smartphone, badge: 'Smart' },
  { name: 'Offers & Subscriptions', href: '/subscriptions', icon: Sparkles },
  { name: 'Scholarships', href: '/scholarships', icon: GraduationCap },
  { name: 'Investments & SIP', href: '/investments', icon: TrendingUp },
  { name: 'Budget Planner', href: '/budgets', icon: PieChart },
  { name: 'KANJOO AI Assistant', href: '/ai-assistant', icon: Bot, highlight: true },
  { name: 'Before You Spend', href: '/before-you-spend', icon: ShieldAlert, badge: 'Signature' },
  { name: 'Money Leak Detector', href: '/money-leak', icon: Search, badge: 'Signature' },
  { name: 'My KANJOO Plan', href: '/kanjoo-plan', icon: Compass },
  { name: 'Financial Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-navy-900/90 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Financial Intelligence
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-cyan/20 to-brand-blue/10 text-brand-cyan border border-brand-cyan/30 shadow-sm'
                  : item.highlight
                  ? 'bg-brand-indigo/15 text-indigo-300 border border-brand-indigo/25 hover:bg-brand-indigo/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  item.badge === 'Signature'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 bg-navy-950/60">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Global Intelligence Active</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">ISO 4217 Decimal Precision Engine</p>
      </div>
    </aside>
  );
}
