import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalAuthorizedShares: 10000000,
    currentCapTable: [
      { shareholder: 'Ajith Kumar (Lead Founder & CEO)', shares: 5500000, percentage: 55.0, role: 'FOUNDER' },
      { shareholder: 'Co-Founder & CTO', shares: 2500000, percentage: 25.0, role: 'FOUNDER' },
      { shareholder: 'Employee Stock Option Pool (ESOP)', shares: 1000000, percentage: 10.0, role: 'OPTION_POOL' },
      { shareholder: 'Angel Syndicate & Early Advisors', shares: 1000000, percentage: 10.0, role: 'ANGEL' },
    ],
    vestingStatus: {
      founderVestingSchedule: '4-Year Linear with 1-Year Initial Cliff',
      monthsVested: 14,
      vestedPercent: 29.17,
      acceleratedOnAcquisition: true,
    },
    dilutionSimulator: {
      seedRoundTarget: 500000.0, // $500k
      preMoneyValuation: 3500000.0, // $3.5M
      postMoneyValuation: 4000000.0, // $4.0M
      newInvestorEquityPercent: 12.5,
      postDilutionFounderShare: 48.125,
      postDilutionCoFounderShare: 21.875,
      postDilutionEsopShare: 8.75,
    },
  });
}
