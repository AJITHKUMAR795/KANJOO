package com.kanjoo.service;

import com.kanjoo.entity.Currency;
import com.kanjoo.entity.ExchangeRate;
import com.kanjoo.repository.CurrencyRepository;
import com.kanjoo.repository.ExchangeRateRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.Optional;

@Service
public class CurrencyService {

    private final CurrencyRepository currencyRepository;
    private final ExchangeRateRepository exchangeRateRepository;

    public CurrencyService(CurrencyRepository currencyRepository, ExchangeRateRepository exchangeRateRepository) {
        this.currencyRepository = currencyRepository;
        this.exchangeRateRepository = exchangeRateRepository;
    }

    public BigDecimal getExchangeRate(Currency source, Currency target) {
        if (source.getCode().equalsIgnoreCase(target.getCode())) {
            return BigDecimal.ONE.setScale(6, RoundingMode.HALF_UP);
        }

        // Direct pair
        Optional<ExchangeRate> direct = exchangeRateRepository.findByBaseCurrencyAndTargetCurrency(source, target);
        if (direct.isPresent()) {
            return direct.get().getRate();
        }

        // Inverse pair
        Optional<ExchangeRate> inverse = exchangeRateRepository.findByBaseCurrencyAndTargetCurrency(target, source);
        if (inverse.isPresent() && inverse.get().getRate().compareTo(BigDecimal.ZERO) > 0) {
            return BigDecimal.ONE.divide(inverse.get().getRate(), 6, RoundingMode.HALF_UP);
        }

        // Triangulate via USD if available
        Optional<Currency> usd = currencyRepository.findById("USD");
        if (usd.isPresent()) {
            BigDecimal sourceToUsd = source.getCode().equalsIgnoreCase("USD") 
                ? BigDecimal.ONE 
                : getDirectRate(source, usd.get());
            BigDecimal usdToTarget = target.getCode().equalsIgnoreCase("USD") 
                ? BigDecimal.ONE 
                : getDirectRate(usd.get(), target);

            if (sourceToUsd != null && usdToTarget != null) {
                return sourceToUsd.multiply(usdToTarget).setScale(6, RoundingMode.HALF_UP);
            }
        }

        return BigDecimal.ONE.setScale(6, RoundingMode.HALF_UP);
    }

    private BigDecimal getDirectRate(Currency base, Currency target) {
        Optional<ExchangeRate> rate = exchangeRateRepository.findByBaseCurrencyAndTargetCurrency(base, target);
        if (rate.isPresent()) return rate.get().getRate();
        Optional<ExchangeRate> inv = exchangeRateRepository.findByBaseCurrencyAndTargetCurrency(target, base);
        return inv.map(exchangeRate -> BigDecimal.ONE.divide(exchangeRate.getRate(), 6, RoundingMode.HALF_UP)).orElse(null);
    }

    public BigDecimal convert(BigDecimal amount, Currency source, Currency target) {
        if (amount == null) return BigDecimal.ZERO;
        if (source.getCode().equalsIgnoreCase(target.getCode())) {
            return amount.setScale(target.getDecimalDigits(), RoundingMode.HALF_UP);
        }
        BigDecimal rate = getExchangeRate(source, target);
        BigDecimal converted = amount.multiply(rate);
        return converted.setScale(target.getDecimalDigits(), RoundingMode.HALF_UP);
    }

    public String format(BigDecimal amount, Currency currency) {
        if (amount == null) amount = BigDecimal.ZERO;
        int decimals = currency.getDecimalDigits();
        StringBuilder pattern = new StringBuilder("#,##0");
        if (decimals > 0) {
            pattern.append(".");
            pattern.append("0".repeat(decimals));
        }
        DecimalFormat df = new DecimalFormat(pattern.toString());
        return currency.getSymbol() + (currency.getSymbol().length() > 1 ? " " : "") + df.format(amount);
    }
}
