/*
 * AuthService.java
 * Service handling registration, password encryption, login, and token generation
 * Author: Ethan Williams (221454780)
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.dto.AuthResponse;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.security.JwtUtil;

import java.util.UUID;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthService(CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(Customer customer) {
        if (customer == null || customer.getEmail() == null || customer.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String rawPassword = customer.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        String customerId = customer.getCustomerId();
        if (customerId == null || customerId.isBlank()) {
            customerId = UUID.randomUUID().toString();
        }

        Customer toSave = new Customer.Builder()
                .copy(customer)
                .setCustomerId(customerId)
                .setPassword(encodedPassword)
                .setMobileNumber(customer.getMobileNumber())
                .build();

        Customer saved = customerRepository.save(toSave);

        String token = jwtUtil.generateToken(saved.getEmail());
        String name = "";
        if (saved.getName() != null) {
            String first = saved.getName().getFirstName() != null ? saved.getName().getFirstName() : "";
            String last = saved.getName().getLastName() != null ? saved.getName().getLastName() : "";
            name = (first + " " + last).trim();
        }

        return new AuthResponse(saved.getCustomerId(), saved.getEmail(), name, token);
    }

    public AuthResponse login(String email, String rawPassword) {
        if (email == null || rawPassword == null) {
            throw new BadCredentialsException("Invalid email or password");
        }

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (customer.getPassword() == null || !passwordEncoder.matches(rawPassword, customer.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(customer.getEmail());
        String name = "";
        if (customer.getName() != null) {
            String first = customer.getName().getFirstName() != null ? customer.getName().getFirstName() : "";
            String last = customer.getName().getLastName() != null ? customer.getName().getLastName() : "";
            name = (first + " " + last).trim();
        }

        return new AuthResponse(customer.getCustomerId(), customer.getEmail(), name, token);
    }
}
