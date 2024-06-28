package com.koyeb.hamburgeria_backend.Repository;

import com.koyeb.hamburgeria_backend.Entity.CustomizableBurger;
import com.koyeb.hamburgeria_backend.Entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BurgerRepository extends JpaRepository<CustomizableBurger, Long> {

}
