package com.koyeb.hamburgeria_backend.Service;

import com.cloudinary.Cloudinary;
import com.koyeb.hamburgeria_backend.Dto.UserDTO;
import com.koyeb.hamburgeria_backend.Entity.User.User;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.EmployeeRepository;
import com.koyeb.hamburgeria_backend.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Cloudinary cloudinary;

    private static final Logger loggerWarn = LoggerFactory.getLogger("loggerWarn");
    private static final Logger loggerTrace = LoggerFactory.getLogger("loggerTrace");
    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");


    public User getLoggedInUser() throws UsernameNotFoundException {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new UsernameNotFoundException("User with email " + email + " not found.");
        }
    }

    public User getUserByEmail(String email) throws UserNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    public Page<User> getUsers(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<User> users = userRepository.findAll(pageable);
        loggerInfo.info("Retrieved users page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return users;
    }

    public User updateUser(String email, UserDTO userDTO) throws UserNotFoundException {
        User user = getUserByEmail(email);
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        userRepository.save(user);
        loggerInfo.info("User with email " + user.getEmail() + " updated.");
        return user;
    }

    public String deleteUser(String email) throws UserNotFoundException {
        User user = getUserByEmail(email);
        userRepository.delete(user);
        loggerInfo.info("User with email " + email + " deleted successfully.");
        return "User with email " + email + " deleted successfully.";
    }

    private void sendRegistrationMail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Rest Service Registration");
        message.setText("Congratulations, " + user.getName() + " " + user.getSurname() + "! Successful registration to this rest service");

        javaMailSender.send(message);
    }

    public String setUserAvatar(String userEmail, MultipartFile photo) throws IOException, UserNotFoundException {
        User user = getUserByEmail(userEmail);

        if (user != null) {
            String url = (String) cloudinary.uploader().upload(photo.getBytes(), Collections.emptyMap()).get("url");

            user.setAvatar(url);
            userRepository.save(user);
            loggerTrace.trace("User with email=" + userEmail + " updated successfully with the sent photo.");
            return "User with email=" + userEmail + " updated successfully with the sent photo.";
        } else {
            loggerError.error("User email: " + userEmail + " not found.");
            return "User with email=" + userEmail + " not found.";
        }
    }
}
