package com.kanjoo.controller;

import com.kanjoo.dto.BudgetDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final BudgetCategoryRepository budgetCategoryRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final ExpenseRepository expenseRepository;
    private final UserProfileRepository userProfileRepository;

    public BudgetController(BudgetRepository budgetRepository,
                            BudgetCategoryRepository budgetCategoryRepository,
                            ExpenseCategoryRepository expenseCategoryRepository,
                            ExpenseRepository expenseRepository,
                            UserProfileRepository userProfileRepository) {
        this.budgetRepository = budgetRepository;
        this.budgetCategoryRepository = budgetCategoryRepository;
        this.expenseCategoryRepository = expenseCategoryRepository;
        this.expenseRepository = expenseRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentBudget(@AuthenticationPrincipal User user,
                                              @RequestParam(required = false) String monthYear) {
        if (user == null) return ResponseEntity.status(401).build();

        String targetMonth = (monthYear != null && !monthYear.isBlank()) 
            ? monthYear 
            : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        BigDecimal income = profile != null ? profile.getMonthlyIncome() : BigDecimal.ZERO;
        BigDecimal targetSavings = profile != null ? profile.getMonthlySavingsTarget() : BigDecimal.ZERO;

        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndMonthYear(user.getId(), targetMonth);
        Budget budget;
        if (budgetOpt.isEmpty()) {
            budget = new Budget();
            budget.setUser(user);
            budget.setMonthYear(targetMonth);
            budget.setTotalIncome(income);
            budget.setSavingsTarget(targetSavings);
            budget.setTotalBudget(income.subtract(targetSavings).max(BigDecimal.ZERO));
            budget = budgetRepository.save(budget);
        } else {
            budget = budgetOpt.get();
        }

        // Calculate actual spend for each category in this month
        LocalDate start = LocalDate.parse(targetMonth + "-01");
        LocalDate end = start.plusMonths(1).minusDays(1);
        List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateRange(user.getId(), start, end);

        List<ExpenseCategory> allCategories = expenseCategoryRepository.findAll();
        List<CategoryAllocationDto> allocationDtos = new ArrayList<>();
        BigDecimal totalSpent = BigDecimal.ZERO;

        for (ExpenseCategory cat : allCategories) {
            BigDecimal spent = monthExpenses.stream()
                .filter(e -> e.getCategory().getId().equals(cat.getId()))
                .map(Expense::getPrimaryAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            totalSpent = totalSpent.add(spent);

            Optional<BudgetCategory> allocatedOpt = budget.getCategories().stream()
                .filter(bc -> bc.getCategory().getId().equals(cat.getId()))
                .findFirst();

            BigDecimal allocated = allocatedOpt.map(BudgetCategory::getAllocatedAmount).orElse(BigDecimal.ZERO);
            BigDecimal remaining = allocated.subtract(spent);
            double pct = allocated.compareTo(BigDecimal.ZERO) > 0 
                ? spent.divide(allocated, 4, RoundingMode.HALF_UP).doubleValue() * 100.0 
                : (spent.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0);

            allocationDtos.add(new CategoryAllocationDto(
                cat.getId(),
                cat.getName(),
                cat.getIcon(),
                allocated,
                spent,
                remaining,
                pct
            ));
        }

        BigDecimal remainingBudget = budget.getTotalBudget().subtract(totalSpent);

        return ResponseEntity.ok(new BudgetResponse(
            budget.getId(),
            budget.getMonthYear(),
            budget.getTotalIncome(),
            budget.getTotalBudget(),
            totalSpent,
            budget.getSavingsTarget(),
            remainingBudget,
            allocationDtos
        ));
    }

    @PostMapping
    public ResponseEntity<?> saveBudget(@AuthenticationPrincipal User user,
                                        @RequestBody SaveBudgetRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        Budget budget = budgetRepository.findByUserIdAndMonthYear(user.getId(), req.monthYear())
            .orElseGet(() -> {
                Budget b = new Budget();
                b.setUser(user);
                b.setMonthYear(req.monthYear());
                return b;
            });

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        BigDecimal income = profile != null ? profile.getMonthlyIncome() : BigDecimal.ZERO;

        budget.setTotalIncome(income);
        if (req.savingsTarget() != null) budget.setSavingsTarget(req.savingsTarget());

        budget = budgetRepository.save(budget);

        BigDecimal sumBudget = BigDecimal.ZERO;
        if (req.allocations() != null) {
            budget.getCategories().clear();
            for (var alloc : req.allocations()) {
                ExpenseCategory cat = expenseCategoryRepository.findById(alloc.categoryId()).orElse(null);
                if (cat != null) {
                    BudgetCategory bc = new BudgetCategory(budget, cat, alloc.allocatedAmount());
                    budget.getCategories().add(bc);
                    sumBudget = sumBudget.add(alloc.allocatedAmount());
                }
            }
        }
        budget.setTotalBudget(sumBudget);
        budgetRepository.save(budget);

        return ResponseEntity.ok(budget);
    }
}
