import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date();
  const formatOffset = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  return NextResponse.json({
    totalDueNext30Days: 24789.0,
    upcomingObligations: [
      {
        id: 'OBL-01',
        title: 'Apartment Rent & Maintenance',
        amount: 14000.0,
        dueDate: formatOffset(7),
        category: 'HOUSING',
        priority: 'CRITICAL',
        status: 'SCHEDULED',
      },
      {
        id: 'OBL-02',
        title: 'High-Speed Fiber Broadband Bill',
        amount: 999.0,
        dueDate: formatOffset(11),
        category: 'UTILITIES',
        priority: 'STANDARD',
        status: 'AUTO_DEBIT',
      },
      {
        id: 'OBL-03',
        title: 'Credit Card Statement Settlement',
        amount: 7290.0,
        dueDate: formatOffset(18),
        category: 'DEBT_LIABILITY',
        priority: 'HIGH',
        status: 'PENDING_APPROVAL',
      },
      {
        id: 'OBL-04',
        title: 'Cloud Infrastructure Retainer',
        amount: 2500.0,
        dueDate: formatOffset(25),
        category: 'BUSINESS_TECH',
        priority: 'STANDARD',
        status: 'SCHEDULED',
      },
    ],
    liquiditySurplusAfterDues: 23211.0,
    cashflowRecommendation:
      'All upcoming obligations totaling ₹24,789.00 are comfortably covered by your current liquid account reserves.',
  });
}
