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
        Error error = new Error();
        error.setMessage(message);
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        error.setStatusCode(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value());
        error.setErrorCode("UNSUPPORTED_MEDIA_TYPE");
        error.setDetails(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .contentType(MediaType.APPLICATION_JSON)
                .body(error);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> UserNotFoundHandler(UserNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("USER_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ShiftNotFoundException.class)
    public ResponseEntity<Object> ShiftNotFoundHandler(ShiftNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("SHIFT_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /*@ExceptionHandler(CustomizableBurgerNotFoundException.class)
    public ResponseEntity<Object> CustomizableBurgerNotFoundHandler(CustomizableBurgerNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("CUSTOMIZABLE_PRODUCT_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }*/

    @ExceptionHandler(CustomizableProductNotFoundException.class)
    public ResponseEntity<Object> CustomizableProductNotFoundHandler(CustomizableProductNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("CUSTOMIZABLE_PRODUCT_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Object> UnauthorizedHandler(UnauthorizedException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.UNAUTHORIZED);
        error.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        error.setErrorCode("UNAUTHORIZED");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<Object> ReservationNotFoundHandler(ReservationNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("RESERVATION_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmailAlreadyInUseException.class)
    public ResponseEntity<Object> EmailAlreadyInUseHandler(EmailAlreadyInUseException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_ACCEPTABLE);
        error.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
        error.setErrorCode("EMAIL_ALREADY_IN_USE");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(DiningTableNotFoundException.class)
    public ResponseEntity<Object> DiningTableNotFoundHandler(DiningTableNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("DINING_TABLE_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CartNotFoundException.class)
    public ResponseEntity<Object> CartNotFoundHandler(CartNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("CART_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Object> ProductNotFoundHandler(ProductNotFoundException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.NOT_FOUND);
        error.setStatusCode(HttpStatus.NOT_FOUND.value());
        error.setErrorCode("PRODUCT_NOT_FOUND");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OwnerAlreadyExistsException.class)
    public ResponseEntity<Object> OwnerAlreadyExistsHandler(OwnerAlreadyExistsException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.PRECONDITION_REQUIRED);
        error.setStatusCode(HttpStatus.PRECONDITION_REQUIRED.value());
        error.setErrorCode("OWNER_ALREADY_EXISTS");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.PRECONDITION_REQUIRED);
    }

    @ExceptionHandler(MinimumTotalException.class)
    public ResponseEntity<Object> MinimumTotalHandler(MinimumTotalException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.PRECONDITION_REQUIRED);
        error.setStatusCode(HttpStatus.PRECONDITION_REQUIRED.value());
        error.setErrorCode("MINIMUM_TOTAL_REQUIRED");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.PRECONDITION_REQUIRED);
    }

    @ExceptionHandler(MissingBearerException.class)
    public ResponseEntity<Object> MissingBearerException(MissingBearerException e) {
        loggerError.error(e.getMessage());
        Error error = new Error();
        error.setMessage(e.getMessage());
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.PRECONDITION_REQUIRED);
        error.setStatusCode(HttpStatus.PRECONDITION_REQUIRED.value());
        error.setErrorCode("BEARER_FORMAT_REQUIRED");
        error.setDetails(e.getLocalizedMessage());
        return new ResponseEntity<>(error, HttpStatus.PRECONDITION_REQUIRED);
    }
}
