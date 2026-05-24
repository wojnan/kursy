package org.example.backend.controller;

import org.example.backend.entity.UserPurchase;
import org.example.backend.service.UserPurchaseService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class UserPurchaseController {

    private final UserPurchaseService service;

    public UserPurchaseController(UserPurchaseService service) {
        this.service = service;
    }

    // Purchase a course
    @PostMapping
    public UserPurchase purchaseCourse(
            @RequestParam Long userId,
            @RequestParam Long courseId,
            @RequestParam BigDecimal amount
    ) {
        return service.purchaseCourse(userId, courseId, amount);
    }

    // Get all purchases of a user
    @GetMapping("/user/{userId}")
    public List<UserPurchase> getUserPurchases(@PathVariable Long userId) {
        return service.getUserPurchases(userId);
    }

    // Get purchases of a course
    @GetMapping("/course/{courseId}")
    public List<UserPurchase> getCoursePurchases(@PathVariable Long courseId) {
        return service.getCoursePurchases(courseId);
    }

    // Get specific purchase
    @GetMapping
    public UserPurchase getPurchase(
            @RequestParam Long userId,
            @RequestParam Long courseId
    ) {
        return service.getPurchase(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));
    }

    // Delete purchase
    @DeleteMapping("/{id}")
    public void deletePurchase(@PathVariable Long id) {
        service.deletePurchase(id);
    }
}