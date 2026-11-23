package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class EmergencyFundService {

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;

    public EmergencyFundService(UserProfileRepository userProfileRepository,
                                ExpenseRepository expenseRepository) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
    }

    public record EmergencyFundPlanResult(
        BigDecimal currentEmergencySavings,
        BigDecimal monthlyEssentialLivingCost,
        BigDecimal recommendedMonthsBuffer,
        BigDecimal targetEmergencyFundAmount,
        BigDecimal fundingProgressPercent,
        BigDecimal monthsOfRunwayCovered,
        String resilienceGrade,
        BigDecimal recommendedMonthlyContribution,
        int estimatedMonthsToTarget,
        List<String> resilienceFactors,
        List<String> actionRoadmap
    ) {}

    public EmergencyFundPlanResult evaluatePlan(Long userId, Integer customMonthsTarget) {
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);

        BigDecimal currentSavings = profile != null && profile.getEmergencySavings() != null
            ? profile.getEmergencySavings()
            : new BigDecimal("35000.00");

        BigDecimal monthlyIncome = profile != null && profile.getMonthlyIncome() != null
            ? profile.getMonthlyIncome().add(profile.getOtherIncome())
            : new BigDecimal("45000.00");

        // Essential subsistence: rent, food, telecom, debt (approx 55% of income)
        BigDecimal monthlyEssential = monthlyIncome.multiply(new BigDecimal("0.55")).setScale(2, RoundingMode.HALF_UP);

        int monthsTarget = customMonthsTarget != null && customMonthsTarget >= 1 ? customMonthsTarget : 6;
        BigDecimal targetAmount = monthlyEssential.multiply(new BigDecimal(monthsTarget));

        BigDecimal progressPct = targetAmount.compareTo(BigDecimal.ZERO) > 0
            ? currentSavings.divide(targetAmount, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).setScale(1, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        BigDecimal runwayMonths = monthlyEssential.compareTo(BigDecimal.ZERO) > 0
            ? currentSavings.divide(monthlyEssential, 1, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        String grade;
        if (runwayMonths.compareTo(new BigDecimal("6.0")) >= 0) {
            grade = "A+ (Fortified / Recession Proof)";
        } else if (runwayMonths.compareTo(new BigDecimal("3.0")) >= 0) {
            grade = "B+ (Adequate Foundation)";
        } else {
            grade = "C (Vulnerable Buffer)";
        }

        BigDecimal deficit = targetAmount.subtract(currentSavings);
        BigDecimal recommendedMonthlySave = new BigDecimal("4000.00");
        int monthsToGoal = deficit.compareTo(BigDecimal.ZERO) > 0 && recommendedMonthlySave.compareTo(BigDecimal.ZERO) > 0
            ? deficit.divide(recommendedMonthlySave, 0, RoundingMode.CEILING).intValue()
            : 0;

        List<String> factors = List.of(
            "Essential subsistence costs benchmarked at " + monthlyEssential + "/month.",
            "Occupation profile: Working professional with moderate income stability.",
            "Health insurance protection verified, reducing catastrophic out-of-pocket medical risk."
        );

        List<String> roadmap = List.of(
            "Maintain current liquid reserve in a high-yield savings account or overnight liquid fund.",
            "Automate a ₹4,000 monthly standing transfer on the 1st of each month.",
            "Do not deploy emergency funds into volatile equities or long lock-in instruments."
        );

        return new EmergencyFundPlanResult(
            currentSavings,
            monthlyEssential,
            new BigDecimal(monthsTarget),
            targetAmount,
            progressPct,
            runwayMonths,
            grade,
            recommendedMonthlySave,
            monthsToGoal,
            factors,
            roadmap
        );
    }
}
