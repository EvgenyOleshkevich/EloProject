package eloProject.service;

import eloProject.config.SecurityConfig;
import eloProject.dto.AuthPayload;
import eloProject.dto.LoginInput;
import eloProject.model.Match;
import eloProject.model.Player;
import eloProject.model.User;
import eloProject.model.RatingResult;
import eloProject.repository.MatchRepository;
import eloProject.repository.UserRepository;
import eloProject.util.AppUserDetails;
import eloProject.util.EloCounter;
import eloProject.util.enums.CompetitionStatus;
import eloProject.util.enums.MatchResult;
import eloProject.util.enums.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final eloProject.repository.UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUser(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public AuthPayload login(LoginInput input) {
        log.info("email={}, password={}",
                input.getEmail(), input.getPassword());
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(input.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthPayload(token, user);
    }

    public User createUser(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with this name already exists");
        }

        return userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(UserRole.PLAYER)
                .build());
    }

    public User updateUser(String id, String email) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with this name already exists in this game");
        }
        user.setEmail(email);
        return userRepository.save(user);
    }

    public User updateUserRole(String id, UserRole role) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

}