package com.kanjoo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kanjoo.entity.*;
import com.kanjoo.entity.Currency;
import com.kanjoo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class AiService {

    @Value("${kanjoo.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${kanjoo.gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String geminiApiUrl;

    private final UserProfileRepository userProfileRepository;
    private final ExpenseRepository expenseRepository;
    private final MoneyLeakDetectorEngine leakEngine;
    private final RechargeOptimizationEngine rechargeEngine;
    private final SubscriptionIntelligenceEngine subscriptionEngine;
    private final CurrencyService currencyService;
    private final AiConversationRepository aiConversationRepository;
    private final InsuranceService insuranceService;
    private final ProService proService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public AiService(UserProfileRepository userProfileRepository,
                     ExpenseRepository expenseRepository,
                     MoneyLeakDetectorEngine leakEngine,
                     RechargeOptimizationEngine rechargeEngine,
                     SubscriptionIntelligenceEngine subscriptionEngine,
                     CurrencyService currencyService,
                     AiConversationRepository aiConversationRepository,
                     InsuranceService insuranceService,
                     ProService proService) {
        this.userProfileRepository = userProfileRepository;
        this.expenseRepository = expenseRepository;
        this.leakEngine = leakEngine;
        this.rechargeEngine = rechargeEngine;
        this.subscriptionEngine = subscriptionEngine;
        this.currencyService = currencyService;
        this.aiConversationRepository = aiConversationRepository;
        this.insuranceService = insuranceService;
        this.proService = proService;
    }

    public record ChatResponse(
        String reply,
        String suggestedAction,
        String actionUrl,
        List<String> followUpQuestions
    ) {}

    public ChatResponse processUserQuery(User user, String userQuery) {
        // Save user message to history
        AiConversation userMsg = new AiConversation(user, "USER", userQuery);
        aiConversationRepository.save(userMsg);

        // Gather real context from database
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        if (profile == null) {
            String fallback = "Please complete your initial financial onboarding so I have access to your country and currency context.";
            saveAssistantMessage(user, fallback, null);
            return new ChatResponse(fallback, "Complete Onboarding", "/onboarding", List.of("Start onboarding"));
        }

        Currency currency = profile.getPrimaryCurrency();
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        List<Expense> monthExpenses = expenseRepository.findByUserIdAndDateRange(user.getId(), startOfMonth, now);

        BigDecimal currentMonthExpenses = monthExpenses.stream()
            .map(Expense::getPrimaryAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncome = profile.getMonthlyIncome().add(profile.getOtherIncome()).add(profile.getPocketMoney());
        var leakReport = leakEngine.detectLeaks(user.getId());
        var simResults = rechargeEngine.analyzeUserSims(user.getId(), currency);
        var subEvals = subscriptionEngine.evaluateUserSubscriptions(user.getId());

        // Context summary block
        String verifiedContext = String.format(
            "User: %s | Country: %s | Primary Currency: %s (%s) | Monthly Income: %s | Current Month Expenses: %s | Emergency Savings: %s | Savings Target: %s | Leaks Found: %d (Total Monthly Savings: %s) | SIM Cards: %d | Subscriptions: %d",
            user.getFullName(),
            profile.getCountry().getName(),
            currency.getCode(),
            currency.getSymbol(),
            currencyService.format(totalIncome, currency),
            currencyService.format(currentMonthExpenses, currency),
            currencyService.format(profile.getEmergencySavings(), currency),
            currencyService.format(profile.getMonthlySavingsTarget(), currency),
            leakReport.leaks().size(),
            currencyService.format(leakReport.totalPotentialMonthlySavings(), currency),
            simResults.size(),
            subEvals.size()
        );

        // If Gemini API Key is configured, attempt LLM call
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                String llmReply = callGemini(userQuery, verifiedContext);
                if (llmReply != null && !llmReply.isBlank()) {
                    saveAssistantMessage(user, llmReply, verifiedContext);
                    return new ChatResponse(
                        llmReply,
                        "View Financial Plan",
                        "/kanjoo-plan",
                        List.of("How can I reduce expenses?", "Analyze my recharge plans", "How much can I save in one year?")
                    );
                }
            } catch (Exception e) {
                // Graceful fallback to deterministic intelligence
            }
        }

        // High-intelligence deterministic response engine
        ChatResponse response = generateDeterministicAdvice(user, userQuery, profile, currency, totalIncome, currentMonthExpenses, leakReport, simResults, subEvals);
        saveAssistantMessage(user, response.reply(), verifiedContext);
        return response;
    }

    private ChatResponse generateDeterministicAdvice(User user,
                                                     String query,
                                                     UserProfile profile,
                                                     Currency currency,
                                                     BigDecimal totalIncome,
                                                     BigDecimal monthExpenses,
                                                     MoneyLeakDetectorEngine.MoneyLeakReport leakReport,
                                                     List<RechargeOptimizationEngine.SimOptimizationResult> simResults,
                                                     List<SubscriptionIntelligenceEngine.SubscriptionEvaluation> subEvals) {
        String q = query.toLowerCase();

        // 0. Upcoming Payments & Cashflow Pro Planner Query
        if (q.contains("upcoming") || q.contains("payment") || q.contains("due") || q.contains("bill") || q.contains("renewal")) {
            var plan = proService.getUpcomingPaymentsPlan(user);
            StringBuilder sb = new StringBuilder();
            sb.append("Here is your **Upcoming Payments & Cashflow Schedule** for the next 30 days:\n\n");
            if (plan.payments().isEmpty()) {
                sb.append("No immediate payments due in the next 30 days! Your recurring obligations are up to date.\n\n");
            } else {
                for (var p : plan.payments()) {
                    sb.append(String.format("- **%s** (%s): **%s** due on `%s` (%d days remaining) [%s]\n",
                        p.title(), p.category(), currencyService.format(p.amount(), currency), p.dueDate(), p.daysRemaining(), p.status()));
                }
                sb.append("\n**Total Due:** ").append(currencyService.format(plan.upcomingPaymentsTotal(), currency)).append("\n");
                sb.append("**Projected Remaining Surplus:** ").append(currencyService.format(plan.projectedEndMonthSurplus(), currency)).append("\n\n");
                sb.append("*Advisor Insight:* ").append(plan.proactiveAiAdvice());
            }

            return new ChatResponse(
                sb.toString(),
                "View Pro Cashflow",
                "/pro/cashflow",
                List.of("Can I reduce my upcoming bills?", "Am I eligible to invest?", "Check my insurance safety net")
            );
        }

        // 0.1 Insurance & Safety Net Query
        if (q.contains("insurance") || q.contains("health cover") || q.contains("term life") || q.contains("policy")) {
            var rep = insuranceService.getAdequacyReport(user);
            StringBuilder sb = new StringBuilder();
            sb.append("Here is your **Insurance Adequacy & Safety Net Analysis**:\n\n");
            sb.append("- **Health Coverage:** ").append(currencyService.format(rep.totalHealthCoverage(), currency))
              .append(" (Recommended benchmark: ").append(currencyService.format(rep.recommendedHealthCoverage(), currency)).append(")\n");
            sb.append("- **Life Coverage:** ").append(currencyService.format(rep.totalLifeCoverage(), currency))
              .append(" (Recommended benchmark: ").append(currencyService.format(rep.recommendedLifeCoverage(), currency)).append(")\n");
            sb.append("- **Total Annual Premium:** ").append(currencyService.format(rep.totalAnnualPremium(), currency)).append("\n");
            sb.append("- **Estimated Tax Savings (80D/80C):** ").append(currencyService.format(rep.estimatedTaxSavings(), currency)).append("\n\n");

            if (!rep.criticalGaps().isEmpty()) {
                sb.append("**Actionable Gaps Identified:**\n");
                for (String g : rep.criticalGaps()) {
                    sb.append("- ").append(g).append("\n");
                }
            }

            return new ChatResponse(
                sb.toString(),
                "Review Insurance Gaps",
                "/insurance",
                List.of("Recommend me a health policy", "What payments are upcoming?", "How much can I invest?")
            );
        }

        // 1. Telecom & SIM query
        if (q.contains("recharge") || q.contains("sim") || q.contains("telecom") || q.contains("mobile")) {
            StringBuilder sb = new StringBuilder();
            sb.append("Here is your Telecom Intelligence breakdown for **").append(profile.getCountry().getName()).append("**:\n\n");
            
            boolean foundOpt = false;
            for (var sim : simResults) {
                if (sim.potentialMonthlySavings().compareTo(BigDecimal.ZERO) > 0) {
                    foundOpt = true;
                    sb.append("- **").append(sim.simCard().getSimSlot()).append(" SIM (").append(sim.simCard().getOperator().getName()).append(")**: ")
                      .append("You can save **").append(currencyService.format(sim.potentialMonthlySavings(), currency)).append("/month** (")
                      .append(currencyService.format(sim.potentialAnnualSavings(), currency)).append("/year) by switching to **")
                      .append(sim.recommendedPlan().getPlanName()).append("**.\n  *Reason:* ").append(sim.reasoning()).append("\n\n");
                }
            }

            if (!foundOpt) {
                sb.append("All your configured SIM cards are currently on optimal tariff tiers. Total monthly telecom cost is well-managed.");
            } else {
                sb.append("Switching unnecessary high-data secondary packs when Wi-Fi is available will stop immediate balance drain.");
            }

            return new ChatResponse(
                sb.toString(),
                "Optimize SIM Plans",
                "/recharge-optimizer",
                List.of("Should I keep both SIM cards?", "Which subscriptions are unnecessary?", "How much did I spend this month?")
            );
        }

        // 2. Spending inquiry
        if (q.contains("how much") && (q.contains("spend") || q.contains("spent") || q.contains("expense"))) {
            BigDecimal remaining = totalIncome.subtract(monthExpenses);
            String reply = String.format(
                "In the current month, you have spent **%s** out of your **%s** verified income.\n\n" +
                "- **Current Expenses:** %s\n" +
                "- **Remaining Cash Flow:** %s\n" +
                "- **Target Monthly Savings:** %s\n\n" +
                "%s",
                currencyService.format(monthExpenses, currency),
                currencyService.format(totalIncome, currency),
                currencyService.format(monthExpenses, currency),
                currencyService.format(remaining, currency),
                currencyService.format(profile.getMonthlySavingsTarget(), currency),
                remaining.compareTo(profile.getMonthlySavingsTarget()) >= 0 
                    ? "You are currently on track to hit your savings goal this month!" 
                    : "Caution: Current spending is trending higher than your savings pace."
            );
            return new ChatResponse(
                reply,
                "View Expense Breakdown",
                "/expenses",
                List.of("Where is my money going?", "Can I reduce my expenses?", "Detect money leaks")
            );
        }

        // 3. Subscriptions & Leaks
        if (q.contains("subscription") || q.contains("leak") || q.contains("unnecessary") || q.contains("cancel")) {
            StringBuilder sb = new StringBuilder();
            sb.append("### Money Leak Analysis\n");
            sb.append("I identified **").append(leakReport.leaks().size()).append(" potential leak(s)** totaling **")
              .append(currencyService.format(leakReport.totalPotentialMonthlySavings(), currency)).append("/month** (")
              .append(currencyService.format(leakReport.totalPotentialAnnualSavings(), currency)).append(" per year):\n\n");

            for (var leak : leakReport.leaks()) {
                sb.append("1. **").append(leak.problem()).append("**\n")
                  .append("   - *Action:* ").append(leak.suggestedAlternative()).append("\n")
                  .append("   - *Monthly Savings:* ").append(currencyService.format(leak.potentialMonthlySavings(), currency)).append("\n\n");
            }

            return new ChatResponse(
                sb.toString(),
                "Plug Money Leaks",
                "/money-leak",
                List.of("Can I reduce my recharge plans?", "Can I afford a new laptop?", "Simulate my savings")
            );
        }

        // 4. Laptop / Purchase Affordability
        if (q.contains("afford") || q.contains("laptop") || q.contains("buy") || q.contains("purchase")) {
            BigDecimal surplus = totalIncome.subtract(monthExpenses).subtract(profile.getMonthlySavingsTarget());
            if (surplus.compareTo(BigDecimal.ZERO) < 0) surplus = BigDecimal.ZERO;

            String reply = String.format(
                "Before making a significant planned purchase (such as a laptop), KANJOO analyzes your cash reserves:\n\n" +
                "- **Monthly Disposable Surplus:** %s\n" +
                "- **Emergency Reserve:** %s\n\n" +
                "**Recommendation:** Use the **Before You Spend** tool to test the exact purchase amount against your savings goal and verify whether you should pay upfront, delay 14 days, or budget across 2 cycles without touching emergency reserves.",
                currencyService.format(surplus, currency),
                currencyService.format(profile.getEmergencySavings(), currency)
            );
            return new ChatResponse(
                reply,
                "Simulate Planned Purchase",
                "/before-you-spend",
                List.of("How much can I save in one year?", "Plug my money leaks", "What is my financial health score?")
            );
        }

        // 5. Savings Projection (1 Year)
        if (q.contains("save") && (q.contains("year") || q.contains("annual") || q.contains("how much"))) {
            BigDecimal baselineAnnualSavings = profile.getMonthlySavingsTarget().multiply(BigDecimal.valueOf(12));
            BigDecimal optimizedAnnualSavings = baselineAnnualSavings.add(leakReport.totalPotentialAnnualSavings());

            String reply = String.format(
                "Based on your profile in **%s**:\n\n" +
                "- **Baseline 1-Year Savings (Current Target):** %s\n" +
                "- **Recoverable Money Leaks:** +%s/year\n" +
                "- **Total Potential 1-Year Wealth Created:** **%s**\n\n" +
                "By executing your KANJOO recommendations (optimizing telecom and canceling unused services), you can increase your yearly savings by **%s** with zero impact on lifestyle quality.",
                profile.getCountry().getName(),
                currencyService.format(baselineAnnualSavings, currency),
                currencyService.format(leakReport.totalPotentialAnnualSavings(), currency),
                currencyService.format(optimizedAnnualSavings, currency),
                currencyService.format(leakReport.totalPotentialAnnualSavings(), currency)
            );
            return new ChatResponse(
                reply,
                "Review My KANJOO Plan",
                "/kanjoo-plan",
                List.of("Can I reduce my mobile recharge?", "Which student discounts am I eligible for?", "Calculate SIP growth")
            );
        }

        // General default assistance
        String reply = String.format(
            "Hello %s! I'm your KANJOO Financial Intelligence Assistant for **%s** (%s).\n\n" +
            "I have real-time visibility into your verified income (%s), monthly expenses (%s), and active telecom/subscription accounts.\n\n" +
            "You can ask me:\n" +
            "- *'How much did I spend this month?'*\n" +
            "- *'Can I reduce my mobile recharge expenses?'*\n" +
            "- *'Which subscriptions are unnecessary?'*\n" +
            "- *'Can I afford a new laptop?'*\n" +
            "- *'How much can I save in one year?'*",
            profile.getUser().getFullName(),
            profile.getCountry().getName(),
            currency.getCode(),
            currencyService.format(totalIncome, currency),
            currencyService.format(monthExpenses, currency)
        );

        return new ChatResponse(
            reply,
            "Explore Dashboard",
            "/dashboard",
            List.of("Can I reduce my mobile recharge?", "How much did I spend this month?", "Detect money leaks")
        );
    }

    private String callGemini(String prompt, String context) {
        try {
            String fullPrompt = "You are KANJOO AI, a financial intelligence assistant. " +
                                "Context: " + context + "\n\n" +
                                "User Question: " + prompt + "\n\n" +
                                "Instructions: Provide concise, professional, actionable financial guidance. Never hallucinate data. Respect the user's country and primary currency.";

            Map<String, Object> body = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", fullPrompt)))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            String urlWithKey = geminiApiUrl + "?key=" + geminiApiKey;
            ResponseEntity<String> res = restTemplate.postForEntity(urlWithKey, entity, String.class);

            if (res.getStatusCode() == HttpStatus.OK && res.getBody() != null) {
                JsonNode root = objectMapper.readTree(res.getBody());
                JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                if (!textNode.isMissingNode()) {
                    return textNode.asText();
                }
            }
        } catch (Exception e) {
            // fallback
        }
        return null;
    }

    private void saveAssistantMessage(User user, String content, String context) {
        AiConversation msg = new AiConversation(user, "ASSISTANT", content);
        msg.setContextData(context);
        aiConversationRepository.save(msg);
    }
}
