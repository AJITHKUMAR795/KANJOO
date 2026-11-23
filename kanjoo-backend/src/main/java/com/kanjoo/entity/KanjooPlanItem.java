package com.kanjoo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kanjoo_plan_items")
public class KanjooPlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private KanjooPlan plan;

    @Column(name = "item_type", nullable = false, length = 50)
    private String itemType; // RECHARGE_OPTIMIZATION, SUBSCRIPTION_CANCEL, SUBSCRIPTION_SWITCH, EXPENSE_REDUCTION, SCHOLARSHIP, SIP_INCREASE

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(name = "potential_monthly_savings", precision = 16, scale = 4)
    private BigDecimal potentialMonthlySavings = BigDecimal.ZERO;

    @Column(name = "potential_annual_savings", precision = 16, scale = 4)
    private BigDecimal potentialAnnualSavings = BigDecimal.ZERO;

    @Column(name = "is_implemented")
    private boolean implemented = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public KanjooPlanItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public KanjooPlan getPlan() { return plan; }
    public void setPlan(KanjooPlan plan) { this.plan = plan; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPotentialMonthlySavings() { return potentialMonthlySavings; }
    public void setPotentialMonthlySavings(BigDecimal potentialMonthlySavings) { this.potentialMonthlySavings = potentialMonthlySavings; }

    public BigDecimal getPotentialAnnualSavings() { return potentialAnnualSavings; }
    public void setPotentialAnnualSavings(BigDecimal potentialAnnualSavings) { this.potentialAnnualSavings = potentialAnnualSavings; }

    public boolean isImplemented() { return implemented; }
    public void setImplemented(boolean implemented) { this.implemented = implemented; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
