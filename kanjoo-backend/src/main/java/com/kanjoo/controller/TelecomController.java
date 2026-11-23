package com.kanjoo.controller;

import com.kanjoo.dto.TelecomDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.service.RechargeOptimizationEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/telecom")
public class TelecomController {

    private final TelecomOperatorRepository operatorRepository;
    private final RechargePlanRepository rechargePlanRepository;
    private final UserSimCardRepository userSimCardRepository;
    private final UserProfileRepository userProfileRepository;
    private final RechargeOptimizationEngine rechargeOptimizationEngine;

    public TelecomController(TelecomOperatorRepository operatorRepository,
                             RechargePlanRepository rechargePlanRepository,
                             UserSimCardRepository userSimCardRepository,
                             UserProfileRepository userProfileRepository,
                             RechargeOptimizationEngine rechargeOptimizationEngine) {
        this.operatorRepository = operatorRepository;
        this.rechargePlanRepository = rechargePlanRepository;
        this.userSimCardRepository = userSimCardRepository;
        this.userProfileRepository = userProfileRepository;
        this.rechargeOptimizationEngine = rechargeOptimizationEngine;
    }

    @GetMapping("/operators")
    public ResponseEntity<List<TelecomOperator>> getOperators(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        String countryCode = profile != null ? profile.getCountry().getCode() : "IN";
        return ResponseEntity.ok(operatorRepository.findByCountryCode(countryCode));
    }

    @GetMapping("/plans")
    public ResponseEntity<List<RechargePlan>> getPlans(@AuthenticationPrincipal User user,
                                                       @RequestParam(required = false) Long operatorId) {
        if (user == null) return ResponseEntity.status(401).build();
        if (operatorId != null) {
            return ResponseEntity.ok(rechargePlanRepository.findByOperatorId(operatorId));
        }
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        String countryCode = profile != null ? profile.getCountry().getCode() : "IN";
        return ResponseEntity.ok(rechargePlanRepository.findByCountryCode(countryCode));
    }

    @GetMapping("/sim-cards")
    public ResponseEntity<List<SimCardResponse>> getSimCards(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        List<UserSimCard> sims = userSimCardRepository.findByUserIdOrderByIdAsc(user.getId());
        List<SimCardResponse> res = sims.stream().map(s -> new SimCardResponse(
            s.getId(),
            s.getOperator().getId(),
            s.getOperator().getName(),
            s.getOperator().getCode(),
            s.getOperator().getLogoColor(),
            s.getPhoneNumber(),
            s.getSimSlot(),
            s.getCurrentPlan() != null ? s.getCurrentPlan().getId() : null,
            s.getCurrentPlan() != null ? s.getCurrentPlan().getPlanName() : "None",
            s.getCurrentPlan() != null ? s.getCurrentPlan().getPrice() : null,
            s.getCurrentPlan() != null ? s.getCurrentPlan().getValidityDays() : 0,
            s.getDailyDataUsedGb(),
            s.isHasWifiAccess(),
            s.getPlanExpiryDate()
        )).toList();

        return ResponseEntity.ok(res);
    }

    @PostMapping("/sim-cards")
    public ResponseEntity<?> addSimCard(@AuthenticationPrincipal User user,
                                        @RequestBody AddSimRequest req) {
        if (user == null) return ResponseEntity.status(401).build();

        TelecomOperator op = operatorRepository.findById(req.operatorId()).orElseThrow();
        RechargePlan plan = req.currentPlanId() != null 
            ? rechargePlanRepository.findById(req.currentPlanId()).orElse(null) 
            : null;

        UserSimCard sim = new UserSimCard();
        sim.setUser(user);
        sim.setOperator(op);
        sim.setPhoneNumber(req.phoneNumber());
        sim.setSimSlot(req.simSlot() != null ? req.simSlot() : "PRIMARY");
        sim.setCurrentPlan(plan);
        sim.setPlanExpiryDate(req.planExpiryDate());
        sim.setDailyDataUsedGb(req.dailyDataUsedGb());
        sim.setHasWifiAccess(req.hasWifiAccess());

        sim = userSimCardRepository.save(sim);
        return ResponseEntity.ok(sim);
    }

    @DeleteMapping("/sim-cards/{id}")
    public ResponseEntity<?> deleteSimCard(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        userSimCardRepository.findById(id).ifPresent(s -> {
            if (s.getUser().getId().equals(user.getId())) {
                userSimCardRepository.delete(s);
            }
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/optimize")
    public ResponseEntity<?> getOptimizationReport(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        if (profile == null) return ResponseEntity.badRequest().body("Profile missing");

        return ResponseEntity.ok(rechargeOptimizationEngine.analyzeUserSims(user.getId(), profile.getPrimaryCurrency()));
    }
}
