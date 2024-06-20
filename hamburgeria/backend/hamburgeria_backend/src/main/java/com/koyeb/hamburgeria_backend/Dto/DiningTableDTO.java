package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;
import java.util.List;

@Data
public class DiningTableDTO {
    private Long id;
    private int tableNumber;
    private int seating;
    private boolean outside;
}

