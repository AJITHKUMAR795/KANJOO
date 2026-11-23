package com.kanjoo.repository;

import com.kanjoo.entity.OfferSubscription;
import com.kanjoo.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferSubscriptionRepository extends JpaRepository<OfferSubscription, Long> {
    List<OfferSubscription> findByCountry(Country country);
    List<OfferSubscription> findByCountryCode(String countryCode);
    List<OfferSubscription> findByCountryCodeAndCategory(String countryCode, String category);
    List<OfferSubscription> findByCountryCodeAndStudentOnly(String countryCode, boolean studentOnly);
}
