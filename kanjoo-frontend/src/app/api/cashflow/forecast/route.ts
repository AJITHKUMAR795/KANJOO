import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const horizon = parseInt(searchParams.get('horizon') || '30', 10);

  const startingBalance = 30000;
  const monthlySalary = 48000;
  const dailyBurn = 750;

  const trajectory = [];
  let currentBalance = startingBalance;
  let totalInflow = 0;
  let totalOutflow = 0;
  let lowestBalance = startingBalance;
  let lowestDate = 'Day 1';

  const today = new Date();

  for (let i = 1; i <= horizon; i++) {
    const simDate = new Date();
    simDate.setDate(today.getDate() + i);
    const dayOfMonth = simDate.getDate();
    const dateStr = simDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let inflow = 0;
    let outflow = dailyBurn;
    const events = [];

    // Monthly Salary on 1st
    if (dayOfMonth === 1) {
      inflow += monthlySalary;
      events.push('Primary Salary Inflow (+₹48,000)');
    }

    // Fixed recurring dues
    if (dayOfMonth === 5) {
      outflow += 5000;
      events.push('Nifty 50 Index SIP Auto-Debit (-₹5,000)');
    }
    if (dayOfMonth === 12) {
      outflow += 119;
      events.push('Spotify Music Renewal (-₹119)');
    }
    if (dayOfMonth === 20) {
      outflow += 1691;
      events.push('Star Health Floater Premium (-₹1,691)');
    }

    currentBalance += inflow - outflow;
    totalInflow += inflow;
    totalOutflow += outflow;

    if (currentBalance < lowestBalance) {
      lowestBalance = currentBalance;
      lowestDate = dateStr;
    }

    trajectory.push({
      date: dateStr,
      dayOffset: i,
      projectedBalance: Math.round(currentBalance),
      dailyInflow: Math.round(inflow),
      dailyOutflow: Math.round(outflow),
      keyEvents: events.length > 0 ? events.join(', ') : 'Baseline living expenses',
    });
  }

  const confidence = horizon === 7 ? 96 : horizon === 30 ? 88 : horizon === 60 ? 76 : 65;

  return NextResponse.json({
    horizonDays: horizon,
    startingBalance,
    endingProjectedBalance: Math.round(currentBalance),
    totalProjectedInflow: totalInflow,
    totalProjectedOutflow: Math.round(totalOutflow),
    projectedNetSavings: Math.round(currentBalance - startingBalance),
    lowestProjectedBalance: Math.round(lowestBalance),
    lowestBalanceDate: lowestDate,
    hasShortageRisk: lowestBalance < 0,
    shortageWarningMessage:
      lowestBalance < 0
        ? `Potential liquidity crunch detected on ${lowestDate}. Recommended action: hold discretionary purchases.`
        : 'Cash flow trajectory remains solvent throughout the forecasting horizon.',
    confidencePercent: confidence,
    assumptionsExplanation:
      'Forecast assumes salary credit of ₹48,000 on the 1st of each month, average daily living burn rate of ₹750, and timely fulfillment of active SIP and insurance mandates.',
    trajectory,
    personalizedAdvice: [
      'Cash flow cushion remains positive with a projected ending liquidity of ₹' + Math.round(currentBalance).toLocaleString() + '.',
      'Your upcoming recurring dues cluster between Day 5 and Day 12; ensure your bank balance is funded before Day 4 to avoid ECS bounce charges.',
      'All predictions are calculated using deterministic transaction history and are not guaranteed outcomes.',
    ],
  });
}
