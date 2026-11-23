package com.kanjoo.controller;

import com.kanjoo.dto.InvestmentDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.service.InvestmentEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    private final InvestmentRepository investmentRepository;
    private final CurrencyRepository currencyRepository;
    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;
    private final InsurancePolicyRepository insurancePolicyRepository;
    private final InvestmentEngine investmentEngine;

    public InvestmentController(InvestmentRepository investmentRepository,
                                CurrencyRepository currencyRepository,
                                UserProfileRepository userProfileRepository,
                                ExpenseRepository expenseRepository,
                                InsurancePolicyRepository insurancePolicyRepository,
                                InvestmentEngine investmentEngine) {
        this.investmentRepository = investmentRepository;
        this.currencyRepository = currencyRepository;
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
        this.insurancePolicyRepository = insurancePolicyRepository;
        this.investmentEngine = investmentEngine;
    }

    @GetMapping
    public ResponseEntity<List<Investment>> getInvestments(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(investmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/eligibility")
    public ResponseEntity<?> getEligibility(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        List<Expense> expenses = expenseRepository.findByUserIdAndDateRange(user.getId(), startOfMonth, LocalDate.now());
        BigDecimal monthExpenses = expenses.stream()
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean hasHealth = insurancePolicyRepository.findByUserIdAndActiveTrue(user.getId()).stream()
            .anyMatch(p -> "HEALTH".equalsIgnoreCase(p.getPolicyType()));

        return ResponseEntity.ok(investmentEngine.evaluateInvestmentEligibility(profile, monthExpenses, hasHealth));
    }

    @PostMapping
    public ResponseEntity<?> addInvestment(@AuthenticationPrincipal User user,
                                           @RequestBody CreateInvestmentRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        Currency currency = currencyRepository.findById(req.currencyCode()).orElseThrow();

        Investment inv = new Investment();
        inv.setUser(user);
        inv.setAssetType(req.assetType());
        inv.setName(req.name());
        inv.setInvestedAmount(req.investedAmount());
        inv.setCurrentValue(req.currentValue());
        inv.setCurrency(currency);
        inv.setMonthlyContribution(req.monthlyContribution());
        inv.setExpectedAnnualReturn(req.expectedAnnualReturn());
        inv.setStartDate(req.startDate());

        inv = investmentRepository.save(inv);
        return ResponseEntity.ok(inv);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvestment(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        investmentRepository.findById(id).ifPresent(i -> {
            if (i.getUser().getId().equals(user.getId())) {
                investmentRepository.delete(i);
            }
        });
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sip-calculate")
    public ResponseEntity<?> calculateSip(@AuthenticationPrincipal User user,
                                          @RequestBody SipCalculatorRequest req) {
        if (user == null) return ResponseEntity.status(401).build();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        Currency currency = profile != null ? profile.getPrimaryCurrency() : currencyRepository.findById("USD").orElseThrow();

        return ResponseEntity.ok(investmentEngine.calculateSip(
            req.monthlyInvestment(),
            req.expectedAnnualReturn(),
            req.durationYears(),
            currency
        ));
    }
}
