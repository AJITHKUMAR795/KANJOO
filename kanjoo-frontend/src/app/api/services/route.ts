import { NextResponse } from 'next/server';

export async function GET() {
  const services = [
    {
      id: 'predictive-cashflow',
      title: 'AI Predictive Cash Flow & Burn Engine',
      category: 'AI Intelligence',
      badge: 'Institutional Grade',
      badgeColor: 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30',
      description:
        'Monte Carlo & time-series balance forecasting across 7, 30, 60, and 90-day horizons. Automatically accounts for scheduled auto-debits, recurring income, and living burn rate.',
      estimatedSavings: '₹18,500 / $220/yr avoided overdraft fees',
      actionUrl: '/cashflow-forecast',
      actionText: 'Launch Forecast',
      highlights: ['7/30/60/90-Day Trajectory', 'Daily Burn Analytics', 'Cash Shortage Warnings'],
    },
    {
      id: 'statement-importer',
      title: 'Smart Bank Statement Importer',
      category: 'Automation',
      badge: 'Multi-Format',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
      description:
        'Zero-credential statement ingestion. Parses official CSV, XLSX, and password-free PDF statements from 100+ global banks with automatic category assignment and duplicate detection.',
      estimatedSavings: '4.5 hours/month saved in manual bookkeeping',
      actionUrl: '/statements',
      actionText: 'Import Statement',
      highlights: ['CSV, XLSX & PDF Ingestion', 'Merchant Clean-up', 'Zero Bank Passwords Needed'],
    },
    {
      id: 'receipt-scanner',
      title: 'AI Vision Receipt Scanner',
      category: 'Computer Vision',
      badge: 'AI OCR',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      description:
        'Instant multi-item OCR extraction from store receipts, invoices, and payment slips. Captures merchant name, items, tax breakdown, and matches them to your budget categories.',
      estimatedSavings: '100% expense capture rate for tax deductions',
      actionUrl: '/receipt-scanner',
      actionText: 'Scan Receipt',
      highlights: ['Line-Item Breakdown', 'Tax Detection', 'Instant Expense Ingestion'],
    },
    {
      id: 'debt-optimizer',
      title: 'Mathematical Debt Snowball & Avalanche Engine',
      category: 'Wealth Strategy',
      badge: 'Interest Saver',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      description:
        'Analyzes personal loans, credit cards, education loans, and mortgages. Compares Minimum Contractual EMI vs Debt Snowball (fastest psychological wins) vs Debt Avalanche (maximum interest savings).',
      estimatedSavings: '₹1,24,000 / $1,480 saved in lifetime interest',
      actionUrl: '/debts',
      actionText: 'Optimize Debts',
      highlights: ['Snowball vs Avalanche Simulation', 'Debt-Free Date Predictor', 'Prepayment Modeler'],
    },
    {
      id: 'family-vault',
      title: 'Family Wealth Vault & Shared Governance',
      category: 'Multi-User',
      badge: 'Zero-Knowledge Privacy',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      description:
        'Coordinate household finances without compromising personal privacy. Pool funds for rent and groceries while keeping individual personal transactions cryptographically isolated.',
      estimatedSavings: 'Seamless family budget alignment with zero friction',
      actionUrl: '/family',
      actionText: 'Open Family Vault',
      highlights: ['Shared Household Pool', 'Private Personal Spending', 'Role Permissions'],
    },
    {
      id: 'net-worth',
      title: 'Personal Net Worth & Balance Sheet',
      category: 'Wealth Strategy',
      badge: 'Real-Time',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      description:
        'Complete accounting equation dashboard: Net Worth = Total Assets - Total Liabilities. Tracks liquid cash, equities, real estate, precious metals, and all loan liabilities.',
      estimatedSavings: 'Holistic multi-asset visibility and growth tracking',
      actionUrl: '/net-worth',
      actionText: 'View Balance Sheet',
      highlights: ['Asset Allocation Chart', 'Historical Growth Curves', 'Debt Ratio Analysis'],
    },
    {
      id: 'founder-suite',
      title: 'Founder Runway & Business Finance Cockpit',
      category: 'KANJOO PRO',
      badge: 'For Founders',
      badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold',
      description:
        'Startup cash-on-hand tracking, gross vs net burn rate calculations, runway in months, break-even simulation, and ESOP equity dilution modeler for future funding rounds.',
      estimatedSavings: 'Essential runway clarity before launching funding rounds',
      actionUrl: '/pro',
      actionText: 'Access Founder Suite',
      highlights: ['Runway in Months', 'ESOP Dilution Modeler', 'Burn Rate Analysis'],
    },
    {
      id: 'investor-network',
      title: 'Venture Capital & Investor Matchmaking',
      category: 'KANJOO PRO',
      badge: 'Verified VCs',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      description:
        'Curated database of premier venture capital funds (Peak XV, Blume, Indian Angel Network, Y Combinator) with ticket sizes, focus sectors, and pitch deck submission channels.',
      estimatedSavings: 'Direct founder access to verified early-stage institutional capital',
      actionUrl: '/pro',
      actionText: 'Explore Investors',
      highlights: ['Direct Dealflow Emails', 'Portfolio Highlights', 'Sector Focus Criteria'],
    },
    {
      id: 'money-leak-hunter',
      title: 'Autonomous Money Leak Hunter & Telecom Optimizer',
      category: 'AI Intelligence',
      badge: 'Signature',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      description:
        'Surveillance engine detecting duplicate subscriptions, forgotten auto-debits, student discount opportunities, and multi-SIM recharge waste for home Wi-Fi users.',
      estimatedSavings: '₹14,200 / $170/yr average user recovery',
      actionUrl: '/money-leak',
      actionText: 'Detect Money Leaks',
      highlights: ['Dual-SIM Cost Minimizer', 'Unused Subscription Finder', 'Discount Verifier'],
    },
    {
      id: 'scholarship-engine',
      title: 'Government Scholarship & Educational Grant Finder',
      category: 'Financial Planning',
      badge: 'Govt Verified',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      description:
        'Direct integration with national scholarship portals (NSP, PM-USP, AICTE, DST INSPIRE, SC/ST social justice grants) featuring real-time eligibility matching based on income and academic profile.',
      estimatedSavings: '₹20,000 to ₹80,000/yr in non-repayable educational grants',
      actionUrl: '/scholarships',
      actionText: 'Find Scholarships',
      highlights: ['National Scholarship Portal', 'Direct Application URLs', 'Document Checklists'],
    },
    {
      id: 'tax-loss-harvesting',
      title: 'Stock Portfolio & Tax-Loss Harvesting Engine',
      category: 'KANJOO PRO',
      badge: 'Tax Reduction',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      description:
        'Calculates real-time capital gains across equity holdings, tracks Section 112A LTCG exemptions, and suggests strategic tax-loss harvesting sales to neutralize statutory tax obligations.',
      estimatedSavings: 'Up to ₹1,25,000 tax-free capital gains harvested annually',
      actionUrl: '/pro',
      actionText: 'Optimize Portfolio Tax',
      highlights: ['LTCG Exemption Tracker', 'Tax-Loss Harvest Alerts', 'Old vs New Regime'],
    },
    {
      id: 'ai-copilot',
      title: '24/7 Grounded KANJOO AI Financial Copilot',
      category: 'AI Intelligence',
      badge: 'Grounded AI',
      badgeColor: 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30',
      description:
        'Context-aware conversational intelligence grounded exclusively on your authorized financial data. Ask complex questions about affordability, upcoming bills, telecom packs, and savings plans.',
      estimatedSavings: 'Instant answers to all your financial decisions',
      actionUrl: '/ai-assistant',
      actionText: 'Chat with AI Copilot',
      highlights: ['Deterministic Backing', 'Zero Generic Hallucinations', 'Actionable Deep Links'],
    },
  ];

  return NextResponse.json({
    totalServices: services.length,
    averageAnnualSavings: '₹1,56,900 / $1,880',
    services,
  });
}
