package com.kanjoo.service;

import com.kanjoo.entity.*;
import com.kanjoo.repository.ScholarshipRepository;
import com.kanjoo.repository.UserProfileRepository;
import com.kanjoo.repository.UserScholarshipBookmarkRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;
    private final UserScholarshipBookmarkRepository bookmarkRepository;
    private final UserProfileRepository userProfileRepository;

    public ScholarshipService(ScholarshipRepository scholarshipRepository,
                              UserScholarshipBookmarkRepository bookmarkRepository,
                              UserProfileRepository userProfileRepository) {
        this.scholarshipRepository = scholarshipRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public record ScholarshipCardDto(
        Scholarship scholarship,
        boolean isEligible,
        String eligibilityReason,
        boolean isBookmarked,
        String bookmarkStatus
    ) {}

    public List<ScholarshipCardDto> getScholarshipsForUser(Long userId) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) return List.of();

        UserProfile profile = profileOpt.get();
        List<Scholarship> list = scholarshipRepository.findByCountry(profile.getCountry());
        List<UserScholarshipBookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<ScholarshipCardDto> results = new ArrayList<>();

        for (Scholarship s : list) {
            Optional<UserScholarshipBookmark> bk = bookmarks.stream()
                .filter(b -> b.getScholarship().getId().equals(s.getId()))
                .findFirst();

            boolean bookmarked = bk.isPresent();
            String status = bk.map(UserScholarshipBookmark::getStatus).orElse("NOT_BOOKMARKED");

            boolean eligible = true;
            String reason = "Matches country citizenship and academic criteria.";

            if (s.getEducationLevel() != null && profile.getEducationLevel() != null) {
                if (!s.getEducationLevel().equalsIgnoreCase(profile.getEducationLevel()) 
                    && !s.getEducationLevel().contains(profile.getEducationLevel())) {
                    eligible = false;
                    reason = "Education level specifies " + s.getEducationLevel();
                }
            }

            results.add(new ScholarshipCardDto(s, eligible, reason, bookmarked, status));
        }

        return results;
    }

    public UserScholarshipBookmark toggleBookmark(Long userId, Long scholarshipId, User user) {
        Optional<UserScholarshipBookmark> existing = bookmarkRepository.findByUserIdAndScholarshipId(userId, scholarshipId);
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return null;
        } else {
            Scholarship s = scholarshipRepository.findById(scholarshipId).orElseThrow();
            UserScholarshipBookmark b = new UserScholarshipBookmark();
            b.setUser(user);
            b.setScholarship(s);
            b.setStatus("BOOKMARKED");
            return bookmarkRepository.save(b);
        }
    }
}
