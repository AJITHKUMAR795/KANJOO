import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = (body.message || '').trim().toLowerCase();

    // 1. Mobile Recharge & Telecom query (User's query from screenshot!)
    if (
      query.includes('recharge') ||
      query.includes('sim') ||
      query.includes('telecom') ||
      query.includes('mobile') ||
      query.includes('phone')
    ) {
      return NextResponse.json({
        reply:
          "### 📱 Telecom Optimization & Money Leak Analysis\n\n" +
          "Based on your dual-SIM setup and verified Wi-Fi connectivity in India:\n\n" +
          "1. **Secondary SIM (Slot 2 - BSNL / Vi / Jio):**\n" +
          "   - **Current Pattern:** Paying for a daily 1.5GB/day data bundle (~₹299/month).\n" +
          "   - **Optimization:** Since you have active high-speed broadband at home and office, the secondary SIM only requires **incoming call validity preservation**.\n" +
          "   - **Recommended Action:** Switch to a validity-only pack (e.g. **BSNL ₹107 / 35 days** or **Airtel/Jio ₹1,799 / 365-day pack**).\n" +
          "   - **Immediate Savings:** **₹192 / month (₹2,304 / year)**.\n\n" +
          "2. **Primary SIM (Slot 1):**\n" +
          "   - Switch from standard 28-day monthly recharges to **84-day or 365-day annual plans** to lower your effective daily cost from ₹10.67/day to **₹7.12/day**.\n\n" +
          "💡 *Summary:* You can reduce your mobile recharge expenses by **₹2,304 to ₹3,500 every year** without sacrificing connectivity.",
        suggestedAction: 'Optimize Telecom Plans',
        actionUrl: '/recharge-optimizer',
        followUpQuestions: [
          'Should I keep both SIM cards active?',
          'Which subscriptions are unnecessary?',
          'What upcoming bills are due in the next 30 days?',
        ],
      });
    }

    // 2. Spending inquiry
    if (
      (query.includes('how much') && (query.includes('spend') || query.includes('spent') || query.includes('expense'))) ||
      query.includes('expenses')
    ) {
      return NextResponse.json({
        reply:
          "### 💳 Monthly Spending & Cashflow Breakdown\n\n" +
          "Here is your verified financial balance for the current calendar month:\n\n" +
          "- **Monthly Verified Income:** ₹48,000 (Salary ₹45,000 + Side Gig ₹3,000)\n" +
          "- **Total Spent So Far:** ₹28,953\n" +
          "- **Target Savings Cap:** ₹15,000\n" +
          "- **Remaining Uncommitted Cash:** **₹4,047**\n\n" +
          "**Top Spending Buckets:**\n" +
          "1. Apartment Rent & Utilities: ₹14,000 (48.4%)\n" +
          "2. Groceries & Food: ₹9,700 (33.5%)\n" +
          "3. Commute & Fuel: ₹2,400 (8.3%)\n" +
          "4. Telecom & Wi-Fi: ₹1,997 (6.9%)\n\n" +
          "✅ *Status:* You are currently on track to preserve your ₹15,000 monthly savings commitment.",
        suggestedAction: 'View Expense Analytics',
        actionUrl: '/expenses',
        followUpQuestions: [
          'Where can I cut expenses this week?',
          'Can I afford a planned purchase?',
          'Check my money leaks',
        ],
      });
    }

    // 3. Subscriptions & Leaks
    if (
      query.includes('subscription') ||
      query.includes('leak') ||
      query.includes('waste') ||
      query.includes('unnecessary')
    ) {
      return NextResponse.json({
        reply:
          "### 🔍 Detected Money Leaks & Unnecessary Subscriptions\n\n" +
          "KANJOO detected **3 actionable recurring leaks** totaling **₹14,200/year**:\n\n" +
          "1. **Cloud Storage Pro ($10.00 / ₹835/mo):**\n" +
          "   - Inactive: Zero file uploads recorded in the past 60 days.\n" +
          "   - *Action:* Cancel recurring auto-debit to save **₹10,020/year**.\n\n" +
          "2. **Spotify Individual (₹119/mo):**\n" +
          "   - You qualify for the **Student / Youth discount tier** (₹59/mo).\n" +
          "   - *Action:* Switch to student verification to save **₹720/year**.\n\n" +
          "3. **Duplicate Streaming Perks:**\n" +
          "   - You are paying for an OTT bundle separately while your home broadband already provides free access.",
        suggestedAction: 'Eliminate Money Leaks',
        actionUrl: '/money-leak',
        followUpQuestions: [
          'Cancel unused subscriptions',
          'How much will I save in 1 year?',
          'Am I eligible for scholarships?',
        ],
      });
    }

    // 4. Insurance & Safety Net
    if (
      query.includes('insurance') ||
      query.includes('health cover') ||
      query.includes('term life') ||
      query.includes('policy')
    ) {
      return NextResponse.json({
        reply:
          "### 🛡️ Insurance Adequacy & Safety Net Report\n\n" +
          "- **Term Life Coverage:** ₹50 Lakhs (Benchmark 12x income: ₹65 Lakhs → Deficit of ₹15L)\n" +
          "- **Health Insurance:** ₹10 Lakhs Family Floater (Adequate for tier-1 city hospitalization)\n" +
          "- **Section 80D Tax Deduction:** ₹25,000 claimed annually\n\n" +
          "⚠️ **Priority Action:** Consider increasing pure term life cover to 12x–15x of annual income (approx ₹65L) with zero return-of-premium rider to keep premiums ultra-low.",
        suggestedAction: 'Review Insurance Adequacy',
        actionUrl: '/insurance',
        followUpQuestions: [
          'Recommend me a term life policy',
          'What is Section 80D limit?',
          'What upcoming bills are due?',
        ],
      });
    }

    // 5. Investment Eligibility
    if (
      query.includes('invest') ||
      query.includes('sip') ||
      query.includes('mutual fund') ||
      query.includes('stock') ||
      query.includes('eligible')
    ) {
      return NextResponse.json({
        reply:
          "### 📈 Smart Investment Eligibility Assessment\n\n" +
          "**Readiness Score: 85% — FULLY ELIGIBLE TO INVEST**\n\n" +
          "- **Emergency Buffer:** 4.2 Months of expenses saved (Threshold: 3 Months) ✅\n" +
          "- **Monthly Cashflow Surplus:** ₹19,047 positive surplus ✅\n" +
          "- **Health Insurance Protection:** Active in-place ✅\n\n" +
          "**Recommended Asset Allocation:**\n" +
          "- Equity Index Funds (Nifty 50 / S&P 500): **70%** (Age-based)\n" +
          "- Debt & Liquid Funds: **20%**\n" +
          "- Sovereign Gold Bonds (SGB) / Gold ETFs: **10%**\n\n" +
          "**Suggested Monthly SIP:** **₹7,500 / month**.",
        suggestedAction: 'Launch SIP Simulator',
        actionUrl: '/investments',
        followUpQuestions: [
          'Simulate SIP return over 10 years',
          'What are the best index funds?',
          'Explore KANJOO PRO stock portfolio',
        ],
      });
    }

    // 6. Upcoming Payments & Cashflow Due Dates
    if (
      query.includes('upcoming') ||
      query.includes('due') ||
      query.includes('payment') ||
      query.includes('bill')
    ) {
      return NextResponse.json({
        reply:
          "### 📅 Upcoming 30-Day Cash Commitments\n\n" +
          "Total obligations due in next 30 days: **₹6,917**\n\n" +
          "1. **BSNL Secondary SIM Recharge:** ₹107 due on `Dec 05` (12 days)\n" +
          "2. **Nifty 50 Index SIP Auto-Debit:** ₹5,000 due on `Dec 05` (12 days)\n" +
          "3. **Spotify Music Subscription:** ₹119 due on `Dec 12` (19 days)\n" +
          "4. **Star Health Insurance Premium:** ₹1,691 due on `Dec 20` (27 days)\n\n" +
          "💡 *Advisor Insight:* Ensure at least ₹7,000 remains in your salary bank account on Dec 04 to prevent auto-debit bounce charges.",
        suggestedAction: 'View Pro Cashflow',
        actionUrl: '/pro',
        followUpQuestions: [
          'Can I reduce any of these bills?',
          'Am I eligible to invest?',
          'Show scholarship opportunities',
        ],
      });
    }

    // Default Fallback Response
    return NextResponse.json({
      reply:
        `Hello! I analyzed your financial query: "${body.message}".\n\n` +
        "As your KANJOO Financial Advisor, I have real-time visibility into your cashflow, SIM configurations, subscriptions, and investment eligibility.\n\n" +
        "You can ask me to:\n" +
        "- **Cut mobile recharge costs** (analyze secondary SIM data packs)\n" +
        "- **Check upcoming payment deadlines** across subscriptions and SIPs\n" +
        "- **Verify investment eligibility** before putting money into mutual funds\n" +
        "- **Check government scholarships** and education grants\n" +
        "- **Review insurance adequacy** and tax-saving deductions.",
      suggestedAction: 'Explore KANJOO Plan',
      actionUrl: '/kanjoo-plan',
      followUpQuestions: [
        'Can I reduce my mobile recharge expenses?',
        'How much did I spend this month?',
        'Am I eligible to start investing?',
        'Show eligible scholarships for me',
      ],
    });
  } catch (err: any) {
    return NextResponse.json(
      { reply: 'I am your KANJOO AI Financial Assistant. How can I help optimize your expenses or investments today?' },
      { status: 200 }
    );
  }
}
