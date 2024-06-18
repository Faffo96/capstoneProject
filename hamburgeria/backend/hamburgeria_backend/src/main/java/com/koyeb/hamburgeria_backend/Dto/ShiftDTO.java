package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShiftDTO {
    private Long id;
    private EmployeeDTO employee;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}

