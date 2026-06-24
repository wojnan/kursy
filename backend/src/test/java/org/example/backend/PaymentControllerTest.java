package org.example.backend;

import com.stripe.model.checkout.Session;
import org.example.backend.controller.PaymentController;
import org.example.backend.entity.*;
import org.example.backend.repository.PaymentRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.UserPurchaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentControllerTest {

    private PaymentRepository paymentRepository;
    private UserPurchaseService userPurchaseService;
    private UserRepository userRepository;
    private PaymentController paymentController;

    @BeforeEach
    void setUp() {
        paymentRepository = mock(PaymentRepository.class);
        userPurchaseService = mock(UserPurchaseService.class);
        userRepository = mock(UserRepository.class);

        paymentController = new PaymentController(
                paymentRepository,
                userPurchaseService,
                userRepository
        );

        ReflectionTestUtils.setField(paymentController, "stripeSecretKey", "sk_test_fake");
    }

    @Test
    void createOfflinePaymentShouldSaveAwaitingApprovalPayment() {
        PaymentController.OfflinePaymentRequest request =
                new PaymentController.OfflinePaymentRequest(
                        1L,
                        10L,
                        BigDecimal.valueOf(49.99),
                        "Bank transfer"
                );

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Payment result = paymentController.createOfflinePayment(request);

        assertEquals(1L, result.getUserId());
        assertEquals(10L, result.getCourseId());
        assertEquals(BigDecimal.valueOf(49.99), result.getAmount());
        assertEquals(PaymentMethod.OFFLINE, result.getMethod());
        assertEquals(PaymentStatus.AWAITING_ADMIN_APPROVAL, result.getStatus());
        assertEquals("Bank transfer", result.getAdminNote());

        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void approveOfflinePaymentShouldSetPaidAndCreatePurchase() {
        Payment payment = new Payment();
        payment.setUserId(1L);
        payment.setCourseId(10L);
        payment.setAmount(BigDecimal.valueOf(49.99));
        payment.setMethod(PaymentMethod.OFFLINE);
        payment.setStatus(PaymentStatus.AWAITING_ADMIN_APPROVAL);

        when(paymentRepository.findById(5L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2AuthenticationToken adminAuth = mockAdminAuth();

        Payment result = paymentController.approveOfflinePayment(5L, adminAuth);

        assertEquals(PaymentStatus.PAID, result.getStatus());

        verify(paymentRepository).save(payment);
        verify(userPurchaseService).purchaseCourse(
                1L,
                10L,
                BigDecimal.valueOf(49.99)
        );
    }

    @Test
    void rejectOfflinePaymentShouldSetRejectedStatusAndNote() {
        Payment payment = new Payment();
        payment.setUserId(1L);
        payment.setCourseId(10L);
        payment.setAmount(BigDecimal.valueOf(49.99));
        payment.setMethod(PaymentMethod.OFFLINE);
        payment.setStatus(PaymentStatus.AWAITING_ADMIN_APPROVAL);

        when(paymentRepository.findById(5L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2AuthenticationToken adminAuth = mockAdminAuth();

        PaymentController.RejectPaymentRequest request =
                new PaymentController.RejectPaymentRequest("Payment proof invalid");

        Payment result = paymentController.rejectOfflinePayment(5L, request, adminAuth);

        assertEquals(PaymentStatus.REJECTED, result.getStatus());
        assertEquals("Payment proof invalid", result.getAdminNote());

        verify(paymentRepository).save(payment);
        verify(userPurchaseService, never()).purchaseCourse(anyLong(), anyLong(), any());
    }

    @Test
    void approveOfflinePaymentShouldRejectNonAdminUser() {
        OAuth2AuthenticationToken auth = mockAuthWithEmail("student@test.com");

        User student = new User();
        student.setEmail("student@test.com");
        student.setRole("USER");

        when(userRepository.findByEmail("student@test.com"))
                .thenReturn(Optional.of(student));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentController.approveOfflinePayment(5L, auth)
        );

        assertEquals("Admin access required", exception.getMessage());

        verify(paymentRepository, never()).findById(anyLong());
        verify(userPurchaseService, never()).purchaseCourse(anyLong(), anyLong(), any());
    }

    @Test
    void getPendingOfflinePaymentsShouldReturnAwaitingApprovalPayments() {
        Payment payment = new Payment();
        payment.setStatus(PaymentStatus.AWAITING_ADMIN_APPROVAL);

        when(paymentRepository.findByStatus(PaymentStatus.AWAITING_ADMIN_APPROVAL))
                .thenReturn(List.of(payment));

        OAuth2AuthenticationToken adminAuth = mockAdminAuth();

        List<Payment> result = paymentController.getPendingOfflinePayments(adminAuth);

        assertEquals(1, result.size());
        assertEquals(PaymentStatus.AWAITING_ADMIN_APPROVAL, result.get(0).getStatus());

        verify(paymentRepository).findByStatus(PaymentStatus.AWAITING_ADMIN_APPROVAL);
    }

    @Test
    void confirmStripePaymentShouldMarkPaymentAsPaid() throws Exception {
        Payment payment = new Payment();
        payment.setUserId(1L);
        payment.setCourseId(10L);
        payment.setAmount(BigDecimal.valueOf(49.99));
        payment.setMethod(PaymentMethod.STRIPE);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setStripeSessionId("cs_test_123");

        Session stripeSession = new Session();
        stripeSession.setPaymentStatus("paid");
        stripeSession.setPaymentIntent("pi_test_123");

        when(paymentRepository.findByStripeSessionId("cs_test_123"))
                .thenReturn(Optional.of(payment));

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        try (MockedStatic<Session> mockedSession = mockStatic(Session.class)) {
            mockedSession.when(() -> Session.retrieve("cs_test_123"))
                    .thenReturn(stripeSession);

            Payment result = paymentController.confirmStripePayment(
                    new PaymentController.ConfirmStripeRequest("cs_test_123")
            );

            assertEquals(PaymentStatus.PAID, result.getStatus());
            assertEquals("pi_test_123", result.getStripePaymentIntentId());

            verify(paymentRepository).save(payment);
            verify(userPurchaseService).purchaseCourse(
                    1L,
                    10L,
                    BigDecimal.valueOf(49.99)
            );
        }
    }

    @Test
    void confirmStripePaymentShouldThrowWhenPaymentNotPaid() throws Exception {
        Session stripeSession = new Session();
        stripeSession.setPaymentStatus("unpaid");

        try (MockedStatic<Session> mockedSession = mockStatic(Session.class)) {
            mockedSession.when(() -> Session.retrieve("cs_test_failed"))
                    .thenReturn(stripeSession);

            RuntimeException exception = assertThrows(
                    RuntimeException.class,
                    () -> paymentController.confirmStripePayment(
                            new PaymentController.ConfirmStripeRequest("cs_test_failed")
                    )
            );

            assertEquals("Stripe payment is not paid", exception.getMessage());

            verify(paymentRepository, never()).save(any(Payment.class));
            verify(userPurchaseService, never()).purchaseCourse(anyLong(), anyLong(), any());
        }
    }

    private OAuth2AuthenticationToken mockAdminAuth() {
        OAuth2AuthenticationToken auth = mockAuthWithEmail("admin@test.com");

        User admin = new User();
        admin.setEmail("admin@test.com");
        admin.setRole("ADMIN");

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(admin));

        return auth;
    }

    private OAuth2AuthenticationToken mockAuthWithEmail(String email) {
        OAuth2AuthenticationToken auth = mock(OAuth2AuthenticationToken.class);
        OAuth2User principal = mock(OAuth2User.class);

        when(auth.getPrincipal()).thenReturn(principal);
        when(principal.getAttribute("email")).thenReturn(email);

        return auth;
    }
}