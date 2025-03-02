package com.koyeb.hamburgeria_backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.koyeb.hamburgeria_backend.Entity.User.User;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "cart")
    @JsonIgnore
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
    private boolean paid;
    private boolean delivery;
    private double deliveryFee;

    @Override
    public String toString() {
        return "Cart{" +
                "id=" + id +
                ", creationDate=" + creationDate +
                ", productList=" + productList +
                ", user=" + user +
                ", total=" + total +
                ", paid=" + paid +
                ", delivery=" + delivery +
                ", deliveryFee=" + deliveryFee +
                '}';
    }

    public void setProductList(List<Product> newProductList) {
        if (this.productList == null) {
            this.productList = new ArrayList<>();
        }

        double currentTotal = this.productList.stream().mapToDouble(Product::getPrice).sum();

        if (newProductList.size() > this.productList.size()) {
            List<Product> productsToAdd = newProductList.stream()
                    .filter(product -> !this.productList.contains(product))
                    .collect(Collectors.toList());
            currentTotal += productsToAdd.stream().mapToDouble(Product::getPrice).sum();
        } else if (newProductList.size() < this.productList.size()) {
            List<Product> productsToRemove = this.productList.stream()
                    .filter(product -> !newProductList.contains(product))
                    .collect(Collectors.toList());
            currentTotal -= productsToRemove.stream().mapToDouble(Product::getPrice).sum();
        }

        this.productList = newProductList;
        this.total = currentTotal + (this.delivery ? this.deliveryFee : 0);
    }
}
