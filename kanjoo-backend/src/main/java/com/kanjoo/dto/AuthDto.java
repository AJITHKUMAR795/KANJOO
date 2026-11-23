package com.kanjoo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class AuthDto {

    public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password,
        @NotBlank String fullName,
        String countryCode
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record AuthResponse(
        String token,
        Long userId,
        String email,
        String fullName,
        String countryCode,
        String primaryCurrencyCode,
        String primaryCurrencySymbol,
        boolean onboardingCompleted
    ) {}

    public record OnboardingRequest(
        String countryCode,
        String primaryCurrencyCode,
        Integer age,
        String stateRegion,
        String city,
        String occupation,
        String studentOrProfessional,
        String educationLevel,
        String preferredLanguage,
        BigDecimal monthlyIncome,
        BigDecimal pocketMoney,
        BigDecimal otherIncome,
        BigDecimal monthlySavingsTarget,
        BigDecimal existingInvestments,
        BigDecimal emergencySavings,
        String housingType,
        String riskTolerance
    ) {}
}
