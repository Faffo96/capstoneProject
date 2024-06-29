package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.UserDataDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Customer;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Security.JwtTool;
import com.koyeb.hamburgeria_backend.Service.CustomerService;
import com.koyeb.hamburgeria_backend.Service.EmployeeService;
import com.koyeb.hamburgeria_backend.Service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jwt")
public class JwtToolController {

    @Autowired
    private JwtTool jwtTool;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private CustomerService customerService;

    @GetMapping("/getUserFromToken")
    public User getUserFromToken(@RequestHeader("Authorization") String token) throws UserNotFoundException {
        // Remove the "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = jwtTool.getEmailFromToken(token);

        try {
            Employee employee = employeeService.getEmployeeByEmail(email);
            employee.setPassword("");
            return employee;
        } catch (UserNotFoundException e) {
            // User not found for Employee, continue checking
        }

        try {
            Customer customer = customerService.getCustomerByEmail(email);
            customer.setPassword("");
            return customer;
        } catch (UserNotFoundException e) {
            // User not found for Customer, continue checking
        }

        try {
            Owner owner = ownerService.getOwnerByEmail(email);
            owner.setPassword("");
            return owner;
        } catch (UserNotFoundException e) {
            // User not found for Owner, throw UnauthorizedException
        }

        throw new UserNotFoundException("User not found for email: " + email);
    }
}
