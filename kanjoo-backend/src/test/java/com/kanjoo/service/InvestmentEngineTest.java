package com.kanjoo.service;

import com.kanjoo.entity.Currency;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class InvestmentEngineTest {

    @Test
    void testSipCalculations() {
        InvestmentEngine engine = new InvestmentEngine();
        Currency usd = new Currency("USD", "US Dollar", "$", 2);

        // $500 monthly at 12% per annum for 10 years (120 months)
        var result = engine.calculateSip(new BigDecimal("500"), new BigDecimal("12.0"), 10, usd);

        // Invested: 500 * 120 = 60,000.00
        assertEquals(new BigDecimal("60000.00"), result.totalInvested());

        // Benchmark future value for $500/mo at 12% for 10 years is ~$116,169.54
        assertTrue(result.estimatedFutureValue().compareTo(new BigDecimal("110000.00")) > 0);
        assertTrue(result.estimatedFutureValue().compareTo(new BigDecimal("120000.00")) < 0);
        assertTrue(result.totalEstimatedReturns().compareTo(new BigDecimal("50000.00")) > 0);
        assertEquals(10, result.yearlyBreakdown().size());
        assertNotNull(result.disclaimer());
    }
}
