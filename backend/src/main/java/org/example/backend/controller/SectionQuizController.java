package org.example.backend.controller;

import org.example.backend.entity.SectionQuiz;
import org.example.backend.service.SectionQuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/section-quizzes")
public class SectionQuizController {

    private final SectionQuizService service;

    public SectionQuizController(SectionQuizService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SectionQuiz> createQuiz(@RequestBody SectionQuiz quiz) {
        return ResponseEntity.ok(service.createQuiz(quiz));
    }

    @GetMapping
    public ResponseEntity<List<SectionQuiz>> getAllQuizzes() {
        return ResponseEntity.ok(service.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionQuiz> getQuizById(@PathVariable Long id) {
        return service.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<SectionQuiz>> getBySectionId(@PathVariable Long sectionId) {
        return ResponseEntity.ok(service.getQuizzesBySectionId(sectionId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SectionQuiz> updateQuiz(
            @PathVariable Long id,
            @RequestBody SectionQuiz quiz
    ) {
        return ResponseEntity.ok(service.updateQuiz(id, quiz));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        service.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
}