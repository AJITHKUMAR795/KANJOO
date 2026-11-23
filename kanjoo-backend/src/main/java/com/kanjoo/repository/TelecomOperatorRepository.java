package com.kanjoo.repository;

import com.kanjoo.entity.TelecomOperator;
import com.kanjoo.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TelecomOperatorRepository extends JpaRepository<TelecomOperator, Long> {
    List<TelecomOperator> findByCountry(Country country);
    List<TelecomOperator> findByCountryCode(String countryCode);
}
