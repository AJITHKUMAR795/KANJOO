package com.kanjoo.controller;

import com.kanjoo.entity.AiConversation;
import com.kanjoo.entity.User;
import com.kanjoo.repository.AiConversationRepository;
import com.kanjoo.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;
    private final AiConversationRepository aiConversationRepository;

    public AiController(AiService aiService, AiConversationRepository aiConversationRepository) {
        this.aiService = aiService;
        this.aiConversationRepository = aiConversationRepository;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@AuthenticationPrincipal User user,
                                  @RequestBody Map<String, String> body) {
        if (user == null) return ResponseEntity.status(401).build();
        String message = body.get("message");
        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body("Message is required");
        }
        return ResponseEntity.ok(aiService.processUserQuery(user, message));
    }

    @GetMapping("/history")
    public ResponseEntity<List<AiConversation>> getHistory(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(aiConversationRepository.findByUserIdOrderByCreatedAtAsc(user.getId()));
    }
}
