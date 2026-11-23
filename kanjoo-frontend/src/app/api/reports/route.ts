import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    reportMonth: 'November 2026',
    generatedDate: new Date().toISOString(),
    grossInflow: 48000.0,
    totalOutflow: 28953.0,
    savingsPreserved: 19047.0,
    savingsRatePercent: 39.68,
    topSpendingCategory: 'Rent & Housing (48.4%)',
    taxRegimeAudit: 'New Regime Section 115BAC (Zero Net Tax Payable)',
    netWorth: 1874500.0,
  });
}
