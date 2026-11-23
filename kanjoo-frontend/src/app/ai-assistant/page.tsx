'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

export default function AiAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How much did I spend this month?',
    'Can I reduce my mobile recharge expenses?',
    'Which subscriptions are unnecessary?',
    'Can I afford a new laptop?',
    'How much can I save in one year?',
    'Should I maintain both SIM cards?',
  ];

  const loadHistory = async () => {
    try {
      const history = await fetchApi<any[]>('/ai/history');
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Welcome message
        setMessages([
          {
            messageRole: 'ASSISTANT',
            content: `Hello ${user?.fullName || 'there'}! I am your KANJOO Personal Finance Intelligence Assistant.\n\nI have authorized access to your verified expenses, budgets, telecom configurations, and active subscriptions in **${user?.countryCode || 'your country'}**.\n\nHow can I help you optimize your money today?`,
          },
        ]);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage = { messageRole: 'USER', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetchApi<any>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });

      setMessages((prev) => [
        ...prev,
        {
          messageRole: 'ASSISTANT',
          content: res.reply,
          suggestedAction: res.suggestedAction,
          actionUrl: res.actionUrl,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          messageRole: 'ASSISTANT',
          content: 'I encountered a temporary connection issue. Please verify your query or try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-navy-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white shadow-md shadow-brand-cyan/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                KANJOO Financial Assistant
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Grounding Verified
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Context-aware advice using deterministic backend data</p>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.messageRole === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {m.messageRole === 'ASSISTANT' && (
                <div className="w-7 h-7 rounded-lg bg-navy-800 text-brand-cyan flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.messageRole === 'USER'
                    ? 'bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-md'
                    : 'bg-navy-800/90 text-slate-200 border border-white/5'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.actionUrl && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-end">
                    <a
                      href={m.actionUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-cyan text-navy-950 font-bold text-[11px] hover:opacity-90 transition-opacity"
                    >
                      {m.suggestedAction || 'View in Dashboard'} <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {m.messageRole === 'USER' && (
                <div className="w-7 h-7 rounded-lg bg-brand-blue text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-navy-800 text-brand-cyan flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-navy-800/80 border border-white/5 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                <span>Synthesizing authorized financial data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-6 py-2 border-t border-white/5 bg-navy-950/40 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 border border-white/10 text-slate-400 hover:text-white text-[11px] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-navy-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your expenses, telecom plans, subscriptions, savings..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-cyan"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold hover:opacity-95 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-md shadow-brand-cyan/20"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
