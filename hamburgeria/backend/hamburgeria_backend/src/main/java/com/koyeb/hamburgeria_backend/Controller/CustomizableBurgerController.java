package com.koyeb.hamburgeria_backend.Controller;
import com.koyeb.hamburgeria_backend.Dto.CustomizableBurgerDTO;
import com.koyeb.hamburgeria_backend.Dto.CustomizableBurgerDTO;
import com.koyeb.hamburgeria_backend.Entity.CustomizableBurger;
import com.koyeb.hamburgeria_backend.Entity.CustomizableBurger;
import com.koyeb.hamburgeria_backend.Exception.CustomizableBurgerNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.CustomizableBurgerNotFoundException;
import com.koyeb.hamburgeria_backend.Service.CustomizableBurgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customizable-burgers")
public class CustomizableBurgerController {

    @Autowired
    private CustomizableBurgerService customizableBurgerService;

    @GetMapping
    public List<CustomizableBurger> getAllCustomizableBurgers() {
        return customizableBurgerService.getCustomizableBurgers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomizableBurger> getCustomizableBurgerById(@PathVariable Long id) throws CustomizableBurgerNotFoundException {
        try {
            CustomizableBurger customizableBurger = customizableBurgerService.getCustomizableBurgerById(id);
            return ResponseEntity.ok(customizableBurger);
        } catch (CustomizableBurgerNotFoundException e) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
    }

    @PostMapping
    public ResponseEntity<CustomizableBurger> createCustomizableBurger(@RequestBody CustomizableBurgerDTO customizableBurgerDTO) {
        CustomizableBurger createdCustomizableBurger = customizableBurgerService.createBurger(customizableBurgerDTO);
        return ResponseEntity.ok(createdCustomizableBurger);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomizableBurger> updateCustomizableBurger(@PathVariable Long id, @RequestBody CustomizableBurgerDTO customizableBurgerDTO) {
        try {
            CustomizableBurger updatedCustomizableBurger = customizableBurgerService.updateCustomizableBurger(id, customizableBurgerDTO);
            return ResponseEntity.ok(updatedCustomizableBurger);
        } catch (CustomizableBurgerNotFoundException e) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomizableBurger(@PathVariable Long id) {
        try {
            String result = customizableBurgerService.deleteCustomizableBurger(id);
            return ResponseEntity.ok(result);
        } catch (CustomizableBurgerNotFoundException e) {
            return ResponseEntity.status(404).body("CustomizableBurger not found with id: " + id);
        }
    }
}
