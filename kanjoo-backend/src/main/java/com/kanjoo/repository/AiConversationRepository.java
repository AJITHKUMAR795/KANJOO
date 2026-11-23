package com.kanjoo.repository;

import com.kanjoo.entity.AiConversation;
import com.kanjoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiConversationRepository extends JpaRepository<AiConversation, Long> {
    List<AiConversation> findByUserOrderByCreatedAtAsc(User user);
    List<AiConversation> findByUserIdOrderByCreatedAtAsc(Long userId);
}
