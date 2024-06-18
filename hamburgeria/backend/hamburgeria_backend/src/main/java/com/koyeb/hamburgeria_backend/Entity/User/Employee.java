package com.koyeb.hamburgeria_backend.Entity.User;

import com.koyeb.hamburgeria_backend.Entity.Shift;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "employees")
public class Employee extends User {
    private String codiceFiscale;
    private double salary;

    @OneToMany(mappedBy = "employee")
    private List<Shift> shiftList;
}