package com.kanjoo.controller;

import com.kanjoo.entity.Currency;
import com.kanjoo.entity.User;
import com.kanjoo.entity.UserStock;
import com.kanjoo.repository.CurrencyRepository;
import com.kanjoo.repository.UserStockRepository;
import com.kanjoo.service.ProService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/pro")
public class ProController {

    private final ProService proService;
    private final UserStockRepository stockRepository;
    private final CurrencyRepository currencyRepository;

    public ProController(ProService proService,
                         UserStockRepository stockRepository,
                         CurrencyRepository currencyRepository) {
        this.proService = proService;
        this.stockRepository = stockRepository;
        this.currencyRepository = currencyRepository;
    }

    @GetMapping("/price")
    public ResponseEntity<?> getProPricing(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(proService.getProPricing(user));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribePro(@AuthenticationPrincipal User user,
                                          @RequestBody(required = false) Map<String, String> body) {
        if (user == null) return ResponseEntity.status(401).build();
        String paypalSubId = body != null ? body.get("paypalSubscriptionId") : null;
        User updated = proService.activatePro(user, paypalSubId);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Welcome to KANJOO PRO! All advanced fintech, tax, investor and stock features are unlocked.",
            "isProMember", updated.isProMember(),
            "proExpiresAt", updated.getProExpiresAt()
        ));
    }

    @GetMapping("/stocks")
    public ResponseEntity<?> getStockAnalysis(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(proService.getStockAnalysis(user));
    }

    public record AddStockRequest(
        String tickerSymbol,
        String companyName,
        BigDecimal quantity,
        BigDecimal buyPrice,
        BigDecimal currentPrice,
        String currencyCode,
        LocalDate purchaseDate,
        String sector
    ) {}

    @PostMapping("/stocks")
    public ResponseEntity<?> addStock(@AuthenticationPrincipal User user,
                                      @RequestBody AddStockRequest req) {
        if (user == null) return ResponseEntity.status(401).build();
        Currency curr = currencyRepository.findById(req.currencyCode() != null ? req.currencyCode() : "INR")
            .orElseGet(() -> currencyRepository.findAll().get(0));

        UserStock stock = new UserStock();
        stock.setUser(user);
        stock.setTickerSymbol(req.tickerSymbol().toUpperCase());
        stock.setCompanyName(req.companyName());
        stock.setQuantity(req.quantity());
        stock.setBuyPrice(req.buyPrice());
        stock.setCurrentPrice(req.currentPrice() != null ? req.currentPrice() : req.buyPrice());
        stock.setCurrency(curr);
        stock.setPurchaseDate(req.purchaseDate() != null ? req.purchaseDate() : LocalDate.now());
        stock.setSector(req.sector() != null ? req.sector() : "General");

        stock = stockRepository.save(stock);
        return ResponseEntity.ok(stock);
    }

    @DeleteMapping("/stocks/{id}")
    public ResponseEntity<?> deleteStock(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        stockRepository.findById(id).ifPresent(s -> {
            if (s.getUser().getId().equals(user.getId())) {
                stockRepository.delete(s);
            }
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/legal-templates")
    public ResponseEntity<?> getLegalTemplates(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(proService.getLegalTemplates());
    }

    @GetMapping("/tax-report")
    public ResponseEntity<?> getTaxReport(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(proService.getTaxReport(user));
    }

    @GetMapping("/investors")
    public ResponseEntity<?> getInvestors(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(proService.getInvestors());
    }

    @GetMapping("/network")
    public ResponseEntity<?> getBusinessNetwork(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(proService.getBusinessNetwork());
    }

    @GetMapping("/upcoming-payments")
    public ResponseEntity<?> getUpcomingPayments(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(proService.getUpcomingPaymentsPlan(user));
    }
}
