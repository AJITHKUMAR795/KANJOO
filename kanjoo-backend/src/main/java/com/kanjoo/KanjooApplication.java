package com.kanjoo;

import com.kanjoo.entity.User;
import com.kanjoo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class KanjooApplication {
    public static void main(String[] args) {
        SpringApplication.run(KanjooApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDemoUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("demo@kanjoo.ai").ifPresent(user -> {
                user.setPasswordHash(passwordEncoder.encode("Password@123"));
                userRepository.save(user);
            });
        };
    }
}
