package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class CashflowPredictorEngine {

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final UserSimCardRepository simCardRepository;
    private final InsurancePolicyRepository insuranceRepository;
    private final InvestmentRepository investmentRepository;

    public CashflowPredictorEngine(UserProfileRepository userProfileRepository,
                                  ExpenseRepository expenseRepository,
                                  UserSubscriptionRepository subscriptionRepository,
                                  UserSimCardRepository simCardRepository,
                                  InsurancePolicyRepository insuranceRepository,
                                  InvestmentRepository investmentRepository) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.simCardRepository = simCardRepository;
        this.insuranceRepository = insuranceRepository;
        this.investmentRepository = investmentRepository;
    }

    public record DailyCashflowPoint(
        String date,
        int dayOffset,
        BigDecimal projectedBalance,
        BigDecimal dailyInflow,
        BigDecimal dailyOutflow,
        String keyEvents
    ) {}

    public record CashflowForecastResult(
        int horizonDays,
        BigDecimal startingBalance,
        BigDecimal endingProjectedBalance,
        BigDecimal totalProjectedInflow,
        BigDecimal totalProjectedOutflow,
        BigDecimal projectedNetSavings,
        BigDecimal lowestProjectedBalance,
        String lowestBalanceDate,
        boolean hasShortageRisk,
        String shortageWarningMessage,
        int confidencePercent,
        String assumptionsExplanation,
        List<DailyCashflowPoint> trajectory,
        List<String> personalizedAdvice
    ) {}

    public CashflowForecastResult generateForecast(Long userId, int horizonDays) {
        if (horizonDays <= 0) horizonDays = 30;
        if (horizonDays > 90) horizonDays = 90;

        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        BigDecimal startingBalance = profile != null && profile.getEmergencySavings() != null 
            ? profile.getEmergencySavings() 
            : new BigDecimal("25000.00");

        BigDecimal monthlyIncome = profile != null 
            ? profile.getMonthlyIncome().add(profile.getOtherIncome()).add(profile.getPocketMoney()) 
            : new BigDecimal("45000.00");

        LocalDate today = LocalDate.now();
        LocalDate past60Days = today.minusDays(60);
        List<Expense> pastExpenses = expenseRepository.findByUserIdAndDateRange(userId, past60Days, today);

        // Compute baseline daily non-recurring spend
        BigDecimal totalPastSpend = pastExpenses.stream()
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal dailyBurnRate = pastExpenses.isEmpty()
            ? monthlyIncome.multiply(new BigDecimal("0.5")).divide(new BigDecimal("30"), 2, RoundingMode.HALF_UP)
            : totalPastSpend.divide(new BigDecimal("60"), 2, RoundingMode.HALF_UP);

        // Fetch recurring dues
        var subs = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        var sims = simCardRepository.findByUserIdOrderByIdAsc(userId);
        var insurances = insuranceRepository.findByUserIdOrderByCreatedAtDesc(userId);
        var investments = investmentRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<DailyCashflowPoint> trajectory = new ArrayList<>();
        BigDecimal currentBalance = startingBalance;
        BigDecimal totalInflow = BigDecimal.ZERO;
        BigDecimal totalOutflow = BigDecimal.ZERO;
        BigDecimal lowestBalance = currentBalance;
        String lowestBalanceDate = today.format(DateTimeFormatter.ISO_LOCAL_DATE);
        boolean hasShortage = false;
        String shortageMessage = "Cash flow remains positive throughout the forecast period.";

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd");

        for (int i = 1; i <= horizonDays; i++) {
            LocalDate simDate = today.plusDays(i);
            BigDecimal dayInflow = BigDecimal.ZERO;
            BigDecimal dayOutflow = dailyBurnRate;
            List<String> eventNames = new ArrayList<>();

            // Monthly Salary Inflow on 1st of month (or 28th/30th)
            if (simDate.getDayOfMonth() == 1) {
                dayInflow = dayInflow.add(monthlyIncome);
                eventNames.add("Primary Monthly Salary Inflow");
            }

            // Recurring Subscriptions
            for (var sub : subs) {
                if (sub.getNextBillingDate() != null && sub.getNextBillingDate().getDayOfMonth() == simDate.getDayOfMonth()) {
                    dayOutflow = dayOutflow.add(sub.getPrice());
                    eventNames.add(sub.getServiceName() + " Renewal");
                }
            }

            // Insurance Premiums (Assume monthly / quarterly on policy due date)
            for (var ins : insurances) {
                if (ins.getExpiryDate() != null && ins.getExpiryDate().getDayOfMonth() == simDate.getDayOfMonth()) {
                    BigDecimal monthlyPrem = ins.getAnnualPremium().divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP);
                    dayOutflow = dayOutflow.add(monthlyPrem);
                    eventNames.add(ins.getPolicyName() + " Premium");
                }
            }

            // Investment SIP Mandates (5th of each month)
            if (simDate.getDayOfMonth() == 5) {
                for (var inv : investments) {
                    if (inv.getMonthlyContribution() != null && inv.getMonthlyContribution().compareTo(BigDecimal.ZERO) > 0) {
                        dayOutflow = dayOutflow.add(inv.getMonthlyContribution());
                        eventNames.add(inv.getName() + " SIP Auto-Debit");
                    }
                }
            }

            currentBalance = currentBalance.add(dayInflow).subtract(dayOutflow);
            totalInflow = totalInflow.add(dayInflow);
            totalOutflow = totalOutflow.add(dayOutflow);

            if (currentBalance.compareTo(lowestBalance) < 0) {
                lowestBalance = currentBalance;
                lowestBalanceDate = simDate.format(dtf);
            }

            if (currentBalance.compareTo(BigDecimal.ZERO) < 0 && !hasShortage) {
                hasShortage = true;
                shortageMessage = String.format("Potential cash shortage detected around %s. Projected deficit: %s.",
                    simDate.format(dtf), currentBalance.abs().setScale(2, RoundingMode.HALF_UP));
            }

            String events = eventNames.isEmpty() ? "Baseline living expense" : String.join(", ", eventNames);
            trajectory.add(new DailyCashflowPoint(
                simDate.format(dtf),
                i,
                currentBalance.setScale(2, RoundingMode.HALF_UP),
                dayInflow.setScale(2, RoundingMode.HALF_UP),
                dayOutflow.setScale(2, RoundingMode.HALF_UP),
                events
            ));
        }

        int confidence = switch (horizonDays) {
            case 7 -> 96;
            case 30 -> 88;
            case 60 -> 76;
            default -> 65;
        };

        String assumptions = String.format(
            "Forecast assumes primary salary of %s credited on 1st of each month, average daily living burn rate of %s (derived from 60-day historical trend), and timely fulfillment of active SIPs and utility renewals. Predictions are probabilistic and not guaranteed outcomes.",
            monthlyIncome.setScale(2, RoundingMode.HALF_UP), dailyBurnRate.setScale(2, RoundingMode.HALF_UP)
        );

        List<String> advice = new ArrayList<>();
        if (hasShortage) {
            advice.add("Prioritize liquidity preservation before the anticipated trough on " + lowestBalanceDate + ".");
            advice.add("Consider staggering high-ticket SIP mandates away from subscription renewal clusters.");
        } else {
            advice.add("Cash flow cushion remains healthy with a projected ending liquidity of " + currentBalance.setScale(2, RoundingMode.HALF_UP) + ".");
            advice.add("Your net cashflow surplus allows deploying scheduled lump-sum investments without breaching emergency thresholds.");
        }

        return new CashflowForecastResult(
            horizonDays,
            startingBalance.setScale(2, RoundingMode.HALF_UP),
            currentBalance.setScale(2, RoundingMode.HALF_UP),
            totalInflow.setScale(2, RoundingMode.HALF_UP),
            totalOutflow.setScale(2, RoundingMode.HALF_UP),
            currentBalance.subtract(startingBalance).setScale(2, RoundingMode.HALF_UP),
            lowestBalance.setScale(2, RoundingMode.HALF_UP),
            lowestBalanceDate,
            hasShortage,
            shortageMessage,
            confidence,
            assumptions,
            trajectory,
            advice
        );
    }
}
