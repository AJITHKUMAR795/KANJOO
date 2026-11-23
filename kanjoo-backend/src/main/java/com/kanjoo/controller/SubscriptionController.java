package com.kanjoo.controller;

import com.kanjoo.dto.SubscriptionDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.service.CurrencyService;
import com.kanjoo.service.SubscriptionIntelligenceEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final OfferSubscriptionRepository offerRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrencyRepository currencyRepository;
    private final CurrencyService currencyService;
    private final SubscriptionIntelligenceEngine subscriptionEngine;

    public SubscriptionController(OfferSubscriptionRepository offerRepository,
                                  UserSubscriptionRepository userSubscriptionRepository,
                                  UserProfileRepository userProfileRepository,
                                  CurrencyRepository currencyRepository,
                                  CurrencyService currencyService,
                                  SubscriptionIntelligenceEngine subscriptionEngine) {
        this.offerRepository = offerRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.userProfileRepository = userProfileRepository;
        this.currencyRepository = currencyRepository;
        this.currencyService = currencyService;
        this.subscriptionEngine = subscriptionEngine;
    }

    @GetMapping("/catalog")
    public ResponseEntity<List<OfferSubscription>> getCatalog(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        String countryCode = profile != null ? profile.getCountry().getCode() : "IN";
        return ResponseEntity.ok(offerRepository.findByCountryCode(countryCode));
    }

    @GetMapping("/user")
    public ResponseEntity<List<UserSubscriptionResponse>> getUserSubscriptions(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        Currency primaryCurr = profile != null ? profile.getPrimaryCurrency() : null;

        List<UserSubscription> list = userSubscriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<UserSubscriptionResponse> res = list.stream().map(s -> {
            BigDecimal primaryPrice = (primaryCurr != null)
                ? currencyService.convert(s.getPrice(), s.getCurrency(), primaryCurr)
                : s.getPrice();

            return new UserSubscriptionResponse(
                s.getId(),
                s.getOffer() != null ? s.getOffer().getId() : null,
                s.getServiceName(),
                s.getPrice(),
                s.getCurrency().getCode(),
                primaryPrice,
                primaryCurr != null ? primaryCurr.getCode() : s.getCurrency().getCode(),
                s.getBillingCycle(),
                s.getNextBillingDate(),
                s.isActivelyUsed(),
                s.getCategory()
            );
        }).toList();

        return ResponseEntity.ok(res);
    }

    @PostMapping("/user")
    public ResponseEntity<?> addUserSubscription(@AuthenticationPrincipal User user,
                                                 @RequestBody AddUserSubscriptionRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        Currency curr = currencyRepository.findById(req.currencyCode()).orElseThrow();
        OfferSubscription offer = req.offerId() != null ? offerRepository.findById(req.offerId()).orElse(null) : null;

        UserSubscription sub = new UserSubscription();
        sub.setUser(user);
        sub.setOffer(offer);
        sub.setServiceName(req.serviceName());
        sub.setPrice(req.price());
        sub.setCurrency(curr);
        sub.setBillingCycle(req.billingCycle() != null ? req.billingCycle() : "MONTHLY");
        sub.setNextBillingDate(req.nextBillingDate());
        sub.setActivelyUsed(req.activelyUsed());
        sub.setCategory(req.category() != null ? req.category() : "ENTERTAINMENT");

        sub = userSubscriptionRepository.save(sub);
        return ResponseEntity.ok(sub);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteSubscription(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        userSubscriptionRepository.findById(id).ifPresent(s -> {
            if (s.getUser().getId().equals(user.getId())) {
                userSubscriptionRepository.delete(s);
            }
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/evaluate")
    public ResponseEntity<?> evaluateSubscriptions(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(subscriptionEngine.evaluateUserSubscriptions(user.getId()));
    }
}
