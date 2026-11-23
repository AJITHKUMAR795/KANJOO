package com.kanjoo.repository;

import com.kanjoo.entity.Investor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestorRepository extends JpaRepository<Investor, Long> {
    List<Investor> findByCountryCode(String countryCode);
    List<Investor> findAllByOrderByCreatedAtDesc();
}
