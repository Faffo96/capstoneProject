package com.koyeb.hamburgeria_backend.Repository;

import com.koyeb.hamburgeria_backend.Entity.CustomizableBurger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomizableBurgerRepository extends JpaRepository<CustomizableBurger, Long> {

}
