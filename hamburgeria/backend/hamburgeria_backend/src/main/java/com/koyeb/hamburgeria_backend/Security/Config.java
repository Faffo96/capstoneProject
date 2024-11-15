package com.koyeb.hamburgeria_backend.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class Config {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.formLogin(http->http.disable());
        httpSecurity.csrf(http->http.disable());
        httpSecurity.sessionManagement(http->http.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        httpSecurity.cors(Customizer.withDefaults());
        httpSecurity.authorizeHttpRequests(http->http.requestMatchers("/api/**").permitAll());
        httpSecurity.authorizeHttpRequests(http->http.requestMatchers("/api/users/**").permitAll());


        httpSecurity.authorizeHttpRequests(http->http.requestMatchers(HttpMethod.POST,"/auth/**").permitAll());

        //nega l'accesso a qualsiasi servizio che non sia get e path /api/users
        httpSecurity.authorizeHttpRequests(http->http.anyRequest().authenticated());
        return httpSecurity.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(11);
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of(
                "http://localhost:4200",
                "https://6693b233dc51f32c3a9bc849--hamburgeriarc.netlify.app",
                "https://hamburgeriarc.netlify.app",
                "https://essential-berget-faff-846119c1.koyeb.app",
                "localhost:4200",
                "6693b233dc51f32c3a9bc849--hamburgeriarc.netlify.app",
                "https://hamburgeriarc.netlify.app",
                "essential-berget-faff-846119c1.koyeb.app/"

        ));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}
/*jdbc:postgresql://ep-purple-rice-a22jh1kl.eu-central-1.pg.koyeb.app/koyebdb*/

