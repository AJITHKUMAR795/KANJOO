'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { Bell, Globe, ChevronDown, CheckCircle, AlertTriangle, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/10 bg-navy-900/80 backdrop-blur-md px-6 flex items-center justify-between">
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
      </div>

      <div className="flex items-center gap-3">
        {/* Country & Currency Indicator */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800/80 border border-white/10 text-xs">
            <Globe className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="font-medium text-slate-300">{user.countryCode}</span>
            <span className="text-slate-500">|</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {user.primaryCurrencyCode} ({user.primaryCurrencySymbol})
            </span>
          </div>
        )}

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
              className="flex items-center gap-2.5 p-1.5 rounded-lg bg-navy-800 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center font-bold text-xs text-white">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">{user.fullName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-navy-850 border border-white/10 shadow-2xl py-1.5 z-50">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs text-slate-300 hover:bg-navy-800 hover:text-white"
                >
                  Settings & Currency
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-navy-800 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
