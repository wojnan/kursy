package org.example.backend.service;

import org.example.backend.entity.CartItem;
import org.example.backend.repository.CartItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    // Get all cart items for a user
    public List<CartItem> getUserCart(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    // Add item to cart
    public CartItem addToCart(Long userId, Long courseId) {
        Optional<CartItem> existing = cartItemRepository
                .findByUserIdAndCourseId(userId, courseId);

        if (existing.isPresent()) {
            return existing.get(); // already exists
        }

        CartItem cartItem = new CartItem(userId, courseId);
        return cartItemRepository.save(cartItem);
    }

    // Remove item from cart
    public void removeFromCart(Long userId, Long courseId) {
        cartItemRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    // Clear cart
    public void clearCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(items);
    }
}
