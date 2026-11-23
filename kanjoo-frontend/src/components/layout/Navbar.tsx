'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Bell,
  Globe,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  LogOut,
  ShieldCheck,
  Sparkles,
  Crown,
  Bot,
} from 'lucide-react';

const GLOBAL_CURRENCIES = [
  { code: 'INR', name: 'India', symbol: '₹', countryCode: 'IN' },
  { code: 'USD', name: 'United States', symbol: '$', countryCode: 'US' },
  { code: 'EUR', name: 'Eurozone', symbol: '€', countryCode: 'EU' },
  { code: 'GBP', name: 'United Kingdom', symbol: '£', countryCode: 'GB' },
  { code: 'AED', name: 'UAE', symbol: 'د.إ', countryCode: 'AE' },
  { code: 'CAD', name: 'Canada', symbol: 'C$', countryCode: 'CA' },
  { code: 'AUD', name: 'Australia', symbol: 'A$', countryCode: 'AU' },
  { code: 'SGD', name: 'Singapore', symbol: 'S$', countryCode: 'SG' },
  { code: 'JPY', name: 'Japan', symbol: '¥', countryCode: 'JP' },
  { code: 'KWD', name: 'Kuwait', symbol: 'KD', countryCode: 'KW' },
];

export default function Navbar() {
  const { user, logout, updateUserContext } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApi<any[]>('/notifications')
        .then(setNotifications)
        .catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    for (const n of notifications.filter(n => !n.read)) {
      await fetchApi(`/notifications/${n.id}/read`, { method: 'PATCH' }).catch(() => {});
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectCurrency = (curr: typeof GLOBAL_CURRENCIES[0]) => {
    updateUserContext({
      countryCode: curr.countryCode,
      primaryCurrencyCode: curr.code,
      primaryCurrencySymbol: curr.symbol,
    });
    setShowCurrencyMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/10 bg-navy-900/90 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/20">
            <span className="font-extrabold text-white text-lg tracking-wider">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-lg flex items-center gap-1.5">
              KANJOO
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                GLOBAL AI
              </span>
            </span>
          </div>
        </Link>

        {/* Services Provided Quick Link */}
        <Link
          href="/services"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Services Provided</span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick KANJOO PRO Button */}
        <Link
          href="/pro"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-brand-cyan/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:border-amber-400 transition-all"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>PRO ($1)</span>
        </Link>

        {/* Global Currency & Country Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-800/90 border border-white/10 hover:border-brand-cyan/40 text-xs text-slate-200 transition-all"
            title="Click to switch primary currency"
          >
            <Globe className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="font-bold text-emerald-400 font-mono">
              {user?.primaryCurrencyCode || 'INR'} ({user?.primaryCurrencySymbol || '₹'})
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showCurrencyMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-navy-900 border border-white/10 shadow-2xl p-2 z-50 divide-y divide-white/5">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Global Currency
              </div>
              <div className="max-h-64 overflow-y-auto pt-1 space-y-0.5 scrollbar-thin">
                {GLOBAL_CURRENCIES.map((curr) => {
                  const isSelected = (user?.primaryCurrencyCode || 'INR') === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => handleSelectCurrency(curr)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors ${
                        isSelected
                          ? 'bg-brand-cyan/20 text-brand-cyan font-bold'
                          : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span>{curr.name}</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {curr.code} ({curr.symbol})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-navy-800 border border-white/10 text-slate-300 hover:text-white relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-navy-850 border border-white/10 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-semibold text-sm text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-cyan hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-lg text-xs ${n.read ? 'bg-navy-800/40 text-slate-400' : 'bg-navy-800 text-slate-200 border border-brand-cyan/20'}`}>
                      <p className="font-semibold text-white mb-0.5">{n.title}</p>
                      <p className="text-[11px] text-slate-300">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-navy-800 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center font-bold text-xs text-white">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">{user.fullName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-navy-900 border border-white/10 shadow-2xl py-2 z-50 divide-y divide-white/5">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/services"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs text-slate-300 hover:bg-navy-800 hover:text-white"
                  >
                    Services Provided (12)
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs text-slate-300 hover:bg-navy-800 hover:text-white"
                  >
                    Settings & Security
                  </Link>
                </div>
                <div className="pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-navy-800 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
