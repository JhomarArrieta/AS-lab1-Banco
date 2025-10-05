package com.udea.lab1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Clase de configuración para habilitar CORS (Cross-Origin Resource Sharing).
 * Necesario para permitir peticiones desde el frontend (React) que corre en un puerto diferente (5173)
 * hacia el backend (Spring Boot) en el puerto 8080.
 */

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Aplica la configuración CORS a todos los endpoints bajo /api/**
        registry.addMapping("/api/**")
                // ✨ IMPORTANTE: Debe coincidir con el puerto donde corre tu React (Vite)
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                // Define los métodos HTTP permitidos
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Permite todos los headers en las peticiones
                .allowedHeaders("*")
                // Permite el uso de credenciales (si se usaran cookies o autenticación basada en sesión)
                .allowCredentials(true);
    }
}