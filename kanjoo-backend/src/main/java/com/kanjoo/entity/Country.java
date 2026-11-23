package com.kanjoo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "countries")
public class Country {

    @Id
    @Column(length = 2)
    private String code; // e.g. IN, US, GB, JP, DE, AE

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "currency_code", nullable = false)
    private Currency currency;

    @Column(name = "phone_code", nullable = false, length = 10)
    private String phoneCode;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public Country() {}

    public Country(String code, String name, Currency currency, String phoneCode) {
        this.code = code;
        this.name = name;
        this.currency = currency;
        this.phoneCode = phoneCode;
        this.active = true;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }

    public String getPhoneCode() { return phoneCode; }
    public void setPhoneCode(String phoneCode) { this.phoneCode = phoneCode; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
