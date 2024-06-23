package com.koyeb.hamburgeria_backend.Service;

import com.cloudinary.Cloudinary;
import com.koyeb.hamburgeria_backend.Dto.CustomerDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Customer;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;
import com.koyeb.hamburgeria_backend.Enum.Role;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.CustomerRepository;
import com.koyeb.hamburgeria_backend.Repository.EmployeeRepository;
import com.koyeb.hamburgeria_backend.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Cloudinary cloudinary;

    private static final Logger loggerWarn = LoggerFactory.getLogger("loggerWarn");
    private static final Logger loggerTrace = LoggerFactory.getLogger("loggerTrace");
    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");

    public String createCustomer(CustomerDTO customerDTO) throws EmailAlreadyInUseException {
        if (isEmailInUse(customerDTO.getEmail())) {
            throw new EmailAlreadyInUseException("Email " + customerDTO.getEmail() + " already in use.");
        }

        Customer customer = new Customer();
        customer.setName(customerDTO.getName());
        customer.setSurname(customerDTO.getSurname());
        customer.setEmail(customerDTO.getEmail());
        customer.setPassword(passwordEncoder.encode(customerDTO.getPassword()));
        customer.setAvatar(customerDTO.getAvatar());
        customer.setRole(Role.valueOf(Role.CUSTOMER.name()));
        customer.setCreationDate(customerDTO.getCreationDate());

        customerRepository.save(customer);
        loggerTrace.trace("Registration email sent to customer: " + customer.getEmail());
        sendRegistrationMail(customer);
        loggerTrace.trace("Customer with email " + customer.getEmail() + " saved.");
        return "Customer with email " + customer.getEmail() + " saved.";
    }

    private boolean isEmailInUse(String email) {
        try {
            ownerService.getOwnerByEmail(email);
            return true;
        } catch (UserNotFoundException e) {
            // Email not found for Owner, continue checking
        }

        Optional<Employee> employeeOptional = employeeRepository.findByEmail(email);
        if (employeeOptional.isPresent()) {
            return true;
        }

        try {
            getCustomerByEmail(email);
            return true;
        } catch (UserNotFoundException e) {
            // Email not found for Customer, continue checking
        }

        return false;
    }


    public Customer getCustomerByEmail(String email) throws UserNotFoundException {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Customer not found with email: " + email));
    }

    public Page<Customer> getCustomers(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<Customer> customers = customerRepository.findAll(pageable);
        loggerInfo.info("Retrieved customers page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return customers;
    }

    public Customer updateCustomer(String email, CustomerDTO customerDTO) throws UserNotFoundException {
        Customer customer = getCustomerByEmail(email);
        String customerEmail = customer.getEmail();
        customer.setName(customerDTO.getName());
        customer.setSurname(customerDTO.getSurname());
        customer.setEmail(customerDTO.getEmail());
        customer.setPassword(passwordEncoder.encode(customerDTO.getPassword()));
        customer.setAvatar(customerDTO.getAvatar());
        customer.setRole(Role.valueOf(Role.CUSTOMER.name()));
        customer.setCreationDate(customerDTO.getCreationDate());
        customerRepository.save(customer);
        loggerInfo.info("Customer with email " + customerEmail + " updated.");
        return customer;
    }

    public String deleteCustomer(String email) throws UserNotFoundException {
        Customer customer = getCustomerByEmail(email);
        customerRepository.delete(customer);
        loggerInfo.info("Customer with email " + email + " deleted successfully.");
        return "Customer with email " + email + " deleted successfully.";
    }

    private void sendRegistrationMail(Customer customer) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(customer.getEmail());
        message.setSubject("Customer Service Registration");
        message.setText("Congratulations, " + customer.getName() + " " + customer.getSurname() + "! Successful registration to this customer service");

        javaMailSender.send(message);
        loggerInfo.info("Registration email sent to owner: " + customer.getEmail());
    }

    public String setCustomerAvatar(String customerEmail, MultipartFile photo) throws IOException, UserNotFoundException {
        Customer customer = getCustomerByEmail(customerEmail);

        if (customer != null) {
            String url = (String) cloudinary.uploader().upload(photo.getBytes(), Collections.emptyMap()).get("url");

            customer.setAvatar(url);
            customerRepository.save(customer);
            loggerTrace.trace("Customer with email=" + customerEmail + " updated successfully with the sent photo.");
            return "Customer with email=" + customerEmail + " updated successfully with the sent photo.";
        } else {
            loggerError.error("Customer email: " + customerEmail + " not found.");
            return "Customer with email=" + customerEmail + " not found.";
        }
    }
}

