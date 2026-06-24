package org.example.backend;

import org.example.backend.entity.Course;
import org.example.backend.repository.CourseRepository;
import org.example.backend.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CourseServiceTest {

    private CourseRepository courseRepository;
    private CourseService courseService;

    @BeforeEach
    void setUp() {
        courseRepository = mock(CourseRepository.class);
        courseService = new CourseService(courseRepository);
    }

    @Test
    void getAllCoursesShouldReturnAllCourses() {
        Course course = sampleCourse();

        when(courseRepository.findAll()).thenReturn(List.of(course));

        List<Course> result = courseService.getAllCourses();

        assertEquals(1, result.size());
        assertEquals("Java Course", result.get(0).getTitle());
        verify(courseRepository).findAll();
    }

    @Test
    void getPublishedCoursesShouldReturnOnlyPublishedCourses() {
        Course course = sampleCourse();
        course.setIsPublished(true);

        when(courseRepository.findByIsPublishedTrue()).thenReturn(List.of(course));

        List<Course> result = courseService.getPublishedCourses();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getIsPublished());
        verify(courseRepository).findByIsPublishedTrue();
    }

    @Test
    void getCourseByIdShouldReturnCourseWhenExists() {
        Course course = sampleCourse();

        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        Course result = courseService.getCourseById(1L);

        assertEquals("Java Course", result.getTitle());
        verify(courseRepository).findById(1L);
    }

    @Test
    void getCourseByIdShouldThrowWhenNotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> courseService.getCourseById(1L)
        );

        assertEquals("Course not found", exception.getMessage());
    }

    @Test
    void getByCategoryShouldReturnMatchingCourses() {
        Course course = sampleCourse();

        when(courseRepository.findByCategory("Programming"))
                .thenReturn(List.of(course));

        List<Course> result = courseService.getByCategory("Programming");

        assertEquals(1, result.size());
        assertEquals("Programming", result.get(0).getCategory());
        verify(courseRepository).findByCategory("Programming");
    }

    @Test
    void getByLevelShouldReturnMatchingCourses() {
        Course course = sampleCourse();

        when(courseRepository.findByLevel("Beginner"))
                .thenReturn(List.of(course));

        List<Course> result = courseService.getByLevel("Beginner");

        assertEquals(1, result.size());
        assertEquals("Beginner", result.get(0).getLevel());
        verify(courseRepository).findByLevel("Beginner");
    }

    @Test
    void createCourseShouldSaveCourse() {
        Course course = sampleCourse();

        when(courseRepository.save(course)).thenReturn(course);

        Course result = courseService.createCourse(course);

        assertEquals("Java Course", result.getTitle());
        verify(courseRepository).save(course);
    }

    @Test
    void updateCourseShouldUpdateExistingCourse() {
        Course existing = sampleCourse();

        Course updated = sampleCourse();
        updated.setTitle("Updated Java Course");
        updated.setDescription("Updated description");
        updated.setInstructor("Updated Instructor");
        updated.setPrice(BigDecimal.valueOf(99.99));
        updated.setRating(BigDecimal.valueOf(4.90));
        updated.setStudents(500);
        updated.setDuration("20 hours");
        updated.setLevel("Advanced");
        updated.setCategory("Backend");
        updated.setImage("updated-image.jpg");
        updated.setLessonsCount(40);
        updated.setLastUpdated("2025");
        updated.setIsPublished(false);

        when(courseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(courseRepository.save(existing)).thenReturn(existing);

        Course result = courseService.updateCourse(1L, updated);

        assertEquals("Updated Java Course", result.getTitle());
        assertEquals("Updated description", result.getDescription());
        assertEquals("Updated Instructor", result.getInstructor());
        assertEquals(BigDecimal.valueOf(99.99), result.getPrice());
        assertEquals(BigDecimal.valueOf(4.90), result.getRating());
        assertEquals(500, result.getStudents());
        assertEquals("20 hours", result.getDuration());
        assertEquals("Advanced", result.getLevel());
        assertEquals("Backend", result.getCategory());
        assertEquals("updated-image.jpg", result.getImage());
        assertEquals(40, result.getLessonsCount());
        assertEquals("2025", result.getLastUpdated());
        assertFalse(result.getIsPublished());

        verify(courseRepository).save(existing);
    }

    @Test
    void updateCourseShouldThrowWhenCourseNotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> courseService.updateCourse(1L, sampleCourse())
        );

        assertEquals("Course not found", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void deleteCourseShouldDeleteWhenExists() {
        when(courseRepository.existsById(1L)).thenReturn(true);

        courseService.deleteCourse(1L);

        verify(courseRepository).deleteById(1L);
    }

    @Test
    void deleteCourseShouldThrowWhenNotFound() {
        when(courseRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> courseService.deleteCourse(1L)
        );

        assertEquals("Course not found with id: 1", exception.getMessage());
        verify(courseRepository, never()).deleteById(anyLong());
    }

    private Course sampleCourse() {
        Course course = new Course();
        course.setTitle("Java Course");
        course.setDescription("Learn Java");
        course.setInstructor("John Doe");
        course.setPrice(BigDecimal.valueOf(49.99));
        course.setRating(BigDecimal.valueOf(4.50));
        course.setStudents(100);
        course.setDuration("10 hours");
        course.setLevel("Beginner");
        course.setCategory("Programming");
        course.setImage("image.jpg");
        course.setLessonsCount(20);
        course.setLastUpdated("2024");
        course.setIsPublished(true);
        return course;
    }
}