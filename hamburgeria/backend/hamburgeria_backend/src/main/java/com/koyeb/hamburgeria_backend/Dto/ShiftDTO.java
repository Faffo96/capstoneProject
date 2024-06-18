package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShiftDTO {
    private EmployeeDTO employee;
    private LocalDateTime date;
}

