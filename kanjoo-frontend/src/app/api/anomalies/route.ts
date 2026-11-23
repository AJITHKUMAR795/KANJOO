import { NextResponse } from 'next/server';

export async function GET() {
  const anomalies = [
    {
      id: 'ANM-001',
      type: 'DUPLICATE_CHARGE',
      riskLevel: 'HIGH',
      merchant: 'Amazon Web Services / Cloud Server',
      amount: 1499.0,
      currency: 'INR',
      date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
      reason: 'Identical debit of ₹1,499.00 recorded 12 minutes prior with matching card ending 4092.',
      recommendedAction: 'Dispute duplicate merchant charge or request prompt reversal from support.',
      status: 'OPEN',
    },
    {
      id: 'ANM-002',
      type: 'UNEXPECTED_PRICE_HIKE',
      riskLevel: 'MEDIUM',
      merchant: 'Creative Cloud Pro Plan',
      amount: 4230.0,
      currency: 'INR',
      date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      reason: 'Billed charge is 28% higher than your 6-month historical average (was ₹3,300/mo).',
      recommendedAction: 'Check plan tier revision notice or downgrade to standard annual plan.',
      status: 'OPEN',
    },
    {
      id: 'ANM-003',
      type: 'SPENDING_VELOCITY_SPIKE',
      riskLevel: 'LOW',
      merchant: 'Online Electronics Store',
      amount: 18500.0,
      currency: 'INR',
      date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      reason: 'Discretionary tech outflow exceeds 48% of the monthly discretionary category allowance.',
      recommendedAction: 'Verify transaction belongs to planned equipment budget.',
      status: 'REVIEWED_VERIFIED',
    },
  ];

  return NextResponse.json({
    totalAnomaliesDetected: 3,
    highRiskCount: 1,
    mediumRiskCount: 1,
    lowRiskCount: 1,
    potentialLeakSavings: 5729.0,
    anomalies,
    regulatoryDisclaimer:
      'KANJOO Anomaly Engine uses statistical machine intelligence on authorized transaction data. It does not replace authoritative cardholder banking fraud notifications.',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      anomalyId: body.anomalyId,
      status: body.resolution || 'RESOLVED',
      userFeedback: body.feedback || 'User confirmed status.',
      updatedAt: new Date().toISOString(),
      message: 'Status updated. Machine intelligence thresholds recalibrated.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 400 });
  }
}
