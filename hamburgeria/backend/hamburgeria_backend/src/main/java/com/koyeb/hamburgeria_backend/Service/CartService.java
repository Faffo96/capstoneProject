package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.CartDTO;
import com.koyeb.hamburgeria_backend.Dto.ProductDTO;
import com.koyeb.hamburgeria_backend.Dto.ReservationDTO;
import com.koyeb.hamburgeria_backend.Dto.UserDTO;
import com.koyeb.hamburgeria_backend.Entity.Cart;
import com.koyeb.hamburgeria_backend.Entity.Product;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import com.koyeb.hamburgeria_backend.Entity.User.Customer;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.*;
import com.koyeb.hamburgeria_backend.Repository.CartRepository;
import com.koyeb.hamburgeria_backend.Repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    private CustomerService customerService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private ProductService productService;

    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");
    private static final Logger loggerTrace = LoggerFactory.getLogger("loggerTrace");
    private static final Logger loggerWarn = LoggerFactory.getLogger("loggerWarn");

    public Cart createCart(CartDTO cartDTO) throws ReservationNotFoundException, UserNotFoundException, ProductNotFoundException {
        Cart cart = new Cart();

        // Gestione della prenotazione
        if (cartDTO.getReservation() != null) {
            Reservation reservation = reservationService.getReservationById(cartDTO.getReservation().getId());
            cart.setReservation(reservation);
        } else {
            cart.setReservation(null);
        }

        // Ottenere l'utente autenticato dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = null;

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                currentUserName = ((UserDetails) principal).getUsername();
            } else {
                currentUserName = principal.toString();
            }
        }
        try {
            Employee employee = employeeService.getEmployeeByEmail(currentUserName);
            cart.setUser(employee);
        } catch (UserNotFoundException e) {
            // User not found for Employee, continue checking
        }

        try {
            Customer customer = customerService.getCustomerByEmail(currentUserName);
            cart.setUser(customer);
        } catch (UserNotFoundException e) {
            // User not found for Customer, continue checking
        }

        try {
            Owner owner = ownerService.getOwnerByEmail(currentUserName);
            cart.setUser(owner);
        } catch (UserNotFoundException e) {
            // User not found for Owner, continue checking
        }

        // Gestione della lista dei prodotti
        List<ProductDTO> productDTOList = cartDTO.getProductList();
        List<Product> productList = new ArrayList<>();

        if (productDTOList != null) {
            for (ProductDTO productDTO : productDTOList) {
                Product product = productService.getProductById(productDTO.getId());
                if (product != null) {
                    productList.add(product);
                } else {
                    loggerError.error("Product not found with id: " + productDTO.getId());
                    throw new ProductNotFoundException("Product not found with id: " + productDTO.getId());
                }
            }
        }

        cart.setProductList(productList);
        cart.setCreationDate(cartDTO.getCreationDate());
        cart.setPaid(cartDTO.isPaid());
        cart.setDelivery(cartDTO.isDelivery());
        cartRepository.save(cart);
        loggerInfo.info("Cart with id " + cart.getId() + " created.");
        return cart;
    }






    public Page<Cart> getCarts(int page, String sortBy) {
        int fixedSize = 15;  // Dimensione fissa impostata a 15
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<Cart> carts = cartRepository.findAll(pageable);
        loggerInfo.info("Retrieved carts page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return carts;
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

    public Cart updateCart(Long id, CartDTO cartDTO) throws CartNotFoundException, ProductNotFoundException, MinimumTotalException {
        Cart cart = getCartById(id);

        List<ProductDTO> productDTOList = cartDTO.getProductList();
        List<Product> productList = new ArrayList<>();

        for (ProductDTO productDTO : productDTOList) {
            Product product = productService.getProductById(productDTO.getId());
            if (product != null) {
                productList.add(product);
            } else {
                loggerError.error("Product not found with id: " + productDTO.getId());
                throw new ProductNotFoundException("Product not found with id: " + productDTO.getId());
            }
        }

        cart.setProductList(productList);
        cart.setDelivery(cartDTO.isDelivery());
        cart.setDeliveryFee(cartDTO.isDelivery() ? 2.0 : 0.0);

        // Calculate the total price of the products in the cart
        double total = productList.stream().mapToDouble(Product::getPrice).sum();
        cart.setTotal(total + (cart.isDelivery() ? cart.getDeliveryFee() : 0));

        // Check if the total is at least 8.5
        if (total < 8.5) {
            throw new MinimumTotalException("The total price of the cart must be at least 8.5");
        }

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

