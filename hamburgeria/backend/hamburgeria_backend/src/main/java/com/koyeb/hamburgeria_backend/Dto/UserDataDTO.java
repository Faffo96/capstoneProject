package com.koyeb.hamburgeria_backend.Dto;

import com.koyeb.hamburgeria_backend.Enum.Role;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDataDTO {
    private String name;
    private String surname;
    private String email;
    private String avatar;
    private Role role;
    private LocalDate creationDate;
}
