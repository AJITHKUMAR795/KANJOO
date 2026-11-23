import { NextResponse } from 'next/server';

export async function GET() {
  const expenses = [
    {
      id: 1,
      expenseDate: new Date().toISOString().split('T')[0],
      category: { id: 1, name: 'Rent & Housing' },
      description: 'Apartment Monthly Lease',
      amount: 14000.0,
      originalCurrency: { code: 'INR', symbol: '₹' },
      primaryAmount: 14000.0,
      paymentMethod: 'Bank Transfer (NEFT)',
      isRecurring: true,
    },
    {
      id: 2,
      expenseDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      category: { id: 2, name: 'Groceries' },
      description: 'Supermarket Provisions',
      amount: 6200.0,
      originalCurrency: { code: 'INR', symbol: '₹' },
      primaryAmount: 6200.0,
      paymentMethod: 'UPI',
      isRecurring: false,
    },
    {
      id: 3,
      expenseDate: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
      category: { id: 3, name: 'Broadband & Telecom' },
      description: 'Airtel Fiber 200Mbps',
      amount: 999.0,
      originalCurrency: { code: 'INR', symbol: '₹' },
      primaryAmount: 999.0,
      paymentMethod: 'Auto Debit',
      isRecurring: true,
    },
    {
      id: 4,
      expenseDate: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().split('T')[0],
      category: { id: 4, name: 'Transportation' },
      description: 'Fuel & Metro card recharge',
      amount: 2400.0,
      originalCurrency: { code: 'INR', symbol: '₹' },
      primaryAmount: 2400.0,
      paymentMethod: 'Debit Card',
      isRecurring: false,
    },
    {
      id: 5,
      expenseDate: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString().split('T')[0],
      category: { id: 5, name: 'Health & Pharmacy' },
      description: 'Prescription Vitamins & Healthcare',
      amount: 1250.0,
      originalCurrency: { code: 'INR', symbol: '₹' },
      primaryAmount: 1250.0,
      paymentMethod: 'UPI',
      isRecurring: false,
    },
  ];

  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      id: Date.now(),
      ...body,
      primaryAmount: body.amount,
      message: 'Transaction recorded successfully.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to record transaction' }, { status: 400 });
  }
}
