package za.ac.cput.tekkiestorecapstone.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.dto.AuthResponse;
import za.ac.cput.tekkiestorecapstone.dto.LoginRequest;
import za.ac.cput.tekkiestorecapstone.dto.RegisterRequest;
import za.ac.cput.tekkiestorecapstone.service.AuthService;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void testRegisterEndpoint() {
        RegisterRequest request = new RegisterRequest("ethan@example.com", "pass123", "Ethan Williams", null, null, "0821234567");
        AuthResponse mockResponse = new AuthResponse("C001", "ethan@example.com", "Ethan Williams", "jwt-token-xyz");

        when(authService.register(any(Customer.class))).thenReturn(mockResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("ethan@example.com", response.getBody().getEmail());
        assertEquals("jwt-token-xyz", response.getBody().getToken());
    }

    @Test
    void testLoginEndpoint() {
        LoginRequest request = new LoginRequest("ethan@example.com", "pass123");
        AuthResponse mockResponse = new AuthResponse("C001", "ethan@example.com", "Ethan Williams", "jwt-token-xyz");

        when(authService.login(eq("ethan@example.com"), eq("pass123"))).thenReturn(mockResponse);

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("jwt-token-xyz", response.getBody().getToken());
    }

    @Test
    void testBadCredentialsExceptionHandler() {
        BadCredentialsException ex = new BadCredentialsException("Invalid email or password");
        ResponseEntity<Map<String, Object>> response = authController.handleBadCredentials(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(401, response.getBody().get("status"));
        assertEquals("Unauthorized", response.getBody().get("error"));
    }
}
