package com.kanjoo.repository;

import com.kanjoo.entity.BudgetCategory;
import com.kanjoo.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long> {
    List<BudgetCategory> findByBudget(Budget budget);
}
