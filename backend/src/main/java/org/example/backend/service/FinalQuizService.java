package org.example.backend.service;

import org.example.backend.entity.FinalQuiz;
import org.example.backend.repository.FinalQuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinalQuizService {

    private final FinalQuizRepository finalQuizRepository;

    public FinalQuizService(FinalQuizRepository finalQuizRepository) {
        this.finalQuizRepository = finalQuizRepository;
    }

    // CREATE
    public FinalQuiz createFinalQuiz(Long courseId) {
        FinalQuiz quiz = new FinalQuiz(courseId);
        return finalQuizRepository.save(quiz);
    }

    // GET ALL
    public List<FinalQuiz> getAllFinalQuizzes() {
        return finalQuizRepository.findAll();
    }

    // GET BY ID
    public FinalQuiz getFinalQuizById(Long id) {
        return finalQuizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Final quiz not found"));
    }

    // GET BY COURSE
    public List<FinalQuiz> getFinalQuizzesByCourse(Long courseId) {
        return finalQuizRepository.findByCourseId(courseId);
    }

    // DELETE
    public void deleteFinalQuiz(Long id) {
        finalQuizRepository.deleteById(id);
    }
}