package org.example.backend.controller;

import org.example.backend.entity.QuizQuestion;
import org.example.backend.service.QuizQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-questions")
@CrossOrigin(origins = "*")
public class QuizQuestionController {

    private final QuizQuestionService service;

    public QuizQuestionController(QuizQuestionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<QuizQuestion> create(@RequestBody QuizQuestion question) {
        return ResponseEntity.ok(service.createQuestion(question));
    }

    @GetMapping
    public ResponseEntity<List<QuizQuestion>> getAll() {
        return ResponseEntity.ok(service.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizQuestion> getById(@PathVariable Long id) {
        return service.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/section/{sectionQuizId}")
    public ResponseEntity<List<QuizQuestion>> getBySectionQuiz(@PathVariable Long sectionQuizId) {
        return ResponseEntity.ok(service.getBySectionQuizId(sectionQuizId));
    }

    @GetMapping("/final/{finalQuizId}")
    public ResponseEntity<List<QuizQuestion>> getByFinalQuiz(@PathVariable Long finalQuizId) {
        return ResponseEntity.ok(service.getByFinalQuizId(finalQuizId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizQuestion> update(
            @PathVariable Long id,
            @RequestBody QuizQuestion question
    ) {
        return ResponseEntity.ok(service.updateQuestion(id, question));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
