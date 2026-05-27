package org.example.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.example.backend.dto.LoginRequest;
import org.example.backend.dto.SignupRequest;

import org.example.backend.entity.User;

import org.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String secret;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> signup(
            SignupRequest request
    ) {

        User user = new User();

        user.setEmail(request.getEmail());
        user.setName(request.getName());

        String hashedPassword =
                passwordEncoder.encode(
                        request.getPassword()
                );

        user.setPasswordHash(hashedPassword);

        User savedUser =
                userRepository.save(user);

        String token = generateToken(savedUser);

        Map<String, Object> response =
                new HashMap<>();

        response.put("user", savedUser);
        response.put("token", token);

        return response;
    }

    public Map<String, Object> login(
            LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid credentials"));

        boolean validPassword =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash()
                );

        if (!validPassword) {
            throw new RuntimeException(
                    "Invalid credentials"
            );
        }

        String token = generateToken(user);

        Map<String, Object> response =
                new HashMap<>();

        response.put("user", user);
        response.put("token", token);

        return response;
    }

    private String generateToken(User user) {

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .signWith(
                        SignatureAlgorithm.HS256,
                        secret
                )
                .compact();
    }
}