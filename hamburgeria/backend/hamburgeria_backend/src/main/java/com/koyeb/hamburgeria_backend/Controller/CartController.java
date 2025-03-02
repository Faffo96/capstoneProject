package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.CartDTO;
import com.koyeb.hamburgeria_backend.Entity.Cart;
import com.koyeb.hamburgeria_backend.Exception.*;
import com.koyeb.hamburgeria_backend.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public ResponseEntity<Cart> createCart(@RequestBody CartDTO cartDTO) throws UserNotFoundException, ProductNotFoundException, ReservationNotFoundException, MinimumTotalException {
        try {
            Cart createdCart = cartService.createCart(cartDTO);
            return ResponseEntity.ok(createdCart);
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException(e.getMessage());
        } catch (ReservationNotFoundException e) {
            throw new ReservationNotFoundException(e.getMessage());
        } catch (ProductNotFoundException e) {
            throw new ProductNotFoundException(e.getMessage()); // Product not found
        } catch (MinimumTotalException e) {
            throw new MinimumTotalException(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long id) {
        try {
            Cart cart = cartService.getCartById(id);
            return ResponseEntity.ok(cart);
        } catch (CartNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Cart not found
        }
    }

    @GetMapping("/user")
    public ResponseEntity<Page<Cart>> getCartsByUserEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {

        Sort sort = Sort.by(Sort.Direction.fromString(order), sortBy);
        Pageable pageable = PageRequest.of(page, 10, sort);
        Page<Cart> carts = cartService.getCartsByUserEmail(email, pageable);
        return ResponseEntity.ok(carts);
    }

    @GetMapping
    public ResponseEntity<Page<Cart>> getAllCarts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {

        Page<Cart> carts = cartService.getCarts(page, sortBy);
        return ResponseEntity.ok(carts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cart> updateCart(@PathVariable Long id, @RequestBody CartDTO cartDTO) throws ProductNotFoundException, CartNotFoundException, MinimumTotalException {
        try {
            Cart updatedCart = cartService.updateCart(id, cartDTO);
            return ResponseEntity.ok(updatedCart);
        } catch (CartNotFoundException e) {
            throw new CartNotFoundException("Cart id " + id + " not found");
        } catch (ProductNotFoundException e) {
            throw new ProductNotFoundException("Product id " + id + " not found");
        } catch (MinimumTotalException e) {
            throw new MinimumTotalException ("The minimum amount must be 8.5€");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCart(@PathVariable Long id) {
        try {
            String result = cartService.deleteCart(id);
            return ResponseEntity.ok(result);
        } catch (CartNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart not found with id: " + id);
        }
    }

    @GetMapping("/revenue/monthly")
    public Map<String, Double> getMonthlyRevenue(@RequestParam int year) {
        return cartService.getMonthlyRevenueByYear(year);
    }

    @GetMapping("/revenue/daily")
    public Map<String, Double> getDailyRevenue(@RequestParam int year, @RequestParam int month) {
        return cartService.getDailyRevenueByYearAndMonth(year, month);
    }

    @GetMapping("/product-quantities")
    public Map<String, Integer> getProductQuantities(@RequestParam int year, @RequestParam(required = false) Integer month) {
        if (month != null) {
            return cartService.getProductQuantitiesByMonthAndYear(year, month);
        } else {
            return cartService.getProductQuantitiesByYear(year);
        }
    }


}

