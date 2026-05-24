package org.example.backend.service;

import org.example.backend.entity.UserProgress;
import org.example.backend.repository.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserProgressService {

    private final UserProgressRepository repository;

    public UserProgressService(UserProgressRepository repository) {
        this.repository = repository;
    }

    public UserProgress saveProgress(UserProgress progress) {
        progress.setCompletedAt(LocalDateTime.now());
        return repository.save(progress);
    }

    public List<UserProgress> getUserProgress(Long userId) {
        return repository.findByUserId(userId);
    }

    public Optional<UserProgress> getSpecificProgress(
            Long userId,
            Long sectionId,
            Long sectionQuizId,
            Long finalQuizId
    ) {
        return repository.findByUserIdAndSectionIdAndSectionQuizIdAndFinalQuizId(
                userId, sectionId, sectionQuizId, finalQuizId
        );
    }

    public void deleteProgress(Long id) {
        repository.deleteById(id);
    }
}