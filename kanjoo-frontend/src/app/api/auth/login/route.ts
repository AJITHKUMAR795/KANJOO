import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || 'ajithkumarelvin6@gmail.com';
    const fullName = email.toLowerCase().includes('ajith') ? 'AJITHKUMAR M' : 'Authorized Fintech User';

    const mockToken = 'kanjoo_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    return NextResponse.json({
      token: mockToken,
      userId: 795,
      email: email,
      fullName: fullName,
      countryCode: 'IN',
      primaryCurrencyCode: 'INR',
      primaryCurrencySymbol: '₹',
      onboardingCompleted: true,
      proMember: true,
      isProMember: true,
      message: 'Authentication successful.',
    });
  } catch {
    return NextResponse.json({ message: 'Authentication failed' }, { status: 400 });
  }
}
