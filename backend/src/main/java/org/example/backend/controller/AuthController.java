package org.example.backend.controller;

import org.example.backend.dto.LoginRequest;
import org.example.backend.dto.SignupRequest;

import org.example.backend.entity.User;

import org.example.backend.service.AuthService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public Map<String, Object> signup(
            @RequestBody SignupRequest request
    ) {

        return authService.signup(request);
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody LoginRequest request
    ) {

        return authService.login(request);
    }
}