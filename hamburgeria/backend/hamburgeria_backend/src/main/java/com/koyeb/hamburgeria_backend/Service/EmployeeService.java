package com.koyeb.hamburgeria_backend.Service;

import com.cloudinary.Cloudinary;
import com.koyeb.hamburgeria_backend.Dto.EmployeeDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;
import com.koyeb.hamburgeria_backend.Enum.Role;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
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

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CustomerService customerService;

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

    public String createEmployee(EmployeeDTO employeeDTO) throws EmailAlreadyInUseException {
        if (isEmailInUse(employeeDTO.getEmail())) {
            throw new EmailAlreadyInUseException("Email " + employeeDTO.getEmail() + " already in use.");
        }

        Employee employee = new Employee();
        employee.setName(employeeDTO.getName());
        employee.setSurname(employeeDTO.getSurname());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        employee.setAvatar(employeeDTO.getAvatar());
        employee.setRole(Role.valueOf(Role.EMPLOYEE.name()));
        employee.setCreationDate(employeeDTO.getCreationDate());
        employee.setCodiceFiscale(employeeDTO.getCodiceFiscale());
        employee.setSalary(employeeDTO.getSalary());

        employeeRepository.save(employee);
        loggerTrace.trace("Registration email sent to employee: " + employee.getEmail());
        sendRegistrationMail(employee);
        loggerTrace.trace("Employee with email " + employee.getEmail() + " saved.");
        return "Employee with email " + employee.getEmail() + " saved.";
    }

    private boolean isEmailInUse(String email) {
        try {
            ownerService.getOwnerByEmail(email);
            return true;
        } catch (UserNotFoundException e) {
            // Email not found for Owner, continue checking
        }

        try {
            getEmployeeByEmail(email);
            return true;
        } catch (UserNotFoundException e) {
            // Email not found for Employee, continue checking
        }

        try {
            customerService.getCustomerByEmail(email);
            return true;
        } catch (UserNotFoundException e) {
            // Email not found for Customer, continue checking
        }

        return false;
    }


    public Employee getEmployeeByEmail(String email) throws UserNotFoundException {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Employee not found with email: " + email));
    }

    public Page<Employee> getEmployees(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<Employee> employees = employeeRepository.findAll(pageable);
        loggerInfo.info("Retrieved employees page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return employees;
    }

    public Employee updateEmployee(String email, EmployeeDTO employeeDTO) throws UserNotFoundException {
        Employee employee = getEmployeeByEmail(email);
        String employeeEmail = employee.getEmail();
        employee.setName(employeeDTO.getName());
        employee.setSurname(employeeDTO.getSurname());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        employee.setAvatar(employeeDTO.getAvatar());
        employee.setRole(Role.valueOf(Role.EMPLOYEE.name()));
        employee.setCreationDate(employeeDTO.getCreationDate());
        employee.setCodiceFiscale(employeeDTO.getCodiceFiscale());
        employee.setSalary(employeeDTO.getSalary());
        employeeRepository.save(employee);
        loggerInfo.info("Employee with email " + employeeEmail + " updated.");
        return employee;
    }

    public String deleteEmployee(String email) throws UserNotFoundException {
        Employee employee = getEmployeeByEmail(email);
        employeeRepository.delete(employee);
        loggerInfo.info("Employee with email " + email + " deleted successfully.");
        return "Employee with email " + email + " deleted successfully.";
    }

    private void sendRegistrationMail(Employee employee) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(employee.getEmail());
        message.setSubject("Employee Service Registration");
        message.setText("Congratulations, " + employee.getName() + " " + employee.getSurname() + "! Successful registration to this employee service");

        javaMailSender.send(message);
        loggerInfo.info("Registration email sent to owner: " + employee.getEmail());
    }

    public String setEmployeeAvatar(String employeeEmail, MultipartFile photo) throws IOException, UserNotFoundException {
        Employee employee = getEmployeeByEmail(employeeEmail);

        if (employee != null) {
            String url = (String) cloudinary.uploader().upload(photo.getBytes(), Collections.emptyMap()).get("url");

            employee.setAvatar(url);
            employeeRepository.save(employee);
            loggerTrace.trace("Employee with email=" + employeeEmail + " updated successfully with the sent photo.");
            return "Employee with email=" + employeeEmail + " updated successfully with the sent photo.";
        } else {
            loggerError.error("Employee email: " + employeeEmail + " not found.");
            return "Employee with email=" + employeeEmail + " not found.";
        }
    }
}

