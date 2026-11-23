import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    usdPrice: 1.0,
    localCurrency: 'INR',
    localPrice: 83.5,
    symbol: '₹',
    formatted: '₹83.50',
    paypalEmail: 'billing@kanjoo.ai',
    paypalPlanId: 'PLAN-KANJOO-PRO-1USD',
  });
}
