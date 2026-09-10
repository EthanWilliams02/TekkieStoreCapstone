/*
 * CartServiceTest.java
 * Test class for CartService
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

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
import za.ac.cput.tekkiestorecapstone.repository.CartRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class CartServiceTest {

    @Mock
    CartRepository repo;

    @InjectMocks
    CartService service;

    private static Cart cart;

    @BeforeEach
    void setUp() {
        Customer customer = new Customer.Builder().setCustomerId("CUST001").build();
        cart = CartFactory.createCart("CART001", customer, BigDecimal.valueOf(150.50));
    }

    @Test
    void a_create() {
        when(repo.save(any(Cart.class))).thenReturn(cart);

        Cart created = service.create(cart);

        assertNotNull(created);
        assertEquals(created.getCartId(), cart.getCartId());
        assertEquals(created.getTotalAmount(), cart.getTotalAmount());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(cart.getCartId())).thenReturn(Optional.of(cart));

        Cart read = service.read(cart.getCartId());
        assertNotNull(read);
        assertEquals(cart.getCartId(), read.getCartId());

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        Cart updated = new Cart.Builder()
                .copy(cart)
                .setTotalAmount(BigDecimal.valueOf(299.99))
                .build();

        when(repo.save(any(Cart.class))).thenReturn(updated);

        Cart updatedCart = service.update(updated);
        assertNotNull(updatedCart);
        assertEquals(BigDecimal.valueOf(299.99), updatedCart.getTotalAmount());

        System.out.println("Success: " + updatedCart);
    }

    @Test
    void d_delete() {
        boolean success = service.delete(cart.getCartId());
        verify(repo).deleteById(cart.getCartId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(cart));
        List<Cart> all = service.getAll();

        assertNotNull(all);
        assertEquals(1, all.size());
        System.out.println("Success: " + all);
    }
}