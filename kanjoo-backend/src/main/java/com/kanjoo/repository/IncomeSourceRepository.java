package com.kanjoo.repository;

import com.kanjoo.entity.IncomeSource;
import com.kanjoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeSourceRepository extends JpaRepository<IncomeSource, Long> {
    List<IncomeSource> findByUserOrderByCreatedAtDesc(User user);
    List<IncomeSource> findByUserIdOrderByCreatedAtDesc(Long userId);
}
