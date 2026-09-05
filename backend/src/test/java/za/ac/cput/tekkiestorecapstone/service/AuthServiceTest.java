package za.ac.cput.tekkiestorecapstone.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.dto.AuthResponse;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.security.JwtUtil;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtUtil = new JwtUtil("TekkieStoreCapstoneSecureJwtKeyForSigningTokensMustBe256BitsLong2026!", 86400000);
        authService = new AuthService(customerRepository, passwordEncoder, jwtUtil);
    }

    @Test
    void testRegisterSuccess() {
        Name name = new Name.Builder().setFirstName("Ethan").setLastName("Williams").build();
        Customer customer = new Customer.Builder()
                .setEmail("ethan@example.com")
                .setPassword("plainPassword123")
                .setName(name)
                .setMobileNumber("+27 82 555 1234")
                .build();

        when(customerRepository.findByEmail("ethan@example.com")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer c = invocation.getArgument(0);
            assertEquals("+27 82 555 1234", c.getMobileNumber());
            return c;
        });

        AuthResponse response = authService.register(customer);

        assertNotNull(response);
        assertEquals("ethan@example.com", response.getEmail());
        assertEquals("Ethan Williams", response.getName());
        assertNotNull(response.getToken());
        assertTrue(jwtUtil.validateToken(response.getToken()));
        assertEquals("ethan@example.com", jwtUtil.extractEmail(response.getToken()));
    }

    @Test
    void testLoginSuccess() {
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        Name name = new Name.Builder().setFirstName("Ethan").setLastName("Williams").build();
        Customer customer = new Customer.Builder()
                .setCustomerId("C001")
                .setEmail("ethan@example.com")
                .setPassword(encodedPassword)
                .setName(name)
                .build();

        when(customerRepository.findByEmail("ethan@example.com")).thenReturn(Optional.of(customer));

        AuthResponse response = authService.login("ethan@example.com", rawPassword);

        assertNotNull(response);
        assertEquals("ethan@example.com", response.getEmail());
        assertNotNull(response.getToken());
        assertTrue(jwtUtil.validateToken(response.getToken()));
    }

    @Test
    void testLoginFailureBadPassword() {
        String encodedPassword = passwordEncoder.encode("correctPassword");

        Customer customer = new Customer.Builder()
                .setEmail("ethan@example.com")
                .setPassword(encodedPassword)
                .build();

        when(customerRepository.findByEmail("ethan@example.com")).thenReturn(Optional.of(customer));

        assertThrows(BadCredentialsException.class, () -> {
            authService.login("ethan@example.com", "wrongPassword");
        });
    }

    @Test
    void testLoginFailureUserNotFound() {
        when(customerRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {
            authService.login("nonexistent@example.com", "anyPassword");
        });
    }
}
