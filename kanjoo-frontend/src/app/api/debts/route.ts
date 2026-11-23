import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const extra = parseFloat(searchParams.get('extraPayment') || '3000');

  const debts = [
    { debtId: 'D-1', debtName: 'HDFC Education Loan', debtType: 'EDUCATION_LOAN', principalRemaining: 320000, interestRatePercent: 9.5, monthlyEmi: 6500, remainingTenureMonths: 64, lenderName: 'HDFC Credila' },
    { debtId: 'D-2', debtName: 'ICICI Platinum Credit Card', debtType: 'CREDIT_CARD', principalRemaining: 45000, interestRatePercent: 38.0, monthlyEmi: 2500, remainingTenureMonths: 24, lenderName: 'ICICI Bank' },
    { debtId: 'D-3', debtName: 'Vehicle Two-Wheeler Loan', debtType: 'VEHICLE_LOAN', principalRemaining: 75000, interestRatePercent: 12.5, monthlyEmi: 3800, remainingTenureMonths: 23, lenderName: 'Bajaj Auto Finance' },
  ];

  const totalDebt = 440000;
  const totalEmi = 12800;
  const weightedRate = 12.95;

  const stdInterest = 138500;
  const snowballInterest = Math.round(stdInterest * (1 - (extra / 15000) * 0.4));
  const avalancheInterest = Math.round(stdInterest * (1 - (extra / 15000) * 0.55));

  const stdMonths = 64;
  const snowMonths = Math.max(24, Math.round(64 - (extra / 3000) * 23));
  const avaMonths = Math.max(20, Math.round(64 - (extra / 3000) * 27));

  return NextResponse.json({
    totalDebtBalance: totalDebt,
    totalMonthlyEmiObligation: totalEmi,
    weightedAverageInterestRate: weightedRate,
    debts,
    standardPlan: {
      strategyName: 'Minimum Contractual Schedule',
      payoffMonths: stdMonths,
      debtFreeDate: 'Mar 2032',
      totalInterestPaid: stdInterest,
      interestSavedVsStandard: 0,
      monthsSavedVsStandard: 0,
      strategyPhilosophy: 'Paying standard contractual EMIs without any accelerated prepayments.',
    },
    snowballPlan: {
      strategyName: 'Debt Snowball (Smallest Balance First)',
      payoffMonths: snowMonths,
      debtFreeDate: 'Apr 2030',
      totalInterestPaid: snowballInterest,
      interestSavedVsStandard: stdInterest - snowballInterest,
      monthsSavedVsStandard: stdMonths - snowMonths,
      strategyPhilosophy: 'Focuses extra payment on the smallest balance (ICICI Card ₹45k) to eliminate creditors quickly and build psychological momentum.',
    },
    avalanchePlan: {
      strategyName: 'Debt Avalanche (Highest Interest First)',
      payoffMonths: avaMonths,
      debtFreeDate: 'Dec 2029',
      totalInterestPaid: avalancheInterest,
      interestSavedVsStandard: stdInterest - avalancheInterest,
      monthsSavedVsStandard: stdMonths - avaMonths,
      strategyPhilosophy: 'Mathematically optimal: attacks the 38% credit card APR first, saving the absolute maximum in compound interest fees.',
    },
    optimizationInsights: [
      `Deploying an extra prepayment of ₹${extra.toLocaleString()}/mo via Debt Avalanche saves ₹${(stdInterest - avalancheInterest).toLocaleString()} in lifetime interest!`,
      'Immediate Priority: The ICICI credit card accrues 38% APR. Diverting surplus cash flow here yields a guaranteed 38% risk-free return.',
      'Section 80E Benefit: Full interest paid on your Education Loan is tax-deductible under Indian IT Act with zero upper limit.',
    ],
  });
}
