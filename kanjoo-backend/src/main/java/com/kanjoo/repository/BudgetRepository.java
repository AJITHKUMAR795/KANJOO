package com.kanjoo.repository;

import com.kanjoo.entity.Budget;
import com.kanjoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserAndMonthYear(User user, String monthYear);
    Optional<Budget> findByUserIdAndMonthYear(Long userId, String monthYear);
    List<Budget> findByUserIdOrderByMonthYearDesc(Long userId);
}
