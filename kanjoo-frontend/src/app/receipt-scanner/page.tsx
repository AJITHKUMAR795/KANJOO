'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Camera,
  Receipt,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
  DollarSign,
  Tag,
} from 'lucide-react';

export default function ReceiptScannerPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  const handleScan = async (sampleType?: string) => {
    setScanning(true);
    setSavedSuccess('');
    try {
      const res = await fetchApi<any>('/receipts/scan', {
        method: 'POST',
        body: JSON.stringify({
          filename: sampleType || file?.name || 'superstore_receipt.jpg',
          text: sampleType || '',
        }),
      });
      setScannedReceipt(res);
    } catch {
      alert('Failed to scan receipt image.');
    } finally {
      setScanning(false);
    }
  };

  const handleConfirm = async () => {
    if (!scannedReceipt) return;
    setSaving(true);
    try {
      const res = await fetchApi<any>('/receipts/confirm', {
        method: 'POST',
        body: JSON.stringify(scannedReceipt),
      });
      setSavedSuccess(res.message || 'Receipt recorded to expenses!');
      setScannedReceipt(null);
    } catch {
      alert('Failed to save receipt as expense.');
    } finally {
      setSaving(false);
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
            <span>AI RECEIPT SCANNER & OCR EXTRACTOR (MODULE 6)</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-cyan" />
            Smart OCR Receipt Scanner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Capture or upload paper receipts: automatically extract merchant, itemized totals, GST/taxes, and record verified expenses
          </p>
        </div>
      </div>

      {/* Upload & Capture Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 p-8 rounded-3xl glass-panel border border-dashed border-white/20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Capture or Upload Receipt Image</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Supports JPEG, PNG, HEIC receipts from dining, groceries, electronics, and fuel stations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleScan('GROCERY_SUPERSTORE')}
              disabled={scanning}
              className="px-4 py-2 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs shadow-md"
            >
              Scan Grocery Receipt
            </button>
            <button
              onClick={() => handleScan('SHELL_PETROL_FUEL')}
              disabled={scanning}
              className="px-4 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold text-xs hover:bg-navy-800"
            >
              Scan Fuel Receipt
            </button>
            <button
              onClick={() => handleScan('CROMA_ELECTRONICS')}
              disabled={scanning}
              className="px-4 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold text-xs hover:bg-navy-800"
            >
              Scan Electronics Receipt
            </button>
          </div>
          {scanning && <p className="text-xs text-brand-cyan animate-pulse">Running OCR neural net extraction...</p>}
        </div>

        {/* Instructions */}
        <div className="p-6 rounded-2xl glass-panel space-y-3 text-xs">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">How Verification Works</h3>
          <p className="text-slate-300 leading-relaxed">
            1. OCR extracts merchant names, individual lines, taxes, and final totals.
          </p>
          <p className="text-slate-300 leading-relaxed">
            2. You review the extracted amounts before any financial entry is created.
          </p>
          <p className="text-slate-300 leading-relaxed">
            3. Duplicate detector ensures a receipt is never entered twice.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Extracted Receipt Card */}
      {scannedReceipt && (
        <div className="mt-8 p-6 rounded-2xl glass-panel border border-brand-cyan/30 max-w-2xl mx-auto space-y-5">
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {scannedReceipt.confidenceStatus}
              </span>
              <h2 className="text-base font-bold text-white mt-1.5">{scannedReceipt.merchantName}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {scannedReceipt.purchaseDate}</span>
                <span>•</span>
                <span>Payment: {scannedReceipt.paymentMethod}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount</span>
              <p className="text-xl font-extrabold text-brand-cyan font-mono mt-0.5">
                {symbol} {Number(scannedReceipt.totalAmount).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">Tax/GST: {symbol}{Number(scannedReceipt.taxAmount).toFixed(2)}</span>
            </div>
          </div>

          {/* Itemized Lines */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Itemized Purchases</span>
            <div className="space-y-1.5">
              {(scannedReceipt.lineItems || []).map((item: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-200">{item.itemName} (x{item.quantity})</span>
                  <span className="font-mono text-white font-bold">{symbol}{Number(item.totalPrice).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Confirmation */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setScannedReceipt(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Discard
            </button>

            <button
              onClick={handleConfirm}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saving ? 'Creating Expense...' : 'Verify & Create Expense'}
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
