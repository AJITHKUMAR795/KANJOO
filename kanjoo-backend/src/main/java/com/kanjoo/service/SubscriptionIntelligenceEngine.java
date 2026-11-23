package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.OfferSubscriptionRepository;
import com.kanjoo.repository.UserProfileRepository;
import com.kanjoo.repository.UserSubscriptionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class SubscriptionIntelligenceEngine {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final OfferSubscriptionRepository offerSubscriptionRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrencyService currencyService;

    public SubscriptionIntelligenceEngine(UserSubscriptionRepository userSubscriptionRepository,
                                          OfferSubscriptionRepository offerSubscriptionRepository,
                                          UserProfileRepository userProfileRepository,
                                          CurrencyService currencyService) {
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.offerSubscriptionRepository = offerSubscriptionRepository;
        this.userProfileRepository = userProfileRepository;
        this.currencyService = currencyService;
    }

    public record SubscriptionEvaluation(
        UserSubscription userSubscription,
        OfferSubscription matchingOffer,
        String eligibilityStatus, // ELIGIBLE, POTENTIALLY_ELIGIBLE, NOT_ELIGIBLE, ACTIVE_OPTIMIZED
        BigDecimal originalMonthlyPrice,
        BigDecimal recommendedMonthlyPrice,
        BigDecimal monthlySavings,
        BigDecimal annualSavings,
        String recommendationNote,
        boolean isUnusedLeak
    ) {}

    public List<SubscriptionEvaluation> evaluateUserSubscriptions(Long userId) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) return Collections.emptyList();

        UserProfile profile = profileOpt.get();
        boolean isStudent = "STUDENT".equalsIgnoreCase(profile.getStudentOrProfessional()) 
                         || (profile.getAge() != null && profile.getAge() <= 24);

        List<UserSubscription> userSubs = userSubscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<OfferSubscription> availableOffers = offerSubscriptionRepository.findByCountry(profile.getCountry());

        List<SubscriptionEvaluation> evaluations = new ArrayList<>();

        for (UserSubscription sub : userSubs) {
            BigDecimal subPriceInPrimary = currencyService.convert(sub.getPrice(), sub.getCurrency(), profile.getPrimaryCurrency());
            
            // Check if unused
            if (!sub.isActivelyUsed()) {
                BigDecimal annualSavings = subPriceInPrimary.multiply(BigDecimal.valueOf(12)).setScale(2, RoundingMode.HALF_UP);
                evaluations.add(new SubscriptionEvaluation(
                    sub,
                    null,
                    "INACTIVE_LEAK",
                    subPriceInPrimary,
                    BigDecimal.ZERO,
                    subPriceInPrimary,
                    annualSavings,
                    "You marked this subscription as inactive or rarely used. Canceling it stops immediate cash leakage.",
                    true
                ));
                continue;
            }

            // Find student or discount alternative
            Optional<OfferSubscription> matchingOffer = availableOffers.stream()
                .filter(o -> o.getServiceName().toLowerCase().contains(sub.getServiceName().toLowerCase()) 
                          || sub.getServiceName().toLowerCase().contains(o.getProviderName().toLowerCase()))
                .filter(o -> {
                    BigDecimal offerPrice = currencyService.convert(o.getDiscountedPrice(), o.getCurrency(), profile.getPrimaryCurrency());
                    return offerPrice.compareTo(subPriceInPrimary) < 0;
                })
                .findFirst();

            if (matchingOffer.isPresent()) {
                OfferSubscription offer = matchingOffer.get();
                BigDecimal offerMonthly = currencyService.convert(offer.getDiscountedPrice(), offer.getCurrency(), profile.getPrimaryCurrency());
                BigDecimal monthlyDiff = subPriceInPrimary.subtract(offerMonthly);
                BigDecimal annualDiff = monthlyDiff.multiply(BigDecimal.valueOf(12)).setScale(2, RoundingMode.HALF_UP);

                String status = (offer.isStudentOnly() && !isStudent) ? "POTENTIALLY_ELIGIBLE" : "ELIGIBLE";
                String note = offer.isStudentOnly() 
                    ? "You qualify for student pricing (" + offer.getBenefitsSummary() + "). Save up to 50% monthly."
                    : "A verified discounted tier or promo plan is available from " + offer.getProviderName() + ".";

                evaluations.add(new SubscriptionEvaluation(
                    sub,
                    offer,
                    status,
                    subPriceInPrimary,
                    offerMonthly,
                    monthlyDiff,
                    annualDiff,
                    note,
                    false
                ));
            } else {
                evaluations.add(new SubscriptionEvaluation(
                    sub,
                    null,
                    "ACTIVE_OPTIMIZED",
                    subPriceInPrimary,
                    subPriceInPrimary,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    "Plan is currently active and within standard market range.",
                    false
                ));
            }
        }

        return evaluations;
    }
}
