/*
 * RegisterRequest.java
 * Registration Request DTO
 * Author: Ethan Williams (221454780)
 */
package za.ac.cput.tekkiestorecapstone.dto;

import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Name;

public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String firstName;
    private String lastName;
    private String mobileNumber;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String fullName, String firstName, String lastName, String mobileNumber) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getPhone() {
        return mobileNumber;
    }

    public void setPhone(String phone) {
        if (this.mobileNumber == null || this.mobileNumber.isBlank()) {
            this.mobileNumber = phone;
        }
    }

    public Customer toCustomer() {
        String first = this.firstName;
        String last = this.lastName;

        if ((first == null || first.isBlank()) && this.fullName != null && !this.fullName.isBlank()) {
            String[] parts = this.fullName.trim().split("\\s+", 2);
            first = parts[0];
            last = parts.length > 1 ? parts[1] : "";
        }

        Name name = new Name.Builder()
                .setFirstName(first != null ? first : "")
                .setLastName(last != null ? last : "")
                .build();

        return new Customer.Builder()
                .setEmail(this.email)
                .setPassword(this.password)
                .setName(name)
                .setMobileNumber(this.mobileNumber != null ? this.mobileNumber : "")
                .build();
    }
}
