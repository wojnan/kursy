package org.example.backend.repository;

import org.example.backend.entity.SectionQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionQuizRepository extends JpaRepository<SectionQuiz, Long> {

    List<SectionQuiz> findBySectionId(Long sectionId);
}
