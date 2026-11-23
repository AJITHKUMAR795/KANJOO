package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class StatementImportService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final CurrencyRepository currencyRepository;

    public StatementImportService(ExpenseRepository expenseRepository,
                                  ExpenseCategoryRepository categoryRepository,
                                  CurrencyRepository currencyRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.currencyRepository = currencyRepository;
    }

    public record ImportedTxPreview(
        String tempId,
        LocalDate date,
        String merchant,
        String description,
        BigDecimal amount,
        String type, // DEBIT or CREDIT
        Long categoryId,
        String categoryName,
        boolean isDuplicate,
        boolean isRecurring,
        boolean isUnusual
    ) {}

    public record StatementPreviewResult(
        String filename,
        int totalTransactions,
        int debitCount,
        int creditCount,
        BigDecimal totalDebitAmount,
        BigDecimal totalCreditAmount,
        int duplicateCount,
        List<ImportedTxPreview> transactions
    ) {}

    public StatementPreviewResult parseStatement(Long userId, String filename, String content) {
        List<ImportedTxPreview> txList = new ArrayList<>();
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;
        int debits = 0;
        int credits = 0;
        int duplicates = 0;

        var existingExpenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
        var categories = categoryRepository.findAll();
        Map<String, ExpenseCategory> catMap = new HashMap<>();
        for (var c : categories) catMap.put(c.getCode(), c);

        String[] lines = content.split("\\r?\\n");
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty() || line.toLowerCase().startsWith("date") || line.toLowerCase().startsWith("txn")) {
                continue;
            }

            String[] parts = line.split("[,;\\t]");
            if (parts.length < 3) continue;

            try {
                LocalDate date = LocalDate.now();
                try {
                    date = LocalDate.parse(parts[0].trim());
                } catch (Exception ignored) {}

                String desc = parts[1].trim();
                BigDecimal amount = new BigDecimal(parts[2].replaceAll("[^0-9.]", ""));
                String type = parts.length > 3 && parts[3].toLowerCase().contains("cr") ? "CREDIT" : "DEBIT";

                String merchant = extractMerchant(desc);
                String catCode = categorizeMerchant(desc, merchant);
                ExpenseCategory cat = catMap.getOrDefault(catCode, categories.isEmpty() ? null : categories.get(0));

                boolean isDup = existingExpenses.stream().anyMatch(e ->
                    e.getExpenseDate().equals(date) && e.getPrimaryAmount().compareTo(amount) == 0
                );

                if (isDup) duplicates++;
                boolean isRecurring = desc.toLowerCase().contains("sub") || desc.toLowerCase().contains("sip") || desc.toLowerCase().contains("recharge");
                boolean isUnusual = amount.compareTo(new BigDecimal("10000.00")) > 0;

                if ("DEBIT".equals(type)) {
                    totalDebit = totalDebit.add(amount);
                    debits++;
                } else {
                    totalCredit = totalCredit.add(amount);
                    credits++;
                }

                txList.add(new ImportedTxPreview(
                    UUID.randomUUID().toString(),
                    date,
                    merchant,
                    desc,
                    amount,
                    type,
                    cat != null ? cat.getId() : 1L,
                    cat != null ? cat.getName() : "General",
                    isDup,
                    isRecurring,
                    isUnusual
                ));
            } catch (Exception ignored) {
                // Skip malformed rows
            }
        }

        return new StatementPreviewResult(
            filename,
            txList.size(),
            debits,
            credits,
            totalDebit,
            totalCredit,
            duplicates,
            txList
        );
    }

    @Transactional
    public int confirmTransactions(User user, List<ImportedTxPreview> confirmedList) {
        int savedCount = 0;
        var categories = categoryRepository.findAll();
        Map<Long, ExpenseCategory> catMap = new HashMap<>();
        for (var c : categories) catMap.put(c.getId(), c);

        Currency inrCurr = currencyRepository.findById("INR")
            .orElseGet(() -> currencyRepository.findAll().get(0));

        for (var tx : confirmedList) {
            if ("DEBIT".equalsIgnoreCase(tx.type())) {
                Expense e = new Expense();
                e.setUser(user);
                e.setCategory(catMap.getOrDefault(tx.categoryId(), categories.get(0)));
                e.setExpenseDate(tx.date());
                e.setAmount(tx.amount());
                e.setPrimaryAmount(tx.amount());
                e.setExchangeRate(BigDecimal.ONE);
                e.setOriginalCurrency(inrCurr);
                e.setDescription(tx.merchant() + " - " + tx.description());
                e.setPaymentMethod("BANK_TRANSFER");
                e.setRecurring(tx.isRecurring());
                expenseRepository.save(e);
                savedCount++;
            }
        }
        return savedCount;
    }

    private String extractMerchant(String desc) {
        String upper = desc.toUpperCase();
        if (upper.contains("SWIGGY")) return "Swiggy";
        if (upper.contains("ZOMATO")) return "Zomato";
        if (upper.contains("AMAZON")) return "Amazon";
        if (upper.contains("FLIPKART")) return "Flipkart";
        if (upper.contains("UBER")) return "Uber";
        if (upper.contains("OLA")) return "Ola";
        if (upper.contains("NETFLIX")) return "Netflix";
        if (upper.contains("SPOTIFY")) return "Spotify";
        if (upper.contains("JIO")) return "Reliance Jio";
        if (upper.contains("AIRTEL")) return "Bharti Airtel";
        if (upper.contains("STAR HEALTH")) return "Star Health Insurance";
        if (upper.contains("SALARY")) return "Salary Credit";
        return desc.length() > 24 ? desc.substring(0, 24) : desc;
    }

    private String categorizeMerchant(String desc, String merchant) {
        String combined = (desc + " " + merchant).toUpperCase();
        if (combined.contains("SWIGGY") || combined.contains("ZOMATO") || combined.contains("CAFE") || combined.contains("FOOD")) return "FOOD";
        if (combined.contains("UBER") || combined.contains("OLA") || combined.contains("METRO") || combined.contains("FUEL") || combined.contains("PETROL")) return "TRANSPORTATION";
        if (combined.contains("JIO") || combined.contains("AIRTEL") || combined.contains("RECHARGE") || combined.contains("BROADBAND")) return "TELECOM";
        if (combined.contains("NETFLIX") || combined.contains("SPOTIFY") || combined.contains("PRIME")) return "SUBSCRIPTION";
        if (combined.contains("HOSPITAL") || combined.contains("PHARMACY") || combined.contains("MEDICINE") || combined.contains("HEALTH")) return "HEALTH";
        if (combined.contains("AMAZON") || combined.contains("FLIPKART") || combined.contains("STORE") || combined.contains("MALL")) return "SHOPPING";
        if (combined.contains("RENT") || combined.contains("MAINTENANCE") || combined.contains("ELECTRICITY")) return "ACCOMMODATION";
        return "FOOD";
    }
}
