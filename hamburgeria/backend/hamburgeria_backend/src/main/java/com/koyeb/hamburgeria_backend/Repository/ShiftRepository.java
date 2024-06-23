package com.koyeb.hamburgeria_backend.Repository;

import com.koyeb.hamburgeria_backend.Entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Long> {

    @Query("SELECT s FROM Shift s JOIN s.employee e WHERE e.email = :email")
    List<Shift> findByEmployeeEmail(@Param("email") String employeeEmail);
}