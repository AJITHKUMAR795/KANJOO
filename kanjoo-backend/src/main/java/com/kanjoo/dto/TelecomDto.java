package com.kanjoo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TelecomDto {

    public record AddSimRequest(
        Long operatorId,
        String phoneNumber,
        String simSlot,
        Long currentPlanId,
        LocalDate planExpiryDate,
        BigDecimal dailyDataUsedGb,
        boolean hasWifiAccess
    ) {}

    public record SimCardResponse(
        Long id,
        Long operatorId,
        String operatorName,
        String operatorCode,
        String operatorColor,
        String phoneNumber,
        String simSlot,
        Long currentPlanId,
        String currentPlanName,
        BigDecimal currentPlanPrice,
        int currentPlanValidity,
        BigDecimal dailyDataUsedGb,
        boolean hasWifiAccess,
        LocalDate planExpiryDate
    ) {}
}
