package za.ac.cput.tekkiestorecapstone.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_item")
public class CartItem {
    @Id
    private String cartItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shoe_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Shoe shoe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ShoeVariant shoeVariant;

    @Embedded
    private ShoeSize shoeSize;

    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;

    protected CartItem(){
    }

    private CartItem(Builder build){
        this.cartItemId = build.cartItemId;
        this.cart = build.cart;
        this.shoe = build.shoe;
        this.shoeVariant = build.shoeVariant;
        this.shoeSize = build.shoeSize;
        this.quantity = build.quantity;
        this.subTotal = build.subTotal;
        this.unitPrice = build.unitPrice;
    }

    public String getCartItem(){
        return cartItemId;
    }
    public String getCartItemId(){
        return cartItemId;
    }
    public Cart getCart() {
        return cart;
    }
    public Shoe getShoe() {
        return shoe;
    }
    public ShoeVariant getShoeVariant() {
        return shoeVariant;
    }
    public ShoeSize getShoeSize() {
        return shoeSize;
    }
    public int getQuantity(){
        return quantity;
    }
    public BigDecimal getUnitPrice(){
        return unitPrice;
    }
    public BigDecimal getSubTotal(){
        return subTotal;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "cartItemId='" + cartItemId + '\'' +
                ", cartId=" + (cart != null ? cart.getCartId() : "null") +
                ", shoeId=" + (shoe != null ? shoe.getShoeId() : "null") +
                ", variantId=" + (shoeVariant != null ? shoeVariant.getVariantId() : "null") +
                ", shoeSize=" + shoeSize +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", subTotal=" + subTotal +
                '}';
    }

    public static class Builder{
        private String cartItemId;
        private Cart cart;
        private Shoe shoe;
        private ShoeVariant shoeVariant;
        private ShoeSize shoeSize;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal subTotal;

        public Builder setCartItemId(String cartItemId) {
            this.cartItemId = cartItemId;
            return this;
        }

        public Builder setCart(Cart cart) {
            this.cart = cart;
            return this;
        }

        public Builder setShoe(Shoe shoe) {
            this.shoe = shoe;
            return this;
        }

        public Builder setShoeVariant(ShoeVariant shoeVariant) {
            this.shoeVariant = shoeVariant;
            return this;
        }

        public Builder setShoeSize(ShoeSize shoeSize) {
            this.shoeSize = shoeSize;
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

        public Builder copy(CartItem cartItem){
            this.cartItemId = cartItem.cartItemId;
            this.cart = cartItem.cart;
            this.shoe = cartItem.shoe;
            this.shoeVariant = cartItem.shoeVariant;
            this.shoeSize = cartItem.shoeSize;
            this.quantity = cartItem.quantity;
            this.unitPrice = cartItem.unitPrice;
            this.subTotal = cartItem.subTotal;
            return this;
        }

        public CartItem build(){
            return new CartItem(this);
        }
    }
}

