package com.kanjoo.repository;

import com.kanjoo.entity.RechargePlan;
import com.kanjoo.entity.Country;
import com.kanjoo.entity.TelecomOperator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RechargePlanRepository extends JpaRepository<RechargePlan, Long> {
    List<RechargePlan> findByCountry(Country country);
    List<RechargePlan> findByCountryCode(String countryCode);
    List<RechargePlan> findByOperator(TelecomOperator operator);
    List<RechargePlan> findByOperatorId(Long operatorId);
    List<RechargePlan> findByCountryCodeAndPlanType(String countryCode, String planType);
}
