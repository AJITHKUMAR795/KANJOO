package com.kanjoo.controller;

import com.kanjoo.dto.IncomeDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.service.CurrencyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeSourceRepository incomeSourceRepository;
    private final CurrencyRepository currencyRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrencyService currencyService;

    public IncomeController(IncomeSourceRepository incomeSourceRepository,
                            CurrencyRepository currencyRepository,
                            UserProfileRepository userProfileRepository,
                            CurrencyService currencyService) {
        this.incomeSourceRepository = incomeSourceRepository;
        this.currencyRepository = currencyRepository;
        this.userProfileRepository = userProfileRepository;
        this.currencyService = currencyService;
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getIncomes(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        String primaryCurr = profile != null ? profile.getPrimaryCurrency().getCode() : "USD";

        List<IncomeSource> list = incomeSourceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<IncomeResponse> res = list.stream().map(i -> new IncomeResponse(
            i.getId(),
            i.getName(),
            i.getAmount(),
            i.getOriginalCurrency().getCode(),
            i.getExchangeRate(),
            i.getPrimaryAmount(),
            primaryCurr,
            i.getFrequency(),
            i.isPrimary()
        )).toList();

        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<?> addIncome(@AuthenticationPrincipal User user,
                                       @Valid @RequestBody CreateIncomeRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        UserProfile profile = userProfileRepository.findByUser(user).orElseThrow();
        Currency originalCurrency = currencyRepository.findById(req.originalCurrency()).orElseThrow();
        Currency primaryCurrency = profile.getPrimaryCurrency();

        BigDecimal exchangeRate = currencyService.getExchangeRate(originalCurrency, primaryCurrency);
        BigDecimal primaryAmount = currencyService.convert(req.amount(), originalCurrency, primaryCurrency);

        IncomeSource income = new IncomeSource();
        income.setUser(user);
        income.setName(req.name());
        income.setAmount(req.amount());
        income.setOriginalCurrency(originalCurrency);
        income.setExchangeRate(exchangeRate);
        income.setPrimaryAmount(primaryAmount);
        income.setFrequency(req.frequency() != null ? req.frequency() : "MONTHLY");
        income.setPrimary(req.primary());

        income = incomeSourceRepository.save(income);

        // Update profile monthly income if primary
        if (req.primary()) {
            profile.setMonthlyIncome(primaryAmount);
            userProfileRepository.save(profile);
        }

        return ResponseEntity.ok(income);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        incomeSourceRepository.findById(id).ifPresent(i -> {
            if (i.getUser().getId().equals(user.getId())) {
                incomeSourceRepository.delete(i);
            }
        });
        return ResponseEntity.ok().build();
    }
}
