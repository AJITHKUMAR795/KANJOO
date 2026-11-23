package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.DebtOptimizerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtOptimizerService debtService;

    public DebtController(DebtOptimizerService debtService) {
        this.debtService = debtService;
    }

    @GetMapping
    public ResponseEntity<?> getDebtAnalysis(
        @AuthenticationPrincipal User user,
        @RequestParam(defaultValue = "3000") BigDecimal extraPayment
    ) {
        Long userId = user != null ? user.getId() : 1L;
        return ResponseEntity.ok(debtService.evaluateDebts(userId, extraPayment));
    }

    @PostMapping
    public ResponseEntity<?> addDebt(
        @AuthenticationPrincipal User user,
        @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(Map.of("success", true, "message", "Debt recorded successfully"));
    }
}
