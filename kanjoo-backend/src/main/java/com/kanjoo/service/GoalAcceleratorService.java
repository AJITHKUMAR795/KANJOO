package com.kanjoo.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class GoalAcceleratorService {

    public Map<String, Object> calculateGoalProjection(
            String goalName,
            BigDecimal targetAmount,
            BigDecimal currentAmount,
            LocalDate targetDate,
            BigDecimal currentMonthlyContribution,
            String priority,
            String category,
            BigDecimal monthlySurplus
    ) {
        BigDecimal remaining = targetAmount.subtract(currentAmount).max(BigDecimal.ZERO);
        long monthsRemaining = ChronoUnit.MONTHS.between(LocalDate.now(), targetDate);
        if (monthsRemaining <= 0) {
            monthsRemaining = 1;
        }

        BigDecimal requiredMonthlySavings = remaining.divide(BigDecimal.valueOf(monthsRemaining), 2, RoundingMode.HALF_UP);

        BigDecimal completionPercent = BigDecimal.ZERO;
        if (targetAmount.compareTo(BigDecimal.ZERO) > 0) {
            completionPercent = currentAmount.divide(targetAmount, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .min(BigDecimal.valueOf(100));
        }

        LocalDate estimatedCompletionDate = targetDate;
        if (currentMonthlyContribution != null && currentMonthlyContribution.compareTo(BigDecimal.ZERO) > 0) {
            long estMonths = remaining.divide(currentMonthlyContribution, 0, RoundingMode.CEILING).longValue();
            estimatedCompletionDate = LocalDate.now().plusMonths(estMonths);
        }

        boolean onTrack = currentMonthlyContribution != null && currentMonthlyContribution.compareTo(requiredMonthlySavings) >= 0;

        // Trade-off / Surplus analysis
        BigDecimal surplusImpactPercent = BigDecimal.ZERO;
        if (monthlySurplus != null && monthlySurplus.compareTo(BigDecimal.ZERO) > 0) {
            surplusImpactPercent = requiredMonthlySavings.divide(monthlySurplus, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        Map<String, Object> goal = new HashMap<>();
        goal.put("goalName", goalName);
        goal.put("category", category);
        goal.put("priority", priority);
        goal.put("targetAmount", targetAmount);
        goal.put("currentAmount", currentAmount);
        goal.put("remainingAmount", remaining);
        goal.put("targetDate", targetDate.toString());
        goal.put("monthsRemaining", monthsRemaining);
        goal.put("requiredMonthlySavings", requiredMonthlySavings);
        goal.put("currentMonthlyContribution", currentMonthlyContribution != null ? currentMonthlyContribution : BigDecimal.ZERO);
        goal.put("completionPercentage", completionPercent.setScale(1, RoundingMode.HALF_UP));
        goal.put("estimatedCompletionDate", estimatedCompletionDate.toString());
        goal.put("onTrack", onTrack);
        goal.put("surplusImpactPercent", surplusImpactPercent.setScale(1, RoundingMode.HALF_UP));

        return goal;
    }

    public Map<String, Object> getGoalsSummary(Long userId) {
        // Institutional baseline goals for verified user
        BigDecimal monthlySurplus = new BigDecimal("19047.00");

        List<Map<String, Object>> goals = new ArrayList<>();
        goals.add(calculateGoalProjection(
                "Emergency Safety Fund (6 Months)",
                new BigDecimal("150000.00"),
                new BigDecimal("85000.00"),
                LocalDate.now().plusMonths(8),
                new BigDecimal("8500.00"),
                "HIGH",
                "EMERGENCY",
                monthlySurplus
        ));

        goals.add(calculateGoalProjection(
                "Professional AI Workstation Laptop",
                new BigDecimal("120000.00"),
                new BigDecimal("40000.00"),
                LocalDate.now().plusMonths(10),
                new BigDecimal("5000.00"),
                "MEDIUM",
                "TECH",
                monthlySurplus
        ));

        goals.add(calculateGoalProjection(
                "Down Payment on Apartment",
                new BigDecimal("1000000.00"),
                new BigDecimal("180000.00"),
                LocalDate.now().plusMonths(36),
                new BigDecimal("12000.00"),
                "HIGH",
                "HOUSE",
                monthlySurplus
        ));

        BigDecimal totalTarget = BigDecimal.ZERO;
        BigDecimal totalSaved = BigDecimal.ZERO;
        BigDecimal totalRequiredMonthly = BigDecimal.ZERO;

        for (Map<String, Object> g : goals) {
            totalTarget = totalTarget.add((BigDecimal) g.get("targetAmount"));
            totalSaved = totalSaved.add((BigDecimal) g.get("currentAmount"));
            totalRequiredMonthly = totalRequiredMonthly.add((BigDecimal) g.get("requiredMonthlySavings"));
        }

        BigDecimal overallCompletion = BigDecimal.ZERO;
        if (totalTarget.compareTo(BigDecimal.ZERO) > 0) {
            overallCompletion = totalSaved.divide(totalTarget, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("goals", goals);
        result.put("totalTargetAmount", totalTarget);
        result.put("totalSavedAmount", totalSaved);
        result.put("totalRequiredMonthlySavings", totalRequiredMonthly);
        result.put("monthlySurplusAvailable", monthlySurplus);
        result.put("overallCompletionPercentage", overallCompletion.setScale(1, RoundingMode.HALF_UP));
        result.put("isSurplusSufficient", monthlySurplus.compareTo(totalRequiredMonthly) >= 0);
        result.put("aiRecommendation",
                monthlySurplus.compareTo(totalRequiredMonthly) >= 0
                        ? "Your monthly surplus of ₹" + monthlySurplus + " comfortably covers the combined required monthly savings of ₹" + totalRequiredMonthly + ". All goals remain on schedule."
                        : "Combined required monthly savings (₹" + totalRequiredMonthly + ") exceed monthly surplus (₹" + monthlySurplus + "). Recommend prioritizing the Emergency Fund and extending the Tech Workstation target date by 3 months."
        );

        return result;
    }
}
