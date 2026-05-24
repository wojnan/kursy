package org.example.backend.service;

import org.example.backend.entity.Course;
import org.example.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }


    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getPublishedCourses() {
        return courseRepository.findByIsPublishedTrue();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public List<Course> getByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    public List<Course> getByLevel(String level) {
        return courseRepository.findByLevel(level);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updated) {
        Course course = getCourseById(id);

        course.setTitle(updated.getTitle());
        course.setDescription(updated.getDescription());
        course.setInstructor(updated.getInstructor());
        course.setPrice(updated.getPrice());
        course.setRating(updated.getRating());
        course.setStudents(updated.getStudents());
        course.setDuration(updated.getDuration());
        course.setLevel(updated.getLevel());
        course.setCategory(updated.getCategory());
        course.setImage(updated.getImage());
        course.setLessonsCount(updated.getLessonsCount());
        course.setLastUpdated(updated.getLastUpdated());
        course.setIsPublished(updated.getIsPublished());

        return courseRepository.save(course);
    }


    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }
}