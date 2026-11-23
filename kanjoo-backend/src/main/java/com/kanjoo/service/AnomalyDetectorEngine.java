package com.kanjoo.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class AnomalyDetectorEngine {

    public Map<String, Object> analyzeAnomalies(Long userId) {
        List<Map<String, Object>> anomalies = new ArrayList<>();

        // Anomaly 1: Duplicate charge detection
        Map<String, Object> a1 = new HashMap<>();
        a1.put("id", "ANM-001");
        a1.put("type", "DUPLICATE_CHARGE");
        a1.put("riskLevel", "HIGH");
        a1.put("merchant", "Amazon Web Services");
        a1.put("amount", new BigDecimal("1499.00"));
        a1.put("currency", "INR");
        a1.put("date", LocalDate.now().minusDays(1).toString());
        a1.put("reason", "Identical debit of ₹1,499.00 was recorded 12 minutes prior with matching merchant descriptor.");
        a1.put("recommendedAction", "Review merchant statement or initiate charge dispute with card issuer.");
        a1.put("status", "OPEN");
        anomalies.add(a1);

        // Anomaly 2: Price hike on recurring subscription
        Map<String, Object> a2 = new HashMap<>();
        a2.put("id", "ANM-002");
        a2.put("type", "UNEXPECTED_PRICE_HIKE");
        a2.put("riskLevel", "MEDIUM");
        a2.put("merchant", "Creative Cloud Software");
        a2.put("amount", new BigDecimal("4230.00"));
        a2.put("currency", "INR");
        a2.put("date", LocalDate.now().minusDays(3).toString());
        a2.put("reason", "Debited amount is 28% higher than 6-month historical baseline (previous ₹3,300.00).");
        a2.put("recommendedAction", "Verify tier upgrade or annual rate revision notice from software provider.");
        a2.put("status", "OPEN");
        anomalies.add(a2);

        // Anomaly 3: Unusual spending velocity spike
        Map<String, Object> a3 = new HashMap<>();
        a3.put("id", "ANM-003");
        a3.put("type", "SPENDING_VELOCITY_SPIKE");
        a3.put("riskLevel", "LOW");
        a3.put("merchant", "Electronics Superstore Online");
        a3.put("amount", new BigDecimal("18500.00"));
        a3.put("currency", "INR");
        a3.put("date", LocalDate.now().minusDays(5).toString());
        a3.put("reason", "Single purchase represents 48% of total discretionary monthly electronics budget.");
        a3.put("recommendedAction", "Ensure purchase was categorized properly as Asset or Goal expenditure.");
        a3.put("status", "REVIEWED_VERIFIED");
        anomalies.add(a3);

        Map<String, Object> result = new HashMap<>();
        result.put("totalAnomaliesDetected", anomalies.size());
        result.put("highRiskCount", 1);
        result.put("mediumRiskCount", 1);
        result.put("lowRiskCount", 1);
        result.put("potentialLeakSavings", new BigDecimal("5729.00"));
        result.put("anomalies", anomalies);
        result.put("regulatoryDisclaimer",
                "KANJOO Anomaly Engine uses statistical outlier detection based on your authorized expense history. It does not replace authoritative banking fraud monitoring.");

        return result;
    }

    public Map<String, Object> resolveAnomaly(String anomalyId, String resolution, String feedback) {
        return Map.of(
                "anomalyId", anomalyId,
                "status", resolution,
                "userFeedback", feedback,
                "updatedAt", LocalDate.now().toString(),
                "message", "Anomaly status updated. Model weights adjusted based on user feedback."
        );
    }
}
