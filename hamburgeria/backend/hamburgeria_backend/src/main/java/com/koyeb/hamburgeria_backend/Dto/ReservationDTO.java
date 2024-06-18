package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationDTO {
    private LocalDateTime creationDate;
    private LocalDateTime bookedDate;
    private DiningTableDTO diningTable;
    private UserDTO user;
    private int participants;
    private CartDTO cart;
}
