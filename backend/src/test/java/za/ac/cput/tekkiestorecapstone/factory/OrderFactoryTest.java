package za.ac.cput.tekkiestorecapstone.factory;

/* OrderFactoryTest.java
OrderFactoryTest model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;


import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;

import java.util.Date;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderFactoryTest {

    @Test
    @org.junit.jupiter.api.Order(1)
    public void createOrder() {

        Order order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                BigDecimal.valueOf(1500.00),
                "PAY001"
        );

        assertNotNull(order);
        assertNotNull(order.getStatus());
        assertEquals(OrderStatus.PENDING, order.getStatus());
        System.out.println(order.toString());
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    public void createOrderWithNullPaymentReference() {

        Order order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                BigDecimal.valueOf(1500.00),
                ""
        );

        assertNull(order);
    }

    @Test
    @org.junit.jupiter.api.Order(3)
    public void createOrderWithNegativeAmount() {

        Order order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                BigDecimal.valueOf(-1500.00),
                "PAY001"
        );

        assertNull(order);
    }

    @Test
    @org.junit.jupiter.api.Order(4)
    public void createOrderDefaultsToPending() {

        Order order = OrderFactory.createOrder(
                "ORD002",
                new Date(),
                BigDecimal.valueOf(2500.00),
                null,
                "PAY002"
        );

        assertNotNull(order);
        assertEquals(OrderStatus.PENDING, order.getStatus());
    }
}