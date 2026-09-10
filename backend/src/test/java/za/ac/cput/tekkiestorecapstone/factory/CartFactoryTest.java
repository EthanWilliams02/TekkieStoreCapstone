/*
 * CartFactoryTest.java
 * Test class for CartFactory
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.Order;
import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.domain.Customer;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CartFactoryTest {

    @Test
    @Order(1)
    public void createCart() {

        Customer dummyCustomer = CustomerFactory.createCustomer(
                "C001", "John", "M", "Doe", "test@test.com", "0821234567",
                "1", "Street", "Suburb", "City", "1234");

        Cart cart = CartFactory.createCart(
                "CRT001",
                dummyCustomer,
                BigDecimal.valueOf(1250.00)
        );

        assertNotNull(cart);
        System.out.println(cart.toString());
    }

    @Test
    @Order(2)
    public void createCartWithNegativeAmount() {

        Customer dummyCustomer = CustomerFactory.createCustomer(
                "C001", "John", "M", "Doe", "test@test.com", "0821234567",
                "1", "Street", "Suburb", "City", "1234");

        Cart cart = CartFactory.createCart(
                "CRT001",
                dummyCustomer,
                BigDecimal.valueOf(-10.00)
        );

        assertNull(cart);
    }
}