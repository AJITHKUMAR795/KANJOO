package com.kanjoo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recharge_plans")
public class RechargePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "operator_id", nullable = false)
    private TelecomOperator operator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_code", nullable = false)
    private Country country;

    @Column(name = "plan_name", nullable = false, length = 150)
    private String planName;

    @Column(nullable = false, precision = 16, scale = 4)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "currency_code", nullable = false)
    private Currency currency;

    @Column(name = "validity_days", nullable = false)
    private int validityDays;

    @Column(name = "daily_data_gb", precision = 6, scale = 2)
    private BigDecimal dailyDataGb = BigDecimal.ZERO;

    @Column(name = "total_data_gb", precision = 6, scale = 2)
    private BigDecimal totalDataGb = BigDecimal.ZERO;

    @Column(name = "is_unlimited_calling")
    private boolean unlimitedCalling = true;

    @Column(name = "sms_per_day")
    private int smsPerDay = 100;

    @Column(name = "plan_type", length = 30)
    private String planType = "PREPAID"; // PREPAID, SECONDARY_INCOMING, POSTPAID

    @Column(name = "bundled_perks", length = 500)
    private String bundledPerks;

    @Column(name = "official_source_url")
    private String officialSourceUrl;

    @Column(name = "last_verified_at", nullable = false)
    private LocalDateTime lastVerifiedAt = LocalDateTime.now();

    public RechargePlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TelecomOperator getOperator() { return operator; }
    public void setOperator(TelecomOperator operator) { this.operator = operator; }

    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }

    public int getValidityDays() { return validityDays; }
    public void setValidityDays(int validityDays) { this.validityDays = validityDays; }

    public BigDecimal getDailyDataGb() { return dailyDataGb != null ? dailyDataGb : BigDecimal.ZERO; }
    public void setDailyDataGb(BigDecimal dailyDataGb) { this.dailyDataGb = dailyDataGb; }

    public BigDecimal getTotalDataGb() { return totalDataGb != null ? totalDataGb : BigDecimal.ZERO; }
    public void setTotalDataGb(BigDecimal totalDataGb) { this.totalDataGb = totalDataGb; }

    public boolean isUnlimitedCalling() { return unlimitedCalling; }
    public void setUnlimitedCalling(boolean unlimitedCalling) { this.unlimitedCalling = unlimitedCalling; }

    public int getSmsPerDay() { return smsPerDay; }
    public void setSmsPerDay(int smsPerDay) { this.smsPerDay = smsPerDay; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public String getBundledPerks() { return bundledPerks; }
    public void setBundledPerks(String bundledPerks) { this.bundledPerks = bundledPerks; }

    public String getOfficialSourceUrl() { return officialSourceUrl; }
    public void setOfficialSourceUrl(String officialSourceUrl) { this.officialSourceUrl = officialSourceUrl; }

    public LocalDateTime getLastVerifiedAt() { return lastVerifiedAt; }
    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) { this.lastVerifiedAt = lastVerifiedAt; }
}
