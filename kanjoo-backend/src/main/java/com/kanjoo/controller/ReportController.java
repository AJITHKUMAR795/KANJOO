package com.kanjoo.controller;

import com.kanjoo.entity.*;
import com.kanjoo.entity.Currency;
import com.kanjoo.repository.*;
import com.kanjoo.service.CurrencyService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ExpenseRepository expenseRepository;
    private final IncomeSourceRepository incomeSourceRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrencyService currencyService;

    public ReportController(ExpenseRepository expenseRepository,
                            IncomeSourceRepository incomeSourceRepository,
                            UserProfileRepository userProfileRepository,
                            CurrencyService currencyService) {
        this.expenseRepository = expenseRepository;
        this.incomeSourceRepository = incomeSourceRepository;
        this.userProfileRepository = userProfileRepository;
        this.currencyService = currencyService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@AuthenticationPrincipal User user,
                                          @RequestParam(defaultValue = "MONTHLY") String timeFrame) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        Currency currency = profile != null ? profile.getPrimaryCurrency() : null;

        List<Expense> allExpenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(user.getId());
        BigDecimal totalExpenses = allExpenses.stream().map(Expense::getPrimaryAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        // Group by category
        Map<String, BigDecimal> byCategory = allExpenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getCategory().getName(),
                Collectors.reducing(BigDecimal.ZERO, Expense::getPrimaryAmount, BigDecimal::add)
            ));

        // Group by month
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, BigDecimal> byMonth = allExpenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getExpenseDate().format(monthFmt),
                LinkedHashMap::new,
                Collectors.reducing(BigDecimal.ZERO, Expense::getPrimaryAmount, BigDecimal::add)
            ));

        BigDecimal monthlyIncome = profile != null ? profile.getMonthlyIncome().add(profile.getOtherIncome()) : BigDecimal.ZERO;
        BigDecimal annualIncome = monthlyIncome.multiply(BigDecimal.valueOf(12));

        return ResponseEntity.ok(Map.of(
            "currency", currency != null ? currency.getCode() : "USD",
            "currencySymbol", currency != null ? currency.getSymbol() : "$",
            "totalExpenses", totalExpenses,
            "monthlyIncome", monthlyIncome,
            "annualIncome", annualIncome,
            "categoryBreakdown", byCategory,
            "monthlyTrends", byMonth
        ));
    }

    @GetMapping("/export-csv")
    public ResponseEntity<byte[]> exportCsv(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        String currCode = profile != null ? profile.getPrimaryCurrency().getCode() : "USD";

        List<Expense> expenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(user.getId());

        StringBuilder csv = new StringBuilder();
        csv.append("Date,Category,Description,Original Amount,Original Currency,Exchange Rate,Primary Amount,Primary Currency,Payment Method,Is Recurring\n");

        for (Expense e : expenses) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",%s,%s,%s,%s,%s,\"%s\",%s\n",
                e.getExpenseDate(),
                e.getCategory().getName(),
                e.getDescription() != null ? e.getDescription().replace("\"", "\"\"") : "",
                e.getAmount(),
                e.getOriginalCurrency().getCode(),
                e.getExchangeRate(),
                e.getPrimaryAmount(),
                currCode,
                e.getPaymentMethod(),
                e.isRecurring()
            ));
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"kanjoo_expenses_" + LocalDate.now() + ".csv\"")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(bytes);
    }
}
