package com.kanjoo.controller;

import com.kanjoo.dto.ExpenseDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.service.CurrencyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final CurrencyRepository currencyRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrencyService currencyService;

    public ExpenseController(ExpenseRepository expenseRepository,
                             ExpenseCategoryRepository categoryRepository,
                             CurrencyRepository currencyRepository,
                             UserProfileRepository userProfileRepository,
                             CurrencyService currencyService) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.currencyRepository = currencyRepository;
        this.userProfileRepository = userProfileRepository;
        this.currencyService = currencyService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        String primaryCurr = profile != null ? profile.getPrimaryCurrency().getCode() : "USD";

        List<Expense> expenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(user.getId());
        List<ExpenseResponse> response = expenses.stream().map(e -> new ExpenseResponse(
            e.getId(),
            e.getCategory().getId(),
            e.getCategory().getName(),
            e.getCategory().getIcon(),
            e.getCategory().isEssential(),
            e.getAmount(),
            e.getOriginalCurrency().getCode(),
            e.getExchangeRate(),
            e.getPrimaryAmount(),
            primaryCurr,
            e.getExpenseDate(),
            e.getDescription(),
            e.getPaymentMethod(),
            e.isRecurring()
        )).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ExpenseCategory>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@AuthenticationPrincipal User user,
                                           @Valid @RequestBody CreateExpenseRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElseThrow();
        ExpenseCategory category = categoryRepository.findById(req.categoryId()).orElseThrow();
        Currency originalCurrency = currencyRepository.findById(req.originalCurrency()).orElseThrow();
        Currency primaryCurrency = profile.getPrimaryCurrency();

        BigDecimal exchangeRate = currencyService.getExchangeRate(originalCurrency, primaryCurrency);
        BigDecimal primaryAmount = currencyService.convert(req.amount(), originalCurrency, primaryCurrency);

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(category);
        expense.setAmount(req.amount());
        expense.setOriginalCurrency(originalCurrency);
        expense.setExchangeRate(exchangeRate);
        expense.setPrimaryAmount(primaryAmount);
        expense.setExpenseDate(req.expenseDate());
        expense.setDescription(req.description());
        expense.setPaymentMethod(req.paymentMethod() != null ? req.paymentMethod() : "CARD");
        expense.setRecurring(req.recurring());

        expense = expenseRepository.save(expense);

        return ResponseEntity.ok(expense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        expenseRepository.findById(id).ifPresent(e -> {
            if (e.getUser().getId().equals(user.getId())) {
                expenseRepository.delete(e);
            }
        });
        return ResponseEntity.ok().build();
    }
}
