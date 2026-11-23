package com.kanjoo.repository;

import com.kanjoo.entity.KanjooPlanItem;
import com.kanjoo.entity.KanjooPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KanjooPlanItemRepository extends JpaRepository<KanjooPlanItem, Long> {
    List<KanjooPlanItem> findByPlan(KanjooPlan plan);
    List<KanjooPlanItem> findByPlanId(Long planId);
}
