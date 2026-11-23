package com.kanjoo.controller;

import com.kanjoo.dto.AuthDto.OnboardingRequest;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final CountryRepository countryRepository;
    private final CurrencyRepository currencyRepository;
    private final UserProfileRepository userProfileRepository;

    public OnboardingController(CountryRepository countryRepository,
                                CurrencyRepository currencyRepository,
                                UserProfileRepository userProfileRepository) {
        this.countryRepository = countryRepository;
        this.currencyRepository = currencyRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @GetMapping("/countries")
    public ResponseEntity<List<Country>> getCountries() {
        return ResponseEntity.ok(countryRepository.findByActiveTrueOrderByNameAsc());
    }

    @GetMapping("/currencies")
    public ResponseEntity<List<Currency>> getCurrencies() {
        return ResponseEntity.ok(currencyRepository.findAll());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userProfileRepository.findByUser(user).orElse(null));
    }

    @PostMapping("/profile")
    public ResponseEntity<?> submitOnboarding(@AuthenticationPrincipal User user,
                                              @RequestBody OnboardingRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElseGet(() -> {
            UserProfile p = new UserProfile();
            p.setUser(user);
            return p;
        });

        if (req.countryCode() != null) {
            Country country = countryRepository.findById(req.countryCode()).orElse(null);
            if (country != null) {
                profile.setCountry(country);
                profile.setPrimaryCurrency(country.getCurrency());
            }
        }

        if (req.primaryCurrencyCode() != null) {
            currencyRepository.findById(req.primaryCurrencyCode()).ifPresent(profile::setPrimaryCurrency);
        }

        if (req.age() != null) profile.setAge(req.age());
        if (req.stateRegion() != null) profile.setStateRegion(req.stateRegion());
        if (req.city() != null) profile.setCity(req.city());
        if (req.occupation() != null) profile.setOccupation(req.occupation());
        if (req.studentOrProfessional() != null) profile.setStudentOrProfessional(req.studentOrProfessional());
        if (req.educationLevel() != null) profile.setEducationLevel(req.educationLevel());
        if (req.preferredLanguage() != null) profile.setPreferredLanguage(req.preferredLanguage());
        if (req.monthlyIncome() != null) profile.setMonthlyIncome(req.monthlyIncome());
        if (req.pocketMoney() != null) profile.setPocketMoney(req.pocketMoney());
        if (req.otherIncome() != null) profile.setOtherIncome(req.otherIncome());
        if (req.monthlySavingsTarget() != null) profile.setMonthlySavingsTarget(req.monthlySavingsTarget());
        if (req.existingInvestments() != null) profile.setExistingInvestments(req.existingInvestments());
        if (req.emergencySavings() != null) profile.setEmergencySavings(req.emergencySavings());
        if (req.housingType() != null) profile.setHousingType(req.housingType());
        if (req.riskTolerance() != null) profile.setRiskTolerance(req.riskTolerance());

        profile.setOnboardingCompleted(true);
        profile = userProfileRepository.save(profile);

        return ResponseEntity.ok(profile);
    }
}
