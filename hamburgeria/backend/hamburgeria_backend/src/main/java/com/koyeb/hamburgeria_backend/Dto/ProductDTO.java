package com.koyeb.hamburgeria_backend.Dto;

import com.koyeb.hamburgeria_backend.Enum.Category;
import lombok.Data;

@Data
public class ProductDTO {
    private String name;
    private String description;
    private double price;
    private Category category;
    private boolean available;
}

