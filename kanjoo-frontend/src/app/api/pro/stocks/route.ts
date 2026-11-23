import { NextResponse } from 'next/server';

export async function GET() {
  const holdings = [
    {
      id: 1,
      tickerSymbol: 'INFY',
      companyName: 'Infosys Limited',
      shares: 100,
      buyPrice: 1450.0,
      currentPrice: 1850.0,
      totalInvested: 145000.0,
      currentValue: 185000.0,
      unrealizedGain: 40000.0,
      returnPercentage: 27.59,
      holdingPeriodDays: 420,
      taxCategory: 'LONG_TERM_CAPITAL_GAIN',
      taxRate: 12.5,
      estimatedTax: 5000.0,
      taxOptimizationTip:
        'LTCG under Section 112A is exempt up to ₹1.25 Lakh per financial year. Your gain of ₹40,000 can be harvested tax-free before March 31.',
    },
    {
      id: 2,
      tickerSymbol: 'TCS',
      companyName: 'Tata Consultancy Services',
      shares: 40,
      buyPrice: 3800.0,
      currentPrice: 4200.0,
      totalInvested: 152000.0,
      currentValue: 168000.0,
      unrealizedGain: 16000.0,
      returnPercentage: 10.53,
      holdingPeriodDays: 180,
      taxCategory: 'SHORT_TERM_CAPITAL_GAIN',
      taxRate: 20.0,
      estimatedTax: 3200.0,
      taxOptimizationTip:
        'Holding for 185 more days converts this to Long-Term Capital Gains, reducing your statutory tax liability from 20% to 12.5%.',
    },
    {
      id: 3,
      tickerSymbol: 'HDFCBANK',
      companyName: 'HDFC Bank Ltd',
      shares: 75,
      buyPrice: 1680.0,
      currentPrice: 1620.0,
      totalInvested: 126000.0,
      currentValue: 121500.0,
      unrealizedGain: -4500.0,
      returnPercentage: -3.57,
      holdingPeriodDays: 95,
      taxCategory: 'SHORT_TERM_CAPITAL_LOSS',
      taxRate: 0.0,
      estimatedTax: 0.0,
      taxOptimizationTip:
        'Tax-loss harvesting: You can realize this ₹4,500 short-term loss before year-end to offset STCG from other trades.',
    },
  ];

  return NextResponse.json({
    holdings,
    summary: {
      totalInvested: 423000.0,
      currentPortfolioValue: 474500.0,
      netUnrealizedGain: 51500.0,
      overallReturnPercentage: 12.17,
      totalEstimatedTaxLiability: 8200.0,
      potentialTaxSavingsViaHarvesting: 4500.0,
    },
  });
}
