package com.kanjoo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "investments")
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "asset_type", nullable = false, length = 50)
    private String assetType; // SIP, MUTUAL_FUND, ETF, STOCK, NISA, ISA, BONDS

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "invested_amount", nullable = false, precision = 16, scale = 4)
    private BigDecimal investedAmount;

    @Column(name = "current_value", nullable = false, precision = 16, scale = 4)
    private BigDecimal currentValue;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "currency_code", nullable = false)
    private Currency currency;

    @Column(name = "monthly_contribution", precision = 16, scale = 4)
    private BigDecimal monthlyContribution = BigDecimal.ZERO;

    @Column(name = "expected_annual_return", precision = 5, scale = 2)
    private BigDecimal expectedAnnualReturn = BigDecimal.valueOf(12.0);

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Investment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getInvestedAmount() { return investedAmount; }
    public void setInvestedAmount(BigDecimal investedAmount) { this.investedAmount = investedAmount; }

    public BigDecimal getCurrentValue() { return currentValue; }
    public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }

    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }

    public BigDecimal getMonthlyContribution() { return monthlyContribution; }
    public void setMonthlyContribution(BigDecimal monthlyContribution) { this.monthlyContribution = monthlyContribution; }

    public BigDecimal getExpectedAnnualReturn() { return expectedAnnualReturn; }
    public void setExpectedAnnualReturn(BigDecimal expectedAnnualReturn) { this.expectedAnnualReturn = expectedAnnualReturn; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
