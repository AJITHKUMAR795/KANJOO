package com.kanjoo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SubscriptionDto {

    public record AddUserSubscriptionRequest(
        Long offerId,
        String serviceName,
        BigDecimal price,
        String currencyCode,
        String billingCycle,
        LocalDate nextBillingDate,
        boolean activelyUsed,
        String category
    ) {}

    public record UserSubscriptionResponse(
        Long id,
        Long offerId,
        String serviceName,
        BigDecimal price,
        String currencyCode,
        BigDecimal primaryPrice,
        String primaryCurrencyCode,
        String billingCycle,
        LocalDate nextBillingDate,
        boolean activelyUsed,
        String category
    ) {}
}
