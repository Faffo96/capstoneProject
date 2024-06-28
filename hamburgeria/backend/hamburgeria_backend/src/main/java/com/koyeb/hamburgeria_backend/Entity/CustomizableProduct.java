package com.koyeb.hamburgeria_backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@DiscriminatorValue("CustomizableProduct")
public class CustomizableProduct extends Product {
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "customizable_products",
            joinColumns = @JoinColumn(name = "customizable_product_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> productList = new ArrayList<>();
}

