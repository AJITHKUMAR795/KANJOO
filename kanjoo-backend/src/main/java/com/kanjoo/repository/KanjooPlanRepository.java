package com.kanjoo.repository;

import com.kanjoo.entity.KanjooPlan;
import com.kanjoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KanjooPlanRepository extends JpaRepository<KanjooPlan, Long> {
    Optional<KanjooPlan> findByUser(User user);
    Optional<KanjooPlan> findByUserId(Long userId);
}
