package org.example.backend.repository;

import org.example.backend.entity.LessonContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonContentRepository extends JpaRepository<LessonContent, Long> {

    List<LessonContent> findByLessonIdOrderByOrderIndexAsc(Long lessonId);
}
