package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;

@Data
public class OwnerDTO extends UserDTO {
    @Override
    public String toString() {
        return "OwnerDTO{" +
                super.toString() +
                '}';
    }
}
