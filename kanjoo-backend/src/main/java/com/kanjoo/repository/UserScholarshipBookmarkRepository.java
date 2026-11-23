package com.kanjoo.repository;

import com.kanjoo.entity.UserScholarshipBookmark;
import com.kanjoo.entity.User;
import com.kanjoo.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserScholarshipBookmarkRepository extends JpaRepository<UserScholarshipBookmark, Long> {
    List<UserScholarshipBookmark> findByUserOrderByCreatedAtDesc(User user);
    List<UserScholarshipBookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<UserScholarshipBookmark> findByUserAndScholarship(User user, Scholarship scholarship);
    Optional<UserScholarshipBookmark> findByUserIdAndScholarshipId(Long userId, Long scholarshipId);
}
