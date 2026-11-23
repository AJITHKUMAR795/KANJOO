package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.AnomalyDetectorEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/anomalies")
public class AnomalyController {

    private final AnomalyDetectorEngine anomalyEngine;

    public AnomalyController(AnomalyDetectorEngine anomalyEngine) {
        this.anomalyEngine = anomalyEngine;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnomalies(@AuthenticationPrincipal User currentUser) {
        Long userId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(anomalyEngine.analyzeAnomalies(userId));
    }

    @PostMapping("/{anomalyId}/feedback")
    public ResponseEntity<Map<String, Object>> recordFeedback(
            @PathVariable String anomalyId,
            @RequestBody Map<String, String> body
    ) {
        String resolution = body.getOrDefault("resolution", "RESOLVED");
        String feedback = body.getOrDefault("feedback", "User confirmed transaction.");
        return ResponseEntity.ok(anomalyEngine.resolveAnomaly(anomalyId, resolution, feedback));
    }
}
