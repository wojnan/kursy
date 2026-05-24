package org.example.backend.repository;

import org.example.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findBySectionId(Long sectionId);

    List<Lesson> findBySectionIdOrderByOrderIndexAsc(Long sectionId);
}