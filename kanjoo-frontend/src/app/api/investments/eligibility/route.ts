import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    isEligible: true,
    readinessScore: 85,
    emergencyFundReady: true,
    emergencyBufferMonths: 4.2,
    positiveSurplus: true,
    monthlySurplus: 19047.0,
    insuranceProtected: true,
    suggestedSipMonthly: 7500.0,
    recommendedEquityPercent: 70,
    recommendedDebtPercent: 20,
    recommendedGoldPercent: 10,
    allocationAdvice: 'Moderate Risk (Age 23)',
    guidanceNote: 'Your emergency buffer exceeds the 3-month threshold and you maintain an active health insurance safety net. You are fully eligible to start disciplined monthly compounding.',
  });
}
