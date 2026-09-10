package za.ac.cput.tekkiestorecapstone.domain;

/* Order.java
Order model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String orderId;
    private Date orderDate;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentReference;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    // Default constructor
    protected Order() {
    }

    // Builder constructor
    private Order(Builder builder) {
        this.orderId = builder.orderId;
        this.orderDate = builder.orderDate;
        this.subtotal = builder.subtotal;
        this.shippingFee = builder.shippingFee;
        this.totalAmount = builder.totalAmount;
        this.paymentMethod = builder.paymentMethod;
        this.paymentReference = builder.paymentReference;
        this.status = builder.status;
        this.customer = builder.customer;
        this.orderItems = builder.orderItems;
    }

    // Getters
    public String getOrderId() {
        return orderId;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public Customer getCustomer() {
        return customer;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId='" + orderId + '\'' +
                ", customerId=" + (customer != null ? customer.getCustomerId() : "null") +
                ", orderDate=" + orderDate +
                ", subtotal=" + subtotal +
                ", shippingFee=" + shippingFee +
                ", totalAmount=" + totalAmount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentReference='" + paymentReference + '\'' +
                ", status=" + status +
                ", itemsCount=" + (orderItems != null ? orderItems.size() : 0) +
                '}';
    }

    // Builder
    public static class Builder {

        private String orderId;
        private Date orderDate;
        private BigDecimal subtotal;
        private BigDecimal shippingFee;
        private BigDecimal totalAmount;
        private String paymentMethod;
        private String paymentReference;
        private OrderStatus status;
        private Customer customer;
        private List<OrderItem> orderItems;

        public Builder setOrderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public Builder setOrderDate(Date orderDate) {
            this.orderDate = orderDate;
            return this;
        }

        public Builder setSubtotal(BigDecimal subtotal) {
            this.subtotal = subtotal;
            return this;
        }

        public Builder setShippingFee(BigDecimal shippingFee) {
            this.shippingFee = shippingFee;
            return this;
        }

        public Builder setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Builder setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public Builder setPaymentReference(String paymentReference) {
            this.paymentReference = paymentReference;
            return this;
        }

        public Builder setStatus(OrderStatus status) {
            this.status = status;
            return this;
        }

        public Builder setCustomer(Customer customer) {
            this.customer = customer;
            return this;
        }

        public Builder setOrderItems(List<OrderItem> orderItems) {
            this.orderItems = orderItems;
            return this;
        }

        public Builder copy(Order order) {
            this.orderId = order.orderId;
            this.orderDate = order.orderDate;
            this.subtotal = order.subtotal;
            this.shippingFee = order.shippingFee;
            this.totalAmount = order.totalAmount;
            this.paymentMethod = order.paymentMethod;
            this.paymentReference = order.paymentReference;
            this.status = order.status;
            this.customer = order.customer;
            this.orderItems = order.orderItems;
            return this;
        }

        public Order build() {
            return new Order(this);
        }
    }
}