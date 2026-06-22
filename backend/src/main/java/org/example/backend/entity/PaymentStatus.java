package org.example.backend.entity;

public enum PaymentStatus {
    PENDING,
    PAID,
    FAILED,
    CANCELLED,
    EXPIRED,
    AWAITING_ADMIN_APPROVAL,
    REJECTED
}