package org.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String duration;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public Lesson() {}

    public Lesson(Long sectionId, String title, String duration, Integer orderIndex) {
        this.sectionId = sectionId;
        this.title = title;
        this.duration = duration;
        this.orderIndex = orderIndex;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}