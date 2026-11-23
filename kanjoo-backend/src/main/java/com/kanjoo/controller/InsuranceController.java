package com.kanjoo.controller;

import com.kanjoo.entity.Currency;
import com.kanjoo.entity.InsurancePolicy;
import com.kanjoo.entity.User;
import com.kanjoo.repository.CurrencyRepository;
import com.kanjoo.repository.InsurancePolicyRepository;
import com.kanjoo.service.InsuranceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/insurance")
public class InsuranceController {

    private final InsuranceService insuranceService;
    private final InsurancePolicyRepository insuranceRepository;
    private final CurrencyRepository currencyRepository;

    public InsuranceController(InsuranceService insuranceService,
                               InsurancePolicyRepository insuranceRepository,
                               CurrencyRepository currencyRepository) {
        this.insuranceService = insuranceService;
        this.insuranceRepository = insuranceRepository;
        this.currencyRepository = currencyRepository;
    }

    public record CreatePolicyRequest(
        String policyType,
        String providerName,
        String policyNumber,
        BigDecimal sumInsured,
        BigDecimal annualPremium,
        String currencyCode,
        LocalDate renewalDate
    ) {}

    @GetMapping
    public ResponseEntity<?> getAdequacyReport(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(insuranceService.getAdequacyReport(user));
    }

    @PostMapping
    public ResponseEntity<?> addPolicy(@AuthenticationPrincipal User user,
                                       @RequestBody CreatePolicyRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        Currency currency = currencyRepository.findById(req.currencyCode() != null ? req.currencyCode() : "INR")
            .orElseGet(() -> currencyRepository.findAll().get(0));

        InsurancePolicy policy = new InsurancePolicy();
        policy.setUser(user);
        policy.setPolicyType(req.policyType() != null ? req.policyType() : "HEALTH");
        policy.setProviderName(req.providerName());
        policy.setPolicyNumber(req.policyNumber());
        policy.setSumInsured(req.sumInsured() != null ? req.sumInsured() : BigDecimal.ZERO);
        policy.setAnnualPremium(req.annualPremium() != null ? req.annualPremium() : BigDecimal.ZERO);
        policy.setCurrency(currency);
        policy.setRenewalDate(req.renewalDate() != null ? req.renewalDate() : LocalDate.now().plusYears(1));
        policy.setActive(true);

        policy = insuranceRepository.save(policy);
        return ResponseEntity.ok(policy);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePolicy(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        insuranceRepository.findById(id).ifPresent(p -> {
            if (p.getUser().getId().equals(user.getId())) {
                insuranceRepository.delete(p);
            }
        });
        return ResponseEntity.ok().build();
    }
}
