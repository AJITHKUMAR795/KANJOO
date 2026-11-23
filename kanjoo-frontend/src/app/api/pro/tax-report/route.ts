import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    countryCode: 'IN',
    financialYear: '2026-2027',
    taxRegime: 'New Tax Regime (Section 115BAC)',
    grossAnnualIncome: 576000.0,
    standardDeduction: 75000.0,
    taxableIncome: 501000.0,
    estimatedIncomeTax: 0.0, // Rebate under 87A covers up to 7L in new regime
    section87aRebate: 25000.0,
    netTaxPayable: 0.0,
    healthAndEducationCess: 0.0,
    recommendations: [
      'Under the revised New Tax Regime, total taxable income up to ₹7,00,000 qualifies for full Section 87A rebate, resulting in zero net tax payable.',
      'Standard deduction of ₹75,000 is automatically applied to your salaried income.',
      'Maintain investment statements for tax-loss harvesting to neutralize capital gains across equity portfolios.',
    ],
    filingDeadline: '2027-07-31',
    auditRequired: false,
    itrFormRecommended: 'ITR-1 (Sahaj)',
  });
}
