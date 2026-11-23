'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

export default function ScholarshipsPage() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchApi<any[]>('/scholarships');
      setScholarships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const toggleBookmark = async (id: number) => {
    try {
      await fetchApi(`/scholarships/${id}/bookmark`, { method: 'POST' });
      loadData();
    } catch {
      alert('Failed to update bookmark');
    }
  };

  const symbol = user?.primaryCurrencySymbol || '$';

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-cyan" />
            Scholarship & Government Benefit Finder
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified state, national, and university educational assistance with country-specific eligibility checks
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading scholarships...</div>
      ) : scholarships.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">
          No active scholarships found for your country currently.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {scholarships.map((sDto: any) => {
            const s = sDto.scholarship;
            const isEligible = sDto.isEligible;
            const isBookmarked = sDto.isBookmarked;

            return (
              <div key={s.id} className="p-6 rounded-2xl glass-panel relative flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                          {s.country?.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isEligible
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isEligible ? 'Eligible' : 'Check Criteria'}
                        </span>
                      </div>
                      <h2 className="font-bold text-white text-sm">{s.name}</h2>
                    </div>

                    <button
                      onClick={() => toggleBookmark(s.id)}
                      className={`p-2 rounded-xl transition-all ${
                        isBookmarked
                          ? 'bg-brand-cyan text-navy-950 shadow'
                          : 'bg-navy-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.provider}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-900 border border-white/5 mb-4">
                    <span className="text-[10px] text-slate-500 font-medium">Grant Value / Funding</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5 font-mono">
                      {s.currency?.symbol} {Number(s.amount).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Eligibility Requirements:</span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">{s.eligibilityDetails}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pt-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Application Deadline: <strong className="text-white">{s.deadline || 'Rolling Basis'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Official government/trust source</span>
                  {s.applicationUrl && (
                    <a
                      href={s.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      Official Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
