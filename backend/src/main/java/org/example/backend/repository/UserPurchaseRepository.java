package org.example.backend.repository;

import org.example.backend.entity.UserPurchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPurchaseRepository extends JpaRepository<UserPurchase, Long> {

    List<UserPurchase> findByUserId(Long userId);

    List<UserPurchase> findByCourseId(Long courseId);

    Optional<UserPurchase> findByUserIdAndCourseId(Long userId, Long courseId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}