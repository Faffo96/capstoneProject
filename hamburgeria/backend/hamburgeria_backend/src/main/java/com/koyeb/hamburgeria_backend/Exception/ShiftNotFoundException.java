package com.koyeb.hamburgeria_backend.Exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ShiftNotFoundException extends Exception {
    public ShiftNotFoundException(String message) {
        super(message);
    }
}
