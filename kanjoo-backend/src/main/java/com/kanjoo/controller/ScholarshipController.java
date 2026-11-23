package com.kanjoo.controller;

import com.kanjoo.entity.*;
import com.kanjoo.service.ScholarshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @GetMapping
    public ResponseEntity<?> getScholarships(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(scholarshipService.getScholarshipsForUser(user.getId()));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<?> toggleBookmark(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) return ResponseEntity.status(401).build();
        var result = scholarshipService.toggleBookmark(user.getId(), id, user);
        return ResponseEntity.ok(result != null);
    }
}
