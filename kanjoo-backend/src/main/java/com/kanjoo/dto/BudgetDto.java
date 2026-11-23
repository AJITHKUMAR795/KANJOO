package com.kanjoo.dto;

import java.math.BigDecimal;
import java.util.List;

public class BudgetDto {

    public record CategoryAllocationDto(
        Long categoryId,
        String categoryName,
        String categoryIcon,
        BigDecimal allocatedAmount,
        BigDecimal spentAmount,
        BigDecimal remainingAmount,
        double spentPercentage
    ) {}

    public record BudgetResponse(
        Long id,
        String monthYear,
        BigDecimal totalIncome,
        BigDecimal totalBudget,
        BigDecimal totalSpent,
        BigDecimal savingsTarget,
        BigDecimal remainingBudget,
        List<CategoryAllocationDto> categoryAllocations
    ) {}

    public record SaveBudgetRequest(
        String monthYear,
        BigDecimal savingsTarget,
        List<CategoryAllocationInput> allocations
    ) {}

    public record CategoryAllocationInput(
        Long categoryId,
        BigDecimal allocatedAmount
    ) {}
}
