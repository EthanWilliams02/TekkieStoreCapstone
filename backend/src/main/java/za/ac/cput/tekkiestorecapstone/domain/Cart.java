/*
 * Cart.java
 * Cart Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class Cart {
    @Id
    private String cartId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private Customer customer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    private BigDecimal totalAmount;

    protected Cart(){}

    private Cart(Builder builder){
        this.cartId = builder.cartId;
        this.customer = builder.customer;
        this.cartItems = builder.cartItems;
        this.totalAmount = builder.totalAmount;
    }

    public String getCartId() {
        return cartId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    @Override
    public String toString() {
        return "Cart{" +
                "cartId='" + cartId + '\'' +
                ", customerId=" + (customer != null ? customer.getCustomerId() : "null") +
                ", itemsCount=" + (cartItems != null ? cartItems.size() : 0) +
                ", totalAmount=" + totalAmount +
                '}';
    }

    public static class Builder {
        private String cartId;
        private Customer customer;
        private List<CartItem> cartItems = new ArrayList<>();
        private BigDecimal totalAmount;

        public Builder setCartId(String cartId) {
            this.cartId = cartId;
            return this;
        }

        public Builder setCustomer(Customer customer) {
            this.customer = customer;
            return this;
        }

        public Builder setCartItems(List<CartItem> cartItems) {
            this.cartItems = cartItems;
            return this;
        }

        public Builder setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Builder copy(Cart cart){
            this.cartId = cart.cartId;
            this.customer = cart.customer;
            this.cartItems = cart.cartItems;
            this.totalAmount = cart.totalAmount;
            return this;
        }
        
        public Cart build(){
            return new Cart(this);
        }
    }
}

