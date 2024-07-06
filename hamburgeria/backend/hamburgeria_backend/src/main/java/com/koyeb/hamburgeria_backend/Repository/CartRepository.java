package com.koyeb.hamburgeria_backend.Repository;


import com.koyeb.hamburgeria_backend.Entity.Cart;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c WHERE c.user.email = :email")
    Page<Cart> findByUserEmail(String email, Pageable pageable);

    @Query("SELECT EXTRACT(MONTH FROM c.creationDate) as month, SUM(c.total) as total FROM Cart c WHERE EXTRACT(YEAR FROM c.creationDate) = :year GROUP BY EXTRACT(MONTH FROM c.creationDate) ORDER BY EXTRACT(MONTH FROM c.creationDate)")
    List<Object[]> findMonthlyRevenueByYear(int year);

    @Query("SELECT EXTRACT(DAY FROM c.creationDate) as day, SUM(c.total) as total FROM Cart c WHERE EXTRACT(YEAR FROM c.creationDate) = :year AND EXTRACT(MONTH FROM c.creationDate) = :month GROUP BY EXTRACT(DAY FROM c.creationDate) ORDER BY EXTRACT(DAY FROM c.creationDate)")
    List<Object[]> findDailyRevenueByYearAndMonth(int year, int month);
}
