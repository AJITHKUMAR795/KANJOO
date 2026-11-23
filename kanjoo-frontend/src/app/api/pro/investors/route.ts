import { NextResponse } from 'next/server';

export async function GET() {
  const investors = [
    {
      id: 1,
      name: 'Peak XV Partners (formerly Sequoia India)',
      type: 'VENTURE_CAPITAL',
      ticketSize: '$500K - $10M',
      focusSectors: ['Fintech', 'AI / ML', 'Enterprise SaaS', 'Consumer Tech'],
      stage: 'Seed / Series A',
      portfolioHighlights: ['Pine Labs', 'Razorpay', 'CRED', 'Groww'],
      contactEmail: 'dealflow@peakxv.com',
      linkedinUrl: 'https://www.linkedin.com/company/peak-xv-partners',
      websiteUrl: 'https://www.peakxv.com',
      verified: true,
    },
    {
      id: 2,
      name: 'Blume Ventures',
      type: 'EARLY_STAGE_VC',
      ticketSize: '$250K - $2M',
      focusSectors: ['Fintech', 'DeepTech', 'B2B Software', 'Emerging Tech'],
      stage: 'Pre-Seed / Seed',
      portfolioHighlights: ['Slice', 'Exotel', 'Instamojo', 'Unacademy'],
      contactEmail: 'founders@blume.vc',
      linkedinUrl: 'https://www.linkedin.com/company/blume-ventures',
      websiteUrl: 'https://blume.vc',
      verified: true,
    },
    {
      id: 3,
      name: 'Indian Angel Network (IAN)',
      type: 'ANGEL_SYNDICATE',
      ticketSize: '$50K - $500K',
      focusSectors: ['Financial Services', 'AI Applications', 'Consumer'],
      stage: 'Idea / Pre-Seed',
      portfolioHighlights: ['Box8', 'FarEye', 'Druva'],
      contactEmail: 'pitch@indianangelnetwork.com',
      linkedinUrl: 'https://www.linkedin.com/company/indian-angel-network',
      websiteUrl: 'https://www.indianangelnetwork.com',
      verified: true,
    },
    {
      id: 4,
      name: 'Y Combinator (YC Global)',
      type: 'ACCELERATOR',
      ticketSize: '$500K standard deal ($125k for 7% + $375k MFN SAFE)',
      focusSectors: ['Fintech', 'Applied AI', 'Global Software'],
      stage: 'Early / Prototype',
      portfolioHighlights: ['Stripe', 'Airbnb', 'Coinbase', 'Brex'],
      contactEmail: 'apply@ycombinator.com',
      linkedinUrl: 'https://www.linkedin.com/company/y-combinator',
      websiteUrl: 'https://www.ycombinator.com',
      verified: true,
    },
  ];

  return NextResponse.json(investors);
}
