package com.koyeb.hamburgeria_backend.Dto;

import com.koyeb.hamburgeria_backend.Enum.Role;

import java.time.LocalDate;

public record CustomerResponseDTO(String name, String surname, String email, String avatar, Role role, LocalDate creationDate) {
}

