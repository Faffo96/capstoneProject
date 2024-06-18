package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.EmployeeDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Service.EmployeeService;
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
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/{email}")
    public ResponseEntity<Employee> getEmployeeByEmail(@PathVariable String email) {
        Employee employee = employeeService.getEmployeeByEmail(email);
        return ResponseEntity.ok(employee);
    }

    @GetMapping
    public ResponseEntity<Page<Employee>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "email") String sortBy
    ) {
        Page<Employee> employees = employeeService.getEmployees(page, sortBy);
        return ResponseEntity.ok(employees);
    }

    @PostMapping
    public ResponseEntity<String> createEmployee(@RequestBody @Validated EmployeeDTO employeeDTO, BindingResult bindingResult) throws EmailAlreadyInUseException, BadRequestException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        String message = employeeService.createEmployee(employeeDTO);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{email}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable String email,
            @RequestBody EmployeeDTO employeeDTO
    ) throws UserNotFoundException {
        Employee updatedEmployee = employeeService.updateEmployee(email, employeeDTO);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteEmployee(@PathVariable String email) throws UserNotFoundException {
        String message = employeeService.deleteEmployee(email);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/{email}/avatar")
    public ResponseEntity<String> setEmployeeAvatar(@PathVariable String email, @RequestParam("photo") MultipartFile photo) throws IOException {
        String message = employeeService.setEmployeeAvatar(email, photo);
        return ResponseEntity.ok(message);
    }
}

