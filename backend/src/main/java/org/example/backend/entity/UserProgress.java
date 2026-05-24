package org.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_progress",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "section_id", "section_quiz_id", "final_quiz_id"}
        )
)
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "section_quiz_id")
    private Long sectionQuizId;

    @Column(name = "final_quiz_id")
    private Long finalQuizId;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "score")
    private Integer score;

    // Constructors
    public UserProgress() {}

    public UserProgress(Long userId, Long sectionId, Long sectionQuizId, Long finalQuizId, Integer score) {
        this.userId = userId;
        this.sectionId = sectionId;
        this.sectionQuizId = sectionQuizId;
        this.finalQuizId = finalQuizId;
        this.score = score;
        this.completedAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getSectionId() { return sectionId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }

    public Long getSectionQuizId() { return sectionQuizId; }
    public void setSectionQuizId(Long sectionQuizId) { this.sectionQuizId = sectionQuizId; }

    public Long getFinalQuizId() { return finalQuizId; }
    public void setFinalQuizId(Long finalQuizId) { this.finalQuizId = finalQuizId; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}