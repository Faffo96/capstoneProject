package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.ReservationDTO;
import com.koyeb.hamburgeria_backend.Entity.Cart;
import com.koyeb.hamburgeria_backend.Entity.CustomizableBurger;
import com.koyeb.hamburgeria_backend.Entity.DiningTable;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import com.koyeb.hamburgeria_backend.Entity.User.Customer;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.CartNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.DiningTableNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.ReservationNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.CartRepository;
import com.koyeb.hamburgeria_backend.Repository.ReservationRepository;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private DiningTableService diningTableService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CartRepository cartRepository;

    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");

    public Reservation createReservation(ReservationDTO reservationDTO) throws UserNotFoundException, DiningTableNotFoundException, CartNotFoundException {
        Reservation reservation = new Reservation();
        reservation.setCreationDate(LocalDateTime.now());
        reservation.setBookedDate(reservationDTO.getBookedDate());
        reservation.setParticipants(reservationDTO.getParticipants());

        DiningTable diningTable = diningTableService.getDiningTableById(reservationDTO.getId());
        reservation.setDiningTable(diningTable);

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

        User currentUser = null;
        try {
            currentUser = employeeService.getEmployeeByEmail(currentUserName);
        } catch (UserNotFoundException e) {
            // User not found for Employee, continue checking
        }

        if (currentUser == null) {
            try {
                currentUser = customerService.getCustomerByEmail(currentUserName);
            } catch (UserNotFoundException e) {
                // User not found for Customer, continue checking
            }
        }

        if (currentUser == null) {
            try {
                currentUser = ownerService.getOwnerByEmail(currentUserName);
            } catch (UserNotFoundException e) {
                // User not found for Owner, continue checking
            }
        }

        if (currentUser == null) {
            throw new UserNotFoundException("User not found for email: " + currentUserName);
        }

        reservation.setUser(currentUser);

        Cart cart;
        if (reservationDTO.getCart() == null) {
            cart = new Cart();
            cartRepository.save(cart); // Save the cart to generate an ID
        } else {
            cart = cartRepository.findById(reservationDTO.getCart().getId())
                    .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + reservationDTO.getCart().getId()));
        }

        reservation.setCart(cart);

        reservationRepository.save(reservation);

        loggerInfo.info("Reservation with id " + reservation.getId() + " created.");
        return reservation;
    }

    public Reservation getReservationById(Long id) throws ReservationNotFoundException {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found with id: " + id));
    }

    public List<Reservation> getReservationsByUserEmail(String userEmail) {
        List<Reservation> reservations = reservationRepository.findByUserEmail(userEmail);
        loggerInfo.info("Retrieved reservations for user with id " + userEmail);
        return reservations;
    }

    public Page<Reservation> getAllReservations(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<Reservation> reservations = reservationRepository.findAll(pageable);
        loggerInfo.info("Retrieved reservations page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return reservations;
    }

    public Reservation updateReservation(Long id, ReservationDTO reservationDTO) throws ReservationNotFoundException, UserNotFoundException {
        Reservation reservation = getReservationById(id);

        reservation.setCreationDate(reservationDTO.getCreationDate());
        reservation.setBookedDate(reservationDTO.getBookedDate());

        DiningTable diningTable = new DiningTable();
        diningTable.setId(reservationDTO.getDiningTable().getId());
        reservation.setDiningTable(diningTable);

        User user = userService.getUserByEmail(reservationDTO.getUser().getEmail());
        if (user == null) {
            throw new UsernameNotFoundException("User not found with id: " + reservationDTO.getUser().getEmail());
        }
        reservation.setUser(user);

        reservation.setParticipants(reservationDTO.getParticipants());

        Cart cart = new Cart();
        cart.setId(reservationDTO.getCart().getId());
        reservation.setCart(cart);

        reservationRepository.save(reservation);
        loggerInfo.info("Reservation with id " + id + " updated.");

        return reservation;
    }

    public String deleteReservation(Long id) throws ReservationNotFoundException {
        Reservation reservation = getReservationById(id);
        reservationRepository.delete(reservation);
        loggerInfo.info("Reservation with id " + id + " deleted successfully.");
        return "Reservation with id " + id + " deleted successfully.";
    }
}

