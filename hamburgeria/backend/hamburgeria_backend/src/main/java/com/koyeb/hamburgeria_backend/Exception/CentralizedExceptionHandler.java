package com.koyeb.hamburgeria_backend.Exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import com.koyeb.hamburgeria_backend.Model.Error;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class CentralizedExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String message = "Content-Type '" + ex.getContentType() + "' not supported. Supported content types: " +
                ex.getSupportedMediaTypes().stream()
                        .map(MediaType::toString)
                        .collect(Collectors.joining(", "));
        loggerError.error(message);
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .contentType(MediaType.APPLICATION_JSON)
                .body(message);
    }


    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> UserNotFoundHandler(UserNotFoundException e) {
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setErrorDate(LocalDateTime.now());
        error.setErrorState(HttpStatus.NOT_FOUND);
        loggerError.error(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ShiftNotFoundException.class)
    public ResponseEntity<Object> ShiftNotFoundHandler(ShiftNotFoundException e) {
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setErrorDate(LocalDateTime.now());
        error.setErrorState(HttpStatus.NOT_FOUND);
        loggerError.error(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Object> UnauthorizedHandler(UnauthorizedException e) {
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setErrorDate(LocalDateTime.now());
        error.setErrorState(HttpStatus.UNAUTHORIZED);
        loggerError.error(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    /*@ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> badRequestHandler(BadRequestException e) {
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setErrorDate(LocalDateTime.now());
        error.setErrorState(HttpStatus.BAD_REQUEST);
        loggerError.error(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }*/

    @ExceptionHandler(EmailAlreadyInUseException.class)
    public ResponseEntity<Object> EmailAlreadyInUseException(EmailAlreadyInUseException e) {
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setErrorDate(LocalDateTime.now());
        error.setErrorState(HttpStatus.BAD_REQUEST);
        loggerError.error(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /*@ExceptionHandler(PartecipantsLimitException.class)
    public ResponseEntity<Object> PartecipantsLimitException(PartecipantsLimitException e) {
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setErrorDate(LocalDateTime.now());
        error.setErrorState(HttpStatus.BAD_REQUEST);
        loggerError.error(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }*/
}