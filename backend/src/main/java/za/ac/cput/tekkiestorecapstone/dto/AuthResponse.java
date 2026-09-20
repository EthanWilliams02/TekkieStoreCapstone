/*
 * AuthResponse.java
 * Authentication Response DTO
 * Author: Ethan Williams (221454780)
 */
package za.ac.cput.tekkiestorecapstone.dto;

public class AuthResponse {
    private String customerId;
    private String email;
    private String name;
    private String token;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String customerId, String email, String name, String token) {
        this(customerId, email, name, token, "CUSTOMER");
    }

    public AuthResponse(String customerId, String email, String name, String token, String role) {
        this.customerId = customerId;
        this.email = email;
        this.name = name;
        this.token = token;
        this.role = (role != null && !role.isBlank()) ? role : "CUSTOMER";
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return (role != null && !role.isBlank()) ? role : "CUSTOMER";
    }

    public void setRole(String role) {
        this.role = role;
    }
}
