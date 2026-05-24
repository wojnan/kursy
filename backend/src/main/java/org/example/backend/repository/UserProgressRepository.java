package org.example.backend.repository;

import org.example.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserId(Long userId);

    Optional<UserProgress> findByUserIdAndSectionIdAndSectionQuizIdAndFinalQuizId(
            Long userId,
            Long sectionId,
            Long sectionQuizId,
            Long finalQuizId
    );
}