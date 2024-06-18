package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.CustomerDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Customer;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Service.CustomerService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping("/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        Customer customer = customerService.getCustomerByEmail(email);
        return ResponseEntity.ok(customer);
    }

    @GetMapping
    public ResponseEntity<Page<Customer>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "email") String sortBy
    ) {
        Page<Customer> customers = customerService.getCustomers(page, sortBy);
        return ResponseEntity.ok(customers);
    }

    @PutMapping("/{email}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable String email,
            @RequestBody CustomerDTO customerDTO
    ) {
        Customer updatedCustomer = customerService.updateCustomer(email, customerDTO);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String email) {
        String message = customerService.deleteCustomer(email);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerCustomer(@RequestBody @Validated CustomerDTO customerDTO, BindingResult bindingResult) throws BadRequestException, EmailAlreadyInUseException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage())
                    .reduce("", (s, s2) -> s + s2));
        }
        String message = customerService.createCustomer(customerDTO);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/{email}/avatar")
    public ResponseEntity<String> setCustomerAvatar(@PathVariable String email, @RequestParam("photo") MultipartFile photo) throws IOException {
        String message = customerService.setCustomerAvatar(email, photo);
        return ResponseEntity.ok(message);
    }
}
