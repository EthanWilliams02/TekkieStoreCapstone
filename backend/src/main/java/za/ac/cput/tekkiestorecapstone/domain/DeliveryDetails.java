/*
DeliveryDetails.java
Author: Rameez Karriem
Student Number: 222357320
Date: 18 July 2026
 */

package za.ac.cput.tekkiestorecapstone.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
public class DeliveryDetails {
    @Id
    private String deliveryId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private Customer customer;

    @Embedded
    private Address address;
    private String courier;
    private String trackingNumber;
    private LocalDate estimatedDeliveryDate;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "created_at", updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    protected DeliveryDetails(){}

    private DeliveryDetails(Builder build){
        this.deliveryId= build.deliveryId;
        this.order = build.order;
        this.customer = build.customer;
        this.address= build.address;
        this.courier= build.courier;
        this.trackingNumber= build.trackingNumber;
        this.estimatedDeliveryDate= build.estimatedDeliveryDate;
        this.fullName = build.fullName;
        this.phone = build.phone;
        this.createdAt = build.createdAt;
    }

    public String getDeliveryId() {
        return deliveryId;
    }

    public Order getOrder() {
        return order;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Address getAddress() {
        return address;
    }

    public String getCourier() {
        return courier;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public LocalDate getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        return "DeliveryDetails{" +
                "deliveryId='" + deliveryId + '\'' +
                ", orderId=" + (order != null ? order.getOrderId() : "null") +
                ", customerId=" + (customer != null ? customer.getCustomerId() : "null") +
                ", fullName='" + fullName + '\'' +
                ", phone='" + phone + '\'' +
                ", address=" + address +
                ", courier='" + courier + '\'' +
                ", trackingNumber='" + trackingNumber + '\'' +
                ", estimatedDeliveryDate=" + estimatedDeliveryDate +
                ", createdAt=" + (createdAt != null ? createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "null") +
                '}';
    }

    public static class Builder{
        private String deliveryId;
        private Order order;
        private Customer customer;
        private Address address;
        private String courier;
        private String trackingNumber;
        private LocalDate estimatedDeliveryDate;
        private String fullName;
        private String phone;
        private LocalDateTime createdAt;

        public Builder setDeliveryId(String deliveryId) {
            this.deliveryId = deliveryId;
            return this;
        }

        public Builder setOrder(Order order) {
            this.order = order;
            return this;
        }

        public Builder setCustomer(Customer customer) {
            this.customer = customer;
            return this;
        }

        public Builder setAddress(Address address) {
            this.address = address;
            return this;
        }

        public Builder setCourier(String courier) {
            this.courier = courier;
            return this;
        }

        public Builder setTrackingNumber(String trackingNumber) {
            this.trackingNumber = trackingNumber;
            return this;
        }

        public Builder setEstimatedDeliveryDate(LocalDate estimatedDeliveryDate) {
            this.estimatedDeliveryDate = estimatedDeliveryDate;
            return this;
        }

        public Builder setFullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder setPhone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder copy(DeliveryDetails deliveryDetails){
            this.deliveryId= deliveryDetails.deliveryId;
            this.order = deliveryDetails.order;
            this.customer = deliveryDetails.customer;
            this.address= deliveryDetails.address;
            this.courier= deliveryDetails.courier;
            this.trackingNumber= deliveryDetails.trackingNumber;
            this.estimatedDeliveryDate= deliveryDetails.estimatedDeliveryDate;
            this.fullName = deliveryDetails.fullName;
            this.phone = deliveryDetails.phone;
            this.createdAt = deliveryDetails.createdAt;
            return this;
        }
        public DeliveryDetails build(){return new DeliveryDetails(this);}
    }
}