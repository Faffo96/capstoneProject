package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.*;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Service.*;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private AuthService authService;

    @PostMapping("/auth/registerEmployee")
    public String registerEmployee(@RequestBody @Validated EmployeeDTO employeeDTO, BindingResult bindingResult) throws BadRequestException, EmailAlreadyInUseException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        try {
            employeeService.createEmployee(employeeDTO);
        } catch (EmailAlreadyInUseException e) {
            throw new EmailAlreadyInUseException(e.getMessage());
        }
        return "Employee with email " + employeeDTO.getEmail() + " has been created!";
    }

    @PostMapping("/auth/registerCustomer")
    public String registerCustomer(@RequestBody @Validated CustomerDTO customerDTO, BindingResult bindingResult) throws BadRequestException, EmailAlreadyInUseException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        try {
            customerService.createCustomer(customerDTO);
        } catch (EmailAlreadyInUseException e) {
            throw new EmailAlreadyInUseException(e.getMessage());
        }
        return "Customer with email " + customerDTO.getEmail() + " has been created!";
    }

    @PostMapping("/auth/registerOwner")
    public String registerOwner(@RequestBody @Validated OwnerDTO ownerDTO, BindingResult bindingResult) throws BadRequestException, EmailAlreadyInUseException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        try {
            ownerService.createOwner(ownerDTO);
        } catch (EmailAlreadyInUseException e) {
            throw new EmailAlreadyInUseException(e.getMessage());
        }
        return "Owner with email " + ownerDTO.getEmail() + " has been created!";
    }

    @PostMapping("/auth/login")
    public String login(@RequestBody @Validated UserLoginDTO userLoginDTO, BindingResult bindingResult) throws BadRequestException, UserNotFoundException, UnauthorizedException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return authService.authenticateUserAndCreateToken(userLoginDTO);
    }
}


