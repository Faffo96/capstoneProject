package com.koyeb.hamburgeria_backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import jakarta.persistence.*;
import jakarta.persistence.Table;
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

    @Override
    public String toString() {
        return "Cart{" +
                "id=" + id +
                ", creationDate=" + creationDate +
                ", productList=" + productList +
                ", user=" + user +
                ", total=" + total +
                '}';
    }

    public void setProductList(List<Product> newProductList) {

        List<Product> productList = getProductList();
        /*List<Product> productsToAdd = new ArrayList<>();
        List<Product> productsToRemove = new ArrayList<>();*/

        if (productList != null) {
            if (newProductList.size() > productList.size()) {
                List<Product> productsToAdd = newProductList.stream()
                        .filter(product -> !productList.contains(product))
                        .toList();
                setTotal(getTotal() + productsToAdd.stream().mapToDouble(Product::getPrice).sum());
            } else if (newProductList.size() < productList.size()) {
                List<Product> productsToRemove = productList.stream()
                        .filter(product -> !newProductList.contains(product))
                        .toList();
                setTotal(getTotal() - productsToRemove.stream().mapToDouble(Product::getPrice).sum());
            }
            this.productList = newProductList;
        } else {
            this.productList = newProductList;
            setTotal(newProductList.stream().mapToDouble(Product::getPrice).sum());
        }
        }


    }


