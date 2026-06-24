package org.example.backend;

import org.example.backend.entity.Course;
import org.example.backend.entity.User;
import org.example.backend.entity.UserPurchase;
import org.example.backend.repository.CourseRepository;
import org.example.backend.repository.UserPurchaseRepository;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserPurchaseRepositoryTest {

    @Autowired
    private UserPurchaseRepository userPurchaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void resetSequences() {
        jdbcTemplate.execute("""
                SELECT setval(
                    'users_id_seq',
                    COALESCE((SELECT MAX(id) FROM users), 1),
                    true
                )
                """);

        jdbcTemplate.execute("""
                SELECT setval(
                    'courses_id_seq',
                    COALESCE((SELECT MAX(id) FROM courses), 1),
                    true
                )
                """);

        jdbcTemplate.execute("""
                SELECT setval(
                    'user_purchases_id_seq',
                    COALESCE((SELECT MAX(id) FROM user_purchases), 1),
                    true
                )
                """);
    }

    @Test
    void existsByUserIdAndCourseIdShouldReturnTrueWhenPurchaseExists() {
        User user = createUser("purchase-repo-1@test.com");
        Course course = createCourse();

        UserPurchase purchase =
                new UserPurchase(user.getId(), course.getId(), new BigDecimal("49.99"));

        userPurchaseRepository.save(purchase);

        boolean result =
                userPurchaseRepository.existsByUserIdAndCourseId(
                        user.getId(),
                        course.getId()
                );

        assertTrue(result);
    }

    @Test
    void existsByUserIdAndCourseIdShouldReturnFalseWhenPurchaseDoesNotExist() {
        User user = createUser("purchase-repo-2@test.com");
        Course course = createCourse();

        boolean result =
                userPurchaseRepository.existsByUserIdAndCourseId(
                        user.getId(),
                        course.getId()
                );

        assertFalse(result);
    }

    @Test
    void findByUserIdShouldReturnUserPurchases() {
        User user = createUser("purchase-repo-3@test.com");
        Course course = createCourse();

        UserPurchase purchase =
                new UserPurchase(user.getId(), course.getId(), new BigDecimal("49.99"));

        userPurchaseRepository.save(purchase);

        List<UserPurchase> result =
                userPurchaseRepository.findByUserId(user.getId());

        assertFalse(result.isEmpty());
        assertEquals(user.getId(), result.get(0).getUserId());
    }

    @Test
    void findByCourseIdShouldReturnCoursePurchases() {
        User user = createUser("purchase-repo-4@test.com");
        Course course = createCourse();

        UserPurchase purchase =
                new UserPurchase(user.getId(), course.getId(), new BigDecimal("49.99"));

        userPurchaseRepository.save(purchase);

        List<UserPurchase> result =
                userPurchaseRepository.findByCourseId(course.getId());

        assertFalse(result.isEmpty());
        assertEquals(course.getId(), result.get(0).getCourseId());
    }

    @Test
    void findByUserIdAndCourseIdShouldReturnPurchase() {
        User user = createUser("purchase-repo-5@test.com");
        Course course = createCourse();

        UserPurchase purchase =
                new UserPurchase(user.getId(), course.getId(), new BigDecimal("49.99"));

        userPurchaseRepository.save(purchase);

        Optional<UserPurchase> result =
                userPurchaseRepository.findByUserIdAndCourseId(
                        user.getId(),
                        course.getId()
                );

        assertTrue(result.isPresent());
        assertEquals(user.getId(), result.get().getUserId());
        assertEquals(course.getId(), result.get().getCourseId());
    }

    private User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setName("Test User");
        user.setAvatarUrl("avatar.jpg");
        user.setBio("Test bio");
        user.setEmailVerified(true);
        user.setIsActive(true);
        user.setProvider("google");
        user.setProviderId(email);
        user.setRole("USER");

        return userRepository.save(user);
    }

    private Course createCourse() {
        Course course = new Course();

        course.setTitle("Java Course " + System.nanoTime());
        course.setDescription("Learn Java");
        course.setInstructor("John Doe");
        course.setPrice(new BigDecimal("49.99"));
        course.setRating(new BigDecimal("4.50"));
        course.setStudents(100);
        course.setDuration("10 hours");
        course.setLevel("Beginner");
        course.setCategory("Programming");
        course.setImage("image.jpg");
        course.setLessonsCount(20);
        course.setLastUpdated("2025");
        course.setIsPublished(true);

        return courseRepository.save(course);
    }
}