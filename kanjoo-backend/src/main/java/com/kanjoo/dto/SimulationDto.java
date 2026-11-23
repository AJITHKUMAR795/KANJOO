package com.kanjoo.dto;

import java.math.BigDecimal;

public class SimulationDto {

    public record BeforeSpendRequest(
        String itemName,
        BigDecimal amount,
        String category,
        String urgency // NORMAL, HIGH, EMERGENCY
    ) {}

    public record WhatIfRequest(
        String scenarioType, // REDUCE_DINING, FIX_ALL_LEAKS, BOOST_SAVINGS
        BigDecimal customValue
    ) {}

    public record AddPlanItemRequest(
        String itemType,
        String title,
        String description,
        BigDecimal potentialMonthlySavings,
        BigDecimal potentialAnnualSavings
    ) {}
}
