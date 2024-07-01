package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.UserDTO;
import com.koyeb.hamburgeria_backend.Entity.Reservation;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Service.ReservationService;
import com.koyeb.hamburgeria_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/user")
    public ResponseEntity<Page<Reservation>> getReservationsByUserEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        try {
            Page<Reservation> reservations = reservationService.getReservationsByUserEmail(email, page, sortBy);
            return ResponseEntity.ok(reservations);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // Unauthorized
        }
    }


    @GetMapping
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "email") String sortBy
    ) {
        Page<User> users = userService.getUsers(page, sortBy);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{email}")
    public ResponseEntity<User> updateUser(
            @PathVariable String email,
            @RequestBody UserDTO userDTO
    ) throws UserNotFoundException {
        User updatedUser = userService.updateUser(email, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) throws UserNotFoundException {
        String message = userService.deleteUser(email);
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/{userEmail}/avatar")
    public ResponseEntity<String> patchUserAvatar(@RequestPart MultipartFile avatar, @PathVariable String userEmail) throws IOException, UserNotFoundException {
        String message = userService.setUserAvatar(userEmail, avatar);
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/{email}/email")
    public ResponseEntity<User> patchUserEmail(
            @PathVariable String email,
            @RequestBody Map<String, String> payload
    ) throws UserNotFoundException {
        String newEmail = payload.get("newEmail");
        User updatedUser = userService.patchUserEmail(email, newEmail);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{email}/password")
    public ResponseEntity<User> patchUserPassword(
            @PathVariable String email,
            @RequestBody Map<String, String> payload
    ) throws UserNotFoundException {
        String newPassword = payload.get("newPassword");
        User updatedUser = userService.patchUserPassword(email, newPassword);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{email}/name")
    public ResponseEntity<User> patchUserName(
            @PathVariable String email,
            @RequestBody Map<String, String> payload
    ) throws UserNotFoundException {
        String newName = payload.get("newName");
        User updatedUser = userService.patchUserName(email, newName);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{email}/surname")
    public ResponseEntity<User> patchUserSurname(
            @PathVariable String email,
            @RequestBody Map<String, String> payload
    ) throws UserNotFoundException {
        String newSurname = payload.get("newSurname");
        User updatedUser = userService.patchUserSurname(email, newSurname);
        return ResponseEntity.ok(updatedUser);
    }
}