package org.example.backend.service;

import org.example.backend.entity.LessonContent;
import org.example.backend.repository.LessonContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LessonContentService {

    private final LessonContentRepository repository;

    public LessonContentService(LessonContentRepository repository) {
        this.repository = repository;
    }

    public LessonContent create(LessonContent content) {
        return repository.save(content);
    }

    public List<LessonContent> getByLessonId(Long lessonId) {
        return repository.findByLessonIdOrderByOrderIndexAsc(lessonId);
    }

    public Optional<LessonContent> getById(Long id) {
        return repository.findById(id);
    }

    public LessonContent update(Long id, LessonContent updatedContent) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setLessonId(updatedContent.getLessonId());
                    existing.setContentType(updatedContent.getContentType());
                    existing.setContentValue(updatedContent.getContentValue());
                    existing.setOrderIndex(updatedContent.getOrderIndex());
                    return repository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("LessonContent not found with id " + id));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
