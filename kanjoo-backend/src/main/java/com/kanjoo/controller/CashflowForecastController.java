package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.CashflowPredictorEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cashflow")
public class CashflowForecastController {

    private final CashflowPredictorEngine cashflowEngine;

    public CashflowForecastController(CashflowPredictorEngine cashflowEngine) {
        this.cashflowEngine = cashflowEngine;
    }

    @GetMapping("/forecast")
    public ResponseEntity<?> getForecast(
        @AuthenticationPrincipal User user,
        @RequestParam(defaultValue = "30") int horizon
    ) {
        Long userId = user != null ? user.getId() : 1L;
        return ResponseEntity.ok(cashflowEngine.generateForecast(userId, horizon));
    }
}
