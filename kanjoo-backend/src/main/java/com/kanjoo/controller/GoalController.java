package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.GoalAcceleratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalAcceleratorService goalService;

    public GoalController(GoalAcceleratorService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGoals(@AuthenticationPrincipal User currentUser) {
        Long userId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(goalService.getGoalsSummary(userId));
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulateGoal(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User currentUser
    ) {
        String name = (String) body.getOrDefault("goalName", "New Financial Goal");
        BigDecimal target = new BigDecimal(body.getOrDefault("targetAmount", "100000").toString());
        BigDecimal current = new BigDecimal(body.getOrDefault("currentAmount", "0").toString());
        String targetDateStr = (String) body.getOrDefault("targetDate", LocalDate.now().plusMonths(12).toString());
        BigDecimal contribution = new BigDecimal(body.getOrDefault("monthlyContribution", "5000").toString());
        String priority = (String) body.getOrDefault("priority", "MEDIUM");
        String category = (String) body.getOrDefault("category", "CUSTOM");

        Map<String, Object> projection = goalService.calculateGoalProjection(
                name, target, current, LocalDate.parse(targetDateStr),
                contribution, priority, category, new BigDecimal("19047.00")
        );

        return ResponseEntity.ok(projection);
    }
}
