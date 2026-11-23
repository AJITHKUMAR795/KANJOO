package com.kanjoo.service;

import com.kanjoo.entity.Currency;
import com.kanjoo.entity.Expense;
import com.kanjoo.entity.UserProfile;
import com.kanjoo.repository.ExpenseRepository;
import com.kanjoo.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class WhatIfSimulatorEngine {

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;
    private final MoneyLeakDetectorEngine leakEngine;
    private final CurrencyService currencyService;

    public WhatIfSimulatorEngine(UserProfileRepository userProfileRepository,
                                 ExpenseRepository expenseRepository,
                                 MoneyLeakDetectorEngine leakEngine,
                                 CurrencyService currencyService) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
        this.leakEngine = leakEngine;
        this.currencyService = currencyService;
    }

    public record SimulationMetric(
        String label,
        BigDecimal currentValue,
        BigDecimal simulatedValue,
        BigDecimal netDifference,
        String formattedDifference
    ) {}

    public record SimulationResponse(
        String scenarioTitle,
        String description,
        BigDecimal monthlySavingsGain,
        BigDecimal annualSavingsGain,
        BigDecimal fiveYearCompoundedWealth, // assuming 12% annual return
        List<SimulationMetric> metrics
    ) {}

    public SimulationResponse simulateScenario(Long userId, String scenarioType, BigDecimal customValue) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) return null;

        UserProfile profile = profileOpt.get();
        Currency currency = profile.getPrimaryCurrency();

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateRange(userId, startOfMonth, now);

        BigDecimal currentMonthlyExpenses = monthExpenses.stream()
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal currentIncome = profile.getMonthlyIncome().add(profile.getOtherIncome()).add(profile.getPocketMoney());
        BigDecimal currentSavingsTarget = profile.getMonthlySavingsTarget();

        BigDecimal monthlyGain = BigDecimal.ZERO;
        String scenarioTitle = "Custom Financial Simulation";
        String description = "";

        switch (scenarioType.toUpperCase()) {
            case "REDUCE_DINING" -> {
                BigDecimal percent = (customValue != null && customValue.compareTo(BigDecimal.ZERO) > 0) ? customValue : BigDecimal.valueOf(15);
                BigDecimal diningTotal = monthExpenses.stream()
                    .filter(e -> "FOOD".equalsIgnoreCase(e.getCategory().getCode()))
                    .map(Expense::getPrimaryAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                monthlyGain = diningTotal.multiply(percent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                scenarioTitle = "Reduce Dining & Food Delivery by " + percent + "%";
                description = "By cooking more meals at home and curbing weekend delivery fees, you capture immediate savings.";
            }
            case "FIX_ALL_LEAKS" -> {
                var leakReport = leakEngine.detectLeaks(userId);
                monthlyGain = leakReport.totalPotentialMonthlySavings();
                scenarioTitle = "Plug All Detected Money Leaks";
                description = "Canceling inactive subscriptions, moving secondary SIM to incoming-saver, and claiming student discounts.";
            }
            case "BOOST_SAVINGS" -> {
                monthlyGain = (customValue != null && customValue.compareTo(BigDecimal.ZERO) > 0) ? customValue : BigDecimal.valueOf(50);
                scenarioTitle = "Increase Monthly Savings by " + currencyService.format(monthlyGain, currency);
                description = "Allocating an additional recurring amount directly to your wealth accumulation pool.";
            }
            default -> {
                monthlyGain = (customValue != null) ? customValue : BigDecimal.valueOf(100);
                scenarioTitle = "Discretionary Spending Reduction";
                description = "General optimization of non-essential monthly expenses.";
            }
        }

        BigDecimal annualGain = monthlyGain.multiply(BigDecimal.valueOf(12)).setScale(2, RoundingMode.HALF_UP);

        // 5-year compounding at 12% p.a.
        // Formula: monthlyGain * [ ( (1 + 0.01)^60 - 1 ) / 0.01 ] * 1.01
        BigDecimal monthlyRate = BigDecimal.valueOf(0.01);
        BigDecimal compoundFactor = BigDecimal.valueOf(1.01).pow(60);
        BigDecimal numerator = compoundFactor.subtract(BigDecimal.ONE);
        BigDecimal fiveYearWealth = monthlyGain.multiply(numerator.divide(monthlyRate, 4, RoundingMode.HALF_UP)).multiply(BigDecimal.valueOf(1.01)).setScale(currency.getDecimalDigits(), RoundingMode.HALF_UP);

        BigDecimal newExpenses = currentMonthlyExpenses.subtract(monthlyGain).max(BigDecimal.ZERO);
        BigDecimal newSavings = currentSavingsTarget.add(monthlyGain);

        List<SimulationMetric> metrics = List.of(
            new SimulationMetric("Monthly Expenses", currentMonthlyExpenses, newExpenses, monthlyGain.negate(), "-" + currencyService.format(monthlyGain, currency)),
            new SimulationMetric("Monthly Savings", currentSavingsTarget, newSavings, monthlyGain, "+" + currencyService.format(monthlyGain, currency)),
            new SimulationMetric("Annual Savings", currentSavingsTarget.multiply(BigDecimal.valueOf(12)), newSavings.multiply(BigDecimal.valueOf(12)), annualGain, "+" + currencyService.format(annualGain, currency))
        );

        return new SimulationResponse(
            scenarioTitle,
            description,
            monthlyGain,
            annualGain,
            fiveYearWealth,
            metrics
        );
    }
}
