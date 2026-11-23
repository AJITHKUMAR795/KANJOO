import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { code: 'IN', name: 'India', currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹' }, phoneCode: '+91' },
    { code: 'US', name: 'United States', currency: { code: 'USD', name: 'US Dollar', symbol: '$' }, phoneCode: '+1' },
    { code: 'GB', name: 'United Kingdom', currency: { code: 'GBP', name: 'British Pound', symbol: '£' }, phoneCode: '+44' },
    { code: 'JP', name: 'Japan', currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }, phoneCode: '+81' },
    { code: 'DE', name: 'Germany', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, phoneCode: '+49' },
    { code: 'AE', name: 'United Arab Emirates', currency: { code: 'AED', name: 'UAE Dirham', symbol: 'AED' }, phoneCode: '+971' },
  ]);
}
