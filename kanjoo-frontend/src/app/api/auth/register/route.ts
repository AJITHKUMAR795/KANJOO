import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = body.fullName || 'Fintech User';
    const email = body.email || 'user@kanjoo.ai';
    const countryCode = (body.countryCode || 'IN').toUpperCase();

    const isIndia = countryCode === 'IN';
    const currencyCode = isIndia ? 'INR' : countryCode === 'US' ? 'USD' : 'EUR';
    const currencySymbol = isIndia ? '₹' : countryCode === 'US' ? '$' : '€';

    const mockToken = 'kanjoo_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    return NextResponse.json({
      token: mockToken,
      userId: 795,
      email: email,
      fullName: fullName,
      countryCode: countryCode,
      primaryCurrencyCode: currencyCode,
      primaryCurrencySymbol: currencySymbol,
      onboardingCompleted: false,
      isProMember: true,
      message: 'Account successfully registered with ISO 4217 currency precision.',
    });
  } catch {
    return NextResponse.json({ message: 'Invalid registration payload' }, { status: 400 });
  }
}
