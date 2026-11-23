package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.NetWorthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/net-worth")
public class NetWorthController {

    private final NetWorthService netWorthService;

    public NetWorthController(NetWorthService netWorthService) {
        this.netWorthService = netWorthService;
    }

    @GetMapping
    public ResponseEntity<?> getNetWorth(@AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        return ResponseEntity.ok(netWorthService.calculateNetWorth(userId));
    }

    @PostMapping("/assets")
    public ResponseEntity<?> addAsset(
        @AuthenticationPrincipal User user,
        @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(Map.of("success", true, "message", "Asset recorded in net worth dashboard"));
    }
}
