import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalScore: 88,
    tier: 'Tier 1: Institutional Elite',
    tierDescription:
      'Your financial discipline, cashflow surplus, and emergency hedges place you in the top tier of financial resilience.',
    disclaimer:
      'The KANJOO Financial Intelligence Score is an autonomous analytical indicator measuring personal cashflow discipline, emergency buffers, and risk resilience. It is not a credit score, creditworthiness rating, or regulated lending assessment.',
    pillars: [
      {
        pillarCode: 'CASHFLOW',
        pillarName: 'Cash Flow Stability',
        score: 14,
        maxScore: 15,
        rating: 'EXCELLENT',
        explanation: 'Monthly cash surplus margin is 39.6% above baseline subsistence costs.',
        actionableAdvice: 'Continue maintaining non-essential discretionary caps.',
      },
      {
        pillarCode: 'SAVINGS',
        pillarName: 'Savings Consistency',
        score: 14,
        maxScore: 15,
        rating: 'DISCIPLINED',
        explanation: 'Consistently hitting monthly savings target of ₹15,000 before spending.',
        actionableAdvice: 'Consider stepping up savings target by 10% on next annual increment.',
      },
      {
        pillarCode: 'DEBT',
        pillarName: 'Debt & Liability Ratio',
        score: 15,
        maxScore: 15,
        rating: 'OPTIMAL',
        explanation: 'Zero high-interest revolving credit card balances or toxic debt obligations.',
        actionableAdvice: 'Maintain debt-to-income ratio below 30% for future mortgage planning.',
      },
      {
        pillarCode: 'EMERGENCY',
        pillarName: 'Emergency Resilience',
        score: 14,
        maxScore: 15,
        rating: 'FORTIFIED',
        explanation: 'Emergency savings cushion covers 4.2 months of essential living expenses (Benchmark: 3-6 months).',
        actionableAdvice: 'Gradually scale buffer toward 6 full months for total recession immunity.',
      },
      {
        pillarCode: 'INSURANCE',
        pillarName: 'Insurance Safety Net',
        score: 13,
        maxScore: 15,
        rating: 'COMPREHENSIVELY_INSURED',
        explanation: 'Active health policy in place; term life covers ~10x annual income.',
        actionableAdvice: 'Consider bumping term life coverage to full 12x–15x rule threshold.',
      },
      {
        pillarCode: 'BUDGET',
        pillarName: 'Budget Discipline',
        score: 14,
        maxScore: 15,
        rating: 'CONSISTENT',
        explanation: 'Category spending allocations maintained without any budget blowouts.',
        actionableAdvice: 'Automate weekly budget review to catch discretionary weekend dining spikes.',
      },
      {
        pillarCode: 'GOALS',
        pillarName: 'Goal & Wealth Compounding',
        score: 14,
        maxScore: 15,
        rating: 'ACCELERATING',
        explanation: 'Active SIP index investments compounding systematically toward long-term goals.',
        actionableAdvice: 'Enable annual 10% SIP step-up to achieve financial independence 4 years earlier.',
      },
    ],
    keyStrengths: [
      'Positive monthly cashflow margin eliminates debt accumulation risk.',
      'Emergency liquid buffer comfortably exceeds the critical 3-month survival threshold.',
      'Health insurance protects core assets against sudden hospitalization costs.',
    ],
    criticalWeaknesses: [
      'Term life coverage is slightly below the institutional 12x annual income benchmark.',
      'Surplus cash sitting idle in low-interest savings can be channeled into index SIPs.',
    ],
    immediateActionPlan: [
      'Secure a pure term life insurance rider to achieve full 12x annual income protection.',
      'Schedule automated salary-day transfers to preserve your ₹15,000 savings commitment.',
      'Review secondary mobile tariffs to eliminate unused high-data recharge bundles.',
    ],
  });
}
