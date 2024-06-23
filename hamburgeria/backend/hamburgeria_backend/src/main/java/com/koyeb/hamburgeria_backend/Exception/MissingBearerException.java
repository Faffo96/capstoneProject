package com.koyeb.hamburgeria_backend.Exception;

public class MissingBearerException extends RuntimeException {
    public MissingBearerException(String message) {
        super(message);
    }
}
