package com.kanjoo.service;

import com.kanjoo.entity.Expense;
import com.kanjoo.entity.UserProfile;
import com.kanjoo.repository.ExpenseRepository;
import com.kanjoo.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FinancialHealthScoreEngine {

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;

    public FinancialHealthScoreEngine(UserProfileRepository userProfileRepository,
                                     ExpenseRepository expenseRepository) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
    }

    public record PillarScore(
        String pillarName,
        int score, // out of maxPoints
        int maxPoints,
        String status, // EXCELLENT, GOOD, FAIR, NEEDS_ATTENTION
        String explanation
    ) {}

    public record HealthScoreBreakdown(
        int overallScore,
        String ratingTier, // EXCELLENT, GOOD, MODERATE, CRITICAL
        List<PillarScore> pillars,
        List<String> keyStrengths,
        List<String> actionableRecommendations
    ) {}

    public HealthScoreBreakdown calculateScore(Long userId) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            return new HealthScoreBreakdown(50, "MODERATE", List.of(), List.of(), List.of());
        }

        UserProfile profile = profileOpt.get();
        BigDecimal income = profile.getMonthlyIncome().add(profile.getOtherIncome()).add(profile.getPocketMoney());
        if (income.compareTo(BigDecimal.ZERO) <= 0) {
            income = BigDecimal.valueOf(1000); // baseline fallback
        }

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateRange(userId, startOfMonth, now);

        BigDecimal totalExpenses = monthExpenses.stream()
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PillarScore> pillars = new ArrayList<>();
        List<String> strengths = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        // 1. Budget Discipline (Max 25 pts)
        // Spending <= 70% of income is ideal
        BigDecimal spendRatio = totalExpenses.divide(income, 4, RoundingMode.HALF_UP);
        int budgetScore;
        if (spendRatio.compareTo(BigDecimal.valueOf(0.50)) <= 0) {
            budgetScore = 25;
            strengths.add("Strong cash flow control: spending less than 50% of monthly income.");
        } else if (spendRatio.compareTo(BigDecimal.valueOf(0.70)) <= 0) {
            budgetScore = 20;
            strengths.add("Healthy budget balance: spending is well within standard limits.");
        } else if (spendRatio.compareTo(BigDecimal.valueOf(0.90)) <= 0) {
            budgetScore = 14;
            actions.add("Trim discretionary dining and shopping to keep total outflow below 75% of income.");
        } else {
            budgetScore = 8;
            actions.add("Spending is consuming over 90% of your earnings. Review essential vs non-essential costs.");
        }
        pillars.add(new PillarScore("Budget Discipline", budgetScore, 25, getStatus(budgetScore, 25), "Ratio of monthly expenses relative to verifiable earnings."));

        // 2. Savings Rate (Max 25 pts)
        // Target: 20%+ savings rate
        BigDecimal savingsRate = profile.getMonthlySavingsTarget().divide(income, 4, RoundingMode.HALF_UP);
        int savingsScore;
        if (savingsRate.compareTo(BigDecimal.valueOf(0.20)) >= 0) {
            savingsScore = 25;
            strengths.add("Excellent savings consistency: targeting >= 20% savings each month.");
        } else if (savingsRate.compareTo(BigDecimal.valueOf(0.10)) >= 0) {
            savingsScore = 18;
        } else {
            savingsScore = 10;
            actions.add("Aim to increase automated recurring savings target towards 15-20%.");
        }
        pillars.add(new PillarScore("Savings Discipline", savingsScore, 25, getStatus(savingsScore, 25), "Percentage of monthly income deliberately set aside for future security."));

        // 3. Emergency Cushion (Max 20 pts)
        // Target: 3 to 6 months of expenses
        BigDecimal monthlyBurn = totalExpenses.compareTo(BigDecimal.ZERO) > 0 ? totalExpenses : income.multiply(BigDecimal.valueOf(0.6));
        BigDecimal emergencyMonths = profile.getEmergencySavings().divide(monthlyBurn, 2, RoundingMode.HALF_UP);
        int emergencyScore;
        if (emergencyMonths.compareTo(BigDecimal.valueOf(3.0)) >= 0) {
            emergencyScore = 20;
            strengths.add("Solid emergency fund: over 3 months of baseline expenses covered.");
        } else if (emergencyMonths.compareTo(BigDecimal.valueOf(1.0)) >= 0) {
            emergencyScore = 12;
            actions.add("Build emergency savings until at least 3 full months of living costs are liquid.");
        } else {
            emergencyScore = 5;
            actions.add("Emergency cushion is below 1 month of expenses. Prioritize liquid emergency savings.");
        }
        pillars.add(new PillarScore("Emergency Cushion", emergencyScore, 20, getStatus(emergencyScore, 20), "Months of baseline living expenses held in safe liquid reserves."));

        // 4. Recurring Commitments Burden (Max 15 pts)
        // Telecom + Subscriptions should be < 10% of income
        BigDecimal recurringExpenses = monthExpenses.stream()
            .filter(Expense::isRecurring)
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal recurringRatio = recurringExpenses.divide(income, 4, RoundingMode.HALF_UP);
        int recurringScore;
        if (recurringRatio.compareTo(BigDecimal.valueOf(0.10)) <= 0) {
            recurringScore = 15;
            strengths.add("Low fixed recurring debt: subscriptions and recurring bills under 10% of income.");
        } else if (recurringRatio.compareTo(BigDecimal.valueOf(0.20)) <= 0) {
            recurringScore = 10;
        } else {
            recurringScore = 5;
            actions.add("Recurring commitments consume over 20% of income. Audit auto-debit plans.");
        }
        pillars.add(new PillarScore("Recurring Commitments", recurringScore, 15, getStatus(recurringScore, 15), "Weight of recurring auto-debits, telecoms, and subscriptions against income."));

        // 5. Investment & Long-term Growth (Max 15 pts)
        int investScore;
        if (profile.getExistingInvestments().compareTo(BigDecimal.ZERO) > 0) {
            investScore = 15;
            strengths.add("Active wealth building: established investment portfolio in place.");
        } else {
            investScore = 5;
            actions.add("Start a modest disciplined SIP / index fund contribution once emergency reserves reach 3 months.");
        }
        pillars.add(new PillarScore("Investment Consistency", investScore, 15, getStatus(investScore, 15), "Active participation in long-term compounding instruments."));

        int overall = budgetScore + savingsScore + emergencyScore + recurringScore + investScore;

        String tier;
        if (overall >= 80) tier = "EXCELLENT";
        else if (overall >= 65) tier = "GOOD";
        else if (overall >= 50) tier = "MODERATE";
        else tier = "NEEDS_IMPROVEMENT";

        // Update profile score
        profile.setFinancialHealthScore(overall);
        userProfileRepository.save(profile);

        return new HealthScoreBreakdown(overall, tier, pillars, strengths, actions);
    }

    private String getStatus(int score, int max) {
        double ratio = (double) score / max;
        if (ratio >= 0.8) return "EXCELLENT";
        if (ratio >= 0.6) return "GOOD";
        if (ratio >= 0.4) return "FAIR";
        return "NEEDS_ATTENTION";
    }
}
