package com.kanjoo.repository;

import com.kanjoo.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {
    Optional<ExpenseCategory> findByCode(String code);
}
