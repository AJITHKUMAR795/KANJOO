package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class NetWorthService {

    private final UserProfileRepository userProfileRepository;
    private final UserStockRepository stockRepository;
    private final InvestmentRepository investmentRepository;

    public NetWorthService(UserProfileRepository userProfileRepository,
                           UserStockRepository stockRepository,
                           InvestmentRepository investmentRepository) {
        this.userProfileRepository = userProfileRepository;
        this.stockRepository = stockRepository;
        this.investmentRepository = investmentRepository;
    }

    public record AssetItem(
        String id,
        String category, // LIQUID_CASH, FIXED_DEPOSIT, EQUITIES, MUTUAL_FUNDS, GOLD, REAL_ESTATE
        String name,
        BigDecimal value,
        String institution,
        String lastUpdated
    ) {}

    public record LiabilityItem(
        String id,
        String category, // HOME_LOAN, EDUCATION_LOAN, VEHICLE_LOAN, CREDIT_CARD, PERSONAL_LOAN
        String name,
        BigDecimal balance,
        BigDecimal interestRatePercent,
        String lender
    ) {}

    public record HistoricalNetWorthPoint(
        String monthLabel,
        BigDecimal totalAssets,
        BigDecimal totalLiabilities,
        BigDecimal netWorth
    ) {}

    public record NetWorthDashboardResult(
        BigDecimal totalAssets,
        BigDecimal totalLiabilities,
        BigDecimal netWorth,
        BigDecimal monthlyChangeAmount,
        BigDecimal monthlyChangePercent,
        List<AssetItem> assets,
        List<LiabilityItem> liabilities,
        Map<String, BigDecimal> assetAllocationPercents,
        Map<String, BigDecimal> liabilityDistributionPercents,
        List<HistoricalNetWorthPoint> history,
        List<String> wealthInsights
    ) {}

    public NetWorthDashboardResult calculateNetWorth(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);

        BigDecimal liquidCash = profile != null && profile.getEmergencySavings() != null 
            ? profile.getEmergencySavings() 
            : new BigDecimal("35000.00");

        List<AssetItem> assets = new ArrayList<>();
        assets.add(new AssetItem("A-1", "LIQUID_CASH", "HDFC Salary Account", liquidCash, "HDFC Bank", "Today"));
        assets.add(new AssetItem("A-2", "FIXED_DEPOSIT", "SBI Emergency Fixed Deposit", new BigDecimal("50000.00"), "State Bank of India", "Nov 2026"));
        assets.add(new AssetItem("A-3", "MUTUAL_FUNDS", "Nifty 50 Direct Index SIP", new BigDecimal("39800.00"), "Zerodha Coin", "Live NAV"));
        assets.add(new AssetItem("A-4", "EQUITIES", "Bluechip Equity Stock Portfolio", new BigDecimal("65000.00"), "Zerodha Kite", "Market Close"));
        assets.add(new AssetItem("A-5", "GOLD", "Sovereign Gold Bonds (SGB)", new BigDecimal("25000.00"), "RBI / HDFC Sec", "Live Spot"));

        List<LiabilityItem> liabilities = new ArrayList<>();
        liabilities.add(new LiabilityItem("L-1", "EDUCATION_LOAN", "HDFC Credila Higher Education Loan", new BigDecimal("320000.00"), new BigDecimal("9.5"), "HDFC Credila"));
        liabilities.add(new LiabilityItem("L-2", "VEHICLE_LOAN", "Bajaj Auto Two-Wheeler Loan", new BigDecimal("75000.00"), new BigDecimal("12.5"), "Bajaj Finance"));
        liabilities.add(new LiabilityItem("L-3", "CREDIT_CARD", "ICICI Platinum Credit Card", new BigDecimal("45000.00"), new BigDecimal("38.0"), "ICICI Bank"));

        BigDecimal totalAssets = assets.stream().map(AssetItem::value).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalLiabilities = liabilities.stream().map(LiabilityItem::balance).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal netWorth = totalAssets.subtract(totalLiabilities);

        Map<String, BigDecimal> assetAllocation = new LinkedHashMap<>();
        if (totalAssets.compareTo(BigDecimal.ZERO) > 0) {
            for (var a : assets) {
                BigDecimal pct = a.value().divide(totalAssets, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).setScale(1, RoundingMode.HALF_UP);
                assetAllocation.put(a.name(), pct);
            }
        }

        Map<String, BigDecimal> liabilityAllocation = new LinkedHashMap<>();
        if (totalLiabilities.compareTo(BigDecimal.ZERO) > 0) {
            for (var l : liabilities) {
                BigDecimal pct = l.balance().divide(totalLiabilities, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).setScale(1, RoundingMode.HALF_UP);
                liabilityAllocation.put(l.name(), pct);
            }
        }

        List<HistoricalNetWorthPoint> history = List.of(
            new HistoricalNetWorthPoint("Jun 2026", new BigDecimal("170000"), new BigDecimal("470000"), new BigDecimal("-300000")),
            new HistoricalNetWorthPoint("Jul 2026", new BigDecimal("182000"), new BigDecimal("464000"), new BigDecimal("-282000")),
            new HistoricalNetWorthPoint("Aug 2026", new BigDecimal("193000"), new BigDecimal("458000"), new BigDecimal("-265000")),
            new HistoricalNetWorthPoint("Sep 2026", new BigDecimal("201000"), new BigDecimal("452000"), new BigDecimal("-251000")),
            new HistoricalNetWorthPoint("Oct 2026", new BigDecimal("208000"), new BigDecimal("446000"), new BigDecimal("-238000")),
            new HistoricalNetWorthPoint("Nov 2026", totalAssets, totalLiabilities, netWorth)
        );

        BigDecimal monthlyChange = new BigDecimal("13000.00");
        BigDecimal monthlyChangePct = new BigDecimal("5.46");

        List<String> insights = List.of(
            "Net worth expanded by +₹13,000 this month due to combined debt paydown and SIP equity appreciation.",
            "Asset Allocation Health: 39.5% in liquid/cash buffers, 48.7% in productive compounding equity assets, 11.8% in gold hedges.",
            "Debt-to-Asset Ratio is currently 2.05. Prioritizing elimination of the 38% APR credit card balance will flip this trajectory into positive net worth faster."
        );

        return new NetWorthDashboardResult(
            totalAssets,
            totalLiabilities,
            netWorth,
            monthlyChange,
            monthlyChangePct,
            assets,
            liabilities,
            assetAllocation,
            liabilityAllocation,
            history,
            insights
        );
    }
}
