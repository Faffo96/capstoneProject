package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.DiningTableDTO;
import com.koyeb.hamburgeria_backend.Entity.DiningTable;
import com.koyeb.hamburgeria_backend.Exception.DiningTableNotFoundException;
import com.koyeb.hamburgeria_backend.Service.DiningTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diningTables")
public class DiningTableController {

    @Autowired
    private DiningTableService diningTableService;

    @PostMapping
    public ResponseEntity<DiningTable> createDiningTable(@RequestBody DiningTableDTO diningTableDTO) {
        DiningTable createdDiningTable = diningTableService.createDiningTable(diningTableDTO);
        return ResponseEntity.ok(createdDiningTable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiningTable> getDiningTableById(@PathVariable Long id) {
        try {
            DiningTable diningTable = diningTableService.getDiningTableById(id);
            return ResponseEntity.ok(diningTable);
        } catch (DiningTableNotFoundException e) {
            return ResponseEntity.status(404).body(null); // Not found
        }
    }

    @GetMapping
    public ResponseEntity<Page<DiningTable>> getAllDiningTables(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        Page<DiningTable> diningTables = diningTableService.getAllDiningTables(page, sortBy);
        return ResponseEntity.ok(diningTables);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiningTable> updateDiningTable(@PathVariable Long id, @RequestBody DiningTableDTO diningTableDTO) {
        try {
            DiningTable updatedDiningTable = diningTableService.updateDiningTable(id, diningTableDTO);
            return ResponseEntity.ok(updatedDiningTable);
        } catch (DiningTableNotFoundException e) {
            return ResponseEntity.status(404).body(null); // Not found
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDiningTable(@PathVariable Long id) {
        try {
            String result = diningTableService.deleteDiningTable(id);
            return ResponseEntity.ok(result);
        } catch (DiningTableNotFoundException e) {
            return ResponseEntity.status(404).body("DiningTable not found with id: " + id);
        }
    }
}
