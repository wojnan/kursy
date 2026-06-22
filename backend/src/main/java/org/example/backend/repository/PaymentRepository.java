package org.example.backend.repository;

import org.example.backend.entity.Payment;
import org.example.backend.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByStripeSessionId(String stripeSessionId);
}