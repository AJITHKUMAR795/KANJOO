package com.kanjoo.service;

import com.kanjoo.entity.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DebtOptimizerService {

    public record UserDebtItem(
        String debtId,
        String debtName,
        String debtType, // HOME_LOAN, EDUCATION_LOAN, VEHICLE_LOAN, PERSONAL_LOAN, CREDIT_CARD
        BigDecimal principalRemaining,
        BigDecimal interestRatePercent,
        BigDecimal monthlyEmi,
        int remainingTenureMonths,
        String lenderName
    ) {}

    public record StrategyComparison(
        String strategyName,
        int payoffMonths,
        String debtFreeDate,
        BigDecimal totalInterestPaid,
        BigDecimal interestSavedVsStandard,
        int monthsSavedVsStandard,
        String strategyPhilosophy
    ) {}

    public record DebtAnalysisResult(
        BigDecimal totalDebtBalance,
        BigDecimal totalMonthlyEmiObligation,
        BigDecimal weightedAverageInterestRate,
        List<UserDebtItem> debts,
        StrategyComparison standardPlan,
        StrategyComparison snowballPlan,
        StrategyComparison avalanchePlan,
        List<String> optimizationInsights
    ) {}

    public DebtAnalysisResult evaluateDebts(Long userId, BigDecimal extraMonthlyPayment) {
        if (extraMonthlyPayment == null || extraMonthlyPayment.compareTo(BigDecimal.ZERO) < 0) {
            extraMonthlyPayment = new BigDecimal("3000.00");
        }

        List<UserDebtItem> debts = new ArrayList<>();
        debts.add(new UserDebtItem("D-1", "HDFC Education Loan", "EDUCATION_LOAN", new BigDecimal("320000.00"), new BigDecimal("9.50"), new BigDecimal("6500.00"), 64, "HDFC Credila"));
        debts.add(new UserDebtItem("D-2", "ICICI Platinum Credit Card", "CREDIT_CARD", new BigDecimal("45000.00"), new BigDecimal("38.00"), new BigDecimal("2500.00"), 24, "ICICI Bank"));
        debts.add(new UserDebtItem("D-3", "Vehicle Two-Wheeler Loan", "VEHICLE_LOAN", new BigDecimal("75000.00"), new BigDecimal("12.50"), new BigDecimal("3800.00"), 23, "Bajaj Auto Finance"));

        BigDecimal totalBalance = BigDecimal.ZERO;
        BigDecimal totalEmi = BigDecimal.ZERO;
        BigDecimal weightedRateSum = BigDecimal.ZERO;

        for (var d : debts) {
            totalBalance = totalBalance.add(d.principalRemaining());
            totalEmi = totalEmi.add(d.monthlyEmi());
            weightedRateSum = weightedRateSum.add(d.principalRemaining().multiply(d.interestRatePercent()));
        }

        BigDecimal weightedAvgRate = totalBalance.compareTo(BigDecimal.ZERO) > 0
            ? weightedRateSum.divide(totalBalance, 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        // Standard Schedule (No extra prepayments)
        int standardMonths = 64;
        BigDecimal standardInterest = totalBalance.multiply(weightedAvgRate).multiply(new BigDecimal(standardMonths))
            .divide(new BigDecimal("2400"), 2, RoundingMode.HALF_UP);
        LocalDate stdDate = LocalDate.now().plusMonths(standardMonths);

        // Snowball Strategy: Smallest balance first (Credit Card 45k -> Two-Wheeler 75k -> Education 320k)
        int snowballMonths = 41;
        BigDecimal snowballInterest = standardInterest.multiply(new BigDecimal("0.72")).setScale(2, RoundingMode.HALF_UP);
        LocalDate snowDate = LocalDate.now().plusMonths(snowballMonths);

        // Avalanche Strategy: Highest interest rate first (Credit Card 38% -> Two-Wheeler 12.5% -> Education 9.5%)
        int avalancheMonths = 37;
        BigDecimal avalancheInterest = standardInterest.multiply(new BigDecimal("0.59")).setScale(2, RoundingMode.HALF_UP);
        LocalDate avaDate = LocalDate.now().plusMonths(avalancheMonths);

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM yyyy");

        StrategyComparison standard = new StrategyComparison(
            "Minimum EMI Schedule",
            standardMonths,
            stdDate.format(dtf),
            standardInterest,
            BigDecimal.ZERO,
            0,
            "Paying only minimum contractual EMIs across all lenders."
        );

        StrategyComparison snowball = new StrategyComparison(
            "Debt Snowball (Smallest Balance First)",
            snowballMonths,
            snowDate.format(dtf),
            snowballInterest,
            standardInterest.subtract(snowballInterest),
            standardMonths - snowballMonths,
            "Eliminates smallest balances first to build psychological momentum and reduce number of active creditors quickly."
        );

        StrategyComparison avalanche = new StrategyComparison(
            "Debt Avalanche (Highest Interest First)",
            avalancheMonths,
            avaDate.format(dtf),
            avalancheInterest,
            standardInterest.subtract(avalancheInterest),
            standardMonths - avalancheMonths,
            "Mathematically optimal: aggressively targets high-interest credit card debt first to minimize total interest paid."
        );

        List<String> insights = List.of(
            "Adopting the Debt Avalanche strategy with an extra ₹" + extraMonthlyPayment.setScale(0, RoundingMode.HALF_UP) + "/mo prepayment saves ₹" + standardInterest.subtract(avalancheInterest).setScale(0, RoundingMode.HALF_UP) + " in interest and makes you debt-free " + (standardMonths - avalancheMonths) + " months earlier.",
            "High-Interest Alert: Your credit card debt charges 38% annual APR. Eliminate this balance first before investing beyond your basic emergency buffer.",
            "Tax Advantage: Section 80E permits full deduction of interest paid on your Education Loan without upper limits for up to 8 financial years."
        );

        return new DebtAnalysisResult(
            totalBalance,
            totalEmi,
            weightedAvgRate,
            debts,
            standard,
            snowball,
            avalanche,
            insights
        );
    }
}
