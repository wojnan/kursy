package org.example.backend.controller;

import org.example.backend.entity.QuizQuestion;
import org.example.backend.entity.SectionQuiz;
import org.example.backend.service.QuizQuestionService;
import org.example.backend.service.SectionQuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/section-quizzes")
public class SectionQuizController {

    private final SectionQuizService sectionQuizService;
    private final QuizQuestionService quizQuestionService;

    public SectionQuizController(
            SectionQuizService sectionQuizService,
            QuizQuestionService quizQuestionService
    ) {
        this.sectionQuizService = sectionQuizService;
        this.quizQuestionService = quizQuestionService;
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<SectionQuizResponse>> getBySectionId(
            @PathVariable Long sectionId
    ) {
        List<SectionQuizResponse> response =
                sectionQuizService.getQuizzesBySectionId(sectionId)
                        .stream()
                        .map(quiz -> new SectionQuizResponse(
                                quiz.getId(),
                                quiz.getSectionId(),
                                quiz.getSectionTitle(),
                                quizQuestionService.getBySectionQuizId(quiz.getId())
                                        .stream()
                                        .map(q -> new QuizQuestionResponse(
                                                q.getId(),
                                                q.getQuestion(),
                                                List.of(
                                                        q.getOption1(),
                                                        q.getOption2(),
                                                        q.getOption3(),
                                                        q.getOption4()
                                                ),
                                                q.getCorrectAnswer()
                                        ))
                                        .toList()
                        ))
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<SectionQuiz> createQuiz(@RequestBody SectionQuiz quiz) {
        return ResponseEntity.ok(sectionQuizService.createQuiz(quiz));
    }

    @GetMapping
    public ResponseEntity<List<SectionQuiz>> getAllQuizzes() {
        return ResponseEntity.ok(sectionQuizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionQuiz> getQuizById(@PathVariable Long id) {
        return sectionQuizService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SectionQuiz> updateQuiz(
            @PathVariable Long id,
            @RequestBody SectionQuiz quiz
    ) {
        return ResponseEntity.ok(sectionQuizService.updateQuiz(id, quiz));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        sectionQuizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    public record SectionQuizResponse(
            Long id,
            Long sectionId,
            String sectionTitle,
            List<QuizQuestionResponse> questions
    ) {}

    public record QuizQuestionResponse(
            Long id,
            String question,
            List<String> options,
            Integer correctAnswer
    ) {}
}