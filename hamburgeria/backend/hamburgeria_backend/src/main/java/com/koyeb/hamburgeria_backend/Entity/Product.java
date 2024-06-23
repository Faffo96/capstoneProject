package com.koyeb.hamburgeria_backend.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private List<Cart> cartList;

    private String italianName;
    private String englishName;
    private String italianDescription;
    private String englishDescription;
    private double price;

    @Enumerated(EnumType.STRING)
    private Category category;

    private boolean available;

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", italianName='" + italianName + '\'' +
                ", englishName='" + englishName + '\'' +
                ", italianDescription='" + italianDescription + '\'' +
                ", englishDescription='" + englishDescription + '\'' +
                ", price=" + price +
                ", category=" + category +
                ", available=" + available +
                '}';
    }
}
