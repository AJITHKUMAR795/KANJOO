import { NextResponse } from 'next/server';

const DEFAULT_PROFILE = {
  country: {
    code: 'IN',
    name: 'India',
    currency: {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
    },
  },
  primaryCurrency: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
  },
  age: 24,
  stateRegion: 'Tamil Nadu',
  city: 'Chennai',
  occupation: 'Software Engineer & Founder',
  studentOrProfessional: 'PROFESSIONAL',
  educationLevel: 'BACHELORS',
  preferredLanguage: 'en',
  monthlyIncome: 48000.0,
  pocketMoney: 0.0,
  otherIncome: 3000.0,
  monthlySavingsTarget: 15000.0,
  existingInvestments: 50000.0,
  emergencySavings: 85000.0,
  housingType: 'RENTED',
  riskTolerance: 'MODERATE',
  hasWifi: true,
  numSims: 2,
};

export async function GET() {
  return NextResponse.json(DEFAULT_PROFILE);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Financial profile and regional settings updated successfully.',
      profile: {
        ...DEFAULT_PROFILE,
        ...body,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
  }
}
