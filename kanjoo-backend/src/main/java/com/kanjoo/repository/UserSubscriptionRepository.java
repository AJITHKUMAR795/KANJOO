package com.kanjoo.repository;

import com.kanjoo.entity.UserSubscription;
import com.kanjoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    List<UserSubscription> findByUserOrderByCreatedAtDesc(User user);
    List<UserSubscription> findByUserIdOrderByCreatedAtDesc(Long userId);
}
