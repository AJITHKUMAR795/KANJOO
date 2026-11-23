package com.kanjoo.controller;

import com.kanjoo.entity.User;
import com.kanjoo.service.StatementImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statements")
public class StatementImportController {

    private final StatementImportService importService;

    public StatementImportController(StatementImportService importService) {
        this.importService = importService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> parseStatement(
        @AuthenticationPrincipal User user,
        @RequestBody Map<String, String> payload
    ) {
        Long userId = user != null ? user.getId() : 1L;
        String filename = payload.getOrDefault("filename", "statement.csv");
        String content = payload.getOrDefault("content", "");
        return ResponseEntity.ok(importService.parseStatement(userId, filename, content));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmTransactions(
        @AuthenticationPrincipal User user,
        @RequestBody List<StatementImportService.ImportedTxPreview> transactions
    ) {
        if (user == null) return ResponseEntity.status(401).build();
        int count = importService.confirmTransactions(user, transactions);
        return ResponseEntity.ok(Map.of("savedCount", count, "message", "Transactions successfully recorded to expenses"));
    }
}
