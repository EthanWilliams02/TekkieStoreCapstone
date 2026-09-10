package za.ac.cput.tekkiestorecapstone.controller;

/* OrderControllerTest.java
OrderController test class
Author: Qaasim Isaacs(222544422)
Date: 19 July 2026
*/

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.factory.OrderFactory;
import za.ac.cput.tekkiestorecapstone.service.OrderService;

import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class OrderControllerTest {

    @Mock
    private OrderService service;

    @InjectMocks
    private OrderController controller;

    private static Order order;

    @BeforeEach
    void setUp() {
        order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                BigDecimal.valueOf(1500.00),
                "PAY001"
        );
    }

    @Test
    void a_create() {
        when(service.create(any(Order.class))).thenReturn(order);

        Order created = controller.create(order);

        assertNotNull(created);
        assertEquals(order.getOrderId(), created.getOrderId());

        System.out.println("Order: " + created);
    }

    @Test
    void b_read() {
        when(service.read("ORD001")).thenReturn(order);

        Order found = controller.read("ORD001");

        assertNotNull(found);
        assertEquals("ORD001", found.getOrderId());

        System.out.println("Order: " + found);
    }

    @Test
    void c_update() {
        Order updated = new Order.Builder()
                .copy(order)
                .setPaymentReference("PAY002")
                .build();

        when(service.update(any(Order.class))).thenReturn(updated);

        Order updatedOrder = controller.update(updated);

        assertNotNull(updatedOrder);
        assertEquals("PAY002", updatedOrder.getPaymentReference());

        System.out.println("Success: " + updatedOrder);
    }

    @Test
    void d_delete() {
        when(service.delete("ORD001")).thenReturn(true);

        boolean deleted = controller.delete("ORD001");

        assertTrue(deleted);

        System.out.println("Success: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(order));

        List<Order> orders = controller.getAll();

        assertNotNull(orders);

        System.out.println("Orders: " + orders);
    }

    @Test
    void f_getOrdersByCustomerId() {
        when(service.getOrdersByCustomerId("C001")).thenReturn(List.of(order));

        List<Order> orders = controller.getOrdersByCustomerId("C001");

        assertNotNull(orders);
        assertEquals(1, orders.size());

        System.out.println("Customer Orders: " + orders);
    }
}