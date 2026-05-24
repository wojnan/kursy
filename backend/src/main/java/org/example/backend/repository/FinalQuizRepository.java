package org.example.backend.repository;

import org.example.backend.entity.FinalQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FinalQuizRepository extends JpaRepository<FinalQuiz, Long> {

    List<FinalQuiz> findByCourseId(Long courseId);

    Optional<FinalQuiz> findByCourseIdAndId(Long courseId, Long id);
}
