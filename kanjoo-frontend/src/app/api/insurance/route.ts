import { NextResponse } from 'next/server';

export async function GET() {
  const policies = [
    {
      id: 1,
      policyName: 'HDFC ERGO Optima Secure Health Cover',
      policyType: 'HEALTH',
      sumInsured: 1000000.0,
      premiumAnnual: 14200.0,
      currencyCode: 'INR',
      renewalDate: '2027-02-15',
      coverageType: 'Family Floater (2 Adults + 1 Child)',
      status: 'ADEQUATE',
    },
    {
      id: 2,
      policyName: 'ICICI Prudential iProtect Smart Term Life',
      policyType: 'TERM_LIFE',
      sumInsured: 5000000.0,
      premiumAnnual: 9800.0,
      currencyCode: 'INR',
      renewalDate: '2027-04-10',
      coverageType: 'Pure Term Protection',
      status: 'UPGRADE_RECOMMENDED',
      deficitAmount: 1500000.0,
    },
  ];

  return NextResponse.json({
    policies,
    assessment: {
      healthAdequate: true,
      termLifeAdequate: false,
      recommendedTermSum: 6500000.0,
      healthSumInsured: 1000000.0,
      annualTotalPremium: 24000.0,
    },
  });
}
