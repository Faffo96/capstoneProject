package com.koyeb.hamburgeria_backend.Service;

import com.cloudinary.Cloudinary;
import com.koyeb.hamburgeria_backend.Dto.OwnerDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Enum.Role;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Exception.OwnerAlreadyExistsException;
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
import java.util.List;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private Owner owner;  // Iniettato come singleton

    private static final Logger loggerWarn = LoggerFactory.getLogger("loggerWarn");
    private static final Logger loggerTrace = LoggerFactory.getLogger("loggerTrace");
    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");

    public String createOwner() throws OwnerAlreadyExistsException, UserNotFoundException {
        if (ownerRepository.findByEmail(owner.getEmail()).isPresent()) {
            throw new OwnerAlreadyExistsException("Owner already exists!");
        }
        /*if (userService.getUserByEmail(owner.getEmail()) != null) {
            throw new EmailAlreadyInUseException("Email " + owner.getEmail() + " already in use.");
        }*/

            Owner ownerToSave = new Owner();
            ownerToSave.setName(owner.getName());
            ownerToSave.setSurname(owner.getSurname());
            ownerToSave.setEmail(owner.getEmail());
            ownerToSave.setPassword(passwordEncoder.encode(owner.getPassword()));
            ownerToSave.setAvatar(owner.getAvatar());
            ownerToSave.setRole(Role.valueOf(Role.OWNER.name()));
            ownerToSave.setCreationDate(owner.getCreationDate());

            ownerRepository.save(ownerToSave);
            loggerTrace.trace("Registration email sent to owner: " + ownerToSave.getEmail());
            sendRegistrationMail(ownerToSave);
            loggerTrace.trace("Owner with email " + ownerToSave.getEmail() + " saved.");
            return "Owner with email " + ownerToSave.getEmail() + " saved.";

    }



    public void instantiateOwner() throws EmailAlreadyInUseException, OwnerAlreadyExistsException {
        try{
            if (ownerRepository.findAll().isEmpty()) {
                this.createOwner();
            } else {
                throw new OwnerAlreadyExistsException("Owner already exist.");
            }
        } catch (UserNotFoundException e) {
        }
    }

    public Owner getOwnerByEmail(String email) throws UserNotFoundException {
        return ownerRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Owner not found with email: " + email));
    }

    public boolean existsOwner() {
        List<Owner> owners = ownerRepository.findAll();
        return !owners.isEmpty();
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

    public String setOwnerAvatar(String ownerEmail, MultipartFile photo) throws IOException, UserNotFoundException {
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
