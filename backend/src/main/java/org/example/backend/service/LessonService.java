package org.example.backend.service;

import org.example.backend.entity.Lesson;
import org.example.backend.repository.LessonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }

    public List<Lesson> getLessonsBySection(Long sectionId) {
        return lessonRepository.findBySectionIdOrderByOrderIndexAsc(sectionId);
    }

    public Lesson createLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Long id, Lesson updatedLesson) {
        return lessonRepository.findById(id).map(lesson -> {
            lesson.setTitle(updatedLesson.getTitle());
            lesson.setDuration(updatedLesson.getDuration());
            lesson.setOrderIndex(updatedLesson.getOrderIndex());
            lesson.setSectionId(updatedLesson.getSectionId());
            return lessonRepository.save(lesson);
        }).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}