package com.koyeb.hamburgeria_backend.Entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "customers")
public class Customer extends User {
}
