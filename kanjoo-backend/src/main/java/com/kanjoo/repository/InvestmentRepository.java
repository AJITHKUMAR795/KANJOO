package com.kanjoo.repository;

import com.kanjoo.entity.Investment;
import com.kanjoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByUserOrderByCreatedAtDesc(User user);
    List<Investment> findByUserIdOrderByCreatedAtDesc(Long userId);
}
