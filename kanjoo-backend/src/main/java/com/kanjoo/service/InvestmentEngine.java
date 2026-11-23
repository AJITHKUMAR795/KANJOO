package com.kanjoo.service;

import com.kanjoo.entity.Currency;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvestmentEngine {

    private static final MathContext MC = new MathContext(12, RoundingMode.HALF_UP);

    public record SipProjectionYear(
        int year,
        BigDecimal totalInvested,
        BigDecimal estimatedWealth,
        BigDecimal wealthGained
    ) {}

    public record SipCalculationResult(
        BigDecimal monthlyInvestment,
        BigDecimal expectedAnnualReturnPercent,
        int durationYears,
        BigDecimal totalInvested,
        BigDecimal estimatedFutureValue,
        BigDecimal totalEstimatedReturns,
        List<SipProjectionYear> yearlyBreakdown,
        String disclaimer
    ) {}

    public SipCalculationResult calculateSip(BigDecimal monthlyInvestment,
                                            BigDecimal annualReturnRatePercent,
                                            int durationYears,
                                            Currency currency) {
        if (monthlyInvestment == null || monthlyInvestment.compareTo(BigDecimal.ZERO) <= 0) {
            monthlyInvestment = BigDecimal.valueOf(100);
        }
        if (annualReturnRatePercent == null || annualReturnRatePercent.compareTo(BigDecimal.ZERO) <= 0) {
            annualReturnRatePercent = BigDecimal.valueOf(12.0);
        }
        if (durationYears <= 0) {
            durationYears = 10;
        }

        // Monthly interest rate: i = (r / 100) / 12
        BigDecimal r = annualReturnRatePercent.divide(BigDecimal.valueOf(100), MC);
        BigDecimal i = r.divide(BigDecimal.valueOf(12), MC);

        List<SipProjectionYear> yearly = new ArrayList<>();

        for (int y = 1; y <= durationYears; y++) {
            int months = y * 12;
            BigDecimal invested = monthlyInvestment.multiply(BigDecimal.valueOf(months)).setScale(currency.getDecimalDigits(), RoundingMode.HALF_UP);

            // A = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
            BigDecimal onePlusI = BigDecimal.ONE.add(i);
            BigDecimal compoundFactor = onePlusI.pow(months, MC);
            BigDecimal numerator = compoundFactor.subtract(BigDecimal.ONE);
            BigDecimal fraction = numerator.divide(i, MC);
            BigDecimal futureValue = monthlyInvestment.multiply(fraction).multiply(onePlusI).setScale(currency.getDecimalDigits(), RoundingMode.HALF_UP);

            BigDecimal gained = futureValue.subtract(invested).setScale(currency.getDecimalDigits(), RoundingMode.HALF_UP);
            yearly.add(new SipProjectionYear(y, invested, futureValue, gained));
        }

        SipProjectionYear finalYear = yearly.get(yearly.size() - 1);

        String disclaimer = "Projections are mathematical illustrations based on compounding and an assumed rate of return. " +
                           "This is for educational and planning purposes only and does not constitute guaranteed returns or financial advice.";

        return new SipCalculationResult(
            monthlyInvestment,
            annualReturnRatePercent,
            durationYears,
            finalYear.totalInvested(),
            finalYear.estimatedWealth(),
            finalYear.wealthGained(),
            yearly,
            disclaimer
        );
    }
}
