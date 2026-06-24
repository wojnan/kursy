package org.example.backend;

import org.example.backend.entity.*;
import org.example.backend.repository.CourseRepository;
import org.example.backend.repository.PaymentRepository;
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
class PaymentRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void resetSequences() {
        jdbcTemplate.execute("""
                SELECT setval(
                    'courses_id_seq',
                    COALESCE((SELECT MAX(id) FROM courses), 1),
                    true
                )
                """);

        jdbcTemplate.execute("""
                SELECT setval(
                    'users_id_seq',
                    COALESCE((SELECT MAX(id) FROM users), 1),
                    true
                )
                """);

        jdbcTemplate.execute("""
                SELECT setval(
                    'payments_id_seq',
                    COALESCE((SELECT MAX(id) FROM payments), 1),
                    true
                )
                """);
    }

    @Test
    void findByStripeSessionIdShouldReturnPayment() {
        User user = createUser("repo-payment-1@test.com");
        Course course = createCourse();

        Payment payment = new Payment();
        payment.setUserId(user.getId());
        payment.setCourseId(course.getId());
        payment.setAmount(new BigDecimal("49.99"));
        payment.setMethod(PaymentMethod.STRIPE);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setStripeSessionId("cs_test_123");

        paymentRepository.save(payment);

        Optional<Payment> result =
                paymentRepository.findByStripeSessionId("cs_test_123");

        assertTrue(result.isPresent());
        assertEquals("cs_test_123", result.get().getStripeSessionId());
    }

    @Test
    void findByStatusShouldReturnMatchingPayments() {
        User user = createUser("repo-payment-2@test.com");
        Course course = createCourse();

        Payment payment = new Payment();
        payment.setUserId(user.getId());
        payment.setCourseId(course.getId());
        payment.setAmount(new BigDecimal("49.99"));
        payment.setMethod(PaymentMethod.OFFLINE);
        payment.setStatus(PaymentStatus.AWAITING_ADMIN_APPROVAL);

        paymentRepository.save(payment);

        List<Payment> result =
                paymentRepository.findByStatus(
                        PaymentStatus.AWAITING_ADMIN_APPROVAL
                );

        assertFalse(result.isEmpty());
        assertTrue(
                result.stream().anyMatch(p ->
                        p.getStatus() == PaymentStatus.AWAITING_ADMIN_APPROVAL
                )
        );
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