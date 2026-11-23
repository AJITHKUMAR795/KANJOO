import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const monthsTarget = parseInt(searchParams.get('monthsTarget') || '6', 10);

  const currentSavings = 35000;
  const monthlyEssential = 24750;
  const targetAmount = monthlyEssential * monthsTarget;
  const progressPct = Math.round((currentSavings / targetAmount) * 100);
  const runwayMonths = (currentSavings / monthlyEssential).toFixed(1);

  return NextResponse.json({
    currentEmergencySavings: currentSavings,
    monthlyEssentialLivingCost: monthlyEssential,
    recommendedMonthsBuffer: monthsTarget,
    targetEmergencyFundAmount: targetAmount,
    fundingProgressPercent: progressPct,
    monthsOfRunwayCovered: parseFloat(runwayMonths),
    resilienceGrade: parseFloat(runwayMonths) >= 6 ? 'A+ (Recession Proof)' : parseFloat(runwayMonths) >= 3 ? 'B+ (Adequate Cushion)' : 'C (Vulnerable Buffer)',
    recommendedMonthlyContribution: 4000,
    estimatedMonthsToTarget: Math.ceil((targetAmount - currentSavings) / 4000),
    resilienceFactors: [
      'Baseline subsistence living floor benchmarked at ₹24,750 / month.',
      'Stable primary professional salary provides baseline cashflow security.',
      'Active family health insurance in place, mitigating large emergency hospital liabilities.'
    ],
    actionRoadmap: [
      'Store your emergency reserve across a high-yield liquid savings account and instant-redemption liquid funds.',
      'Automate ₹4,000 monthly standing instruction on salary day until the target is fully funded.',
      'Do not expose emergency reserves to equity market fluctuations or lock-in fixed deposits.'
    ]
  });
}
