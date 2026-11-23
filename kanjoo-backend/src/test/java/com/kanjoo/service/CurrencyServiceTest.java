package com.kanjoo.service;

import com.kanjoo.entity.Currency;
import com.kanjoo.repository.CurrencyRepository;
import com.kanjoo.repository.ExchangeRateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class CurrencyServiceTest {

    private CurrencyRepository currencyRepository;
    private ExchangeRateRepository exchangeRateRepository;
    private CurrencyService currencyService;

    private Currency usd;
    private Currency inr;
    private Currency jpy;
    private Currency kwd;

    @BeforeEach
    void setUp() {
        currencyRepository = Mockito.mock(CurrencyRepository.class);
        exchangeRateRepository = Mockito.mock(ExchangeRateRepository.class);
        currencyService = new CurrencyService(currencyRepository, exchangeRateRepository);

        usd = new Currency("USD", "US Dollar", "$", 2);
        inr = new Currency("INR", "Indian Rupee", "₹", 2);
        jpy = new Currency("JPY", "Japanese Yen", "¥", 0);
        kwd = new Currency("KWD", "Kuwaiti Dinar", "KD", 3);
    }

    @Test
    void testSameCurrencyConversion() {
        BigDecimal amount = new BigDecimal("123.456");
        BigDecimal result = currencyService.convert(amount, usd, usd);
        assertEquals(new BigDecimal("123.46"), result);
    }

    @Test
    void testZeroDecimalPrecisionForJpy() {
        BigDecimal amount = new BigDecimal("1000.55");
        BigDecimal result = currencyService.convert(amount, jpy, jpy);
        assertEquals(new BigDecimal("1001"), result);
    }

    @Test
    void testFormattingConventions() {
        String formattedUsd = currencyService.format(new BigDecimal("1500.50"), usd);
        assertEquals("$1,500.50", formattedUsd);

        String formattedJpy = currencyService.format(new BigDecimal("150000"), jpy);
        assertEquals("¥150,000", formattedJpy);

        String formattedKwd = currencyService.format(new BigDecimal("12.345"), kwd);
        assertEquals("KD 12.345", formattedKwd);
    }
}
