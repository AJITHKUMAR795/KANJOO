import { NextResponse } from 'next/server';

export async function GET() {
  const targetDate1 = new Date();
  targetDate1.setMonth(targetDate1.getMonth() + 8);

  const targetDate2 = new Date();
  targetDate2.setMonth(targetDate2.getMonth() + 10);

  const targetDate3 = new Date();
  targetDate3.setMonth(targetDate3.getMonth() + 36);

  const goals = [
    {
      goalName: 'Emergency Safety Fund (6 Months)',
      category: 'EMERGENCY',
      priority: 'HIGH',
      targetAmount: 150000.0,
      currentAmount: 85000.0,
      remainingAmount: 65000.0,
      targetDate: targetDate1.toISOString().split('T')[0],
      monthsRemaining: 8,
      requiredMonthlySavings: 8125.0,
      currentMonthlyContribution: 8500.0,
      completionPercentage: 56.7,
      estimatedCompletionDate: targetDate1.toISOString().split('T')[0],
      onTrack: true,
      surplusImpactPercent: 42.6,
    },
    {
      goalName: 'Professional AI Workstation Laptop',
      category: 'TECH',
      priority: 'MEDIUM',
      targetAmount: 120000.0,
      currentAmount: 40000.0,
      remainingAmount: 80000.0,
      targetDate: targetDate2.toISOString().split('T')[0],
      monthsRemaining: 10,
      requiredMonthlySavings: 8000.0,
      currentMonthlyContribution: 5000.0,
      completionPercentage: 33.3,
      estimatedCompletionDate: new Date(Date.now() + 16 * 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      onTrack: false,
      surplusImpactPercent: 41.9,
    },
    {
      goalName: 'Down Payment on Apartment',
      category: 'HOUSE',
      priority: 'HIGH',
      targetAmount: 1000000.0,
      currentAmount: 180000.0,
      remainingAmount: 820000.0,
      targetDate: targetDate3.toISOString().split('T')[0],
      monthsRemaining: 36,
      requiredMonthlySavings: 22777.78,
      currentMonthlyContribution: 12000.0,
      completionPercentage: 18.0,
      estimatedCompletionDate: new Date(Date.now() + 68 * 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      onTrack: false,
      surplusImpactPercent: 119.5,
    },
  ];

  const totalTargetAmount = 1270000.0;
  const totalSavedAmount = 305000.0;
  const totalRequiredMonthlySavings = 38902.78;
  const monthlySurplusAvailable = 19047.0;

  return NextResponse.json({
    goals,
    totalTargetAmount,
    totalSavedAmount,
    totalRequiredMonthlySavings,
    monthlySurplusAvailable,
    overallCompletionPercentage: 24.0,
    isSurplusSufficient: false,
    aiRecommendation:
      'Combined required monthly savings (₹38,903) exceed your uncommitted monthly surplus (₹19,047). KANJOO recommends keeping the Emergency Fund fully funded at ₹8,500/mo, deferring the Tech Laptop by 4 months, and focusing additional windfalls toward the House Down Payment.',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const target = parseFloat(body.targetAmount || 100000);
    const current = parseFloat(body.currentAmount || 0);
    const remaining = Math.max(0, target - current);
    const monthsRemaining = parseInt(body.monthsRemaining || 12);
    const requiredMonthly = (remaining / monthsRemaining).toFixed(2);
    const completionPercent = ((current / target) * 100).toFixed(1);

    return NextResponse.json({
      goalName: body.goalName || 'Custom Goal',
      targetAmount: target,
      currentAmount: current,
      remainingAmount: remaining,
      requiredMonthlySavings: parseFloat(requiredMonthly),
      completionPercentage: parseFloat(completionPercent),
      onTrack: true,
      message: 'Goal successfully created and integrated into budget simulation.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process goal' }, { status: 400 });
  }
}
