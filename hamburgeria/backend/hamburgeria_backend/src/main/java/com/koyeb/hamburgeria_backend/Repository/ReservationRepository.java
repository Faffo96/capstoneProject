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

    @Query("SELECT TO_CHAR(r.creationDate, 'YYYY-MM') AS month, COUNT(r.id) AS total FROM Reservation r WHERE EXTRACT(YEAR FROM r.creationDate) = :year GROUP BY TO_CHAR(r.creationDate, 'YYYY-MM') ORDER BY month")
    List<Object[]> findMonthlyReservationCountByYear(int year);

    @Query("SELECT TO_CHAR(r.creationDate, 'YYYY-MM-DD') AS day, COUNT(r.id) AS total FROM Reservation r WHERE EXTRACT(YEAR FROM r.creationDate) = :year AND EXTRACT(MONTH FROM r.creationDate) = :month GROUP BY TO_CHAR(r.creationDate, 'YYYY-MM-DD') ORDER BY day")
    List<Object[]> findDailyReservationCountByYearAndMonth(int year, int month);

    @Query("SELECT TO_CHAR(r.creationDate, 'YYYY-MM-DD HH24') AS hour, COUNT(r.id) AS total FROM Reservation r WHERE EXTRACT(YEAR FROM r.creationDate) = :year AND EXTRACT(MONTH FROM r.creationDate) = :month AND EXTRACT(DAY FROM r.creationDate) = :day GROUP BY TO_CHAR(r.creationDate, 'YYYY-MM-DD HH24') ORDER BY hour")
    List<Object[]> findHourlyReservationCountByYearMonthAndDay(int year, int month, int day);

}