package com.koyeb.hamburgeria_backend.Security;

import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import com.koyeb.hamburgeria_backend.Service.UserService;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private UserService userService;

    @Override //metodo per verificare che nella richiesta ci sia il token, altrimenti non si è autorizzati
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Error in authorization, token missing!");
        }

        String token = authHeader.substring(7);

        jwtTool.verifyToken(token);

        String userEmail = jwtTool.getEmailFromToken(token);

        User user = null;
        try {
            user = userService.getUserByEmail(userEmail);
        } catch (UserNotFoundException e) {
            logger.error("User with email=" + userEmail + " not found");
            System.out.println("User with email=" + userEmail + " not found");
        }

        if (user != null) {
            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else{
            logger.error("User with email=" + userEmail + " not found");
            System.out.println("User with email=" + userEmail + " not found");
        }
        filterChain.doFilter(request, response);
    }

    @Override //permette di non effettuare l'autenticazione per usare i servizi di autenticazione
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return new AntPathMatcher().match("/auth/**", request.getServletPath());
    }
}
