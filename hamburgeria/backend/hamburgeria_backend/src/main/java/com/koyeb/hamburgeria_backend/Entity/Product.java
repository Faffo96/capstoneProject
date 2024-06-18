package com.koyeb.hamburgeria_backend.Entity;
import com.koyeb.hamburgeria_backend.Enum.Category;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(mappedBy = "productList")
    private List<Cart> cartList;

    private String name;
    private String description;
    private double price;

    @Enumerated(EnumType.STRING)
    private Category category;

    private boolean available;
}
