package org.example.backend;

import org.example.backend.entity.UserPurchase;
import org.example.backend.repository.UserPurchaseRepository;
import org.example.backend.service.UserPurchaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserPurchaseServiceTest {

    private UserPurchaseRepository repository;
    private UserPurchaseService service;

    @BeforeEach
    void setUp() {
        repository = mock(UserPurchaseRepository.class);
        service = new UserPurchaseService(repository);
    }

    @Test
    void purchaseCourseShouldSavePurchaseWhenNotAlreadyPurchased() {
        Long userId = 1L;
        Long courseId = 10L;
        BigDecimal amount = BigDecimal.valueOf(49.99);

        when(repository.existsByUserIdAndCourseId(userId, courseId))
                .thenReturn(false);

        when(repository.save(any(UserPurchase.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserPurchase result = service.purchaseCourse(userId, courseId, amount);

        assertEquals(userId, result.getUserId());
        assertEquals(courseId, result.getCourseId());
        assertEquals(amount, result.getAmountPaid());
        assertNotNull(result.getPurchaseDate());

        verify(repository).existsByUserIdAndCourseId(userId, courseId);
        verify(repository).save(any(UserPurchase.class));
    }

    @Test
    void purchaseCourseShouldThrowExceptionWhenAlreadyPurchased() {
        when(repository.existsByUserIdAndCourseId(1L, 10L))
                .thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.purchaseCourse(1L, 10L, BigDecimal.valueOf(49.99))
        );

        assertEquals("User already purchased this course", exception.getMessage());

        verify(repository).existsByUserIdAndCourseId(1L, 10L);
        verify(repository, never()).save(any(UserPurchase.class));
    }

    @Test
    void getUserPurchasesShouldReturnPurchasesForUser() {
        UserPurchase purchase = new UserPurchase(1L, 10L, BigDecimal.valueOf(49.99));

        when(repository.findByUserId(1L))
                .thenReturn(List.of(purchase));

        List<UserPurchase> result = service.getUserPurchases(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getUserId());

        verify(repository).findByUserId(1L);
    }

    @Test
    void getCoursePurchasesShouldReturnPurchasesForCourse() {
        UserPurchase purchase = new UserPurchase(1L, 10L, BigDecimal.valueOf(49.99));

        when(repository.findByCourseId(10L))
                .thenReturn(List.of(purchase));

        List<UserPurchase> result = service.getCoursePurchases(10L);

        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getCourseId());

        verify(repository).findByCourseId(10L);
    }

    @Test
    void getPurchaseShouldReturnPurchaseWhenExists() {
        UserPurchase purchase = new UserPurchase(1L, 10L, BigDecimal.valueOf(49.99));

        when(repository.findByUserIdAndCourseId(1L, 10L))
                .thenReturn(Optional.of(purchase));

        Optional<UserPurchase> result = service.getPurchase(1L, 10L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getUserId());
        assertEquals(10L, result.get().getCourseId());

        verify(repository).findByUserIdAndCourseId(1L, 10L);
    }

    @Test
    void getPurchaseShouldReturnEmptyWhenNotExists() {
        when(repository.findByUserIdAndCourseId(1L, 10L))
                .thenReturn(Optional.empty());

        Optional<UserPurchase> result = service.getPurchase(1L, 10L);

        assertTrue(result.isEmpty());

        verify(repository).findByUserIdAndCourseId(1L, 10L);
    }

    @Test
    void deletePurchaseShouldDeleteById() {
        service.deletePurchase(5L);

        verify(repository).deleteById(5L);
    }
}