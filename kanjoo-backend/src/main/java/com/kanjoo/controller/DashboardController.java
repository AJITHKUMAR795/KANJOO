package com.kanjoo.controller;

import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeSourceRepository incomeSourceRepository;
    private final MoneyLeakDetectorEngine leakEngine;
    private final FinancialHealthScoreEngine healthScoreEngine;
    private final NotificationRepository notificationRepository;
    private final CurrencyService currencyService;

    public DashboardController(UserProfileRepository userProfileRepository,
                               ExpenseRepository expenseRepository,
                               IncomeSourceRepository incomeSourceRepository,
                               MoneyLeakDetectorEngine leakEngine,
                               FinancialHealthScoreEngine healthScoreEngine,
                               NotificationRepository notificationRepository,
                               CurrencyService currencyService) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
        this.incomeSourceRepository = incomeSourceRepository;
        this.leakEngine = leakEngine;
        this.healthScoreEngine = healthScoreEngine;
        this.notificationRepository = notificationRepository;
        this.currencyService = currencyService;
    }

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        if (profile == null) return ResponseEntity.badRequest().body("Profile not found");

        Currency currency = profile.getPrimaryCurrency();
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateRange(user.getId(), startOfMonth, now);
        BigDecimal totalSpent = monthExpenses.stream()
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncome = profile.getMonthlyIncome().add(profile.getOtherIncome()).add(profile.getPocketMoney());
        BigDecimal availableBalance = totalIncome.subtract(totalSpent);

        var leakReport = leakEngine.detectLeaks(user.getId());
        var healthScore = healthScoreEngine.calculateScore(user.getId());
        var notifications = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(user.getId());

        List<Expense> recentExpenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(user.getId())
            .stream().limit(5).toList();

        Map<String, Object> data = Map.of(
            "user", Map.of(
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "country", profile.getCountry().getName(),
                "countryCode", profile.getCountry().getCode(),
                "primaryCurrency", currency.getCode(),
                "currencySymbol", currency.getSymbol()
            ),
            "financialOverview", Map.of(
                "monthlyIncome", totalIncome,
                "totalExpenses", totalSpent,
                "availableBalance", availableBalance,
                "monthlySavingsTarget", profile.getMonthlySavingsTarget(),
                "emergencySavings", profile.getEmergencySavings(),
                "existingInvestments", profile.getExistingInvestments()
            ),
            "leakSummary", Map.of(
                "totalLeaksFound", leakReport.leaks().size(),
                "potentialMonthlySavings", leakReport.totalPotentialMonthlySavings(),
                "potentialAnnualSavings", leakReport.totalPotentialAnnualSavings()
            ),
            "healthScore", healthScore,
            "recentExpenses", recentExpenses,
            "unreadNotificationsCount", notifications.size()
        );

        return ResponseEntity.ok(data);
    }
}
