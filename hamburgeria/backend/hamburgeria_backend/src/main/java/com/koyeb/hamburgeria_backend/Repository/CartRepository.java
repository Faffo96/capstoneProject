package com.koyeb.hamburgeria_backend.Repository;


import com.koyeb.hamburgeria_backend.Entity.Cart;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c WHERE c.user.email = :email")
    Page<Cart> findByUserEmail(String email, Pageable pageable);
}
