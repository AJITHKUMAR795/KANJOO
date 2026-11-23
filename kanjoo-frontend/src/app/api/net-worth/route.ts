import { NextResponse } from 'next/server';

export async function GET() {
  const assets = [
    { id: 'A-1', category: 'LIQUID_CASH', name: 'HDFC Salary Account', value: 35000, institution: 'HDFC Bank', lastUpdated: 'Today' },
    { id: 'A-2', category: 'FIXED_DEPOSIT', name: 'SBI Emergency FD', value: 50000, institution: 'State Bank of India', lastUpdated: 'Nov 2026' },
    { id: 'A-3', category: 'MUTUAL_FUNDS', name: 'Nifty 50 Index Mutual Fund', value: 39800, institution: 'Zerodha Coin', lastUpdated: 'Live NAV' },
    { id: 'A-4', category: 'EQUITIES', name: 'Bluechip Equity Stock Holdings', value: 65000, institution: 'Zerodha Kite', lastUpdated: 'Market Close' },
    { id: 'A-5', category: 'GOLD', name: 'Sovereign Gold Bonds (SGB)', value: 25000, institution: 'RBI / Demat', lastUpdated: 'Live Spot' },
  ];

  const liabilities = [
    { id: 'L-1', category: 'EDUCATION_LOAN', name: 'HDFC Credila Higher Education Loan', balance: 320000, interestRatePercent: 9.5, lender: 'HDFC Credila' },
    { id: 'L-2', category: 'VEHICLE_LOAN', name: 'Bajaj Two-Wheeler Vehicle Loan', balance: 75000, interestRatePercent: 12.5, lender: 'Bajaj Auto Finance' },
    { id: 'L-3', category: 'CREDIT_CARD', name: 'ICICI Platinum Credit Card', balance: 45000, interestRatePercent: 38.0, lender: 'ICICI Bank' },
  ];

  const totalAssets = 214800;
  const totalLiabilities = 440000;
  const netWorth = totalAssets - totalLiabilities;

  const history = [
    { monthLabel: 'Jun 2026', totalAssets: 170000, totalLiabilities: 470000, netWorth: -300000 },
    { monthLabel: 'Jul 2026', totalAssets: 182000, totalLiabilities: 464000, netWorth: -282000 },
    { monthLabel: 'Aug 2026', totalAssets: 193000, totalLiabilities: 458000, netWorth: -265000 },
    { monthLabel: 'Sep 2026', totalAssets: 201000, totalLiabilities: 452000, netWorth: -251000 },
    { monthLabel: 'Oct 2026', totalAssets: 208000, totalLiabilities: 446000, netWorth: -238000 },
    { monthLabel: 'Nov 2026', totalAssets: 214800, totalLiabilities: 440000, netWorth: -225200 },
  ];

  return NextResponse.json({
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlyChangeAmount: 12800,
    monthlyChangePercent: 5.38,
    assets,
    liabilities,
    assetAllocationPercents: {
      'Liquid Cash & Savings': 16.3,
      'Emergency Fixed Deposits': 23.3,
      'Index Mutual Funds': 18.5,
      'Equities & Stocks': 30.3,
      'Gold Hedges': 11.6,
    },
    liabilityDistributionPercents: {
      'Education Loan': 72.7,
      'Vehicle Loan': 17.0,
      'Credit Card': 10.3,
    },
    history,
    wealthInsights: [
      'Net Worth expanded by +₹12,800 this month through a combination of debt principal paydown and equity compounding.',
      'Healthy Productive Asset Allocation: 60.4% in wealth-compounding growth assets (Stocks, Mutual Funds, SGB).',
      'Accelerating payoff of the ₹45,000 credit card debt will flip your net worth trajectory into positive territory much faster.',
    ],
  });
}
