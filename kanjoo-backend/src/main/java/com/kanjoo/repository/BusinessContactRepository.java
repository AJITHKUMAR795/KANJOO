package com.kanjoo.repository;

import com.kanjoo.entity.BusinessContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessContactRepository extends JpaRepository<BusinessContact, Long> {
    List<BusinessContact> findByCountryCode(String countryCode);
    List<BusinessContact> findAllByOrderByCreatedAtDesc();
}
