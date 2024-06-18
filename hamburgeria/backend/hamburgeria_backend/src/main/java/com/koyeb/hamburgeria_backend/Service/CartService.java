package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Repository.CartRepository;
import com.koyeb.hamburgeria_backend.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService; // Assicurati che UserService abbia un metodo per ottenere l'utente loggato

    @Autowired
    private ProductRepository productRepository;

    /*private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");*/

    /*public Cart createCart(CartDTO cartDTO) {
        Cart cart = new Cart();
        Cart convertedCartDTO = convertDtoToEntity(cartDTO);
        cart.setUser(convertedCartDTO.getUser());
        cart.setProductList(convertedCartDTO.getProductList());
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

    public Cart convertDtoToEntity(CartDTO cartDTO) {
        Cart cart = new Cart();
        cart.setCreationDate(cartDTO.getCreationDate());
        cart.setTotal(cartDTO.getTotal());

        try {
            UserDTO currentUserDTO = userService.getLoggedInUserDTO(); // Metodo che restituisce l'utente loggato come DTO
            User currentUser = userService.convertDtoToEntity(currentUserDTO);
            cart.setUser(currentUser);
        } catch (Exception e) {
            loggerError.error("Failed to fetch logged-in user: " + e.getMessage());
            return null;
        }

        if (cartDTO.getReservation() != null) {
            // Aggiungi la logica per gestire la conversione della ReservationDTO
        } else {
            loggerDebug.debug("No reservation linked to this cart.");
        }

        try {
            List<Product> products = cartDTO.getProductList().stream()
                    .map(dto -> productRepository.findById(dto.getId()).orElse(null))
                    .collect(Collectors.toList());
            cart.setProductList(products);
        } catch (Exception e) {
            loggerWarn.warn("Error while fetching products: " + e.getMessage());
        }

        loggerTrace.trace("Cart DTO converted to Cart entity successfully.");
        return cart;
    }*/
}

