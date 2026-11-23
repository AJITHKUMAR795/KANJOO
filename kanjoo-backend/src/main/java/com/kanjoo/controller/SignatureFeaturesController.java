package com.kanjoo.controller;

import com.kanjoo.dto.SimulationDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intelligence")
public class SignatureFeaturesController {

    private final MoneyLeakDetectorEngine leakEngine;
    private final BeforeYouSpendEngine beforeSpendEngine;
    private final WhatIfSimulatorEngine whatIfEngine;
    private final FinancialHealthScoreEngine healthScoreEngine;
    private final KanjooPlanRepository kanjooPlanRepository;
    private final KanjooPlanItemRepository kanjooPlanItemRepository;

    public SignatureFeaturesController(MoneyLeakDetectorEngine leakEngine,
                                       BeforeYouSpendEngine beforeSpendEngine,
                                       WhatIfSimulatorEngine whatIfEngine,
                                       FinancialHealthScoreEngine healthScoreEngine,
                                       KanjooPlanRepository kanjooPlanRepository,
                                       KanjooPlanItemRepository kanjooPlanItemRepository) {
        this.leakEngine = leakEngine;
        this.beforeSpendEngine = beforeSpendEngine;
        this.whatIfEngine = whatIfEngine;
        this.healthScoreEngine = healthScoreEngine;
        this.kanjooPlanRepository = kanjooPlanRepository;
        this.kanjooPlanItemRepository = kanjooPlanItemRepository;
    }

    @GetMapping("/money-leaks")
    public ResponseEntity<?> getMoneyLeaks(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(leakEngine.detectLeaks(user.getId()));
    }

    @PostMapping("/before-you-spend")
    public ResponseEntity<?> evaluatePlannedSpend(@AuthenticationPrincipal User user,
                                                  @RequestBody BeforeSpendRequest req) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(beforeSpendEngine.evaluatePurchase(
            user.getId(),
            req.itemName(),
            req.amount(),
            req.category(),
            req.urgency()
        ));
    }

    @PostMapping("/what-if")
    public ResponseEntity<?> simulateWhatIf(@AuthenticationPrincipal User user,
                                            @RequestBody WhatIfRequest req) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(whatIfEngine.simulateScenario(
            user.getId(),
            req.scenarioType(),
            req.customValue()
        ));
    }

    @GetMapping("/health-score")
    public ResponseEntity<?> getHealthScore(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(healthScoreEngine.calculateScore(user.getId()));
    }

    @GetMapping("/kanjoo-plan")
    public ResponseEntity<?> getKanjooPlan(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        KanjooPlan plan = kanjooPlanRepository.findByUserId(user.getId()).orElseGet(() -> {
            KanjooPlan p = new KanjooPlan();
            p.setUser(user);
            return kanjooPlanRepository.save(p);
        });
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/kanjoo-plan/items")
    public ResponseEntity<?> addPlanItem(@AuthenticationPrincipal User user,
                                         @RequestBody AddPlanItemRequest req) {
        if (user == null) return ResponseEntity.status(401).build();
        KanjooPlan plan = kanjooPlanRepository.findByUserId(user.getId()).orElseGet(() -> {
            KanjooPlan p = new KanjooPlan();
            p.setUser(user);
            return kanjooPlanRepository.save(p);
        });

        KanjooPlanItem item = new KanjooPlanItem();
        item.setPlan(plan);
        item.setItemType(req.itemType());
        item.setTitle(req.title());
        item.setDescription(req.description());
        item.setPotentialMonthlySavings(req.potentialMonthlySavings());
        item.setPotentialAnnualSavings(req.potentialAnnualSavings());
        item.setImplemented(false);

        item = kanjooPlanItemRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @PatchMapping("/kanjoo-plan/items/{id}/toggle")
    public ResponseEntity<?> togglePlanItem(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        var itemOpt = kanjooPlanItemRepository.findById(id);
        if (itemOpt.isPresent()) {
            KanjooPlanItem item = itemOpt.get();
            item.setImplemented(!item.isImplemented());
            kanjooPlanItemRepository.save(item);
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }
}
