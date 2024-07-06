package com.koyeb.hamburgeria_backend.Repository;

import com.koyeb.hamburgeria_backend.Entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.user.email = :email")
    Page<Reservation> findByUserEmail(String email, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.user.email = :email AND r.bookedDate BETWEEN :startDate AND :endDate")
    Page<Reservation> findByUserEmailAndDateRange(@Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

    @Query("SELECT EXTRACT(MONTH FROM r.creationDate) as month, COUNT(r.id) as total FROM Reservation r WHERE EXTRACT(YEAR FROM r.creationDate) = :year GROUP BY EXTRACT(MONTH FROM r.creationDate) ORDER BY EXTRACT(MONTH FROM r.creationDate)")
    List<Object[]> findMonthlyReservationCountByYear(int year);

    @Query("SELECT EXTRACT(DAY FROM r.creationDate) as day, COUNT(r.id) as total FROM Reservation r WHERE EXTRACT(YEAR FROM r.creationDate) = :year AND EXTRACT(MONTH FROM r.creationDate) = :month GROUP BY EXTRACT(DAY FROM r.creationDate) ORDER BY EXTRACT(DAY FROM r.creationDate)")
    List<Object[]> findDailyReservationCountByYearAndMonth(int year, int month);

    @Query("SELECT EXTRACT(HOUR FROM r.creationDate) as hour, COUNT(r.id) as total FROM Reservation r WHERE EXTRACT(YEAR FROM r.creationDate) = :year AND EXTRACT(MONTH FROM r.creationDate) = :month AND EXTRACT(DAY FROM r.creationDate) = :day GROUP BY EXTRACT(HOUR FROM r.creationDate) ORDER BY EXTRACT(HOUR FROM r.creationDate)")
    List<Object[]> findHourlyReservationCountByYearMonthAndDay(int year, int month, int day);
}