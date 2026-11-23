package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.EmergencyFundService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/emergency-fund")
public class EmergencyFundController {

    private final EmergencyFundService emergencyService;

    public EmergencyFundController(EmergencyFundService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @GetMapping("/plan")
    public ResponseEntity<?> getPlan(
        @AuthenticationPrincipal User user,
        @RequestParam(defaultValue = "6") int monthsTarget
    ) {
        Long userId = user != null ? user.getId() : 1L;
        return ResponseEntity.ok(emergencyService.evaluatePlan(userId, monthsTarget));
    }

    @PostMapping("/target")
    public ResponseEntity<?> updateTarget(
        @AuthenticationPrincipal User user,
        @RequestBody Map<String, Integer> payload
    ) {
        int months = payload.getOrDefault("monthsTarget", 6);
        Long userId = user != null ? user.getId() : 1L;
        return ResponseEntity.ok(emergencyService.evaluatePlan(userId, months));
    }
}
