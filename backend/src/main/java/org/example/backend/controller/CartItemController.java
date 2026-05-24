package org.example.backend.controller;

import org.example.backend.entity.CartItem;
import org.example.backend.service.CartItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    // Get cart items for user
    @GetMapping("/{userId}")
    public List<CartItem> getUserCart(@PathVariable Long userId) {
        return cartItemService.getUserCart(userId);
    }

    // Add course to cart
    @PostMapping
    public CartItem addToCart(
            @RequestParam Long userId,
            @RequestParam Long courseId
    ) {
        return cartItemService.addToCart(userId, courseId);
    }

    // Remove course from cart
    @DeleteMapping
    public void removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long courseId
    ) {
        cartItemService.removeFromCart(userId, courseId);
    }

    // Clear entire cart
    @DeleteMapping("/{userId}")
    public void clearCart(@PathVariable Long userId) {
        cartItemService.clearCart(userId);
    }
}
