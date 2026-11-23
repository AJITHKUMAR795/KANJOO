import { NextResponse } from 'next/server';

export async function GET() {
  const financialOverview = {
    monthlyIncome: 48000.0,
    totalExpenses: 28953.0,
    monthlySavingsTarget: 15000.0,
    netSavings: 19047.0,
    savingsRate: 39.68,
  };

  const healthScore = {
    score: 84,
    grade: 'A',
    tier: 'INSTITUTIONAL_RESILIENT',
    assessment: 'Excellent liquidity buffer and high savings discipline.',
  };

  const leakSummary = {
    totalLeakAmount: 14200.0,
    activeLeaksDetected: 3,
  };

  const user = {
    fullName: 'AJITHKUMAR M',
    country: 'India',
    primaryCurrency: 'INR',
    currencySymbol: '₹',
  };

  const recentExpenses = [
    {
      id: 1,
      expenseDate: new Date().toISOString().split('T')[0],
      category: { name: 'Rent & Utilities' },
      description: 'Apartment monthly lease & society dues',
      amount: 14000.0,
      originalCurrency: { code: 'INR' },
      primaryAmount: 14000.0,
    },
    {
      id: 2,
      expenseDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      category: { name: 'Groceries' },
      description: 'Monthly grocery supply run',
      amount: 6200.0,
      originalCurrency: { code: 'INR' },
      primaryAmount: 6200.0,
    },
    {
      id: 3,
      expenseDate: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
      category: { name: 'Telecom & Broadband' },
      description: 'Airtel Fiber Gigabit connection',
      amount: 999.0,
      originalCurrency: { code: 'INR' },
      primaryAmount: 999.0,
    },
  ];

  return NextResponse.json({
    financialOverview,
    healthScore,
    leakSummary,
    user,
    recentExpenses,
  });
}
