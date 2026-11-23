import { NextResponse } from 'next/server';

export async function GET() {
  const response = {
    familyGroupId: 'FAM-795-IN',
    groupName: 'Kumar Household Trust',
    currencyCode: 'INR',
    currencySymbol: '₹',
    currentUserRole: 'ADMIN_HEAD',
    members: [
      {
        userId: 1,
        name: 'Ajith Kumar (You)',
        role: 'HEAD',
        monthlyContribution: 25000.0,
        sharePrivateExpenses: false,
        status: 'ACTIVE',
        avatar: 'AK',
      },
      {
        userId: 202,
        name: 'Priya K. (Spouse)',
        role: 'CO_CONTRIBUTOR',
        monthlyContribution: 20000.0,
        sharePrivateExpenses: false,
        status: 'ACTIVE',
        avatar: 'PK',
      },
      {
        userId: 203,
        name: 'Parent Senior (Dependent / Viewer)',
        role: 'VIEWER',
        monthlyContribution: 0.0,
        sharePrivateExpenses: false,
        status: 'ACTIVE',
        avatar: 'PS',
      },
    ],
    sharedBudgets: [
      {
        category: 'Groceries & Household Essentials',
        allocated: 16000.0,
        spent: 12400.0,
        percentage: 77.5,
      },
      {
        category: 'Apartment Rent & Society Maintenance',
        allocated: 18000.0,
        spent: 14000.0,
        percentage: 77.8,
      },
      {
        category: 'Utilities (Electricity, High-Speed Broadband, Gas)',
        allocated: 6000.0,
        spent: 3450.0,
        percentage: 57.5,
      },
      {
        category: 'Family Health & Medical Reserve',
        allocated: 5000.0,
        spent: 0.0,
        percentage: 0.0,
      },
    ],
    totalSharedBudget: 45000.0,
    totalSharedSpent: 29850.0,
    sharedRemaining: 15150.0,
    familyGoals: [
      {
        title: 'Annual Family Vacation (Nilgiris / Himachal)',
        targetAmount: 80000.0,
        savedAmount: 52000.0,
        targetDate: '2027-03-31',
        progressPercent: 65.0,
      },
      {
        title: 'Family Health Emergency Liquidity Cushion',
        targetAmount: 200000.0,
        savedAmount: 140000.0,
        targetDate: '2027-05-31',
        progressPercent: 70.0,
      },
    ],
    privacyPolicy: {
      privateTransactionsHidden: true,
      sharedExpenseAuditing: 'ENABLED',
      approvalRequiredOver: 5000.0,
      guarantee: 'Zero private transaction leakage. Only allocated pool contributions are visible.',
    },
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'INVITATION_SENT',
      email: body.email || '',
      role: body.role || 'VIEWER',
      message: 'Secure invite link generated. Member will only see shared household pool upon acceptance.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to dispatch invite' }, { status: 400 });
  }
}
