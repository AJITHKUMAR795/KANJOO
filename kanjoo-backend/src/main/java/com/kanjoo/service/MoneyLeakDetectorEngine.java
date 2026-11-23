package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.entity.Currency;
import com.kanjoo.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class MoneyLeakDetectorEngine {

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;
    private final SubscriptionIntelligenceEngine subscriptionEngine;
    private final RechargeOptimizationEngine rechargeEngine;
    private final CurrencyService currencyService;

    public MoneyLeakDetectorEngine(UserProfileRepository userProfileRepository,
                                  ExpenseRepository expenseRepository,
                                  SubscriptionIntelligenceEngine subscriptionEngine,
                                  RechargeOptimizationEngine rechargeEngine,
                                  CurrencyService currencyService) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
        this.subscriptionEngine = subscriptionEngine;
        this.rechargeEngine = rechargeEngine;
        this.currencyService = currencyService;
    }

    public record MoneyLeakItem(
        String id,
        String category, // SUBSCRIPTIONS, TELECOM, DINING, RECURRING
        String problem,
        String explanation,
        String suggestedAlternative,
        BigDecimal potentialMonthlySavings,
        BigDecimal potentialAnnualSavings,
        String severity // HIGH, MEDIUM, LOW
    ) {}

    public record MoneyLeakReport(
        BigDecimal totalPotentialMonthlySavings,
        BigDecimal totalPotentialAnnualSavings,
        List<MoneyLeakItem> leaks
    ) {}

    public MoneyLeakReport detectLeaks(Long userId) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            return new MoneyLeakReport(BigDecimal.ZERO, BigDecimal.ZERO, Collections.emptyList());
        }

        UserProfile profile = profileOpt.get();
        Currency currency = profile.getPrimaryCurrency();
        List<MoneyLeakItem> leaks = new ArrayList<>();

        // 1. Check Subscriptions
        var subEvals = subscriptionEngine.evaluateUserSubscriptions(userId);
        for (var eval : subEvals) {
            if (eval.isUnusedLeak()) {
                leaks.add(new MoneyLeakItem(
                    "LEAK-SUB-UNUSED-" + eval.userSubscription().getId(),
                    "SUBSCRIPTIONS",
                    "Inactive Subscription: " + eval.userSubscription().getServiceName(),
                    "You are paying for " + eval.userSubscription().getServiceName() + " but have indicated zero or near-zero active usage.",
                    "Cancel the auto-renewing subscription and save the entire recurring amount.",
                    eval.monthlySavings(),
                    eval.annualSavings(),
                    "HIGH"
                ));
            } else if (eval.monthlySavings().compareTo(BigDecimal.ZERO) > 0) {
                leaks.add(new MoneyLeakItem(
                    "LEAK-SUB-OVERPAY-" + eval.userSubscription().getId(),
                    "SUBSCRIPTIONS",
                    "Overpaying for " + eval.userSubscription().getServiceName(),
                    "You qualify for an official discount tier (" + eval.recommendationNote() + ").",
                    "Switch to the discounted plan.",
                    eval.monthlySavings(),
                    eval.annualSavings(),
                    "MEDIUM"
                ));
            }
        }

        // 2. Check Telecom Multi-SIM
        var simResults = rechargeEngine.analyzeUserSims(userId, currency);
        for (var simRes : simResults) {
            if (simRes.potentialMonthlySavings().compareTo(BigDecimal.ZERO) > 0) {
                leaks.add(new MoneyLeakItem(
                    "LEAK-SIM-" + simRes.simCard().getId(),
                    "TELECOM",
                    "Excess Recharge on " + simRes.simCard().getSimSlot() + " SIM (" + simRes.simCard().getOperator().getName() + ")",
                    simRes.reasoning(),
                    "Switch to " + simRes.recommendedPlan().getPlanName() + " (daily cost: " + currencyService.format(simRes.recommendedMetrics().dailyCost(), currency) + ").",
                    simRes.potentialMonthlySavings(),
                    simRes.potentialAnnualSavings(),
                    "HIGH"
                ));
            }
        }

        // 3. Dining & Food Leakage Check
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateRange(userId, startOfMonth, now);

        BigDecimal foodTotal = monthExpenses.stream()
            .filter(e -> "FOOD".equalsIgnoreCase(e.getCategory().getCode()))
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyIncome = profile.getMonthlyIncome();
        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal foodRatio = foodTotal.divide(monthlyIncome, 4, RoundingMode.HALF_UP);
            if (foodRatio.compareTo(BigDecimal.valueOf(0.25)) > 0) {
                BigDecimal excessMonthly = foodTotal.multiply(BigDecimal.valueOf(0.15)).setScale(2, RoundingMode.HALF_UP);
                BigDecimal excessAnnual = excessMonthly.multiply(BigDecimal.valueOf(12)).setScale(2, RoundingMode.HALF_UP);
                leaks.add(new MoneyLeakItem(
                    "LEAK-FOOD-DINING",
                    "DINING",
                    "Disproportionate Food & Delivery Spending",
                    "Your food and dining spend accounts for " + foodRatio.multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP) + 
                    "% of your monthly income. Frequent takeout and delivery markups create cumulative friction.",
                    "Set a meal prep target and curb weekend delivery apps by 15-20%.",
                    excessMonthly,
                    excessAnnual,
                    "MEDIUM"
                ));
            }
        }

        BigDecimal totalMonthly = leaks.stream().map(MoneyLeakItem::potentialMonthlySavings).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAnnual = leaks.stream().map(MoneyLeakItem::potentialAnnualSavings).reduce(BigDecimal.ZERO, BigDecimal::add);

        return new MoneyLeakReport(totalMonthly, totalAnnual, leaks);
    }
}
