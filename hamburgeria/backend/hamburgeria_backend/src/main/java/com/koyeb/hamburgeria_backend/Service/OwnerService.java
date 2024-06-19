package com.koyeb.hamburgeria_backend.Service;

import com.cloudinary.Cloudinary;
import com.koyeb.hamburgeria_backend.Dto.OwnerDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Enum.Role;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.OwnerRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;

@Service
public class OwnerService {
    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Cloudinary cloudinary;

    private static final Logger loggerWarn = LoggerFactory.getLogger("loggerWarn");
    private static final Logger loggerTrace = LoggerFactory.getLogger("loggerTrace");
    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");

    public String createOwner(OwnerDTO ownerDTO) throws EmailAlreadyInUseException {
        try {
            getOwnerByEmail(ownerDTO.getEmail());
            throw new EmailAlreadyInUseException("Email " + ownerDTO.getEmail() + " already in use.");
        } catch (UserNotFoundException e) {
            Owner owner = new Owner();
            owner.setName(ownerDTO.getName());
            owner.setSurname(ownerDTO.getSurname());
            owner.setEmail(ownerDTO.getEmail());
            owner.setPassword(passwordEncoder.encode(ownerDTO.getPassword()));
            owner.setAvatar(ownerDTO.getAvatar());
            owner.setRole(Role.valueOf(Role.OWNER.name()));
            owner.setCreationDate(ownerDTO.getCreationDate());

            ownerRepository.save(owner);
            loggerTrace.trace("Registration email sent to owner: " + owner.getEmail());
            sendRegistrationMail(owner);
            loggerTrace.trace("Owner with email " + owner.getEmail() + " saved.");
            return "Owner with email " + owner.getEmail() + " saved.";
        }
    }

    public Owner getOwnerByEmail(String email) {
        return ownerRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Owner not found with email: " + email));
    }

    public Page<Owner> getOwners(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<Owner> owners = ownerRepository.findAll(pageable);
        loggerInfo.info("Retrieved owners page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return owners;
    }

    public Owner updateOwner(String email, OwnerDTO ownerDTO) throws UserNotFoundException {
        Owner owner = getOwnerByEmail(email);
        String ownerEmail = owner.getEmail();
        owner.setName(ownerDTO.getName());
        owner.setSurname(ownerDTO.getSurname());
        owner.setEmail(ownerDTO.getEmail());
        owner.setPassword(passwordEncoder.encode(ownerDTO.getPassword()));
        owner.setAvatar(ownerDTO.getAvatar());
        owner.setRole(Role.valueOf(Role.OWNER.name()));
        owner.setCreationDate(ownerDTO.getCreationDate());
        ownerRepository.save(owner);
        loggerInfo.info("Owner with email " + ownerEmail + " updated.");
        return owner;
    }

    public String deleteOwner(String email) throws UserNotFoundException {
        Owner owner = getOwnerByEmail(email);
        ownerRepository.delete(owner);
        loggerInfo.info("Owner with email " + email + " deleted successfully.");
        return "Owner with email " + email + " deleted successfully.";
    }

    private void sendRegistrationMail(Owner owner) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(owner.getEmail());
        message.setSubject("Owner Service Registration");
        message.setText("Congratulations, " + owner.getName() + " " + owner.getSurname() + "! Successful registration to this owner service");

        javaMailSender.send(message);
        loggerInfo.info("Registration email sent to owner: " + owner.getEmail());
    }

    public String setOwnerAvatar(String ownerEmail, MultipartFile photo) throws IOException {
        Owner owner = getOwnerByEmail(ownerEmail);

        if (owner != null) {
            String url = (String) cloudinary.uploader().upload(photo.getBytes(), Collections.emptyMap()).get("url");

            owner.setAvatar(url);
            ownerRepository.save(owner);
            loggerTrace.trace("Owner with email=" + ownerEmail + " updated successfully with the sent photo.");
            return "Owner with email=" + ownerEmail + " updated successfully with the sent photo.";
        } else {
            loggerError.error("Owner email: " + ownerEmail + " not found.");
            return "Owner with email=" + ownerEmail + " not found.";
        }
    }
}
