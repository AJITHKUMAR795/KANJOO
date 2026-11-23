package com.kanjoo.service;

import com.kanjoo.entity.Country;
import com.kanjoo.entity.Currency;
import com.kanjoo.entity.RechargePlan;
import com.kanjoo.entity.TelecomOperator;
import com.kanjoo.repository.RechargePlanRepository;
import com.kanjoo.repository.UserSimCardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class RechargeOptimizationEngineTest {

    private RechargeOptimizationEngine engine;
    private Currency inr;
    private Country india;
    private TelecomOperator jio;

    @BeforeEach
    void setUp() {
        engine = new RechargeOptimizationEngine(null, null, null);

        inr = new Currency("INR", "Indian Rupee", "₹", 2);
        india = new Country("IN", "India", inr, "+91");
        jio = new TelecomOperator();
        jio.setName("Jio");
        jio.setCountry(india);
    }

    @Test
    void testRechargeCostFormulas() {
        // Plan: ₹299 for 28 days with 1.5GB/day (42GB total)
        RechargePlan plan = new RechargePlan();
        plan.setPrice(new BigDecimal("299.00"));
        plan.setValidityDays(28);
        plan.setDailyDataGb(new BigDecimal("1.50"));
        plan.setTotalDataGb(new BigDecimal("42.00"));
        plan.setCurrency(inr);

        var metrics = engine.calculateCostMetrics(plan);

        // Daily cost = 299 / 28 = 10.6786
        assertEquals(new BigDecimal("10.6786"), metrics.dailyCost());

        // Monthly equivalent = 10.6786 * 30 = 320.36
        assertEquals(new BigDecimal("320.36"), metrics.monthlyEquivalent());

        // Annual equivalent = 10.6786 * 365 = 3897.69
        assertEquals(new BigDecimal("3897.69"), metrics.annualEquivalent());

        // Cost per GB = 299 / 42 = 7.12
        assertEquals(new BigDecimal("7.12"), metrics.costPerGb());
    }
}
