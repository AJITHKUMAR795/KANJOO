package com.kanjoo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "investors_catalog")
public class Investor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "firm_name", nullable = false, length = 100)
    private String firmName;

    @Column(nullable = false, length = 50)
    private String stage; // PRE_SEED, SEED, SERIES_A, GROWTH

    @Column(nullable = false, length = 255)
    private String sectors;

    @Column(name = "ticket_size", nullable = false, length = 50)
    private String ticketSize;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_code", nullable = false)
    private Country country;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "pitch_email", length = 100)
    private String pitchEmail;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Investor() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFirmName() { return firmName; }
    public void setFirmName(String firmName) { this.firmName = firmName; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getSectors() { return sectors; }
    public void setSectors(String sectors) { this.sectors = sectors; }

    public String getTicketSize() { return ticketSize; }
    public void setTicketSize(String ticketSize) { this.ticketSize = ticketSize; }

    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getPitchEmail() { return pitchEmail; }
    public void setPitchEmail(String pitchEmail) { this.pitchEmail = pitchEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
