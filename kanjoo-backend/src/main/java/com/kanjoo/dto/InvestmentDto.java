package com.kanjoo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvestmentDto {

    public record CreateInvestmentRequest(
        String assetType,
        String name,
        BigDecimal investedAmount,
        BigDecimal currentValue,
        String currencyCode,
        BigDecimal monthlyContribution,
        BigDecimal expectedAnnualReturn,
        LocalDate startDate
    ) {}

    public record SipCalculatorRequest(
        BigDecimal monthlyInvestment,
        BigDecimal expectedAnnualReturn,
        int durationYears
    ) {}
}
