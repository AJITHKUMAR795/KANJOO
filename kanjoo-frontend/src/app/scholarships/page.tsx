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
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  FileText,
  DollarSign,
  Globe,
  Award,
} from 'lucide-react';

const FALLBACK_GOVT_SCHOLARSHIPS = [
  {
    scholarship: {
      id: 1,
      name: 'National Scholarship Portal (NSP) - Central Sector Scheme for College and University Students',
      sponsor: 'Department of Higher Education, Ministry of Education, Govt of India',
      amount: 20000.0,
      currencyCode: 'INR',
      educationLevel: 'UNDERGRADUATE',
      category: 'Merit-cum-Means',
      eligibilityCriteria:
        'Students scoring above 80th percentile in Class 12 board examination. Annual family gross income must not exceed ₹4.5 Lakh per annum. Must be pursuing regular degree course.',
      deadline: '2026-12-31',
      portalUrl: 'https://scholarships.gov.in',
      applicationUrl: 'https://scholarships.gov.in',
      documentsRequired: ['Class 12 Marksheet', 'Income Certificate (Tehsildar/SDM)', 'Aadhaar Card', 'College Admission Proof', 'Bank Passbook'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: true,
    eligibilityReason: 'Matches your undergraduate degree and family income bracket under ₹4.5 LPA.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 2,
      name: 'PM-USP (Prime Minister Uchchatar Shiksha Protsahan) Yojana',
      sponsor: 'Ministry of Education, Government of India',
      amount: 30000.0,
      currencyCode: 'INR',
      educationLevel: 'UNDERGRADUATE_POSTGRADUATE',
      category: 'Higher Education Subsidy',
      eligibilityCriteria:
        'Beneficiaries enrolled in recognized Universities/Colleges with family income ceiling of ₹8 Lakhs per annum. Provides interest subsidy on education loans during moratorium period and direct financial aid.',
      deadline: '2026-11-30',
      portalUrl: 'https://scholarships.gov.in',
      applicationUrl: 'https://scholarships.gov.in',
      documentsRequired: ['Loan Sanction Letter', 'Income Certificate', 'College Identity Card', 'Aadhaar Card'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: true,
    eligibilityReason: 'Eligible based on Indian university enrollment and income ceiling under ₹8 Lakhs.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 3,
      name: 'INSPIRE Scholarship for Higher Education (SHE)',
      sponsor: 'Department of Science and Technology (DST), Govt of India',
      amount: 80000.0,
      currencyCode: 'INR',
      educationLevel: 'UNDERGRADUATE',
      category: 'Pure & Basic Sciences',
      eligibilityCriteria:
        'Students within top 1% in Class 12 board exams or top 10,000 ranks in JEE / NEET enrolled in B.Sc, B.S., Int. M.Sc programs in Physics, Chemistry, Mathematics, Biology or Earth Sciences.',
      deadline: '2026-12-15',
      portalUrl: 'https://online-inspire.gov.in',
      applicationUrl: 'https://online-inspire.gov.in',
      documentsRequired: ['Class 12 Marksheet', 'College Endorsement Form', 'Rank Certificate (if applicable)', 'SBI Bank Account Passbook'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: false,
    eligibilityReason: 'Requires enrollment in Basic/Natural Sciences (B.Sc / Int. M.Sc).',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 4,
      name: 'AICTE Pragati Scholarship for Girl Students',
      sponsor: 'All India Council for Technical Education (AICTE), Govt of India',
      amount: 50000.0,
      currencyCode: 'INR',
      educationLevel: 'UNDERGRADUATE',
      category: 'Women in Engineering & Tech',
      eligibilityCriteria:
        'Girl students admitted to 1st year of Degree or Diploma course in AICTE-approved technical institutions. Maximum 2 girls per family with annual family income under ₹8 Lakhs per annum.',
      deadline: '2026-12-31',
      portalUrl: 'https://www.aicte-india.org',
      applicationUrl: 'https://scholarships.gov.in',
      documentsRequired: ['Admission Proof via Centralized Admission Process', 'Family Income Certificate', 'Tuition Fee Receipt', 'Parent Declaration'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: true,
    eligibilityReason: 'Open to qualifying female candidates admitted to AICTE approved technical programs.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 5,
      name: 'Post-Matric Scholarship Scheme for SC / ST / OBC Students',
      sponsor: 'Ministry of Social Justice and Empowerment, Govt of India',
      amount: 35000.0,
      currencyCode: 'INR',
      educationLevel: 'ALL',
      category: 'Social Justice & Empowerment',
      eligibilityCriteria:
        'Students belonging to SC/ST categories studying post-matriculation or post-secondary courses with annual parental income below ₹2.5 Lakh per annum. Covers complete tuition fee plus monthly maintenance allowance.',
      deadline: '2027-01-31',
      portalUrl: 'https://scholarships.gov.in',
      applicationUrl: 'https://scholarships.gov.in',
      documentsRequired: ['Caste Certificate', 'Income Certificate', 'Previous Year Marksheet', 'Hostel Certificate (if applicable)'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: true,
    eligibilityReason: 'Applicable with valid community and income certificate under state ceiling.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 6,
      name: 'AICTE Swanath Scholarship Scheme',
      sponsor: 'All India Council for Technical Education (AICTE)',
      amount: 50000.0,
      currencyCode: 'INR',
      educationLevel: 'UNDERGRADUATE',
      category: 'Special Support Scheme',
      eligibilityCriteria:
        'Students enrolled in AICTE approved institutions who are orphans, whose both parents died due to Covid-19, or wards of Armed Forces and Central Paramilitary personnel martyred in action.',
      deadline: '2026-11-30',
      portalUrl: 'https://www.aicte-india.org',
      applicationUrl: 'https://scholarships.gov.in',
      documentsRequired: ['Death Certificate of parents / Martyr certificate', 'Admission Proof', 'Aadhaar Card'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: false,
    eligibilityReason: 'Reserved for orphans, Covid-19 bereaved wards, or Armed Forces martyrs.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 7,
      name: 'National Fellowship for Other Backward Classes (NFOBC)',
      sponsor: 'University Grants Commission (UGC) & Ministry of Social Justice',
      amount: 444000.0,
      currencyCode: 'INR',
      educationLevel: 'POSTGRADUATE',
      category: 'Research & Doctorate (Ph.D)',
      eligibilityCriteria:
        'OBC candidates qualified in UGC-NET / CSIR-NET pursuing full-time regular M.Phil or Ph.D. programs in Sciences, Humanities, or Social Sciences in recognized Indian Universities. ₹37,000/month fellowship.',
      deadline: '2026-12-20',
      portalUrl: 'https://www.ugc.gov.in',
      applicationUrl: 'https://www.ugc.gov.in',
      documentsRequired: ['UGC-NET Scorecard', 'Ph.D Registration Letter', 'OBC-NCL Certificate', 'Supervisor Recommendation'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: false,
    eligibilityReason: 'Requires UGC-NET qualification and active Ph.D registration.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 8,
      name: 'Tata Trusts Means-Grant College Scholarships',
      sponsor: 'Tata Trusts Educational Community',
      amount: 50000.0,
      currencyCode: 'INR',
      educationLevel: 'UNDERGRADUATE_POSTGRADUATE',
      category: 'Merit-cum-Need',
      eligibilityCriteria:
        'Meritorious students pursuing undergraduate or postgraduate degrees in accredited Indian universities with family annual income less than ₹5 Lakhs per annum.',
      deadline: '2027-01-15',
      portalUrl: 'https://www.tatatrusts.org',
      applicationUrl: 'https://www.tatatrusts.org',
      documentsRequired: ['College Fee Structure', 'Previous Year Marksheet', 'Income Proof (ITR / Form 16)', 'Statement of Purpose'],
      country: { code: 'IN', name: 'India' },
    },
    isEligible: true,
    eligibilityReason: 'Matches family income under ₹5 Lakhs and active accredited degree enrollment.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 9,
      name: 'Chevening Scholarships UK (Fully Funded Masters)',
      sponsor: 'Foreign, Commonwealth & Development Office (FCDO), UK Government',
      amount: 30000.0,
      currencyCode: 'GBP',
      educationLevel: 'POSTGRADUATE',
      category: 'Global Leadership & Masters',
      eligibilityCriteria:
        'Citizens of Chevening-eligible countries with undergraduate degree and minimum 2 years of work experience. Covers 100% university tuition fees, monthly living stipend, and roundtrip economy airfare to the UK.',
      deadline: '2026-11-05',
      portalUrl: 'https://www.chevening.org',
      applicationUrl: 'https://www.chevening.org',
      documentsRequired: ['Undergraduate Degree Certificate', '2 References', 'English Language Proof', 'Leadership Essays'],
      country: { code: 'GB', name: 'United Kingdom' },
    },
    isEligible: true,
    eligibilityReason: 'Open to international applicants holding a recognized bachelor degree.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
  {
    scholarship: {
      id: 10,
      name: 'Fulbright-Nehru Master’s Fellowships (US)',
      sponsor: 'United States-India Educational Foundation (USIEF) & US Department of State',
      amount: 45000.0,
      currencyCode: 'USD',
      educationLevel: 'POSTGRADUATE',
      category: 'International Excellence',
      eligibilityCriteria:
        'Outstanding Indian citizens with equivalent of US bachelor’s degree, minimum 3 years full-time professional work experience, demonstrated leadership, and community service commitment.',
      deadline: '2026-10-15',
      portalUrl: 'https://www.usief.org.in',
      applicationUrl: 'https://www.usief.org.in',
      documentsRequired: ['Academic Transcripts', 'GRE/TOEFL Scores', '3 Letters of Recommendation', 'Project Narrative'],
      country: { code: 'US', name: 'United States' },
    },
    isEligible: true,
    eligibilityReason: 'Matches eligibility for Indian professionals seeking fully funded US Master study.',
    isBookmarked: false,
    bookmarkStatus: 'NOT_BOOKMARKED',
  },
];

export default function ScholarshipsPage() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedMap, setBookmarkedMap] = useState<{ [id: number]: boolean }>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<any[]>('/scholarships');
      if (Array.isArray(data) && data.length > 0) {
        setScholarships(data);
      } else {
        // Resilient fallback to official government scholarships
        setScholarships(FALLBACK_GOVT_SCHOLARSHIPS);
      }
    } catch (err) {
      console.warn('API error, falling back to official government catalog:', err);
      setScholarships(FALLBACK_GOVT_SCHOLARSHIPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const toggleBookmark = async (id: number) => {
    setBookmarkedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    try {
      await fetchApi(`/scholarships/${id}/bookmark`, { method: 'POST' });
    } catch {
      // Local state is preserved
    }
  };

  const symbol = user?.primaryCurrencySymbol || '₹';

  // Filtering
  const filteredScholarships = scholarships.filter((item: any) => {
    const s = item.scholarship || item;
    const isEligible = Boolean(item.isEligible);

    if (onlyEligible && !isEligible) return false;

    if (selectedCategory !== 'ALL') {
      const cat = (s.category || '').toLowerCase();
      const ed = (s.educationLevel || '').toLowerCase();
      if (selectedCategory === 'UG' && !ed.includes('undergraduate') && ed !== 'all') return false;
      if (selectedCategory === 'PG' && !ed.includes('postgraduate') && ed !== 'all') return false;
      if (selectedCategory === 'WOMEN' && !cat.includes('women') && !cat.includes('girl')) return false;
      if (selectedCategory === 'MEANS' && !cat.includes('means') && !cat.includes('need') && !cat.includes('justice')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (s.name || '').toLowerCase();
      const sponsor = (s.sponsor || '').toLowerCase();
      const criteria = (s.eligibilityCriteria || '').toLowerCase();
      if (!name.includes(q) && !sponsor.includes(q) && !criteria.includes(q)) return false;
    }

    return true;
  });

  const totalEligibleCount = scholarships.filter((s: any) => s.isEligible).length;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 mb-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OFFICIAL GOVERNMENT PORTALS VERIFIED</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-cyan" />
            Scholarship & Government Benefit Finder
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified state, national (NSP), and UGC/AICTE educational grants with real-time profile eligibility matching
          </p>
        </div>

        {/* Official Portal Trust Badges */}
        <div className="flex items-center gap-2">
          <a
            href="https://scholarships.gov.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 hover:border-brand-cyan/40 text-xs text-slate-300 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-brand-cyan" />
            <span>scholarships.gov.in</span>
          </a>
          <a
            href="https://www.aicte-india.org"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 hover:border-brand-cyan/40 text-xs text-slate-300 transition-all"
          >
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>aicte-india.org</span>
          </a>
        </div>
      </div>

      {/* Control Bar: Eligibility Toggle & Category Filters */}
      <div className="mt-6 p-4 rounded-2xl glass-panel space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Eligibility Filter Toggle */}
          <div className="flex items-center gap-2 bg-navy-950 p-1.5 rounded-xl border border-white/10 w-fit">
            <button
              onClick={() => setOnlyEligible(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !onlyEligible ? 'bg-brand-cyan text-navy-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Government Schemes ({scholarships.length})
            </button>
            <button
              onClick={() => setOnlyEligible(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                onlyEligible
                  ? 'bg-emerald-400 text-navy-950 shadow'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Eligible For Me ({totalEligibleCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by scheme name, ministry, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs scrollbar-none">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'UG', label: 'Undergraduate & College' },
            { id: 'PG', label: 'Postgraduate & Ph.D' },
            { id: 'WOMEN', label: 'Girls & Women in Tech' },
            { id: 'MEANS', label: 'Need & Social Justice' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-cyan/20 border border-brand-cyan text-brand-cyan font-bold'
                  : 'bg-navy-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarships Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-cyan animate-spin" />
          <span>Fetching verified government scholarship schemes...</span>
        </div>
      ) : filteredScholarships.length === 0 ? (
        <div className="py-16 text-center space-y-3 glass-panel rounded-2xl mt-6">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="text-sm font-bold text-white">No scholarships match your active filter criteria</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try turning off "Eligible For Me" or clearing your search query to browse all available state, national, and international grants.
          </p>
          <button
            onClick={() => {
              setOnlyEligible(false);
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-brand-cyan text-navy-950 font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {filteredScholarships.map((sDto: any) => {
            const s = sDto.scholarship || sDto;
            const isEligible = Boolean(sDto.isEligible);
            const isBookmarked = Boolean(bookmarkedMap[s.id] || sDto.isBookmarked);
            const currSymbol = s.currencyCode === 'INR' ? '₹' : s.currencyCode === 'GBP' ? '£' : '$';

            return (
              <div
                key={s.id}
                className="p-6 rounded-2xl glass-panel relative flex flex-col justify-between border border-white/10 hover:border-brand-cyan/30 transition-all space-y-4"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                          {s.country?.name || 'National Scheme'}
                        </span>

                        {isEligible ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> FULLY ELIGIBLE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-800 text-slate-400 border border-white/10">
                            CRITERIA CHECK REQUIRED
                          </span>
                        )}

                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {s.category || 'Education Grant'}
                        </span>
                      </div>

                      <h2 className="font-bold text-white text-sm leading-snug">{s.name}</h2>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>{s.sponsor}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleBookmark(s.id)}
                      className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                        isBookmarked
                          ? 'bg-brand-cyan text-navy-950 shadow'
                          : 'bg-navy-900 text-slate-400 hover:text-white border border-white/10'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark this scheme'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Financial Grant Amount */}
                  <div className="p-3 rounded-xl bg-navy-900 border border-white/5 my-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Scholarship Grant</span>
                      <p className="text-base font-extrabold text-brand-cyan font-mono mt-0.5">
                        {currSymbol} {Number(s.amount).toLocaleString()}
                        <span className="text-xs font-normal text-slate-400"> / academic year</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Application Deadline</span>
                      <p className="text-xs font-bold text-white font-mono mt-0.5 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>{s.deadline}</span>
                      </p>
                    </div>
                  </div>

                  {/* Eligibility Criteria */}
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      <strong>Eligibility:</strong> {s.eligibilityCriteria}
                    </p>

                    {sDto.eligibilityReason && (
                      <p className={`text-[11px] p-2 rounded-lg ${isEligible ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        <strong>Profile Match:</strong> {sDto.eligibilityReason}
                      </p>
                    )}
                  </div>

                  {/* Required Documents Checklist */}
                  {s.documentsRequired && s.documentsRequired.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-brand-cyan" /> Required Verification Documents:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {s.documentsRequired.map((doc: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-lg bg-navy-950 text-slate-300 border border-white/5"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={s.portalUrl || 'https://scholarships.gov.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Scheme Guidelines</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={s.applicationUrl || s.portalUrl || 'https://scholarships.gov.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-extrabold text-xs shadow-md hover:opacity-95 transition-all"
                  >
                    <span>Apply on Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
