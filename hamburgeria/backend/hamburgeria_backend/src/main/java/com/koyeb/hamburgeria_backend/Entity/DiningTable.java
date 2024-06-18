package com.koyeb.hamburgeria_backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

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

    @OneToMany(mappedBy = "diningTable")
    @JsonIgnore
    private List<Reservation> reservationList;

    @Override
    public String toString() {
        return "DiningTable{" +
                "id=" + id +
                ", seating=" + seating +
                ", outside=" + outside +
                '}';
    }
}

