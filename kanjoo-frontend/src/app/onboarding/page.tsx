'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import {
  User,
  DollarSign,
  Home,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Globe,
  Shield,
  Wifi,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUserContext, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    countryCode: 'IN',
    age: 23,
    stateRegion: 'Karnataka',
    city: 'Bengaluru',
    occupation: 'Software Engineer',
    studentOrProfessional: 'PROFESSIONAL',
    educationLevel: 'BACHELORS',
    preferredLanguage: 'en',
    monthlyIncome: 45000,
    pocketMoney: 0,
    otherIncome: 3000,
    monthlySavingsTarget: 15000,
    existingInvestments: 50000,
    emergencySavings: 30000,
    housingType: 'RENTED',
    riskTolerance: 'MODERATE',
    hasWifi: true,
    numSims: 2,
  });

  useEffect(() => {
    fetchApi<any[]>('/onboarding/countries')
      .then((data) => {
        setCountries(data);
        if (user?.countryCode) {
          setFormData((prev) => ({ ...prev, countryCode: user.countryCode }));
        }
      })
      .catch(() => {});
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await fetchApi('/onboarding/profile', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      updateUserContext({
        countryCode: formData.countryCode,
        onboardingCompleted: true,
      });

      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      updateUserContext({
        countryCode: formData.countryCode,
        onboardingCompleted: true,
      });
      router.push('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountryObj = countries.find((c) => c.code === formData.countryCode);
  const currencySymbol = selectedCountryObj?.currency?.symbol || '$';
  const currencyCode = selectedCountryObj?.currency?.code || 'USD';

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl glass-panel p-8 rounded-2xl shadow-2xl relative">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Guided Financial Onboarding</span>
            </div>
            <h1 className="text-xl font-bold text-white">
              {step === 1 && 'Step 1: Personal & Geographic Profile'}
              {step === 2 && 'Step 2: Financial Foundation & Targets'}
              {step === 3 && 'Step 3: Lifestyle & Living Accommodation'}
              {step === 4 && 'Step 4: Digital Footprint & Risk Profile'}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  step === s
                    ? 'bg-brand-cyan text-navy-950 shadow-md shadow-brand-cyan/20'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-navy-800 text-slate-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.currency.code} - {c.currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  min={16}
                  max={100}
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State / Province / Region</label>
                <input
                  type="text"
                  value={formData.stateRegion}
                  onChange={(e) => handleChange('stateRegion', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={formData.studentOrProfessional}
                  onChange={(e) => handleChange('studentOrProfessional', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  <option value="STUDENT">Student (Qualifies for discounts & scholarships)</option>
                  <option value="PROFESSIONAL">Working Professional</option>
                  <option value="FREELANCER">Freelancer / Consultant</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Education Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleChange('educationLevel', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs"
                >
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="UNDERGRADUATE">Undergraduate / College</option>
                  <option value="BACHELORS">Bachelor's Degree</option>
                  <option value="POSTGRADUATE">Master's / Postgraduate</option>
                  <option value="DOCTORATE">Doctorate / PhD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Financial Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-xs text-brand-cyan flex items-center gap-2">
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span>All amounts use your primary currency: <strong>{currencyCode} ({currencySymbol})</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Primary Income ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.monthlyIncome === 0 ? '' : formData.monthlyIncome}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    handleChange('monthlyIncome', val === '' ? 0 : parseFloat(val) || 0);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Side Gig / Other Income ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.otherIncome === 0 ? '' : formData.otherIncome}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    handleChange('otherIncome', val === '' ? 0 : parseFloat(val) || 0);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Savings Target ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.monthlySavingsTarget === 0 ? '' : formData.monthlySavingsTarget}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    handleChange('monthlySavingsTarget', val === '' ? 0 : parseFloat(val) || 0);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Reserve Savings ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.emergencySavings === 0 ? '' : formData.emergencySavings}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    handleChange('emergencySavings', val === '' ? 0 : parseFloat(val) || 0);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Existing Investments (Stocks / Funds / SIP) ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.existingInvestments === 0 ? '' : formData.existingInvestments}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    handleChange('existingInvestments', val === '' ? 0 : parseFloat(val) || 0);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle & Housing */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Housing & Living Arrangement</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'RENTED', label: 'Rented Apt' },
                  { id: 'OWNED', label: 'Owned Home' },
                  { id: 'HOSTEL', label: 'College Hostel' },
                  { id: 'FAMILY', label: 'With Family' },
                ].map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleChange('housingType', h.id)}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.housingType === h.id
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                        : 'bg-navy-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Wi-Fi & Broadband Facilities</label>
              <div className="p-4 rounded-xl bg-navy-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Daily Wi-Fi Available</p>
                    <p className="text-[11px] text-slate-400">Home fiber, office, or university Wi-Fi network</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('hasWifi', !formData.hasWifi)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    formData.hasWifi ? 'bg-brand-cyan' : 'bg-navy-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.hasWifi ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Crucial for the Smart Recharge Optimizer to detect unneeded mobile data bundles on secondary numbers.
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Digital Footprint & Risk Profile */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">How many SIM cards do you maintain?</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleChange('numSims', num)}
                    className={`py-3 rounded-xl text-xs font-semibold border transition-all ${
                      formData.numSims === num
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                        : 'bg-navy-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} {num === 1 ? 'SIM Card' : 'SIM Cards'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Investment Risk Tolerance</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'CONSERVATIVE', label: 'Conservative', desc: 'Capital safety focus' },
                  { id: 'MODERATE', label: 'Moderate', desc: 'Balanced index funds' },
                  { id: 'AGGRESSIVE', label: 'Aggressive', desc: 'High growth equity' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleChange('riskTolerance', r.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      formData.riskTolerance === r.id
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                        : 'bg-navy-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{r.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-blue/20 to-brand-cyan/10 border border-brand-cyan/30 mt-4">
              <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Profile Ready to Generate</span>
              </div>
              <p className="text-xs text-slate-300">
                KANJOO will compute your baseline Financial Health Score, populate your primary currency dashboard,
                and scan for immediate telecom & subscription leaks.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold hover:bg-navy-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-brand-cyan text-navy-950 text-xs font-bold hover:opacity-90 shadow-md shadow-brand-cyan/20 flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinish}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold hover:opacity-95 shadow-lg shadow-brand-cyan/25 flex items-center gap-2"
            >
              {submitting ? 'Generating AI Profile...' : 'Launch Dashboard'}
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
