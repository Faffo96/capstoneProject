package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartDTO {
    private Long id;
    private ReservationDTO reservation;
    private LocalDateTime creationDate;
    private List<ProductDTO> productList;
    private UserDTO user;
    private double total;
    private boolean paid;
    private boolean delivery;
    private double deliveryFee;
}

