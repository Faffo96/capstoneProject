package com.koyeb.hamburgeria_backend;

import com.koyeb.hamburgeria_backend.Controller.JwtToolController;
import com.koyeb.hamburgeria_backend.Dto.OwnerDTO;
import com.koyeb.hamburgeria_backend.Entity.Product;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Repository.*;
import com.koyeb.hamburgeria_backend.Service.*;
import com.opencsv.exceptions.CsvException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.util.List;

@SpringBootApplication
public class Runner implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ProductService productService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DiningTableRepository diningTableRepository;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private JwtToolController jwtToolController;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private Owner owner;

    public static void main(String[] args) {
        SpringApplication.run(Runner.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
       /* LocalDate creationDate = LocalDate.of(2023, 6, 18);

        UserDTO userDTO = new UserDTO();
        userDTO.setName("Mario");
        userDTO.setSurname("Rossi");
        userDTO.setEmail("mario.rossi@example.com");
        userDTO.setPassword("12345678");
        userDTO.setAvatar("https://example.com/avatar.jpg");
        userDTO.setRole(Role.CUSTOMER);
        userDTO.setCreationDate(creationDate);

        System.out.println(userDTO);

        // Salvataggio dell'utente nel repository
        userService.createUser(userDTO);*/

        /*Employee employee = employeeService.getEmployeeByEmail("mario.rossi@example.com");
        System.out.println(employee);*/

        /*List<Class<? extends User>> types = Arrays.asList(Customer.class, Owner.class, Employee.class);*/
        /*Reservation reservation1 = new Reservation();
        reservation1.setUser(employeeService.getEmployeeByEmail("jane.doe@example.com"));
        reservationRepository.save(reservation1);*/

        /*List<Reservation> reservations = reservationService.getReservationsByUserEmail("jane.doe@example.com");
        for (Reservation reservation : reservations) {
            System.out.println(reservation);
        }*/

        List<Product> products = productService.getProducts();
        if (products.isEmpty()) {
            try {
                productService.importProductsFromCSV();
            } catch (IOException | CsvException e) {
                e.printStackTrace();
            }
        }

        if (!ownerService.existsOwner()) {
            ownerService.instantiateOwner();
        }

        System.out.println(jwtToolController.getUserFromToken("eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTk3MDA4OTYsImV4cCI6MTcxOTcwNDQ5Niwic3ViIjoiZmFiaW9zY2FyOTZAZ21haWwuY29tIn0.GTr-ykNZiSh25DOpQK-INr8jkll6MDqC40_yrTIxzWM"));
    }
}



