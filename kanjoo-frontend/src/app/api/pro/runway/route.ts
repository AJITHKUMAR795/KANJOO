import { NextResponse } from 'next/server';

export async function GET() {
  const cashOnHand = 1250000.0;
  const monthlyRevenue = 150000.0;
  const monthlyGrossBurn = 320000.0;
  const netBurn = monthlyGrossBurn - monthlyRevenue; // 170,000/mo
  const runwayMonths = (cashOnHand / netBurn).toFixed(1); // 7.4 months
  const breakEvenRevenueTarget = monthlyGrossBurn; // 320,000/mo

  return NextResponse.json({
    cashOnHand,
    monthlyRevenue,
    monthlyGrossBurn,
    netMonthlyBurn: netBurn,
    runwayMonths: parseFloat(runwayMonths),
    breakEvenRevenueTarget,
    burnBreakdown: [
      { category: 'Engineering & Product Payroll', amount: 180000.0, percent: 56.25 },
      { category: 'Cloud Infrastructure & AI API Tokens', amount: 65000.0, percent: 20.31 },
      { category: 'Office, Co-working & SaaS Tooling', amount: 45000.0, percent: 14.06 },
      { category: 'Legal, Compliance & Banking Reserve', amount: 30000.0, percent: 9.38 },
    ],
    growthScenario: {
      zeroGrowthRunway: `${runwayMonths} Months`,
      fifteenPercentMoMGrowthRunway: '12.8 Months (Reaches Cashflow Positive in Month 9)',
    },
    recommendation:
      'Current cash runway is 7.4 months at net burn ₹1.70L/month. Initiate your Seed funding discussions or reach ₹3.20L/mo monthly revenue within 4 months to avoid dilutive bridge terms.',
  });
}
