package com.koyeb.hamburgeria_backend.Entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "owner")
public class Owner extends User {
}
