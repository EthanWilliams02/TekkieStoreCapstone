package za.ac.cput.tekkiestorecapstone.domain;

/* OrderItem.java
OrderItem model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;

// Represents an item in an order.
@Entity
public class OrderItem {

    @Id
    private String orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Order order;

    private String shoeId;
    private String shoeName;
    private String brand;
    private String size;
    private String imageUrl;

    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;

    // Default constructor
    protected OrderItem() {
    }

    // Constructor using Builder
    private OrderItem(Builder builder) {
        this.orderItemId = builder.orderItemId;
        this.order = builder.order;
        this.shoeId = builder.shoeId;
        this.shoeName = builder.shoeName;
        this.brand = builder.brand;
        this.size = builder.size;
        this.imageUrl = builder.imageUrl;
        this.quantity = builder.quantity;
        this.unitPrice = builder.unitPrice;
        this.subTotal = builder.subTotal;
    }

    // Getters
    public String getOrderItemId() {
        return orderItemId;
    }

    public Order getOrder() {
        return order;
    }

    public String getShoeId() {
        return shoeId;
    }

    public String getShoeName() {
        return shoeName;
    }

    public String getBrand() {
        return brand;
    }

    public String getSize() {
        return size;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "orderItemId='" + orderItemId + '\'' +
                ", orderId=" + (order != null ? order.getOrderId() : "null") +
                ", shoeId='" + shoeId + '\'' +
                ", shoeName='" + shoeName + '\'' +
                ", brand='" + brand + '\'' +
                ", size='" + size + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", subTotal=" + subTotal +
                '}';
    }

    // Builder class
    public static class Builder {

        private String orderItemId;
        private Order order;
        private String shoeId;
        private String shoeName;
        private String brand;
        private String size;
        private String imageUrl;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal subTotal;

        public Builder setOrderItemId(String orderItemId) {
            this.orderItemId = orderItemId;
            return this;
        }

        public Builder setOrder(Order order) {
            this.order = order;
            return this;
        }

        public Builder setShoeId(String shoeId) {
            this.shoeId = shoeId;
            return this;
        }

        public Builder setShoeName(String shoeName) {
            this.shoeName = shoeName;
            return this;
        }

        public Builder setBrand(String brand) {
            this.brand = brand;
            return this;
        }

        public Builder setSize(String size) {
            this.size = size;
            return this;
        }

        public Builder setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder setQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
            return this;
        }

        public Builder setSubTotal(BigDecimal subTotal) {
            this.subTotal = subTotal;
            return this;
        }

        // Copies values from an existing OrderItem object
        public Builder copy(OrderItem orderItem) {
            this.orderItemId = orderItem.orderItemId;
            this.order = orderItem.order;
            this.shoeId = orderItem.shoeId;
            this.shoeName = orderItem.shoeName;
            this.brand = orderItem.brand;
            this.size = orderItem.size;
            this.imageUrl = orderItem.imageUrl;
            this.quantity = orderItem.quantity;
            this.unitPrice = orderItem.unitPrice;
            this.subTotal = orderItem.subTotal;
            return this;
        }

        // Builds and returns a new OrderItem object
        public OrderItem build() {
            return new OrderItem(this);
        }
    }
}