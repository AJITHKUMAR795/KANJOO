package com.kanjoo.service;

import com.kanjoo.entity.Currency;
import com.kanjoo.entity.UserProfile;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvestmentEngine {

    private static final MathContext MC = new MathContext(12, RoundingMode.HALF_UP);

    public record SipProjectionYear(
        int year,
        BigDecimal totalInvested,
        BigDecimal estimatedWealth,
        BigDecimal wealthGained
    ) {}

    public record SipCalculationResult(
        BigDecimal monthlyInvestment,
        BigDecimal expectedAnnualReturnPercent,
        int durationYears,
        BigDecimal totalInvested,
        BigDecimal estimatedFutureValue,
        BigDecimal totalEstimatedReturns,
        List<SipProjectionYear> yearlyBreakdown,
        String disclaimer
    ) {}

    public record InvestmentEligibilityResult(
        boolean eligible,
        int readinessScore,
        String status,
        BigDecimal emergencyFundMonths,
        BigDecimal monthlyCashflowSurplus,
        BigDecimal suggestedMonthlySip,
        int recommendedEquityPercent,
        int recommendedDebtPercent,
        int recommendedGoldPercent,
        List<String> passedChecklist,
        List<String> unblockingRoadmap,
        String personalizedInstruction
    ) {}

    public SipCalculationResult calculateSip(BigDecimal monthlyInvestment,
                                            BigDecimal annualReturnRatePercent,
                                            int durationYears,
                                            Currency currency) {
        if (monthlyInvestment == null || monthlyInvestment.compareTo(BigDecimal.ZERO) <= 0) {
            monthlyInvestment = BigDecimal.valueOf(100);
        }
        if (annualReturnRatePercent == null || annualReturnRatePercent.compareTo(BigDecimal.ZERO) <= 0) {
            annualReturnRatePercent = BigDecimal.valueOf(12.0);
        }
        if (durationYears <= 0) {
            durationYears = 10;
        }

        // Monthly interest rate: i = (r / 100) / 12
        BigDecimal r = annualReturnRatePercent.divide(BigDecimal.valueOf(100), MC);
        BigDecimal i = r.divide(BigDecimal.valueOf(12), MC);

        List<SipProjectionYear> yearly = new ArrayList<>();

        for (int y = 1; y <= durationYears; y++) {
            int months = y * 12;
            BigDecimal invested = monthlyInvestment.multiply(BigDecimal.valueOf(months)).setScale(currency.getDecimalDigits(), RoundingMode.HALF_UP);

            // A = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
            BigDecimal onePlusI = BigDecimal.ONE.add(i);
            BigDecimal onePlusIPowN = onePlusI.pow(months, MC);
            BigDecimal numerator = onePlusIPowN.subtract(BigDecimal.ONE);
            BigDecimal term = numerator.divide(i, MC);
            BigDecimal futureVal = monthlyInvestment.multiply(term).multiply(onePlusI).setScale(currency.getDecimalDigits(), RoundingMode.HALF_UP);

            BigDecimal wealthGained = futureVal.subtract(invested).setScale(currency.getDecimalDigits(), RoundingMode.HALF_UP);

            yearly.add(new SipProjectionYear(y, invested, futureVal, wealthGained));
        }

        SipProjectionYear finalYear = yearly.get(yearly.size() - 1);

        String disclaimer = "Projections are based on historical compounding formulas and do not account for taxes or market inflation. Past performance does not guarantee future returns.";

        return new SipCalculationResult(
            monthlyInvestment,
            annualReturnRatePercent,
            durationYears,
            finalYear.totalInvested(),
            finalYear.estimatedWealth(),
            finalYear.wealthGained(),
            yearly,
            disclaimer
        );
    }

    public InvestmentEligibilityResult evaluateInvestmentEligibility(UserProfile profile,
                                                                    BigDecimal monthExpenses,
                                                                    boolean hasHealthInsurance) {
        if (profile == null) {
            return new InvestmentEligibilityResult(
                false, 20, "PROFILE_INCOMPLETE", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                60, 30, 10, List.of(), List.of("Complete onboarding profile"), "Complete profile to unlock analysis."
            );
        }

        BigDecimal burnRate = monthExpenses.compareTo(BigDecimal.ZERO) > 0 ? monthExpenses : BigDecimal.valueOf(1000);
        BigDecimal emergencySavings = profile.getEmergencySavings() != null ? profile.getEmergencySavings() : BigDecimal.ZERO;
        BigDecimal emergencyMonths = emergencySavings.divide(burnRate, 1, RoundingMode.HALF_UP);

        BigDecimal income = profile.getMonthlyIncome().add(profile.getOtherIncome()).add(profile.getPocketMoney());
        BigDecimal surplus = income.subtract(monthExpenses);
        if (surplus.compareTo(BigDecimal.ZERO) < 0) surplus = BigDecimal.ZERO;

        List<String> passed = new ArrayList<>();
        List<String> roadmap = new ArrayList<>();

        int score = 0;
        if (emergencyMonths.compareTo(BigDecimal.valueOf(3)) >= 0) {
            passed.add(String.format("Safe Emergency Buffer: %s months of living expenses secured in liquid reserves.", emergencyMonths));
            score += 40;
        } else {
            roadmap.add(String.format("Emergency Cushion Under 3 Months: You currently have %s months. Stash 3-6 months in liquid deposits before exposing capital to market volatility.", emergencyMonths));
        }

        if (surplus.compareTo(BigDecimal.valueOf(100)) > 0) {
            passed.add(String.format("Positive Cashflow Surplus: Consistent monthly buffer of %s available.", surplus.setScale(0, RoundingMode.HALF_UP)));
            score += 35;
        } else {
            roadmap.add("Zero/Low Disposable Surplus: Eliminate money leaks or reduce discretionary dining to free up monthly investment capital.");
        }

        if (hasHealthInsurance) {
            passed.add("Health Risk Shielded: Active hospitalization insurance in place so investments won't be prematurely liquidated.");
            score += 25;
        } else {
            roadmap.add("Unprotected Health Risk: Secure basic health insurance first. A single hospitalization without cover can force distress liquidation of stocks/SIPs.");
        }

        boolean isEligible = score >= 75;
        String status = isEligible ? "READY_TO_INVEST" : (emergencyMonths.compareTo(BigDecimal.valueOf(3)) < 0 ? "BUILD_EMERGENCY_FUND" : "STABILIZE_SURPLUS");

        int age = profile.getAge() != null && profile.getAge() > 18 ? profile.getAge() : 25;
        int equity = Math.max(30, Math.min(80, 100 - age));
        int gold = 10;
        int debt = 100 - equity - gold;

        BigDecimal suggestedSip = surplus.multiply(BigDecimal.valueOf(0.60)).setScale(0, RoundingMode.HALF_UP);
        if (suggestedSip.compareTo(BigDecimal.valueOf(500)) < 0) suggestedSip = BigDecimal.valueOf(500);

        String instruction = isEligible
            ? String.format("You are 100%% Investment-Ready! Based on your age (%d) and risk profile (%s), your optimal asset allocation is %d%% Broad Market Index Equity, %d%% Debt/FD, and %d%% Sovereign Gold. We recommend committing %s/month into an automated SIP.",
                age, profile.getRiskTolerance(), equity, debt, gold, suggestedSip)
            : "You are not fully investment-ready yet. Investing before securing emergency reserves and health protection exposes you to forced debt during surprises. Complete the 2 roadmap steps below first.";

        return new InvestmentEligibilityResult(
            isEligible,
            score,
            status,
            emergencyMonths,
            surplus,
            suggestedSip,
            equity,
            debt,
            gold,
            passed,
            roadmap,
            instruction
        );
    }
}
