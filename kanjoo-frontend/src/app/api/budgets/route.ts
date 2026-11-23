import { NextResponse } from 'next/server';

export async function GET() {
  const budgets = [
    {
      id: 1,
      categoryName: 'Housing & Utilities',
      allocatedAmount: 18000.0,
      spentAmount: 14999.0,
      currencyCode: 'INR',
      percentageUsed: 83.3,
    },
    {
      id: 2,
      categoryName: 'Groceries & Provisions',
      allocatedAmount: 10000.0,
      spentAmount: 6200.0,
      currencyCode: 'INR',
      percentageUsed: 62.0,
    },
    {
      id: 3,
      categoryName: 'Transportation & Commute',
      allocatedAmount: 4000.0,
      spentAmount: 2400.0,
      currencyCode: 'INR',
      percentageUsed: 60.0,
    },
    {
      id: 4,
      categoryName: 'Discretionary & Dining',
      allocatedAmount: 5000.0,
      spentAmount: 3100.0,
      currencyCode: 'INR',
      percentageUsed: 62.0,
    },
  ];

  return NextResponse.json(budgets);
}
