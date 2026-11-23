package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.entity.Currency;
import com.kanjoo.repository.RechargePlanRepository;
import com.kanjoo.repository.UserSimCardRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class RechargeOptimizationEngine {

    private final RechargePlanRepository rechargePlanRepository;
    private final UserSimCardRepository userSimCardRepository;
    private final CurrencyService currencyService;

    public RechargeOptimizationEngine(RechargePlanRepository rechargePlanRepository,
                                      UserSimCardRepository userSimCardRepository,
                                      CurrencyService currencyService) {
        this.rechargePlanRepository = rechargePlanRepository;
        this.userSimCardRepository = userSimCardRepository;
        this.currencyService = currencyService;
    }

    public record PlanCostMetrics(
        BigDecimal dailyCost,
        BigDecimal monthlyEquivalent,
        BigDecimal annualEquivalent,
        BigDecimal costPerGb
    ) {}

    public PlanCostMetrics calculateCostMetrics(RechargePlan plan) {
        if (plan == null || plan.getValidityDays() <= 0) {
            return new PlanCostMetrics(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        BigDecimal validity = BigDecimal.valueOf(plan.getValidityDays());
        BigDecimal dailyCost = plan.getPrice().divide(validity, 4, RoundingMode.HALF_UP);
        BigDecimal monthlyEquivalent = dailyCost.multiply(BigDecimal.valueOf(30)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal annualEquivalent = dailyCost.multiply(BigDecimal.valueOf(365)).setScale(2, RoundingMode.HALF_UP);

        BigDecimal effectiveTotalGb = plan.getTotalDataGb();
        if (effectiveTotalGb == null || effectiveTotalGb.compareTo(BigDecimal.ZERO) == 0) {
            if (plan.getDailyDataGb() != null && plan.getDailyDataGb().compareTo(BigDecimal.ZERO) > 0) {
                effectiveTotalGb = plan.getDailyDataGb().multiply(validity);
            } else {
                effectiveTotalGb = BigDecimal.ZERO;
            }
        }

        BigDecimal costPerGb = BigDecimal.ZERO;
        if (effectiveTotalGb.compareTo(BigDecimal.ZERO) > 0) {
            costPerGb = plan.getPrice().divide(effectiveTotalGb, 2, RoundingMode.HALF_UP);
        }

        return new PlanCostMetrics(dailyCost, monthlyEquivalent, annualEquivalent, costPerGb);
    }

    public record SimOptimizationResult(
        UserSimCard simCard,
        RechargePlan currentPlan,
        PlanCostMetrics currentMetrics,
        RechargePlan recommendedPlan,
        PlanCostMetrics recommendedMetrics,
        BigDecimal potentialMonthlySavings,
        BigDecimal potentialAnnualSavings,
        String reasoning,
        String unnecessaryPerks,
        boolean isOptimized
    ) {}

    public List<SimOptimizationResult> analyzeUserSims(Long userId, Currency primaryCurrency) {
        List<UserSimCard> simCards = userSimCardRepository.findByUserIdOrderByIdAsc(userId);
        List<SimOptimizationResult> results = new ArrayList<>();

        for (UserSimCard sim : simCards) {
            RechargePlan currentPlan = sim.getCurrentPlan();
            PlanCostMetrics currentMetrics = calculateCostMetrics(currentPlan);

            if (currentPlan == null) {
                continue;
            }

            boolean isSecondary = "SECONDARY".equalsIgnoreCase(sim.getSimSlot());
            boolean hasWifi = sim.isHasWifiAccess();

            List<RechargePlan> availablePlans = rechargePlanRepository.findByCountry(sim.getOperator().getCountry());
            RechargePlan bestPlan = currentPlan;
            BigDecimal maxMonthlySavings = BigDecimal.ZERO;
            String reasoning = "Your current plan is well-suited for your usage pattern.";
            String unnecessaryPerks = "None detected.";

            if (isSecondary && hasWifi) {
                // Secondary SIM in Wi-Fi environment only needs incoming validity & active number preservation!
                Optional<RechargePlan> incomingSaver = availablePlans.stream()
                    .filter(p -> "SECONDARY_INCOMING".equalsIgnoreCase(p.getPlanType()) 
                              || (p.getPrice().compareTo(currentPlan.getPrice()) < 0 && p.getValidityDays() >= 30))
                    .min(Comparator.comparing(p -> calculateCostMetrics(p).monthlyEquivalent()));

                if (incomingSaver.isPresent()) {
                    RechargePlan candidate = incomingSaver.get();
                    PlanCostMetrics candidateMetrics = calculateCostMetrics(candidate);

                    BigDecimal monthlyDiff = currentMetrics.monthlyEquivalent().subtract(candidateMetrics.monthlyEquivalent());
                    if (monthlyDiff.compareTo(BigDecimal.ZERO) > 0) {
                        bestPlan = candidate;
                        maxMonthlySavings = monthlyDiff;
                        reasoning = "Because this is your secondary SIM and you have reliable Wi-Fi, you are paying for unused daily data allowances (" + 
                                    (currentPlan.getDailyDataGb() != null ? currentPlan.getDailyDataGb() + "GB/day" : "full pack") + 
                                    "). Switching to an incoming-saver plan keeps your number active while saving money.";
                        unnecessaryPerks = "Daily data pack, OTT bundled subscriptions, excess outgoing SMS quota.";
                    }
                }
            } else {
                // Primary SIM: check for longer validity packs with lower daily cost
                Optional<RechargePlan> cheaperEquivalent = availablePlans.stream()
                    .filter(p -> p.getOperator().getId().equals(sim.getOperator().getId()))
                    .filter(p -> p.getValidityDays() > currentPlan.getValidityDays())
                    .min(Comparator.comparing(p -> calculateCostMetrics(p).dailyCost()));

                if (cheaperEquivalent.isPresent()) {
                    RechargePlan candidate = cheaperEquivalent.get();
                    PlanCostMetrics candidateMetrics = calculateCostMetrics(candidate);
                    BigDecimal monthlyDiff = currentMetrics.monthlyEquivalent().subtract(candidateMetrics.monthlyEquivalent());
                    if (monthlyDiff.compareTo(BigDecimal.valueOf(10)) > 0) {
                        bestPlan = candidate;
                        maxMonthlySavings = monthlyDiff;
                        reasoning = "Switching from short 28-day recharges to an 84-day or annual pack reduces your effective daily recharge cost.";
                        unnecessaryPerks = "28-day recharge friction and higher per-day renewal rates.";
                    }
                }
            }

            BigDecimal annualSavings = maxMonthlySavings.multiply(BigDecimal.valueOf(12)).setScale(2, RoundingMode.HALF_UP);
            PlanCostMetrics recommendedMetrics = calculateCostMetrics(bestPlan);

            results.add(new SimOptimizationResult(
                sim,
                currentPlan,
                currentMetrics,
                bestPlan,
                recommendedMetrics,
                maxMonthlySavings,
                annualSavings,
                reasoning,
                unnecessaryPerks,
                maxMonthlySavings.compareTo(BigDecimal.ZERO) == 0
            ));
        }

        return results;
    }
}
