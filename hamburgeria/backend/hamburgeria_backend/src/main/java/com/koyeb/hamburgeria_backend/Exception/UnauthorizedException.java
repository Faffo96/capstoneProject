package com.koyeb.hamburgeria_backend.Exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}

