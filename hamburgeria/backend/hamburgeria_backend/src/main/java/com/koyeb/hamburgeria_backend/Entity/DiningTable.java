package com.koyeb.hamburgeria_backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@Entity
@Table(name = "dining_tables")
public class DiningTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int seating;
    private boolean outside;

    @OneToMany(mappedBy = "table")
    private List<Reservation> reservationList;
}

