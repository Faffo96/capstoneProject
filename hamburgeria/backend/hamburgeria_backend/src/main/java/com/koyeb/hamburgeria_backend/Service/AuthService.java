package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.UserLoginDTO;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public String authenticateUserAndCreateToken(UserLoginDTO userLoginDTO) throws UnauthorizedException, UserNotFoundException {
        User user = userService.getUserByEmail(userLoginDTO.getEmail());
        if (user != null) {
            // Logging per debug
            System.out.println("User found: " + user.getEmail());
            System.out.println("Password from DTO: " + userLoginDTO.getPassword());
            System.out.println("Encoded Password from User: " + user.getPassword());

            if (passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
                return jwtTool.createToken(user);
            } else {
                throw new UnauthorizedException("Error in authorization, relogin!");
            }
        } else {
            throw new UserNotFoundException("User with email " + userLoginDTO.getEmail() + " not found.");
        }
    }

}