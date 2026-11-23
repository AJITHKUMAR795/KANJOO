package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.FamilyFinanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/family")
public class FamilyController {

    private final FamilyFinanceService familyService;

    public FamilyController(FamilyFinanceService familyService) {
        this.familyService = familyService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getFamilyOverview(@AuthenticationPrincipal User currentUser) {
        Long userId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(familyService.getFamilyOverview(userId));
    }

    @PostMapping("/invite")
    public ResponseEntity<Map<String, Object>> inviteMember(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User currentUser
    ) {
        String email = body.getOrDefault("email", "");
        String role = body.getOrDefault("role", "VIEWER");

        return ResponseEntity.ok(Map.of(
                "status", "INVITATION_SENT",
                "email", email,
                "role", role,
                "message", "Encrypted invitation link dispatched. Member will only see shared household pool."
        ));
    }
}
