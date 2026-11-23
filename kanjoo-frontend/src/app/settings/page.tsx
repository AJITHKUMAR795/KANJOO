'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  Settings as SettingsIcon,
  Globe,
  Save,
  CheckCircle2,
  DollarSign,
  User,
  Shield,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUser, updateUserContext } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchApi<any>('/onboarding/profile').catch(() => null),
      fetchApi<any[]>('/onboarding/countries').catch(() => []),
      fetchApi<any[]>('/onboarding/currencies').catch(() => []),
    ])
      .then(([prof, cList, currList]) => {
        const defaultCountry = {
          code: user?.countryCode || 'IN',
          name: user?.countryCode === 'IN' ? 'India' : 'United States',
          currency: { code: user?.primaryCurrencyCode || 'INR', symbol: user?.primaryCurrencySymbol || '₹', name: 'Primary Currency' },
        };
        const defaultCurrency = {
          code: user?.primaryCurrencyCode || 'INR',
          symbol: user?.primaryCurrencySymbol || '₹',
          name: 'Primary Currency',
        };

        setProfile(prof || {
          country: defaultCountry,
          primaryCurrency: defaultCurrency,
          age: 24,
          occupation: 'Software Engineer & Founder',
          studentOrProfessional: 'PROFESSIONAL',
          educationLevel: 'BACHELORS',
          housingType: 'RENTED',
          riskTolerance: 'MODERATE',
          monthlyIncome: 48000,
          monthlySavingsTarget: 15000,
          emergencySavings: 85000,
        });

        setCountries(cList && cList.length > 0 ? cList : [
          { code: 'IN', name: 'India', currency: { code: 'INR', symbol: '₹' } },
          { code: 'US', name: 'United States', currency: { code: 'USD', symbol: '$' } },
          { code: 'GB', name: 'United Kingdom', currency: { code: 'GBP', symbol: '£' } },
          { code: 'EU', name: 'European Union', currency: { code: 'EUR', symbol: '€' } },
          { code: 'AE', name: 'United Arab Emirates', currency: { code: 'AED', symbol: 'د.إ' } },
        ]);

        setCurrencies(currList && currList.length > 0 ? currList : [
          { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' },
          { code: 'GBP', name: 'British Pound', symbol: '£' },
          { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user]);

  const handleCountryChange = (cCode: string) => {
    const selected = countries.find((c) => c.code === cCode);
    if (selected) {
      setProfile((prev: any) => ({
        ...prev,
        country: selected,
        primaryCurrency: selected.currency,
      }));
    }
  };

  const handleCurrencyChange = (currCode: string) => {
    const selected = currencies.find((c) => c.code === currCode);
    if (selected) {
      setProfile((prev: any) => ({
        ...prev,
        primaryCurrency: selected,
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi('/onboarding/profile', {
        method: 'POST',
        body: JSON.stringify({
          countryCode: profile.country.code,
          primaryCurrencyCode: profile.primaryCurrency.code,
          age: profile.age,
          occupation: profile.occupation,
          studentOrProfessional: profile.studentOrProfessional,
          educationLevel: profile.educationLevel,
          housingType: profile.housingType,
          riskTolerance: profile.riskTolerance,
          monthlyIncome: profile.monthlyIncome,
          monthlySavingsTarget: profile.monthlySavingsTarget,
          emergencySavings: profile.emergencySavings,
        }),
      });

      updateUserContext({
        countryCode: profile.country.code,
        primaryCurrencyCode: profile.primaryCurrency.code,
        primaryCurrencySymbol: profile.primaryCurrency.symbol,
      });

      await refreshUser();
      alert('Settings & Country Configuration successfully updated!');
    } catch {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-xs text-slate-400">Loading settings...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-brand-cyan" />
            Global Settings & Currency
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure country of residence, ISO 4217 primary currency, and profile parameters
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl mt-6 space-y-6">
        {/* Global Currency Section */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-cyan" /> Country & Currency Architecture
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Country of Residence</label>
              <select
                value={profile.country?.code || 'IN'}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currency.code} - {c.currency.symbol})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Controls telecom catalogs, student discounts, and scholarships.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Operating Currency</label>
              <select
                value={profile.primaryCurrency?.code || 'INR'}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono font-bold"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.name} [Decimals: {c.decimalDigits}]
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                All budgets, reports, and leak detectors compute in this currency.
              </span>
            </div>
          </div>
        </div>

        {/* Profile & Demographic Parameters */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-brand-cyan" /> Financial Profile & Lifestyle
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Occupation</label>
              <input
                type="text"
                value={profile.occupation || ''}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Student / Professional Status</label>
              <select
                value={profile.studentOrProfessional || 'PROFESSIONAL'}
                onChange={(e) => setProfile({ ...profile, studentOrProfessional: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
              >
                <option value="STUDENT">Student</option>
                <option value="PROFESSIONAL">Working Professional</option>
                <option value="FREELANCER">Freelancer</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Housing Type</label>
              <select
                value={profile.housingType || 'RENTED'}
                onChange={(e) => setProfile({ ...profile, housingType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
              >
                <option value="RENTED">Rented Apartment</option>
                <option value="OWNED">Owned Home</option>
                <option value="HOSTEL">College Hostel</option>
                <option value="FAMILY">With Family</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Risk Tolerance</label>
              <select
                value={profile.riskTolerance || 'MODERATE'}
                onChange={(e) => setProfile({ ...profile, riskTolerance: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
              >
                <option value="CONSERVATIVE">Conservative</option>
                <option value="MODERATE">Moderate</option>
                <option value="AGGRESSIVE">Aggressive</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-bold text-xs shadow-lg shadow-brand-cyan/25 hover:opacity-95 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </form>
    </AppLayout>
  );
}
