package com.koyeb.hamburgeria_backend.Repository;


import com.koyeb.hamburgeria_backend.Entity.CustomizableProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomizableProductRepository extends JpaRepository<CustomizableProduct, Long> {

}