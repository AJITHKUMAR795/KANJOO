package com.kanjoo.controller;

import com.kanjoo.entity.Expense;
import com.kanjoo.entity.User;
import com.kanjoo.service.ReceiptScannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptScannerController {

    private final ReceiptScannerService receiptService;

    public ReceiptScannerController(ReceiptScannerService receiptService) {
        this.receiptService = receiptService;
    }

    @PostMapping("/scan")
    public ResponseEntity<?> scanReceipt(
        @AuthenticationPrincipal User user,
        @RequestBody Map<String, String> payload
    ) {
        Long userId = user != null ? user.getId() : 1L;
        String rawText = payload.getOrDefault("text", "");
        String filename = payload.getOrDefault("filename", "receipt.jpg");
        return ResponseEntity.ok(receiptService.scanReceipt(userId, rawText, filename));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmReceipt(
        @AuthenticationPrincipal User user,
        @RequestBody ReceiptScannerService.ScannedReceiptResult receipt
    ) {
        if (user == null) return ResponseEntity.status(401).build();
        Expense created = receiptService.createExpenseFromReceipt(user, receipt);
        return ResponseEntity.ok(Map.of(
            "expenseId", created.getId(),
            "amount", created.getAmount(),
            "message", "Expense created from scanned receipt successfully"
        ));
    }
}
