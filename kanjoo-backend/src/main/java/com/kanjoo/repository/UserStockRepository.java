package com.kanjoo.repository;

import com.kanjoo.entity.UserStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserStockRepository extends JpaRepository<UserStock, Long> {
    List<UserStock> findByUserIdOrderByCreatedAtDesc(Long userId);
}
