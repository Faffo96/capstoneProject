package com.koyeb.hamburgeria_backend.Dto;

import com.koyeb.hamburgeria_backend.Entity.Product;
import com.koyeb.hamburgeria_backend.Enum.Category;
import lombok.Data;

import java.util.List;

@Data
public class CustomizableBurgerDTO {
    private Long id;
    private String italianName;
    private String englishName;
    private String italianDescription;
    private String englishDescription;
    private double price;
    private Category category;
    private boolean available;
    private List<Long> productList; // Lista di ID di prodotto
}
