package com.kanjoo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "offers_subscriptions")
public class OfferSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_code", nullable = false)
    private Country country;

    @Column(name = "provider_name", nullable = false, length = 100)
    private String providerName;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Column(nullable = false, length = 50)
    private String category; // ENTERTAINMENT, EDUCATION, CLOUD, TOOLS, OTHER

    @Column(name = "original_price", nullable = false, precision = 16, scale = 4)
    private BigDecimal originalPrice;

    @Column(name = "discounted_price", nullable = false, precision = 16, scale = 4)
    private BigDecimal discountedPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "currency_code", nullable = false)
    private Currency currency;

    @Column(name = "billing_period", length = 20)
    private String billingPeriod = "MONTHLY"; // MONTHLY, ANNUAL

    @Column(name = "student_only")
    private boolean studentOnly = false;

    @Column(name = "eligibility_criteria", length = 500)
    private String eligibilityCriteria;

    @Column(name = "benefits_summary", length = 500)
    private String benefitsSummary;

    @Column(name = "official_source_url")
    private String officialSourceUrl;

    @Column(name = "last_verified_at", nullable = false)
    private LocalDateTime lastVerifiedAt = LocalDateTime.now();

    public OfferSubscription() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }

    public String getBillingPeriod() { return billingPeriod; }
    public void setBillingPeriod(String billingPeriod) { this.billingPeriod = billingPeriod; }

    public boolean isStudentOnly() { return studentOnly; }
    public void setStudentOnly(boolean studentOnly) { this.studentOnly = studentOnly; }

    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public String getBenefitsSummary() { return benefitsSummary; }
    public void setBenefitsSummary(String benefitsSummary) { this.benefitsSummary = benefitsSummary; }

    public String getOfficialSourceUrl() { return officialSourceUrl; }
    public void setOfficialSourceUrl(String officialSourceUrl) { this.officialSourceUrl = officialSourceUrl; }

    public LocalDateTime getLastVerifiedAt() { return lastVerifiedAt; }
    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) { this.lastVerifiedAt = lastVerifiedAt; }
}
