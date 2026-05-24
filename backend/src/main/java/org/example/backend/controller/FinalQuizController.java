package org.example.backend.controller;

import org.example.backend.entity.FinalQuiz;
import org.example.backend.service.FinalQuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/final-quizzes")
@CrossOrigin
public class FinalQuizController {

    private final FinalQuizService finalQuizService;

    public FinalQuizController(FinalQuizService finalQuizService) {
        this.finalQuizService = finalQuizService;
    }

    // Create quiz
    @PostMapping
    public FinalQuiz createFinalQuiz(@RequestParam Long courseId) {
        return finalQuizService.createFinalQuiz(courseId);
    }

    // Get all
    @GetMapping
    public List<FinalQuiz> getAllFinalQuizzes() {
        return finalQuizService.getAllFinalQuizzes();
    }

    // Get by ID
    @GetMapping("/{id}")
    public FinalQuiz getFinalQuizById(@PathVariable Long id) {
        return finalQuizService.getFinalQuizById(id);
    }

    // Get by course
    @GetMapping("/course/{courseId}")
    public List<FinalQuiz> getByCourse(@PathVariable Long courseId) {
        return finalQuizService.getFinalQuizzesByCourse(courseId);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deleteFinalQuiz(@PathVariable Long id) {
        finalQuizService.deleteFinalQuiz(id);
    }
}
