package com.koyeb.hamburgeria_backend.AppConfig;

import com.cloudinary.Cloudinary;
import com.koyeb.hamburgeria_backend.Dto.OwnerDTO;
import com.koyeb.hamburgeria_backend.Entity.User.Owner;
import com.koyeb.hamburgeria_backend.Exception.EmailAlreadyInUseException;
import com.koyeb.hamburgeria_backend.Service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
@PropertySource("classpath:application.properties")
public class AppConfig {
    /*@Bean
    @Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
    public OwnerDTO ownerDTO() throws EmailAlreadyInUseException {
        OwnerDTO ownerDTO = new OwnerDTO();
        ownerDTO.setEmail(System.getenv("OWNER_EMAIL"));
        ownerDTO.setName(System.getenv("OWNER_NAME"));
        ownerDTO.setSurname(System.getenv("OWNER_SURNAME"));
        ownerDTO.setAvatar(System.getenv("OWNER_AVATAR"));
        ownerDTO.setPassword(System.getenv("OWNER_PASSWORD"));
        System.out.println(ownerDTO);
        return ownerDTO;
    }*/

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
    public Owner owner(@Value("${owner.email}") String email,
                       @Value("${owner.name}") String name,
                       @Value("${owner.surname}") String surname,
                       @Value("${owner.avatar}") String avatar,
                       @Value("${owner.password}") String password) {
        Owner owner = new Owner();
        owner.setEmail(email);
        owner.setName(name);
        owner.setSurname(surname);
        owner.setAvatar(avatar);
        owner.setPassword(password);
        return owner;
    }

    @Bean
    public Cloudinary getCloudinary(@Value("${cloudinary.name}") String name,
                                    @Value("${cloudinary.apikey}") String apikey,
                                    @Value("${cloudinary.secret}") String secret){

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", name);
        config.put("api_key", apikey);
        config.put("api_secret", secret);
        return new Cloudinary(config);
    }

    @Bean
    public JavaMailSenderImpl getJavaMailSender(@Value("${gmail.mail.transport.protocol}" )String protocol,
                                                @Value("${gmail.mail.smtp.auth}" ) String auth,
                                                @Value("${gmail.mail.smtp.starttls.enable}" )String starttls,
                                                @Value("${gmail.mail.debug}" )String debug,
                                                @Value("${gmail.mail.from}" )String from,
                                                @Value("${gmail.mail.from.password}" )String password,
                                                @Value("${gmail.smtp.ssl.enable}" )String ssl,
                                                @Value("${gmail.smtp.host}" )String host,
                                                @Value("${gmail.smtp.port}" )String port){
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(Integer.parseInt(port));

        mailSender.setUsername(from);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", protocol);
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", starttls);
        props.put("mail.debug", debug);
        props.put("smtp.ssl.enable",ssl);

        return mailSender;
    }
}

