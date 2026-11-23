package com.kanjoo.repository;

import com.kanjoo.entity.Scholarship;
import com.kanjoo.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    List<Scholarship> findByCountry(Country country);
    List<Scholarship> findByCountryCode(String countryCode);
    List<Scholarship> findByCountryCodeAndEducationLevel(String countryCode, String educationLevel);
}
