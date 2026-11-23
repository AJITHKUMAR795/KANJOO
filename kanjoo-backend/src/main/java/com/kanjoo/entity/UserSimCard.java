package com.kanjoo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_sim_cards")
public class UserSimCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "operator_id", nullable = false)
    private TelecomOperator operator;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "sim_slot", nullable = false, length = 20)
    private String simSlot = "PRIMARY"; // PRIMARY, SECONDARY

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_plan_id")
    private RechargePlan currentPlan;

    @Column(name = "plan_expiry_date")
    private LocalDate planExpiryDate;

    @Column(name = "daily_data_used_gb", precision = 6, scale = 2)
    private BigDecimal dailyDataUsedGb = BigDecimal.valueOf(1.0);

    @Column(name = "has_wifi_access")
    private boolean hasWifiAccess = true;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UserSimCard() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public TelecomOperator getOperator() { return operator; }
    public void setOperator(TelecomOperator operator) { this.operator = operator; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getSimSlot() { return simSlot; }
    public void setSimSlot(String simSlot) { this.simSlot = simSlot; }

    public RechargePlan getCurrentPlan() { return currentPlan; }
    public void setCurrentPlan(RechargePlan currentPlan) { this.currentPlan = currentPlan; }

    public LocalDate getPlanExpiryDate() { return planExpiryDate; }
    public void setPlanExpiryDate(LocalDate planExpiryDate) { this.planExpiryDate = planExpiryDate; }

    public BigDecimal getDailyDataUsedGb() { return dailyDataUsedGb != null ? dailyDataUsedGb : BigDecimal.ZERO; }
    public void setDailyDataUsedGb(BigDecimal dailyDataUsedGb) { this.dailyDataUsedGb = dailyDataUsedGb; }

    public boolean isHasWifiAccess() { return hasWifiAccess; }
    public void setHasWifiAccess(boolean hasWifiAccess) { this.hasWifiAccess = hasWifiAccess; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
