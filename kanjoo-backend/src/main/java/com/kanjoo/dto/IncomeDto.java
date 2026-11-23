package com.kanjoo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class IncomeDto {

    public record CreateIncomeRequest(
        @NotBlank String name,
        @NotNull BigDecimal amount,
        @NotBlank String originalCurrency,
        String frequency,
        boolean primary
    ) {}

    public record IncomeResponse(
        Long id,
        String name,
        BigDecimal originalAmount,
        String originalCurrency,
        BigDecimal exchangeRate,
        BigDecimal primaryAmount,
        String primaryCurrency,
        String frequency,
        boolean primary
    ) {}
}
