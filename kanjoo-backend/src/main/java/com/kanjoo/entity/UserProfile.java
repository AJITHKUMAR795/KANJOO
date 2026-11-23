package com.kanjoo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_code", nullable = false)
    private Country country;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_currency_code", nullable = false)
    private Currency primaryCurrency;

    private Integer age;

    @Column(name = "state_region", length = 100)
    private String stateRegion;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String occupation;

    @Column(name = "student_or_professional", length = 30)
    private String studentOrProfessional = "PROFESSIONAL"; // STUDENT, PROFESSIONAL, FREELANCER, RETIRED

    @Column(name = "education_level", length = 50)
    private String educationLevel; // HIGH_SCHOOL, UNDERGRADUATE, POSTGRADUATE, DOCTORATE

    @Column(name = "preferred_language", length = 20)
    private String preferredLanguage = "en";

    @Column(name = "monthly_income", precision = 16, scale = 4)
    private BigDecimal monthlyIncome = BigDecimal.ZERO;

    @Column(name = "pocket_money", precision = 16, scale = 4)
    private BigDecimal pocketMoney = BigDecimal.ZERO;

    @Column(name = "other_income", precision = 16, scale = 4)
    private BigDecimal otherIncome = BigDecimal.ZERO;

    @Column(name = "monthly_savings_target", precision = 16, scale = 4)
    private BigDecimal monthlySavingsTarget = BigDecimal.ZERO;

    @Column(name = "existing_investments", precision = 16, scale = 4)
    private BigDecimal existingInvestments = BigDecimal.ZERO;

    @Column(name = "emergency_savings", precision = 16, scale = 4)
    private BigDecimal emergencySavings = BigDecimal.ZERO;

    @Column(name = "housing_type", length = 50)
    private String housingType = "RENTED"; // OWNED, RENTED, HOSTEL, FAMILY

    @Column(name = "risk_tolerance", length = 20)
    private String riskTolerance = "MODERATE"; // LOW, MODERATE, HIGH

    @Column(name = "onboarding_completed", nullable = false)
    private boolean onboardingCompleted = false;

    @Column(name = "financial_health_score")
    private Integer financialHealthScore = 65;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserProfile() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }

    public Currency getPrimaryCurrency() { return primaryCurrency; }
    public void setPrimaryCurrency(Currency primaryCurrency) { this.primaryCurrency = primaryCurrency; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getStateRegion() { return stateRegion; }
    public void setStateRegion(String stateRegion) { this.stateRegion = stateRegion; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getStudentOrProfessional() { return studentOrProfessional; }
    public void setStudentOrProfessional(String studentOrProfessional) { this.studentOrProfessional = studentOrProfessional; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome != null ? monthlyIncome : BigDecimal.ZERO; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public BigDecimal getPocketMoney() { return pocketMoney != null ? pocketMoney : BigDecimal.ZERO; }
    public void setPocketMoney(BigDecimal pocketMoney) { this.pocketMoney = pocketMoney; }

    public BigDecimal getOtherIncome() { return otherIncome != null ? otherIncome : BigDecimal.ZERO; }
    public void setOtherIncome(BigDecimal otherIncome) { this.otherIncome = otherIncome; }

    public BigDecimal getMonthlySavingsTarget() { return monthlySavingsTarget != null ? monthlySavingsTarget : BigDecimal.ZERO; }
    public void setMonthlySavingsTarget(BigDecimal monthlySavingsTarget) { this.monthlySavingsTarget = monthlySavingsTarget; }

    public BigDecimal getExistingInvestments() { return existingInvestments != null ? existingInvestments : BigDecimal.ZERO; }
    public void setExistingInvestments(BigDecimal existingInvestments) { this.existingInvestments = existingInvestments; }

    public BigDecimal getEmergencySavings() { return emergencySavings != null ? emergencySavings : BigDecimal.ZERO; }
    public void setEmergencySavings(BigDecimal emergencySavings) { this.emergencySavings = emergencySavings; }

    public String getHousingType() { return housingType; }
    public void setHousingType(String housingType) { this.housingType = housingType; }

    public String getRiskTolerance() { return riskTolerance; }
    public void setRiskTolerance(String riskTolerance) { this.riskTolerance = riskTolerance; }

    public boolean isOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public Integer getFinancialHealthScore() { return financialHealthScore != null ? financialHealthScore : 60; }
    public void setFinancialHealthScore(Integer financialHealthScore) { this.financialHealthScore = financialHealthScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
