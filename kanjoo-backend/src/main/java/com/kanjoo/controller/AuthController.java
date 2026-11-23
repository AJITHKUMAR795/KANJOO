package com.kanjoo.controller;

import com.kanjoo.dto.AuthDto.*;
import com.kanjoo.entity.*;
import com.kanjoo.repository.*;
import com.kanjoo.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CountryRepository countryRepository;
    private final CurrencyRepository currencyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserRepository userRepository,
                          UserProfileRepository userProfileRepository,
                          CountryRepository countryRepository,
                          CurrencyRepository currencyRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.countryRepository = countryRepository;
        this.currencyRepository = currencyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body("An account with this email already exists.");
        }

        User user = new User(req.email(), passwordEncoder.encode(req.password()), req.fullName());
        user = userRepository.save(user);

        // Auto-assign default country or provided country
        String countryCode = (req.countryCode() != null && !req.countryCode().isBlank()) ? req.countryCode() : "IN";
        Country country = countryRepository.findById(countryCode).orElseGet(() -> countryRepository.findAll().get(0));

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setCountry(country);
        profile.setPrimaryCurrency(country.getCurrency());
        profile.setOnboardingCompleted(false);
        userProfileRepository.save(profile);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(new AuthResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            country.getCode(),
            country.getCurrency().getCode(),
            country.getCurrency().getSymbol(),
            false
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.email());
        if (userOpt.isEmpty() || !passwordEncoder.matches(req.password(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid email or password credentials.");
        }

        User user = userOpt.get();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);

        String countryCode = (profile != null && profile.getCountry() != null) ? profile.getCountry().getCode() : "IN";
        String currCode = (profile != null && profile.getPrimaryCurrency() != null) ? profile.getPrimaryCurrency().getCode() : "INR";
        String currSym = (profile != null && profile.getPrimaryCurrency() != null) ? profile.getPrimaryCurrency().getSymbol() : "₹";
        boolean onboardingDone = profile != null && profile.isOnboardingCompleted();

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(new AuthResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            countryCode,
            currCode,
            currSym,
            onboardingDone
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        String countryCode = (profile != null && profile.getCountry() != null) ? profile.getCountry().getCode() : "IN";
        String currCode = (profile != null && profile.getPrimaryCurrency() != null) ? profile.getPrimaryCurrency().getCode() : "INR";
        String currSym = (profile != null && profile.getPrimaryCurrency() != null) ? profile.getPrimaryCurrency().getSymbol() : "₹";
        boolean onboardingDone = profile != null && profile.isOnboardingCompleted();

        return ResponseEntity.ok(new AuthResponse(
            null,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            countryCode,
            currCode,
            currSym,
            onboardingDone
        ));
    }
}
