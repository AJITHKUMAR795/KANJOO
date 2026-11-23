import { NextResponse } from 'next/server';

export async function GET() {
  const network = [
    {
      id: 1,
      name: 'Dr. Rajesh Sundaram',
      designation: 'Ex-VP Engineering & Fintech Architect',
      organization: 'Fintech Capital Ventures',
      sector: 'Banking APIs & Regulatory Tech',
      linkedinUrl: 'https://linkedin.com/in/rajesh-sundaram-fintech',
      location: 'Bengaluru / San Francisco',
      expertise: ['Core Banking', 'UPI Architecture', 'Global Remittance'],
      collaborationStatus: 'Available for Advisory',
    },
    {
      id: 2,
      name: 'Ananya Deshmukh',
      designation: 'Chief Compliance Officer & Corporate Attorney',
      organization: 'LexFintech Legal Associates',
      sector: 'Fintech Licensing & RBI/SEBI Regulations',
      linkedinUrl: 'https://linkedin.com/in/ananya-deshmukh-legal',
      location: 'Mumbai, India',
      expertise: ['SEBI RIA Regulations', 'PA/PG Licensing', 'Data Localization'],
      collaborationStatus: 'Available for Retainer',
    },
    {
      id: 3,
      name: 'Karthik Raman',
      designation: 'Partner & Head of Growth',
      organization: 'SaaS Accelerate India',
      sector: 'B2B Distribution & Go-To-Market',
      linkedinUrl: 'https://linkedin.com/in/karthik-raman-growth',
      location: 'Chennai / Hyderabad',
      expertise: ['B2B Enterprise Sales', 'Customer Acquisition', 'Fundraising Prep'],
      collaborationStatus: 'Mentor Network',
    },
  ];

  return NextResponse.json(network);
}
