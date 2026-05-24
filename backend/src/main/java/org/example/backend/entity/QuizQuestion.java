package org.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_quiz_id")
    private Long sectionQuizId;

    @Column(name = "final_quiz_id")
    private Long finalQuizId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(name = "option_1", nullable = false)
    private String option1;

    @Column(name = "option_2", nullable = false)
    private String option2;

    @Column(name = "option_3", nullable = false)
    private String option3;

    @Column(name = "option_4", nullable = false)
    private String option4;

    @Column(name = "correct_answer", nullable = false)
    private Integer correctAnswer;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public QuizQuestion() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getSectionQuizId() {
        return sectionQuizId;
    }

    public void setSectionQuizId(Long sectionQuizId) {
        this.sectionQuizId = sectionQuizId;
    }

    public Long getFinalQuizId() {
        return finalQuizId;
    }

    public void setFinalQuizId(Long finalQuizId) {
        this.finalQuizId = finalQuizId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getOption1() {
        return option1;
    }

    public void setOption1(String option1) {
        this.option1 = option1;
    }

    public String getOption2() {
        return option2;
    }

    public void setOption2(String option2) {
        this.option2 = option2;
    }

    public String getOption3() {
        return option3;
    }

    public void setOption3(String option3) {
        this.option3 = option3;
    }

    public String getOption4() {
        return option4;
    }

    public void setOption4(String option4) {
        this.option4 = option4;
    }

    public Integer getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(Integer correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}