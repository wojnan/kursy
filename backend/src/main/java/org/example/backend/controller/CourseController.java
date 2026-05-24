package org.example.backend.controller;

import org.example.backend.entity.Course;
import org.example.backend.service.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/published")
    public List<Course> getPublishedCourses() {
        return courseService.getPublishedCourses();
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @GetMapping("/category/{category}")
    public List<Course> getByCategory(@PathVariable String category) {
        return courseService.getByCategory(category);
    }

    @GetMapping("/level/{level}")
    public List<Course> getByLevel(@PathVariable String level) {
        return courseService.getByLevel(level);
    }


    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseService.createCourse(course);
    }


    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}