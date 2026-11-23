import { NextResponse } from 'next/server';

export async function GET() {
  const templates = [
    {
      id: 'SAFE_NOTE',
      title: 'Simple Agreement for Future Equity (SAFE Note - Post-Money)',
      category: 'FUNDRAISING',
      description: 'Standard YC-style post-money SAFE note with valuation cap and discount clause.',
      content: `POST-MONEY VALUATION CAP SIMPLE AGREEMENT FOR FUTURE EQUITY (SAFE)

THIS CERTIFIES THAT in exchange for the payment by [INVESTOR NAME] of $[INVESTMENT AMOUNT] (the "Purchase Amount"), [COMPANY NAME], a [DELAWARE / INDIAN PRIVATE LIMITED] company (the "Company"), issues to the Investor the right to certain shares of the Company's Capital Stock...

1. Events:
(a) Equity Financing: If there is an Equity Financing before the termination of this Safe, the Company will automatically issue to the Investor shares of Safe Preferred Stock equal to the Purchase Amount divided by the Safe Price.
(b) Post-Money Valuation Cap: $[VALUATION CAP].
(c) Discount Rate: [80%] (20% Discount).`,
    },
    {
      id: 'CO_FOUNDER_AGREEMENT',
      title: 'Founders Collaboration & Equity Vesting Agreement',
      category: 'FOUNDER_GOVERNANCE',
      description: 'Comprehensive 4-year vesting with 1-year cliff, IP assignment, and acceleration on exit.',
      content: `CO-FOUNDERS COLLABORATION AND EQUITY VESTING AGREEMENT

THIS AGREEMENT is entered into as of [DATE], by and between [FOUNDER 1] and [FOUNDER 2].

1. Equity Split: Founder 1: [50%], Founder 2: [50%].
2. Vesting Schedule: Equity subject to a standard 4-year linear monthly vesting with a 12-month initial cliff.
3. IP Assignment: All intellectual property, codebases, algorithms, and trade secrets developed for [COMPANY NAME] belong exclusively to the Company.
4. Departure: Unvested shares subject to company repurchase at nominal par value upon departure.`,
    },
    {
      id: 'MUTUAL_NDA',
      title: 'Fintech Bilateral Non-Disclosure Agreement (NDA)',
      category: 'COMMERCIAL',
      description: 'Two-way non-disclosure agreement protecting proprietary financial models and investor data.',
      content: `MUTUAL NON-DISCLOSURE AGREEMENT

1. Confidential Information: All non-public financial, code, algorithmic, customer, and strategic information disclosed.
2. Non-Disclosure Obligations: Both parties agree to protect proprietary materials with the same degree of care as their own confidential information.
3. Term: 2 years from date of execution.`,
    },
  ];

  return NextResponse.json(templates);
}
