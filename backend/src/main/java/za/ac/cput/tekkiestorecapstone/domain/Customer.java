/*
 * Customer.java
 * Customer Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Embedded;

@Entity
public class Customer {
    @Id
    private String customerId;
    private String email;
    private String password;
    @Embedded
    private Name name;
    private String mobileNumber;
    @Embedded
    private Address address;

    protected Customer(){}

    private Customer(Builder builder){
        this.customerId= builder.customerId;
        this.email= builder.email;
        this.password= builder.password;
        this.name= builder.name;
        this.mobileNumber= builder.mobileNumber;
        this.address= builder.address;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customerId='" + customerId + '\'' +
                ", email='" + email + '\'' +
                ", name=" + name +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", address=" + address +
                '}';
    }

    public static class Builder{
       private String customerId;
       private String email;
       private String password;
       private Name name;
       private String mobileNumber;
       private Address address;

       public Builder setCustomerId(String customerId) {
           this.customerId = customerId;
           return this;
       }

       public Builder setEmail(String email) {
           this.email = email;
           return this;
       }

       public Builder setPassword(String password) {
           this.password = password;
           return this;
       }

       public Builder setName(Name name) {
           this.name = name;
           return this;
       }

       public Builder setMobileNumber(String mobileNumber) {
           this.mobileNumber = mobileNumber;
           return this;
       }

       public Builder setAddress(Address address) {
           this.address = address;
           return this;
       }

       public Builder copy(Customer customer){
           this.customerId= customer.customerId;
           this.email= customer.email;
           this.password= customer.password;
           this.name= customer.name;
           this.mobileNumber=customer.mobileNumber;
           this.address=customer.address;
           return this;
       }
       public Customer build(){return new Customer(this);}
   }
}
