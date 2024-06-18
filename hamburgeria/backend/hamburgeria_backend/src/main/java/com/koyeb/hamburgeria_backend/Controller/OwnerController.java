package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.OwnerDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {
    @Autowired
    private OwnerService ownerService;

    /*@GetMapping("/current")
    public ResponseEntity<Owner> getCurrentOwner() {
        Owner owner = ownerService.getLoggedInOwner();
        return ResponseEntity.ok(owner);
    }*/

    @GetMapping("/{email}")
    public ResponseEntity<Owner> getOwnerByEmail(@PathVariable String email) {
        Owner owner = ownerService.getOwnerByEmail(email);
        return ResponseEntity.ok(owner);
    }

    @GetMapping
    public ResponseEntity<Page<Owner>> getAllOwners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "email") String sortBy
    ) {
        Page<Owner> owner = ownerService.getOwners(page, sortBy);
        return ResponseEntity.ok(owner);
    }

    @PutMapping("/{email}")
    public ResponseEntity<Owner> updateOwner(
            @PathVariable String email,
            @RequestBody OwnerDTO ownerDTO
    ) {
        Owner updatedOwner = ownerService.updateOwner(email, ownerDTO);
        return ResponseEntity.ok(updatedOwner);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteOwner(@PathVariable String email) {
        String message = ownerService.deleteOwner(email);
        return ResponseEntity.ok(message);
    }
}
