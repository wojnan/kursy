package org.example.backend.service;

import org.example.backend.entity.UserPurchase;
import org.example.backend.repository.UserPurchaseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class UserPurchaseService {

    private final UserPurchaseRepository repository;

    public UserPurchaseService(UserPurchaseRepository repository) {
        this.repository = repository;
    }

    public UserPurchase purchaseCourse(Long userId, Long courseId, BigDecimal amount) {

        if (repository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("User already purchased this course");
        }

        UserPurchase purchase = new UserPurchase(userId, courseId, amount);
        return repository.save(purchase);
    }

    public List<UserPurchase> getUserPurchases(Long userId) {
        return repository.findByUserId(userId);
    }

    public List<UserPurchase> getCoursePurchases(Long courseId) {
        return repository.findByCourseId(courseId);
    }

    public Optional<UserPurchase> getPurchase(Long userId, Long courseId) {
        return repository.findByUserIdAndCourseId(userId, courseId);
    }

    public void deletePurchase(Long id) {
        repository.deleteById(id);
    }
}