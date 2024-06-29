package com.koyeb.hamburgeria_backend.Controller;

import com.koyeb.hamburgeria_backend.Dto.UserDTO;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    /*@GetMapping("/current")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getLoggedInUser();
        return ResponseEntity.ok(user);
    }*/

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) throws UserNotFoundException {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
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

    @PatchMapping("/{userEmail}")
    public String PATCHUserAvatar(@RequestPart MultipartFile avatar, @PathVariable String userEmail) throws IOException, UserNotFoundException {
        return userService.setUserAvatar(userEmail, avatar);
    }
}
