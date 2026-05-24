package org.example.backend.repository;

import org.example.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // extra useful queries
    List<Course> findByIsPublishedTrue();

    List<Course> findByCategory(String category);

    List<Course> findByLevel(String level);
}
