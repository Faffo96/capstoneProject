package com.koyeb.hamburgeria_backend;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Repository.EmployeeRepository;
import com.koyeb.hamburgeria_backend.Repository.UserRepository;
import com.koyeb.hamburgeria_backend.Service.EmployeeService;
import com.koyeb.hamburgeria_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
public class Runner implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

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


    }
}



