package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CurrencyRepository currencyRepository;
    private final CurrencyService currencyService;
    private final UserStockRepository stockRepository;
    private final InvestorRepository investorRepository;
    private final BusinessContactRepository businessContactRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final UserSimCardRepository simCardRepository;
    private final InsurancePolicyRepository insuranceRepository;
    private final InvestmentRepository investmentRepository;

    public ProService(UserRepository userRepository,
                      UserProfileRepository userProfileRepository,
                      CurrencyRepository currencyRepository,
                      CurrencyService currencyService,
                      UserStockRepository stockRepository,
                      InvestorRepository investorRepository,
                      BusinessContactRepository businessContactRepository,
                      UserSubscriptionRepository subscriptionRepository,
                      UserSimCardRepository simCardRepository,
                      InsurancePolicyRepository insuranceRepository,
                      InvestmentRepository investmentRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.currencyRepository = currencyRepository;
        this.currencyService = currencyService;
        this.stockRepository = stockRepository;
        this.investorRepository = investorRepository;
        this.businessContactRepository = businessContactRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.simCardRepository = simCardRepository;
        this.insuranceRepository = insuranceRepository;
        this.investmentRepository = investmentRepository;
    }

    // 1. Pro Pricing ($1 USD equivalent)
    public record ProPricingResponse(
        BigDecimal usdPrice,
        BigDecimal localPrice,
        String currencyCode,
        String currencySymbol,
        String paypalClientId,
        String planDescription
    ) {}

    public ProPricingResponse getProPricing(User user) {
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        Currency primaryCurr = profile != null ? profile.getPrimaryCurrency() : currencyRepository.findById("USD").orElseThrow();
        Currency usd = currencyRepository.findById("USD").orElseThrow();

        BigDecimal localPrice = currencyService.convert(BigDecimal.valueOf(1.00), usd, primaryCurr);

        return new ProPricingResponse(
            BigDecimal.valueOf(1.00),
            localPrice,
            primaryCurr.getCode(),
            primaryCurr.getSymbol(),
            "sb-kanjoo-paypal-client-id",
            String.format("$1.00 USD/month (%s %s)", primaryCurr.getSymbol(), localPrice.toPlainString())
        );
    }

    public User activatePro(User user, String paypalSubId) {
        user.setProMember(true);
        user.setProExpiresAt(LocalDateTime.now().plusMonths(1));
        user.setPaypalSubscriptionId(paypalSubId != null ? paypalSubId : "PAYPAL-SUB-" + System.currentTimeMillis());
        return userRepository.save(user);
    }

    // 2. Stock Portfolio & Tax-Loss Harvesting Engine
    public record StockItemResponse(
        Long id,
        String ticker,
        String company,
        BigDecimal quantity,
        BigDecimal buyPrice,
        BigDecimal currentPrice,
        BigDecimal totalInvested,
        BigDecimal currentVal,
        BigDecimal unrealizedGainLoss,
        BigDecimal gainLossPercent,
        LocalDate purchaseDate,
        String sector,
        boolean isLossMaking,
        boolean isLongTerm
    ) {}

    public record StockPortfolioAnalysis(
        BigDecimal totalInvested,
        BigDecimal totalCurrentValue,
        BigDecimal netGainLoss,
        BigDecimal netGainLossPercent,
        BigDecimal potentialTaxLossHarvestSavings,
        List<String> taxOptimizationTips,
        List<StockItemResponse> stocks
    ) {}

    public StockPortfolioAnalysis getStockAnalysis(User user) {
        List<UserStock> list = stockRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<StockItemResponse> responses = new ArrayList<>();

        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalCurrent = BigDecimal.ZERO;
        BigDecimal harvestableLoss = BigDecimal.ZERO;

        LocalDate oneYearAgo = LocalDate.now().minusYears(1);

        for (UserStock s : list) {
            BigDecimal inv = s.getQuantity().multiply(s.getBuyPrice());
            BigDecimal cur = s.getQuantity().multiply(s.getCurrentPrice());
            BigDecimal diff = cur.subtract(inv);
            BigDecimal pct = inv.compareTo(BigDecimal.ZERO) > 0
                ? diff.divide(inv, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

            boolean isLoss = diff.compareTo(BigDecimal.ZERO) < 0;
            boolean isLongTerm = s.getPurchaseDate().isBefore(oneYearAgo);

            if (isLoss) {
                harvestableLoss = harvestableLoss.add(diff.abs());
            }

            totalInvested = totalInvested.add(inv);
            totalCurrent = totalCurrent.add(cur);

            responses.add(new StockItemResponse(
                s.getId(), s.getTickerSymbol(), s.getCompanyName(), s.getQuantity(),
                s.getBuyPrice(), s.getCurrentPrice(), inv.setScale(2, RoundingMode.HALF_UP),
                cur.setScale(2, RoundingMode.HALF_UP), diff.setScale(2, RoundingMode.HALF_UP),
                pct.setScale(2, RoundingMode.HALF_UP), s.getPurchaseDate(), s.getSector(),
                isLoss, isLongTerm
            ));
        }

        BigDecimal netDiff = totalCurrent.subtract(totalInvested);
        BigDecimal netPct = totalInvested.compareTo(BigDecimal.ZERO) > 0
            ? netDiff.divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;

        // Estimated 15% - 20% capital gains tax savings via tax-loss harvesting
        BigDecimal taxSaved = harvestableLoss.multiply(BigDecimal.valueOf(0.15)).setScale(2, RoundingMode.HALF_UP);

        List<String> tips = new ArrayList<>();
        if (harvestableLoss.compareTo(BigDecimal.ZERO) > 0) {
            tips.add(String.format("Tax-Loss Harvesting Opportunity: You have unrealized losses totaling %s. Selling and immediately rotating into an index ETF or similar sector instrument can offset up to %s in capital gains taxes.",
                harvestableLoss.setScale(0, RoundingMode.HALF_UP), taxSaved));
        }
        tips.add("Long-Term Capital Gains (LTCG) Advantage: Stocks held over 12 months qualify for concessional tax rates (e.g. 12.5% in India with ₹1.25 Lakh exemption, or 0%/15% in the US).");
        tips.add("Dividend Reinvestment Optimization: Accumulate dividends in growth plans to defer annual income tax liability until final redemption.");

        return new StockPortfolioAnalysis(
            totalInvested.setScale(2, RoundingMode.HALF_UP),
            totalCurrent.setScale(2, RoundingMode.HALF_UP),
            netDiff.setScale(2, RoundingMode.HALF_UP),
            netPct.setScale(2, RoundingMode.HALF_UP),
            taxSaved,
            tips,
            responses
        );
    }

    // 3. Legal Templates
    public record LegalTemplate(String id, String title, String category, String description, String downloadSnippet) {}

    public List<LegalTemplate> getLegalTemplates() {
        return List.of(
            new LegalTemplate("NDA-01", "Standard Mutual Non-Disclosure Agreement (NDA)", "CONFIDENTIALITY",
                "Protects proprietary business ideas, source code, and trade secrets during investor and contractor pitches.",
                "MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is entered into by and between the Disclosing Party and the Receiving Party for the purpose of preventing unauthorized disclosure of Confidential Information..."),
            new LegalTemplate("ICA-02", "Independent Contractor & Software Services Agreement", "HIRING",
                "Standard work-for-hire contract with explicit IP assignment and payment milestones.",
                "INDEPENDENT CONTRACTOR AGREEMENT\n\nThe Company engages the Contractor to perform software development services. All Works created shall be considered Works Made for Hire and proprietary to Company..."),
            new LegalTemplate("SAFE-03", "Y-Combinator Standard SAFE (Valuation Cap Only)", "FUNDRAISING",
                "Simple Agreement for Future Equity to legally receive angel investment without complex debt notes.",
                "SIMPLE AGREEMENT FOR FUTURE EQUITY (SAFE)\n\nIn exchange for the payment of the Purchase Amount, the Company hereby issues to the Investor the right to certain shares of Company Capital Stock..."),
            new LegalTemplate("ADV-04", "Founder & Strategic Advisory Board Agreement", "GOVERNANCE",
                "Grants 0.25% - 1.0% equity to strategic startup advisors with standard 2-year vesting and quarterly contribution milestones.",
                "STRATEGIC ADVISOR AGREEMENT\n\nThe Advisor agrees to provide strategic guidance, introductions to enterprise clients, and quarterly consultation...")
        );
    }

    // 4. Tax Filing Report
    public record TaxComparisonReport(
        BigDecimal grossIncome,
        BigDecimal standardDeduction,
        BigDecimal section80C,
        BigDecimal section80D,
        BigDecimal otherDeductions,
        BigDecimal oldRegimeTax,
        BigDecimal newRegimeTax,
        String recommendedRegime,
        BigDecimal regimeSavings,
        List<String> filingTips
    ) {}

    public TaxComparisonReport getTaxReport(User user) {
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        BigDecimal annualIncome = (profile != null)
            ? profile.getMonthlyIncome().multiply(BigDecimal.valueOf(12))
            : BigDecimal.valueOf(600000);

        BigDecimal stdDed = BigDecimal.valueOf(75000); // Standard deduction
        BigDecimal sec80C = BigDecimal.valueOf(150000); // Max 80C
        BigDecimal sec80D = BigDecimal.valueOf(25000);  // Health insurance
        BigDecimal other = BigDecimal.valueOf(50000);   // HRA or NPS

        // Old Regime: Income - 75k - 1.5L - 25k - 50k = Taxable
        BigDecimal oldTaxable = annualIncome.subtract(stdDed).subtract(sec80C).subtract(sec80D).subtract(other);
        if (oldTaxable.compareTo(BigDecimal.ZERO) < 0) oldTaxable = BigDecimal.ZERO;
        BigDecimal oldTax = oldTaxable.multiply(BigDecimal.valueOf(0.20)).setScale(0, RoundingMode.HALF_UP);

        // New Regime: Income - 75k std deduction with lower slab rates
        BigDecimal newTaxable = annualIncome.subtract(stdDed);
        if (newTaxable.compareTo(BigDecimal.ZERO) < 0) newTaxable = BigDecimal.ZERO;
        BigDecimal newTax = newTaxable.multiply(BigDecimal.valueOf(0.12)).setScale(0, RoundingMode.HALF_UP);

        String rec = newTax.compareTo(oldTax) <= 0 ? "NEW_TAX_REGIME" : "OLD_TAX_REGIME";
        BigDecimal savings = oldTax.subtract(newTax).abs();

        List<String> tips = List.of(
            "New Tax Regime is optimal if you claim fewer than ₹3,75,000 in total itemized deductions.",
            "Make sure your employer reflects your tax regime choice before the Q4 payroll cutoff.",
            "Health insurance premium receipts (Section 80D) and ELSS/SIP statements can be downloaded directly from your KANJOO dashboard."
        );

        return new TaxComparisonReport(annualIncome, stdDed, sec80C, sec80D, other, oldTax, newTax, rec, savings, tips);
    }

    // 5. Investors & Business Network
    public List<Investor> getInvestors() {
        return investorRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<BusinessContact> getBusinessNetwork() {
        return businessContactRepository.findAllByOrderByCreatedAtDesc();
    }

    // 6. AI Pro Assistant: Upcoming Payments & Autonomous Planner
    public record UpcomingPayment(
        String category, // TELECOM, SUBSCRIPTION, INSURANCE, INVESTMENT_SIP
        String title,
        BigDecimal amount,
        LocalDate dueDate,
        long daysRemaining,
        String status
    ) {}

    public record ProCashflowPlan(
        BigDecimal currentSurplus,
        BigDecimal upcomingPaymentsTotal,
        BigDecimal projectedEndMonthSurplus,
        int paymentsCount,
        List<UpcomingPayment> payments,
        String proactiveAiAdvice
    ) {}

    public ProCashflowPlan getUpcomingPaymentsPlan(User user) {
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        LocalDate today = LocalDate.now();
        List<UpcomingPayment> payments = new ArrayList<>();
        BigDecimal totalDue = BigDecimal.ZERO;

        // 1. Telecom SIMs
        var sims = simCardRepository.findByUserIdOrderByIdAsc(user.getId());
        for (var s : sims) {
            if (s.getPlanExpiryDate() != null) {
                long days = ChronoUnit.DAYS.between(today, s.getPlanExpiryDate());
                if (days <= 30) {
                    BigDecimal cost = s.getCurrentPlan() != null ? s.getCurrentPlan().getPrice() : BigDecimal.valueOf(299);
                    totalDue = totalDue.add(cost);
                    payments.add(new UpcomingPayment("TELECOM", s.getOperator().getName() + " SIM Recharge (" + s.getPhoneNumber() + ")", cost, s.getPlanExpiryDate(), days, days <= 3 ? "URGENT" : "UPCOMING"));
                }
            }
        }

        // 2. Subscriptions
        var subs = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (var sub : subs) {
            if (sub.getNextBillingDate() != null) {
                long days = ChronoUnit.DAYS.between(today, sub.getNextBillingDate());
                if (days <= 30) {
                    totalDue = totalDue.add(sub.getPrice());
                    payments.add(new UpcomingPayment("SUBSCRIPTION", sub.getServiceName() + " Auto-Debit", sub.getPrice(), sub.getNextBillingDate(), days, days <= 3 ? "URGENT" : "UPCOMING"));
                }
            }
        }

        // 3. Insurance Policies
        var policies = insuranceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (var p : policies) {
            long days = ChronoUnit.DAYS.between(today, p.getRenewalDate());
            if (days <= 60) {
                totalDue = totalDue.add(p.getAnnualPremium());
                payments.add(new UpcomingPayment("INSURANCE", p.getProviderName() + " (" + p.getPolicyType() + ")", p.getAnnualPremium(), p.getRenewalDate(), days, days <= 15 ? "URGENT" : "UPCOMING"));
            }
        }

        // 4. SIP Investments
        var investments = investmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (var inv : investments) {
            if (inv.getMonthlyContribution() != null && inv.getMonthlyContribution().compareTo(BigDecimal.ZERO) > 0) {
                LocalDate sipDate = today.withDayOfMonth(5).isBefore(today) ? today.plusMonths(1).withDayOfMonth(5) : today.withDayOfMonth(5);
                long days = ChronoUnit.DAYS.between(today, sipDate);
                totalDue = totalDue.add(inv.getMonthlyContribution());
                payments.add(new UpcomingPayment("INVESTMENT_SIP", inv.getName() + " Automated SIP", inv.getMonthlyContribution(), sipDate, days, "UPCOMING"));
            }
        }

        BigDecimal surplus = profile != null
            ? profile.getMonthlyIncome().subtract(profile.getMonthlySavingsTarget())
            : BigDecimal.valueOf(15000);
        BigDecimal projected = surplus.subtract(totalDue);

        String advice = projected.compareTo(BigDecimal.ZERO) >= 0
            ? String.format("All upcoming payments totaling %s across the next 30 days are 100%% covered by your monthly surplus. You will retain a comfortable %s disposable cushion.",
                totalDue.setScale(0, RoundingMode.HALF_UP), projected.setScale(0, RoundingMode.HALF_UP))
            : String.format("Alert: Upcoming commitments (%s) exceed your planned liquid buffer by %s. Consider pausing discretionary subscriptions before the renewal window.",
                totalDue.setScale(0, RoundingMode.HALF_UP), projected.abs().setScale(0, RoundingMode.HALF_UP));

        return new ProCashflowPlan(surplus, totalDue, projected, payments.size(), payments, advice);
    }
}
