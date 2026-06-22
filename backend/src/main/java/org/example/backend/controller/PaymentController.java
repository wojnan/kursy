package org.example.backend.controller;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.example.backend.entity.Payment;
import org.example.backend.entity.PaymentMethod;
import org.example.backend.entity.PaymentStatus;
import org.example.backend.repository.PaymentRepository;
import org.example.backend.service.UserPurchaseService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final UserPurchaseService userPurchaseService;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    public PaymentController(
            PaymentRepository paymentRepository,
            UserPurchaseService userPurchaseService
    ) {
        this.paymentRepository = paymentRepository;
        this.userPurchaseService = userPurchaseService;
    }

    @PostMapping("/checkout")
    public Map<String, String> createCheckoutSession(
            @RequestBody CheckoutRequest request
    ) throws Exception {

        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl(successUrl)
                        .setCancelUrl(cancelUrl)
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(request.amount())
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName(request.courseTitle())
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .putMetadata("courseId", request.courseId().toString())
                        .putMetadata("userId", request.userId().toString())
                        .build();

        Session session = Session.create(params);

        Payment payment = new Payment();
        payment.setUserId(request.userId());
        payment.setCourseId(request.courseId());
        payment.setAmount(BigDecimal.valueOf(request.amount()).movePointLeft(2));
        payment.setMethod(PaymentMethod.STRIPE);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setStripeSessionId(session.getId());

        paymentRepository.save(payment);

        return Map.of("url", session.getUrl());
    }

    @PostMapping("/confirm-stripe")
    public Payment confirmStripePayment(
            @RequestBody ConfirmStripeRequest request
    ) throws Exception {

        Stripe.apiKey = stripeSecretKey;

        Session session = Session.retrieve(request.sessionId());

        if (!"paid".equals(session.getPaymentStatus())) {
            throw new RuntimeException("Stripe payment is not paid");
        }

        Payment payment = paymentRepository
                .findByStripeSessionId(request.sessionId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.PAID) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setStripePaymentIntentId(session.getPaymentIntent());

            paymentRepository.save(payment);

            userPurchaseService.purchaseCourse(
                    payment.getUserId(),
                    payment.getCourseId(),
                    payment.getAmount()
            );
        }

        return payment;
    }

    @PostMapping("/offline")
    public Payment createOfflinePayment(
            @RequestBody OfflinePaymentRequest request
    ) {
        Payment payment = new Payment();

        payment.setUserId(request.userId());
        payment.setCourseId(request.courseId());
        payment.setAmount(request.amount());
        payment.setMethod(PaymentMethod.OFFLINE);
        payment.setStatus(PaymentStatus.AWAITING_ADMIN_APPROVAL);
        payment.setAdminNote(request.note());

        return paymentRepository.save(payment);
    }

    @GetMapping("/admin/pending")
    public List<Payment> getPendingOfflinePayments() {
        return paymentRepository.findByStatus(
                PaymentStatus.AWAITING_ADMIN_APPROVAL
        );
    }

    @PostMapping("/admin/{id}/approve")
    public Payment approveOfflinePayment(
            @PathVariable Long id
    ) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.PAID);

        Payment saved = paymentRepository.save(payment);

        userPurchaseService.purchaseCourse(
                payment.getUserId(),
                payment.getCourseId(),
                payment.getAmount()
        );

        return saved;
    }

    @PostMapping("/admin/{id}/reject")
    public Payment rejectOfflinePayment(
            @PathVariable Long id,
            @RequestBody(required = false) RejectPaymentRequest request
    ) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.REJECTED);

        if (request != null && request.note() != null) {
            payment.setAdminNote(request.note());
        }

        return paymentRepository.save(payment);
    }

    public record CheckoutRequest(
            Long userId,
            Long courseId,
            String courseTitle,
            Long amount
    ) {}

    public record ConfirmStripeRequest(
            String sessionId
    ) {}

    public record OfflinePaymentRequest(
            Long userId,
            Long courseId,
            BigDecimal amount,
            String note
    ) {}

    public record RejectPaymentRequest(
            String note
    ) {}
}