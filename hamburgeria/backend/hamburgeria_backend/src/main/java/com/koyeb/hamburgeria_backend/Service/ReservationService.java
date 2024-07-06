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
import com.koyeb.hamburgeria_backend.Exception.*;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public Page<Reservation> getReservationsByUserEmail(String userEmail, int page, String sortBy) throws UnauthorizedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = null;
        boolean isAdminOrOwner = false;

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                currentUserName = ((UserDetails) principal).getUsername();
                for (GrantedAuthority authority : ((UserDetails) principal).getAuthorities()) {
                    if (authority.getAuthority().equals("ROLE_ADMIN") || authority.getAuthority().equals("ROLE_OWNER")) {
                        isAdminOrOwner = true;
                        break;
                    }
                }
            } else {
                currentUserName = principal.toString();
            }
        }

        if (currentUserName == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        if (isAdminOrOwner || currentUserName.equals(userEmail)) {
            int fixedSize = 15;
            Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
            Page<Reservation> reservations = reservationRepository.findByUserEmail(userEmail, pageable);
            loggerInfo.info("Retrieved reservations for user with email " + userEmail + ", page " + page);
            return reservations;
        } else {
            throw new UnauthorizedException("User not authorized to access these reservations");
        }
    }

    public Page<Reservation> getReservationsByUserEmailAndDateRange(String userEmail, LocalDateTime startDate, LocalDateTime endDate, int page, String sortBy) throws UnauthorizedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = null;
        boolean isAdminOrOwner = false;

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                currentUserName = ((UserDetails) principal).getUsername();
                for (GrantedAuthority authority : ((UserDetails) principal).getAuthorities()) {
                    if (authority.getAuthority().equals("ROLE_ADMIN") || authority.getAuthority().equals("ROLE_OWNER")) {
                        isAdminOrOwner = true;
                        break;
                    }
                }
            } else {
                currentUserName = principal.toString();
            }
        }

        if (currentUserName == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        if (isAdminOrOwner || currentUserName.equals(userEmail)) {
            int fixedSize = 15;
            Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
            Page<Reservation> reservations = reservationRepository.findByUserEmailAndDateRange(userEmail, startDate, endDate, pageable);
            loggerInfo.info("Retrieved reservations for user with email " + userEmail + ", page " + page);
            return reservations;
        } else {
            throw new UnauthorizedException("User not authorized to access these reservations");
        }
    }

    public List<Reservation> getAllReservations(String sortBy) {
        List<Reservation> reservations = reservationRepository.findAll(Sort.by(sortBy));
        loggerInfo.info("Retrieved all reservations sorted by " + sortBy);
        return reservations;
    }

    public Page<Reservation> getReservations(int page, String sortBy) {
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

    public Map<String, Long> getMonthlyReservationCountByYear(int year) {
        List<Object[]> results = reservationRepository.findMonthlyReservationCountByYear(year);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row[0]),
                        row -> (Long) row[1]
                ));
    }

    public Map<String, Long> getDailyReservationCountByYearAndMonth(int year, int month) {
        List<Object[]> results = reservationRepository.findDailyReservationCountByYearAndMonth(year, month);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row[0]),
                        row -> (Long) row[1]
                ));
    }

    public Map<String, Long> getHourlyReservationCountByYearMonthAndDay(int year, int month, int day) {
        List<Object[]> results = reservationRepository.findHourlyReservationCountByYearMonthAndDay(year, month, day);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row[0]),
                        row -> (Long) row[1]
                ));
    }
}
