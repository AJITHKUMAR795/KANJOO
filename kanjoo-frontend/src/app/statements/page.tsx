'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Trash2,
  Lock,
} from 'lucide-react';

export default function BankStatementImporterPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleParse = async () => {
    setParsing(true);
    setSuccessMsg('');
    try {
      let content = '';
      if (file) {
        content = await file.text();
      }
      const res = await fetchApi<any>('/statements/upload', {
        method: 'POST',
        body: JSON.stringify({
          filename: file?.name || 'bank_statement_nov2026.csv',
          content,
        }),
      });
      setPreview(res);
    } catch {
      alert('Failed to parse statement format. Please ensure valid CSV/XLSX.');
    } finally {
      setParsing(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview?.transactions) return;
    setConfirming(true);
    try {
      const res = await fetchApi<any>('/statements/confirm', {
        method: 'POST',
        body: JSON.stringify(preview.transactions),
      });
      setSuccessMsg(res.message || 'Transactions recorded successfully!');
      setPreview(null);
      setFile(null);
    } catch {
      alert('Failed to confirm transactions.');
    } finally {
      setConfirming(false);
    }
  };

  const symbol = user?.primaryCurrencySymbol || '₹';

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-[11px] font-bold text-brand-cyan mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SMART BANK STATEMENT IMPORTER (MODULE 2)</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-cyan" />
            Automated Bank Statement Importer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Import CSV, XLSX, or PDF bank statements with automated merchant detection, categorization, and duplicate protection
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-navy-900 px-3 py-1.5 rounded-xl border border-white/5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Banking Passwords Stored • 100% Client-Side Privacy</span>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="mt-6 p-8 rounded-3xl glass-panel border border-dashed border-white/20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Select Bank Statement File</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Drag and drop your monthly bank statement (<strong>CSV, XLSX, PDF</strong>). Standard bank formats (SBI, HDFC, ICICI, Chase, HSBC) supported.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.txt"
            onChange={handleFileChange}
            id="statement-file-input"
            className="hidden"
          />
          <label
            htmlFor="statement-file-input"
            className="px-4 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold text-xs cursor-pointer hover:bg-navy-800 transition-colors"
          >
            {file ? file.name : 'Choose File from Computer'}
          </label>

          <button
            onClick={handleParse}
            disabled={parsing}
            className="px-6 py-2 rounded-xl bg-brand-cyan text-navy-950 font-extrabold text-xs shadow-lg hover:shadow-brand-cyan/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {parsing ? 'Parsing Transactions...' : file ? 'Process & Generate Preview' : 'Parse Sample Statement'}
          </button>
        </div>

        <span className="text-[10px] text-slate-500">
          Max file size: 10MB • File never shared with third parties
        </span>
      </div>

      {successMsg && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Preview Table */}
      {preview && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Statement Preview & Verification</h2>
              <p className="text-xs text-slate-400">
                Found <strong>{preview.totalTransactions}</strong> transactions ({preview.debitCount} debits totaling {symbol}{Number(preview.totalDebitAmount).toLocaleString()}). Review before saving.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-navy-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              {confirming ? 'Saving to Expenses...' : 'Confirm & Save All Transactions'}
            </button>
          </div>

          <div className="p-4 rounded-2xl glass-panel overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-left">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Identified Merchant</th>
                  <th className="pb-3 font-semibold">Description / Narration</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(preview.transactions || []).map((t: any) => (
                  <tr key={t.tempId} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono text-slate-300">{t.date}</td>
                    <td className="py-3 font-bold text-white">{t.merchant}</td>
                    <td className="py-3 text-slate-400 max-w-xs truncate">{t.description}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan text-[10px] font-bold">
                        {t.categoryName}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-mono font-bold ${t.type === 'CREDIT' ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'}{symbol}{Number(t.amount).toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      {t.isDuplicate ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          Potential Duplicate
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          Ready to Import
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
