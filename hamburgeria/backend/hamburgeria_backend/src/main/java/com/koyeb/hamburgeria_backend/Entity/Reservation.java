package com.koyeb.hamburgeria_backend.Entity;

import com.koyeb.hamburgeria_backend.Entity.User.User;
import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Table;


import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime creationDate;
    private LocalDateTime bookedDate;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private DiningTable diningTable;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private int participants;

    @OneToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;
}
