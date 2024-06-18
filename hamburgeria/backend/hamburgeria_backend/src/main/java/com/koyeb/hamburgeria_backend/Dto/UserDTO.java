package com.koyeb.hamburgeria_backend.Dto;

import lombok.Data;

import javax.management.relation.Role;
import java.time.LocalDate;
import java.util.List;

@Data
public class UserDTO {
    private String name;
    private String surname;
    private String email;
    private String avatar;
    private Role role;
    private LocalDate creationDate;
}
