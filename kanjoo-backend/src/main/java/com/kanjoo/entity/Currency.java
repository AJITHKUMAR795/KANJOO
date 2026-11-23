package com.kanjoo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "currencies")
public class Currency {

    @Id
    @Column(length = 3)
    private String code; // e.g. USD, INR, JPY, EUR

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 10)
    private String symbol;

    @Column(name = "decimal_digits", nullable = false)
    private int decimalDigits = 2;

    public Currency() {}

    public Currency(String code, String name, String symbol, int decimalDigits) {
        this.code = code;
        this.name = name;
        this.symbol = symbol;
        this.decimalDigits = decimalDigits;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public int getDecimalDigits() { return decimalDigits; }
    public void setDecimalDigits(int decimalDigits) { this.decimalDigits = decimalDigits; }
}
