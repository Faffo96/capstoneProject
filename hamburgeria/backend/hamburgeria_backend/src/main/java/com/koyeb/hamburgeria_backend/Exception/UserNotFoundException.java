package com.koyeb.hamburgeria_backend.Exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message) {
        super(message);
    }
}
