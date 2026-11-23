import { NextResponse } from 'next/server';

export async function GET() {
  const subscriptions = [
    {
      id: 1,
      serviceName: 'Airtel Fiber 200Mbps',
      monthlyCost: 999.0,
      billingCycle: 'MONTHLY',
      renewalDate: '2026-12-05',
      category: 'BROADBAND',
      status: 'ACTIVE_OPTIMIZED',
      cancellationUrl: 'https://airtel.in',
    },
    {
      id: 2,
      serviceName: 'Cloud Storage Pro (100GB)',
      monthlyCost: 835.0,
      billingCycle: 'MONTHLY',
      renewalDate: '2026-12-01',
      category: 'CLOUD_SOFTWARE',
      status: 'RECOMMENDED_CANCEL',
      cancellationUrl: 'https://one.google.com',
    },
    {
      id: 3,
      serviceName: 'Spotify Individual Premium',
      monthlyCost: 119.0,
      billingCycle: 'MONTHLY',
      renewalDate: '2026-12-14',
      category: 'ENTERTAINMENT',
      status: 'STUDENT_DISCOUNT_ELIGIBLE',
      cancellationUrl: 'https://spotify.com',
    },
  ];

  return NextResponse.json(subscriptions);
}
