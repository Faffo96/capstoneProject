package com.koyeb.hamburgeria_backend.Dto;

import com.koyeb.hamburgeria_backend.Enum.Category;
import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String italianName;
    private String englishName;
    private String italianDescription;
    private String englishDescription;
    private double price;
    private Category category;
    private boolean available;
}

