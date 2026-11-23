'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Bot, Sparkles } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col relative">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Floating World-Class Action Bar (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <Link
          href="/services"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full glass-panel border border-brand-cyan/30 text-brand-cyan hover:bg-navy-800 text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105"
          title="Browse all 12 institutional services"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Services (12)</span>
        </Link>

        <Link
          href="/ai-assistant"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-navy-950 font-bold text-xs shadow-xl shadow-brand-cyan/25 hover:opacity-95 transition-all hover:scale-105"
          title="Instant Financial Intelligence AI Assistant"
        >
          <Bot className="w-4 h-4 text-navy-950" />
          <span>KANJOO AI Copilot</span>
        </Link>
      </div>
    </div>
  );
}
