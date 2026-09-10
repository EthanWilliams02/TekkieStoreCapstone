/*
 * CartControllerTest.java
 * CartControllerTest model class
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.factory.CartFactory;
import za.ac.cput.tekkiestorecapstone.factory.CustomerFactory;
import za.ac.cput.tekkiestorecapstone.service.CartService;
import java.math.BigDecimal;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class CartControllerTest {

    @Mock
    private CartService service;

    @InjectMocks
    private CartController controller;

    private static Cart cart;

    @BeforeEach
    void setUp() {
        Customer customer = CustomerFactory.createCustomer(
                "CUST001", "John", "M", "Doe", "john.doe@example.com", "0821234567",
                "123", "Main St", "Central", "Cape Town", "8001"
        );
        cart = CartFactory.createCart("CART001", customer, BigDecimal.valueOf(150.50));
    }

    @Test
    void a_create() {
        when(service.create(any(Cart.class))).thenReturn(cart);

        Cart created = controller.create(cart);

        assertNotNull(created);
        assertEquals(cart.getCartId(), created.getCartId());
        assertEquals(cart.getTotalAmount(), created.getTotalAmount());

        System.out.println("Cart created: " + created);
    }

    @Test
    void b_read() {
        when(service.read("CART001")).thenReturn(cart);

        Cart found = controller.read("CART001");

        assertNotNull(found);
        assertEquals("CART001", found.getCartId());
        assertEquals(BigDecimal.valueOf(150.50), found.getTotalAmount());

        System.out.println("Cart found: " + found);
    }

    @Test
    void c_update() {
        Cart updated = new Cart.Builder()
                .copy(cart)
                .setTotalAmount(BigDecimal.valueOf(299.99))
                .build();

        when(service.update(any(Cart.class))).thenReturn(updated);

        Cart updatedCart = controller.update(updated);

        assertNotNull(updatedCart);
        assertEquals(BigDecimal.valueOf(299.99), updatedCart.getTotalAmount());

        System.out.println("Cart updated: " + updatedCart);
    }

    @Test
    void d_delete() {
        when(service.delete("CART001")).thenReturn(true);

        boolean deleted = controller.delete("CART001");

        assertTrue(deleted);

        System.out.println("Cart deleted: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(cart));

        List<Cart> carts = controller.getAll();

        assertNotNull(carts);
        assertEquals(1, carts.size());
        assertEquals("CART001", carts.get(0).getCartId());

        System.out.println("All carts: " + carts);
    }
}