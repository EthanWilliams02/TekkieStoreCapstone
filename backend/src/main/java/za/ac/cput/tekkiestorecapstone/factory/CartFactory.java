/*
 * CartFactory.java
 * Factory for Cart Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.util.Helper;
import java.math.BigDecimal;

public class CartFactory {

    public static Cart createCart(String cartId, Customer customer, BigDecimal totalAmount) {

        if (Helper.isNullOrEmpty(cartId) || customer == null) {
            return null;
        }

        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            return null;
        }

        return new Cart.Builder()
                .setCartId(cartId)
                .setCustomer(customer)
                .setTotalAmount(totalAmount)
                .build();
    }
}