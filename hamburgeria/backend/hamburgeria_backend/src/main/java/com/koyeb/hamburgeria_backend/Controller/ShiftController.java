package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.ShiftDTO;
import com.koyeb.hamburgeria_backend.Entity.Shift;
import com.koyeb.hamburgeria_backend.Exception.ShiftNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @RestController
    @RequestMapping("/api/shifts")
    public class ShiftController {

        @Autowired
        private ShiftService shiftService;

        /*@PostMapping
        public ResponseEntity<Shift> createShift(@RequestBody ShiftDTO shiftDTO) {
            Shift createdShift = shiftService.createShift(shiftDTO);
            return ResponseEntity.ok(createdShift);
        }*/

        @GetMapping("/{id}")
        public ResponseEntity<Shift> getShiftById(@PathVariable Long id) {
            Shift shift = shiftService.getShiftById(id);
            return ResponseEntity.ok(shift);
        }

        @GetMapping("/employee")
        public ResponseEntity<List<Shift>> getShiftsByEmployeeEmail(@RequestParam String email) {
            List<Shift> shifts = shiftService.getShiftsByEmployeeEmail(email);
            return ResponseEntity.ok(shifts);
        }

        @GetMapping
        public ResponseEntity<Page<Shift>> getAllShifts(@RequestParam int page, @RequestParam int size, @RequestParam String sortBy) {
            Page<Shift> shifts = shiftService.getAllShifts(page, size, sortBy);
            return ResponseEntity.ok(shifts);
        }

        /*@PutMapping("/{id}")
        public ResponseEntity<Shift> updateShift(@PathVariable Long id, @RequestBody ShiftDTO shiftDTO) {
            try {
                Shift updatedShift = shiftService.updateShift(id, shiftDTO);
                return ResponseEntity.ok(updatedShift);
            } catch (ShiftNotFoundException | UnauthorizedException e) {
                return ResponseEntity.status(403).body(null); // Forbidden or not found
            }
        }*/

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteShift(@PathVariable Long id) {
            try {
                String result = shiftService.deleteShift(id);
                return ResponseEntity.ok(result);
            } catch (ShiftNotFoundException e) {
                return ResponseEntity.status(404).body("Shift not found with id: " + id);
            }
        }
    }
