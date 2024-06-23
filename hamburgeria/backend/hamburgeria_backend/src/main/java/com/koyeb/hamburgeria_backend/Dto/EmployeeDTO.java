package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;
import java.util.List;

@Data
public class EmployeeDTO extends UserDTO {
    private String codiceFiscale;
    private double salary;
}

