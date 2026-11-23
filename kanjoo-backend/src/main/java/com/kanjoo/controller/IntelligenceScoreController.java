package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.FinancialIntelligenceScoreEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intelligence-score")
public class IntelligenceScoreController {

    private final FinancialIntelligenceScoreEngine scoreEngine;

    public IntelligenceScoreController(FinancialIntelligenceScoreEngine scoreEngine) {
        this.scoreEngine = scoreEngine;
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentScore(@AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        return ResponseEntity.ok(scoreEngine.evaluateUserScore(userId));
    }
}
