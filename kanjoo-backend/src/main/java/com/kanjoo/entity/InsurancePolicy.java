package com.kanjoo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_insurance_policies")
public class InsurancePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "policy_type", nullable = false, length = 50)
    private String policyType; // HEALTH, LIFE_TERM, VEHICLE, HOME, ACCIDENTAL

    @Column(name = "provider_name", nullable = false, length = 100)
    private String providerName;

    @Column(name = "policy_number", length = 100)
    private String policyNumber;

    @Column(name = "sum_insured", nullable = false, precision = 18, scale = 4)
    private BigDecimal sumInsured;

    @Column(name = "annual_premium", nullable = false, precision = 18, scale = 4)
    private BigDecimal annualPremium;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "currency_code", nullable = false)
    private Currency currency;

    @Column(name = "renewal_date", nullable = false)
    private LocalDate renewalDate;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public InsurancePolicy() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPolicyType() { return policyType; }
    public void setPolicyType(String policyType) { this.policyType = policyType; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public BigDecimal getSumInsured() { return sumInsured; }
    public void setSumInsured(BigDecimal sumInsured) { this.sumInsured = sumInsured; }

    public BigDecimal getAnnualPremium() { return annualPremium; }
    public void setAnnualPremium(BigDecimal annualPremium) { this.annualPremium = annualPremium; }

    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }

    public LocalDate getRenewalDate() { return renewalDate; }
    public void setRenewalDate(LocalDate renewalDate) { this.renewalDate = renewalDate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
