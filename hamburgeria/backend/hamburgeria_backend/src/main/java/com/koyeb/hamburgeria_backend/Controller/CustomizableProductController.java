package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.CustomizableProductDTO;
import com.koyeb.hamburgeria_backend.Entity.CustomizableProduct;
import com.koyeb.hamburgeria_backend.Exception.CustomizableProductNotFoundException;
import com.koyeb.hamburgeria_backend.Service.CustomizableProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customizableProducts")
public class CustomizableProductController {

    @Autowired
    private CustomizableProductService customizableProductService;

    @GetMapping
    public List<CustomizableProduct> getAllCustomizableProducts() {
        return customizableProductService.getCustomizableProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomizableProduct> getCustomizableProductById(@PathVariable Long id) throws CustomizableProductNotFoundException {
        try {
            CustomizableProduct customizableProduct = customizableProductService.getCustomizableProductById(id);
            return ResponseEntity.ok(customizableProduct);
        } catch (CustomizableProductNotFoundException e) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
    }

    @PostMapping
    public ResponseEntity<CustomizableProduct> createCustomizableProduct(@RequestBody CustomizableProductDTO customizableProductDTO) {
        CustomizableProduct createdCustomizableProduct = customizableProductService.createProduct(customizableProductDTO);
        return ResponseEntity.ok(createdCustomizableProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomizableProduct> updateCustomizableProduct(@PathVariable Long id, @RequestBody CustomizableProductDTO customizableProductDTO) {
        try {
            CustomizableProduct updatedCustomizableProduct = customizableProductService.updateCustomizableProduct(id, customizableProductDTO);
            return ResponseEntity.ok(updatedCustomizableProduct);
        } catch (CustomizableProductNotFoundException e) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomizableProduct(@PathVariable Long id) {
        try {
            String result = customizableProductService.deleteCustomizableProduct(id);
            return ResponseEntity.ok(result);
        } catch (CustomizableProductNotFoundException e) {
            return ResponseEntity.status(404).body("CustomizableProduct not found with id: " + id);
        }
    }
}