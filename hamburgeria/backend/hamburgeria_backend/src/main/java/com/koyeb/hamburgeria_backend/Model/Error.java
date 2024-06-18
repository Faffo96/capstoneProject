package com.koyeb.hamburgeria_backend.Model;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class Error {
    private String message;
    private LocalDateTime errorDate;
    private HttpStatus errorState;
}
