package com.koyeb.hamburgeria_backend.Entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;


import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
