package org.example.backend.service;

import org.example.backend.entity.QuizQuestion;
import org.example.backend.repository.QuizQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizQuestionService {

    private final QuizQuestionRepository repository;

    public QuizQuestionService(QuizQuestionRepository repository) {
        this.repository = repository;
    }

    public QuizQuestion createQuestion(QuizQuestion question) {
        return repository.save(question);
    }

    public List<QuizQuestion> getAllQuestions() {
        return repository.findAll();
    }

    public Optional<QuizQuestion> getQuestionById(Long id) {
        return repository.findById(id);
    }

    public List<QuizQuestion> getBySectionQuizId(Long sectionQuizId) {
        return repository.findBySectionQuizIdOrderByOrderIndexAsc(sectionQuizId);
    }

    public List<QuizQuestion> getByFinalQuizId(Long finalQuizId) {
        return repository.findByFinalQuizIdOrderByOrderIndexAsc(finalQuizId);
    }

    public QuizQuestion updateQuestion(Long id, QuizQuestion updated) {
        return repository.findById(id).map(q -> {
            q.setQuestion(updated.getQuestion());
            q.setOption1(updated.getOption1());
            q.setOption2(updated.getOption2());
            q.setOption3(updated.getOption3());
            q.setOption4(updated.getOption4());
            q.setCorrectAnswer(updated.getCorrectAnswer());
            q.setOrderIndex(updated.getOrderIndex());
            q.setSectionQuizId(updated.getSectionQuizId());
            q.setFinalQuizId(updated.getFinalQuizId());
            return repository.save(q);
        }).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public void deleteQuestion(Long id) {
        repository.deleteById(id);
    }
}
