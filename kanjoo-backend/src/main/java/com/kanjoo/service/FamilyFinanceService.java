package com.kanjoo.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class FamilyFinanceService {

    public Map<String, Object> getFamilyOverview(Long userId) {
        Map<String, Object> family = new HashMap<>();
        family.put("familyGroupId", "FAM-795-IN");
        family.put("groupName", "Kumar Household Trust");
        family.put("currencyCode", "INR");
        family.put("currencySymbol", "₹");
        family.put("currentUserRole", "ADMIN_HEAD");

        // Members
        List<Map<String, Object>> members = new ArrayList<>();

        Map<String, Object> m1 = new HashMap<>();
        m1.put("userId", userId != null ? userId : 1L);
        m1.put("name", "Ajith Kumar (You)");
        m1.put("role", "HEAD");
        m1.put("monthlyContribution", new BigDecimal("25000.00"));
        m1.put("sharePrivateExpenses", false); // Privacy safe!
        m1.put("status", "ACTIVE");
        m1.put("avatar", "AK");
        members.add(m1);

        Map<String, Object> m2 = new HashMap<>();
        m2.put("userId", 202L);
        m2.put("name", "Priya K. (Spouse)");
        m2.put("role", "CO_CONTRIBUTOR");
        m2.put("monthlyContribution", new BigDecimal("20000.00"));
        m2.put("sharePrivateExpenses", false);
        m2.put("status", "ACTIVE");
        m2.put("avatar", "PK");
        members.add(m2);

        Map<String, Object> m3 = new HashMap<>();
        m3.put("userId", 203L);
        m3.put("name", "Parent Senior (Dependent / Viewer)");
        m3.put("role", "VIEWER");
        m3.put("monthlyContribution", BigDecimal.ZERO);
        m3.put("sharePrivateExpenses", false);
        m3.put("status", "ACTIVE");
        m3.put("avatar", "PS");
        members.add(m3);

        family.put("members", members);

        // Shared household budget
        BigDecimal sharedBudgetTotal = new BigDecimal("45000.00");
        BigDecimal sharedSpentTotal = new BigDecimal("29850.00");
        BigDecimal sharedRemaining = sharedBudgetTotal.subtract(sharedSpentTotal);

        List<Map<String, Object>> sharedCategories = new ArrayList<>();

        Map<String, Object> c1 = new HashMap<>();
        c1.put("category", "Groceries & Household");
        c1.put("allocated", new BigDecimal("16000.00"));
        c1.put("spent", new BigDecimal("12400.00"));
        c1.put("percentage", 77.5);
        sharedCategories.add(c1);

        Map<String, Object> c2 = new HashMap<>();
        c2.put("category", "Apartment Rent & Society Maintenance");
        c2.put("allocated", new BigDecimal("18000.00"));
        c2.put("spent", new BigDecimal("14000.00"));
        c2.put("percentage", 77.8);
        sharedCategories.add(c2);

        Map<String, Object> c3 = new HashMap<>();
        c3.put("category", "Utilities (Electricity, Wi-Fi, Water)");
        c3.put("allocated", new BigDecimal("6000.00"));
        c3.put("spent", new BigDecimal("3450.00"));
        c3.put("percentage", 57.5);
        sharedCategories.add(c3);

        Map<String, Object> c4 = new HashMap<>();
        c4.put("category", "Family Health & Medicine");
        c4.put("allocated", new BigDecimal("5000.00"));
        c4.put("spent", new BigDecimal("0.00"));
        c4.put("percentage", 0.0);
        sharedCategories.add(c4);

        family.put("sharedBudgets", sharedCategories);
        family.put("totalSharedBudget", sharedBudgetTotal);
        family.put("totalSharedSpent", sharedSpentTotal);
        family.put("sharedRemaining", sharedRemaining);

        // Shared Family Goals
        List<Map<String, Object>> familyGoals = new ArrayList<>();
        Map<String, Object> fg1 = new HashMap<>();
        fg1.put("title", "Annual Family Vacation (Nilgiris / Himachal)");
        fg1.put("targetAmount", new BigDecimal("80000.00"));
        fg1.put("savedAmount", new BigDecimal("52000.00"));
        fg1.put("targetDate", LocalDate.now().plusMonths(4).toString());
        fg1.put("progressPercent", 65.0);
        familyGoals.add(fg1);

        Map<String, Object> fg2 = new HashMap<>();
        fg2.put("title", "Family Health Emergency Buffer");
        fg2.put("targetAmount", new BigDecimal("200000.00"));
        fg2.put("savedAmount", new BigDecimal("140000.00"));
        fg2.put("targetDate", LocalDate.now().plusMonths(6).toString());
        fg2.put("progressPercent", 70.0);
        familyGoals.add(fg2);

        family.put("familyGoals", familyGoals);

        // Privacy controls status
        Map<String, Object> privacy = new HashMap<>();
        privacy.put("privateTransactionsHidden", true);
        privacy.put("sharedExpenseAuditing", "ENABLED");
        privacy.put("approvalRequiredOver", new BigDecimal("5000.00"));
        family.put("privacyPolicy", privacy);

        return family;
    }
}
