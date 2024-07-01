package com.koyeb.hamburgeria_backend;

import com.koyeb.hamburgeria_backend.Controller.JwtToolController;
import com.koyeb.hamburgeria_backend.Dto.DiningTableDTO;
import com.koyeb.hamburgeria_backend.Dto.OwnerDTO;
import com.koyeb.hamburgeria_backend.Entity.DiningTable;
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
    private DiningTableService diningTableService;

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

        List<DiningTable> diningTables = diningTableService.getAllDiningTables();
        if (diningTables.isEmpty()) {
            DiningTableDTO[] diningTablesDTO = new DiningTableDTO[15];
            for (int i = 0; i < diningTablesDTO.length; i++) {
                diningTablesDTO[i] = new DiningTableDTO();
            }

            diningTablesDTO[0].setId(1L);
            diningTablesDTO[0].setTableNumber(1);
            diningTablesDTO[0].setSeating(4);
            diningTablesDTO[0].setOutside(false);

            diningTablesDTO[1].setId(2L);
            diningTablesDTO[1].setTableNumber(2);
            diningTablesDTO[1].setSeating(4);
            diningTablesDTO[1].setOutside(false);

            diningTablesDTO[2].setId(3L);
            diningTablesDTO[2].setTableNumber(3);
            diningTablesDTO[2].setSeating(4);
            diningTablesDTO[2].setOutside(false);

            diningTablesDTO[3].setId(4L);
            diningTablesDTO[3].setTableNumber(4);
            diningTablesDTO[3].setSeating(4);
            diningTablesDTO[3].setOutside(false);

            diningTablesDTO[4].setId(5L);
            diningTablesDTO[4].setTableNumber(5);
            diningTablesDTO[4].setSeating(2);
            diningTablesDTO[4].setOutside(false);

            diningTablesDTO[5].setId(6L);
            diningTablesDTO[5].setTableNumber(6);
            diningTablesDTO[5].setSeating(2);
            diningTablesDTO[5].setOutside(false);

            diningTablesDTO[6].setId(7L);
            diningTablesDTO[6].setTableNumber(7);
            diningTablesDTO[6].setSeating(2);
            diningTablesDTO[6].setOutside(false);

            diningTablesDTO[7].setId(8L);
            diningTablesDTO[7].setTableNumber(8);
            diningTablesDTO[7].setSeating(2);
            diningTablesDTO[7].setOutside(true);

            diningTablesDTO[8].setId(9L);
            diningTablesDTO[8].setTableNumber(9);
            diningTablesDTO[8].setSeating(2);
            diningTablesDTO[8].setOutside(true);

            diningTablesDTO[9].setId(10L);
            diningTablesDTO[9].setTableNumber(10);
            diningTablesDTO[9].setSeating(2);
            diningTablesDTO[9].setOutside(true);

            diningTablesDTO[10].setId(11L);
            diningTablesDTO[10].setTableNumber(11);
            diningTablesDTO[10].setSeating(2);
            diningTablesDTO[10].setOutside(true);

            diningTablesDTO[11].setId(12L);
            diningTablesDTO[11].setTableNumber(12);
            diningTablesDTO[11].setSeating(2);
            diningTablesDTO[11].setOutside(true);

            diningTablesDTO[12].setId(13L);
            diningTablesDTO[12].setTableNumber(13);
            diningTablesDTO[12].setSeating(2);
            diningTablesDTO[12].setOutside(true);

            diningTablesDTO[13].setId(14L);
            diningTablesDTO[13].setTableNumber(14);
            diningTablesDTO[13].setSeating(2);
            diningTablesDTO[13].setOutside(true);

            diningTablesDTO[14].setId(15L);
            diningTablesDTO[14].setTableNumber(15);
            diningTablesDTO[14].setSeating(2);
            diningTablesDTO[14].setOutside(true);

            for (DiningTableDTO diningTableDTO : diningTablesDTO) {
                diningTableService.createDiningTable(diningTableDTO);
            }
        }

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
    }
}



