package za.ac.cput.tekkiestorecapstone.controller;

/* OrderItemControllerTest.java
OrderItemController test class
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
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.factory.OrderItemFactory;
import za.ac.cput.tekkiestorecapstone.service.OrderItemService;

import java.util.List;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class OrderItemControllerTest {

    @Mock
    private OrderItemService service;

    @InjectMocks
    private OrderItemController controller;

    private static OrderItem orderItem;

    @BeforeEach
    void setUp() {
        orderItem = OrderItemFactory.createOrderItem(
                "OI001",
                2,
                BigDecimal.valueOf(750.00)
        );
    }

    @Test
    void a_create() {
        when(service.create(any(OrderItem.class))).thenReturn(orderItem);

        OrderItem created = controller.create(orderItem);

        assertNotNull(created);
        assertEquals(orderItem.getOrderItemId(), created.getOrderItemId());

        System.out.println("Order Item: " + created);
    }

    @Test
    void b_read() {
        when(service.read("OI001")).thenReturn(orderItem);

        OrderItem found = controller.read("OI001");

        assertNotNull(found);
        assertEquals("OI001", found.getOrderItemId());

        System.out.println("Order Item: " + found);
    }

    @Test
    void c_update() {
        OrderItem updated = new OrderItem.Builder()
                .copy(orderItem)
                .setQuantity(3)
                .setSubTotal(BigDecimal.valueOf(2250.00))
                .build();

        when(service.update(any(OrderItem.class))).thenReturn(updated);

        OrderItem updatedItem = controller.update(updated);

        assertNotNull(updatedItem);
        assertEquals(3, updatedItem.getQuantity());

        System.out.println("Success: " + updatedItem);
    }

    @Test
    void d_delete() {
        when(service.delete("OI001")).thenReturn(true);

        boolean deleted = controller.delete("OI001");

        assertTrue(deleted);

        System.out.println("Success: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(orderItem));

        List<OrderItem> orderItems = controller.getAll();

        assertNotNull(orderItems);

        System.out.println("Order Items: " + orderItems);
    }
}
