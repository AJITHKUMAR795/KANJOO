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
public class BeforeYouSpendEngine {

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;
    private final CurrencyService currencyService;

    public BeforeYouSpendEngine(UserProfileRepository userProfileRepository,
                                ExpenseRepository expenseRepository,
                                CurrencyService currencyService) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
        this.currencyService = currencyService;
    }

    public record SpendEvaluationResult(
        String itemName,
        BigDecimal purchaseAmount,
        String category,
        String classification, // ESSENTIAL, SAFE_TO_BUY, DELAY_AND_SAVE, HIGH_RISK_OVERSPEND
        int recommendedWaitingDays,
        BigDecimal availableMonthlySurplus,
        BigDecimal remainingSurplusAfterPurchase,
        BigDecimal emergencyFundRatio,
        String verdictReasoning,
        String alternativeAction,
        boolean affordableWithoutDebt
    ) {}

    public SpendEvaluationResult evaluatePurchase(Long userId, String itemName, BigDecimal amount, String category, String urgency) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            return new SpendEvaluationResult(itemName, amount, category, "UNKNOWN", 0, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, "User profile not found", "Update profile", false);
        }

        UserProfile profile = profileOpt.get();
        Currency currency = profile.getPrimaryCurrency();

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateRange(userId, startOfMonth, now);

        BigDecimal currentMonthExpenses = monthExpenses.stream()
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncome = profile.getMonthlyIncome().add(profile.getOtherIncome()).add(profile.getPocketMoney());
        BigDecimal savingsTarget = profile.getMonthlySavingsTarget();
        BigDecimal emergencySavings = profile.getEmergencySavings();

        // Available surplus before this planned purchase
        BigDecimal committed = currentMonthExpenses.add(savingsTarget);
        BigDecimal availableSurplus = totalIncome.subtract(committed);
        if (availableSurplus.compareTo(BigDecimal.ZERO) < 0) {
            availableSurplus = BigDecimal.ZERO;
        }

        BigDecimal remainingSurplus = availableSurplus.subtract(amount);

        // Emergency cushion in terms of monthly expense months
        BigDecimal monthlyBurnRate = currentMonthExpenses.compareTo(BigDecimal.ZERO) > 0 ? currentMonthExpenses : BigDecimal.valueOf(1000);
        BigDecimal emergencyFundMonths = emergencySavings.divide(monthlyBurnRate, 1, RoundingMode.HALF_UP);

        String classification;
        int waitingDays = 0;
        String reasoning;
        String alternative;
        boolean affordableWithoutDebt;

        boolean isHighUrgency = "EMERGENCY".equalsIgnoreCase(urgency) || "HEALTHCARE".equalsIgnoreCase(category);

        if (isHighUrgency) {
            classification = "ESSENTIAL";
            waitingDays = 0;
            reasoning = "This is an urgent necessity or healthcare item. Fulfill with priority.";
            alternative = "Ensure you check medical coverage or emergency reserve allocation.";
            affordableWithoutDebt = true;
        } else if (remainingSurplus.compareTo(BigDecimal.ZERO) >= 0 && emergencyFundMonths.compareTo(BigDecimal.valueOf(2.0)) >= 0) {
            classification = "SAFE_TO_BUY";
            waitingDays = 0;
            reasoning = "You have sufficient monthly cash surplus (" + currencyService.format(availableSurplus, currency) + 
                        ") and a healthy emergency cushion (" + emergencyFundMonths + " months of living expenses).";
            alternative = "Consider purchasing during seasonal discount periods or using cash-back cards.";
            affordableWithoutDebt = true;
        } else if (remainingSurplus.compareTo(BigDecimal.ZERO) < 0 && amount.compareTo(totalIncome.multiply(BigDecimal.valueOf(0.5))) <= 0) {
            classification = "DELAY_AND_SAVE";
            waitingDays = 14;
            reasoning = "This planned purchase (" + currencyService.format(amount, currency) + 
                        ") exceeds your available monthly surplus after savings targets. Buying now will dip into savings or emergency funds.";
            alternative = "Apply the 14-day anti-impulse cooling rule. Save " + 
                          currencyService.format(amount.divide(BigDecimal.valueOf(2), currency.getDecimalDigits(), RoundingMode.HALF_UP), currency) + 
                          " over the next 2 paycheck cycles.";
            affordableWithoutDebt = false;
        } else {
            classification = "HIGH_RISK_OVERSPEND";
            waitingDays = 30;
            reasoning = "This purchase represents a major fraction of your monthly cash flow. Your emergency cushion is currently " + 
                        emergencyFundMonths + " months, which is below the recommended 3-6 months threshold.";
            alternative = "Postpone purchase until emergency reserves reach at least 3 months of baseline expenses.";
            affordableWithoutDebt = false;
        }

        return new SpendEvaluationResult(
            itemName,
            amount,
            category,
            classification,
            waitingDays,
            availableSurplus,
            remainingSurplus,
            emergencyFundMonths,
            reasoning,
            alternative,
            affordableWithoutDebt
        );
    }
}
