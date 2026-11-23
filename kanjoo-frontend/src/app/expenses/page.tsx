'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Receipt,
  Plus,
  Trash2,
  Download,
  Filter,
  Calendar,
  CreditCard,
  Tag,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // New expense form
  const [form, setForm] = useState({
    categoryId: 1,
    amount: '',
    originalCurrency: user?.primaryCurrencyCode || 'USD',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'CARD',
    recurring: false,
  });

  const loadData = async () => {
    try {
      const [expData, catData, currData] = await Promise.all([
        fetchApi<any[]>('/expenses'),
        fetchApi<any[]>('/expenses/categories'),
        fetchApi<any[]>('/onboarding/currencies'),
      ]);
      setExpenses(expData);
      setCategories(catData);
      setCurrencies(currData);
      if (catData.length > 0) {
        setForm((f) => ({ ...f, categoryId: catData[0].id }));
      }
      if (user?.primaryCurrencyCode) {
        setForm((f) => ({ ...f, originalCurrency: user.primaryCurrencyCode }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      });
      setShowAddModal(false);
      setForm((f) => ({ ...f, amount: '', description: '' }));
      loadData();
    } catch (err) {
      alert('Failed to record expense');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await fetchApi(`/expenses/${id}`, { method: 'DELETE' });
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert('Failed to delete expense');
    }
  };

  const downloadCsv = () => {
    const token = localStorage.getItem('kanjoo_token');
    window.open(`http://localhost:8080/api/reports/export-csv?auth=${token}`, '_blank');
  };

  const filteredExpenses = selectedCategory === 'ALL'
    ? expenses
    : expenses.filter((e) => e.categoryName === selectedCategory);

  const totalPrimarySpend = filteredExpenses.reduce((sum, e) => sum + Number(e.primaryAmount || 0), 0);
  const symbol = user?.primaryCurrencySymbol || '$';

  return (
    <AppLayout>
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-cyan" />
            Expense Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track daily transactions with exact decimal arithmetic & multi-currency conversion
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadCsv}
            className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700/80 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-cyan/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Record Expense
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400 font-medium">Total Spending ({user?.primaryCurrencyCode})</span>
          <p className="text-xl font-bold text-white mt-1">
            {symbol} {totalPrimarySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400 font-medium">Recorded Transactions</span>
          <p className="text-xl font-bold text-brand-cyan mt-1">{filteredExpenses.length}</p>
        </div>
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-[11px] text-slate-400 font-medium">Active Currency</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">{user?.primaryCurrencyCode} ({symbol})</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-brand-cyan text-navy-950 shadow'
              : 'bg-navy-800/80 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === c.name
                ? 'bg-brand-cyan text-navy-950 shadow'
                : 'bg-navy-800/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Expense List Table */}
      <div className="mt-4 p-6 rounded-2xl glass-panel">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading transactions...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No expenses found. Click <strong>Record Expense</strong> to add your first transaction.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Original Entry</th>
                  <th className="pb-3 font-semibold">Exchange Rate</th>
                  <th className="pb-3 font-semibold text-right">Primary ({symbol})</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-3 text-slate-300 font-mono text-[11px]">{e.expenseDate}</td>
                    <td className="py-3 font-medium text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
                      {e.categoryName}
                    </td>
                    <td className="py-3 text-slate-300">{e.description || '—'}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{e.paymentMethod}</td>
                    <td className="py-3 text-slate-300 font-mono">
                      {e.originalCurrency} {Number(e.originalAmount).toFixed(2)}
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">
                      {Number(e.exchangeRate) !== 1 ? `x${Number(e.exchangeRate).toFixed(4)}` : '1.00'}
                    </td>
                    <td className="py-3 font-bold text-white text-right font-mono">
                      {symbol} {Number(e.primaryAmount).toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl shadow-2xl relative border border-white/10">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-cyan" /> Record New Expense
            </h2>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.essential ? '(Essential)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Currency</label>
                  <select
                    value={form.originalCurrency}
                    onChange={(e) => setForm({ ...form, originalCurrency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={form.expenseDate}
                  onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Merchant</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Grocery store, coffee, metro card..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                  >
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="UPI">UPI / Instant Pay</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="AUTO_DEBIT">Auto Debit</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={form.recurring}
                    onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
                    className="rounded bg-navy-900 border-white/10 text-brand-cyan"
                  />
                  <label htmlFor="recurring" className="text-xs text-slate-300 cursor-pointer">
                    Recurring monthly bill
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs hover:opacity-90 shadow-md shadow-brand-cyan/20"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
