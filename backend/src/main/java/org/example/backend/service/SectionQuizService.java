package org.example.backend.service;

import org.example.backend.entity.SectionQuiz;
import org.example.backend.repository.SectionQuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SectionQuizService {

    private final SectionQuizRepository repository;

    public SectionQuizService(SectionQuizRepository repository) {
        this.repository = repository;
    }

    public SectionQuiz createQuiz(SectionQuiz quiz) {
        return repository.save(quiz);
    }

    public List<SectionQuiz> getAllQuizzes() {
        return repository.findAll();
    }

    public Optional<SectionQuiz> getQuizById(Long id) {
        return repository.findById(id);
    }

    public List<SectionQuiz> getQuizzesBySectionId(Long sectionId) {
        return repository.findBySectionId(sectionId);
    }

    public SectionQuiz updateQuiz(Long id, SectionQuiz updatedQuiz) {
        return repository.findById(id).map(quiz -> {
            quiz.setSectionId(updatedQuiz.getSectionId());
            quiz.setSectionTitle(updatedQuiz.getSectionTitle());
            return repository.save(quiz);
        }).orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    public void deleteQuiz(Long id) {
        repository.deleteById(id);
    }
}
