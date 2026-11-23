package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class InsuranceService {

    private final InsurancePolicyRepository insuranceRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrencyService currencyService;

    public InsuranceService(InsurancePolicyRepository insuranceRepository,
                            UserProfileRepository userProfileRepository,
                            CurrencyService currencyService) {
        this.insuranceRepository = insuranceRepository;
        this.userProfileRepository = userProfileRepository;
        this.currencyService = currencyService;
    }

    public record PolicyResponse(
        Long id,
        String policyType,
        String providerName,
        String policyNumber,
        BigDecimal sumInsured,
        BigDecimal annualPremium,
        String currencyCode,
        String currencySymbol,
        BigDecimal primarySumInsured,
        BigDecimal primaryAnnualPremium,
        LocalDate renewalDate,
        long daysUntilRenewal,
        boolean active
    ) {}

    public record InsuranceRecommendation(
        String provider,
        String planName,
        String policyType,
        BigDecimal estimatedAnnualCost,
        String coverageHighlights,
        String taxBenefitSection,
        String sourceUrl
    ) {}

    public record InsuranceAdequacyReport(
        boolean hasHealthInsurance,
        boolean hasLifeInsurance,
        boolean hasVehicleInsurance,
        BigDecimal totalHealthCoverage,
        BigDecimal recommendedHealthCoverage,
        BigDecimal totalLifeCoverage,
        BigDecimal recommendedLifeCoverage,
        BigDecimal totalAnnualPremium,
        BigDecimal estimatedTaxSavings,
        int healthAdequacyScore, // 0-100
        List<String> criticalGaps,
        List<String> strengths,
        List<PolicyResponse> policies,
        List<InsuranceRecommendation> recommendedPlans
    ) {}

    public InsuranceAdequacyReport getAdequacyReport(User user) {
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        Currency primaryCurr = profile != null ? profile.getPrimaryCurrency() : null;

        List<InsurancePolicy> userPolicies = insuranceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        List<PolicyResponse> policyResponses = new ArrayList<>();
        BigDecimal totalHealth = BigDecimal.ZERO;
        BigDecimal totalLife = BigDecimal.ZERO;
        BigDecimal totalPremium = BigDecimal.ZERO;
        boolean hasVehicle = false;

        LocalDate today = LocalDate.now();

        for (InsurancePolicy p : userPolicies) {
            BigDecimal primarySum = (primaryCurr != null) ? currencyService.convert(p.getSumInsured(), p.getCurrency(), primaryCurr) : p.getSumInsured();
            BigDecimal primaryPrem = (primaryCurr != null) ? currencyService.convert(p.getAnnualPremium(), p.getCurrency(), primaryCurr) : p.getAnnualPremium();

            long daysUntil = java.time.temporal.ChronoUnit.DAYS.between(today, p.getRenewalDate());

            policyResponses.add(new PolicyResponse(
                p.getId(),
                p.getPolicyType(),
                p.getProviderName(),
                p.getPolicyNumber(),
                p.getSumInsured(),
                p.getAnnualPremium(),
                p.getCurrency().getCode(),
                p.getCurrency().getSymbol(),
                primarySum,
                primaryPrem,
                p.getRenewalDate(),
                daysUntil,
                p.isActive()
            ));

            if (p.isActive()) {
                totalPremium = totalPremium.add(primaryPrem);
                if ("HEALTH".equalsIgnoreCase(p.getPolicyType())) {
                    totalHealth = totalHealth.add(primarySum);
                } else if ("LIFE_TERM".equalsIgnoreCase(p.getPolicyType()) || "LIFE".equalsIgnoreCase(p.getPolicyType())) {
                    totalLife = totalLife.add(primarySum);
                } else if ("VEHICLE".equalsIgnoreCase(p.getPolicyType())) {
                    hasVehicle = true;
                }
            }
        }

        BigDecimal annualIncome = (profile != null)
            ? profile.getMonthlyIncome().multiply(BigDecimal.valueOf(12))
            : BigDecimal.valueOf(600000);

        // Recommended life coverage: 12x annual income
        BigDecimal recLife = annualIncome.multiply(BigDecimal.valueOf(12));
        // Recommended health coverage: minimum 500,000 INR or 50,000 USD
        BigDecimal recHealth = "INR".equalsIgnoreCase(primaryCurr != null ? primaryCurr.getCode() : "INR")
            ? BigDecimal.valueOf(1000000)
            : BigDecimal.valueOf(50000);

        List<String> gaps = new ArrayList<>();
        List<String> strengths = new ArrayList<>();

        boolean hasHealth = totalHealth.compareTo(BigDecimal.ZERO) > 0;
        boolean hasLife = totalLife.compareTo(BigDecimal.ZERO) > 0;

        if (!hasHealth) {
            gaps.add("CRITICAL: No active Health Insurance detected. A single medical emergency could wipe out liquid savings.");
        } else if (totalHealth.compareTo(recHealth) < 0) {
            gaps.add(String.format("Underinsured Health: Current coverage is below the recommended %s %s benchmark.",
                primaryCurr != null ? primaryCurr.getSymbol() : "₹", recHealth.toPlainString()));
        } else {
            strengths.add("Strong Health Safety Net: Adequate hospitalization coverage is secured.");
        }

        if (!hasLife) {
            gaps.add("No Term Life Insurance: If you have financial dependents, securing a pure term cover protects their future.");
        } else if (totalLife.compareTo(recLife) < 0) {
            gaps.add(String.format("Underinsured Life Cover: Current cover is below the 12x annual income rule (%s %s).",
                primaryCurr != null ? primaryCurr.getSymbol() : "₹", recLife.toPlainString()));
        } else {
            strengths.add("Excellent Life Protection: Comprehensive term cover meeting the 10x-15x income replacement rule.");
        }

        // Tax Savings calculation (e.g. 80D allows up to 25k INR, 80C up to 1.5L INR)
        BigDecimal taxBenefit = totalPremium.multiply(BigDecimal.valueOf(0.20)).setScale(2, RoundingMode.HALF_UP);

        int score = 30;
        if (hasHealth) score += 40;
        if (hasLife) score += 30;

        List<InsuranceRecommendation> recs = getRecommendationsForCountry(profile != null ? profile.getCountry().getCode() : "IN");

        return new InsuranceAdequacyReport(
            hasHealth,
            hasLife,
            hasVehicle,
            totalHealth,
            recHealth,
            totalLife,
            recLife,
            totalPremium,
            taxBenefit,
            score,
            gaps,
            strengths,
            policyResponses,
            recs
        );
    }

    public List<InsuranceRecommendation> getRecommendationsForCountry(String countryCode) {
        List<InsuranceRecommendation> list = new ArrayList<>();
        if ("IN".equalsIgnoreCase(countryCode)) {
            list.add(new InsuranceRecommendation(
                "HDFC ERGO", "Optima Secure Comprehensive Health", "HEALTH", BigDecimal.valueOf(14500),
                "2X coverage from Day 1, zero deduction on consumables, 13,000+ cashless hospitals",
                "Section 80D (Save up to ₹25,000)", "https://www.hdfcergo.com"
            ));
            list.add(new InsuranceRecommendation(
                "Tata AIA", "Sampoorna Raksha Supreme Pure Term", "LIFE_TERM", BigDecimal.valueOf(11500),
                "₹1.5 Cr pure life protection until age 75, critical illness rider bundled",
                "Section 80C (Save up to ₹1,50,000)", "https://www.tataaia.com"
            ));
            list.add(new InsuranceRecommendation(
                "Care Health", "Care Supreme Super Top-Up", "HEALTH", BigDecimal.valueOf(4200),
                "₹50 Lakhs super top-up with ₹5 Lakh deductible. High leverage for budget users.",
                "Section 80D", "https://www.careinsurance.com"
            ));
        } else if ("US".equalsIgnoreCase(countryCode)) {
            list.add(new InsuranceRecommendation(
                "Blue Cross Blue Shield", "Gold PPO Comprehensive", "HEALTH", BigDecimal.valueOf(4800),
                "$0 preventive care, nationwide network, low deductible",
                "HSA / FSA Qualified", "https://www.bcbs.com"
            ));
            list.add(new InsuranceRecommendation(
                "Northwestern Mutual", "Level Term Life 20-Year", "LIFE_TERM", BigDecimal.valueOf(750),
                "$1,000,000 guaranteed death benefit, convertible to permanent",
                "Income tax-free payout", "https://www.northwesternmutual.com"
            ));
        } else {
            list.add(new InsuranceRecommendation(
                "Bupa Global", "Worldwide Health Options", "HEALTH", BigDecimal.valueOf(2200),
                "Global private clinic access, evacuation assistance, direct billing",
                "Standard medical allowance", "https://www.bupaglobal.com"
            ));
            list.add(new InsuranceRecommendation(
                "Aviva", "Life Insurance Level Term", "LIFE_TERM", BigDecimal.valueOf(350),
                "£500,000 family protection cover, terminal illness benefit included",
                "Inheritance tax trust option", "https://www.aviva.co.uk"
            ));
        }
        return list;
    }
}
