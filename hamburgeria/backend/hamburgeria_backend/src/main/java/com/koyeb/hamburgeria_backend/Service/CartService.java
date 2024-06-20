package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.CartDTO;
import com.koyeb.hamburgeria_backend.Dto.ProductDTO;
import com.koyeb.hamburgeria_backend.Dto.ReservationDTO;
import com.koyeb.hamburgeria_backend.Dto.UserDTO;
import com.koyeb.hamburgeria_backend.Entity.Cart;
import com.koyeb.hamburgeria_backend.Entity.Product;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.CartNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.ReservationNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.CartRepository;
import com.koyeb.hamburgeria_backend.Repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ProductRepository productRepository;

    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");
    private static final Logger loggerTrace = LoggerFactory.getLogger("loggerTrace");
    private static final Logger loggerWarn = LoggerFactory.getLogger("loggerWarn");

    public Cart createCart(CartDTO cartDTO) throws ReservationNotFoundException, UserNotFoundException {
        Cart cart = new Cart();
        ReservationDTO reservationDTO = cartDTO.getReservation();
        Reservation reservation = reservationService.getReservationById(reservationDTO.getId());
        cart.setReservation(reservation);
        UserDTO userDTO = cartDTO.getUser();
        User user = userService.getUserByEmail(userDTO.getEmail());
        cart.setUser(user);
        List<ProductDTO> productDTOList = cartDTO.getProductList();
        List<Product> productList = productDTOList.stream().map(productDTO -> {
            Product product = productRepository.findById(productDTO.getId()).get();
            return product;
        }).collect(Collectors.toList());
        cart.setProductList(productList);
        cart.setTotal(cartDTO.getTotal());
        cartRepository.save(cart);
        loggerInfo.info("Cart with id " + cart.getId() + " created.");
        return cart;
    }

    public Page<Cart> getCarts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return cartRepository.findAll(pageable);
    }

    public Cart getCartById(Long id) throws CartNotFoundException {
        Optional<Cart> cart = cartRepository.findById(id);
        if (cart.isPresent()) {
            return cart.get();
        } else {
            loggerError.error("Cart with id " + id + " not found.");
            throw new CartNotFoundException("Cart with id " + id + " not found.");
        }
    }

    public Cart updateCart(Long id, CartDTO cartDTO) throws CartNotFoundException {
        Cart cart = getCartById(id);
        cart.setProductList(cart.getProductList());
        cart.setTotal(cart.getTotal());
        cartRepository.save(cart);
        loggerInfo.info("Cart with id " + cart.getId() + " updated.");
        return cart;
    }

    public String deleteCart(Long id) throws CartNotFoundException {
        Cart cart = getCartById(id);
        cartRepository.delete(cart);
        loggerInfo.info("Cart with id " + id + " deleted successfully.");
        return "Cart with id " + id + " deleted successfully.";
    }
}

