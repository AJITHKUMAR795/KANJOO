package com.kanjoo.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseDto {

    public record CreateExpenseRequest(
        @NotNull Long categoryId,
        @NotNull BigDecimal amount,
        @NotNull String originalCurrency,
        @NotNull LocalDate expenseDate,
        String description,
        String paymentMethod,
        boolean recurring
    ) {}

    public record ExpenseResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String categoryIcon,
        boolean categoryIsEssential,
        BigDecimal originalAmount,
        String originalCurrency,
        BigDecimal exchangeRate,
        BigDecimal primaryAmount,
        String primaryCurrency,
        LocalDate expenseDate,
        String description,
        String paymentMethod,
        boolean recurring
    ) {}
}
