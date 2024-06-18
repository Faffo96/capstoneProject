package com.koyeb.hamburgeria_backend.Entity;

import com.koyeb.hamburgeria_backend.Entity.User.User;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "cart")
    private Reservation reservation;

    private LocalDateTime creationDate;

    @ManyToMany
    @JoinTable(
            name = "cart_products",
            joinColumns = @JoinColumn(name = "cart_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    private List<Product> productList;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private double total;
}
