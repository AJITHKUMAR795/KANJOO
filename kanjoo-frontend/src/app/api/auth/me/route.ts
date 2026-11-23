import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    userId: 795,
    email: 'ajithkumarelvin6@gmail.com',
    fullName: 'AJITHKUMAR M',
    countryCode: 'IN',
    primaryCurrencyCode: 'INR',
    primaryCurrencySymbol: '₹',
    onboardingCompleted: true,
    isProMember: true,
  });
}
