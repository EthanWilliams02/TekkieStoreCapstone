package za.ac.cput.tekkiestorecapstone.controller;

/*
 CartItemControllerTest.java
 CartItemController test class
 Author: Angelo Adams
 Student Number: 230450431
 Date: 20 July 2026
*/

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.CartItem;
import za.ac.cput.tekkiestorecapstone.factory.CartItemFactory;
import za.ac.cput.tekkiestorecapstone.service.CartItemService;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class CartItemControllerTest {

    @Mock
    private CartItemService service;

    @InjectMocks
    private CartItemController controller;

    private static CartItem cartItem;

    @BeforeEach
    void setUp() {
        cartItem = CartItemFactory.createCartItem(
                "D001",
                2,
                BigDecimal.valueOf(900.00)
        );
    }

    @Test
    void a_create() {
        when(service.create(any(CartItem.class))).thenReturn(cartItem);

        CartItem created = controller.create(cartItem);

        assertNotNull(created);
        assertEquals(cartItem.getCartItem(), created.getCartItem());

        System.out.println("Cart Item: " + created);
    }

    @Test
    void b_read() {
        when(service.read("D001")).thenReturn(cartItem);

        CartItem found = controller.read("D001");

        assertNotNull(found);
        assertEquals("D001", found.getCartItem());

        System.out.println("Cart Item: " + found);
    }

    @Test
    void c_update() {
        CartItem updated = new CartItem.Builder()
                .copy(cartItem)
                .setQuantity(3)
                .setSubTotal(BigDecimal.valueOf(1450.00))
                .build();

        when(service.update(any(CartItem.class))).thenReturn(updated);

        CartItem updatedItem = controller.update(updated);

        assertNotNull(updatedItem);
        assertEquals(3, updatedItem.getQuantity());

        System.out.println("Success: " + updatedItem);
    }

    @Test
    void d_delete() {
        when(service.delete("D001")).thenReturn(true);

        boolean deleted = controller.delete("D001");

        assertTrue(deleted);

        System.out.println("Success: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(cartItem));

        List<CartItem> cartItems = controller.getAll();

        assertNotNull(cartItems);

        System.out.println("Cart Items: " + cartItems);
    }

    @Test
    void f_getCartItemsByCartId() {
        when(service.getCartItemsByCartId("CART001")).thenReturn(List.of(cartItem));

        List<CartItem> cartItems = controller.getCartItemsByCartId("CART001");

        assertNotNull(cartItems);
        assertEquals(1, cartItems.size());

        System.out.println("Cart Items by Cart ID: " + cartItems);
    }
}
