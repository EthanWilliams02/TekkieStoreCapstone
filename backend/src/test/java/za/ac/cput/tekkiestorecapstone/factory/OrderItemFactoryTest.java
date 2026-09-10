package za.ac.cput.tekkiestorecapstone.factory;

/* OrderItemFactoryTest.java
OrderItemFactoryTest model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderItemFactoryTest {

    @Test
    @org.junit.jupiter.api.Order(1)
    public void createOrderItem() {

        OrderItem orderItem = OrderItemFactory.createOrderItem(
                "OI001",
                2,
                BigDecimal.valueOf(750.00)
        );

        assertNotNull(orderItem);
        assertEquals(BigDecimal.valueOf(1500.00), orderItem.getSubTotal());
        assertEquals(BigDecimal.valueOf(orderItem.getQuantity()).multiply(orderItem.getUnitPrice()), orderItem.getSubTotal());
        System.out.println(orderItem.toString());
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    public void createOrderItemWithNegativePrice() {

        OrderItem orderItem = OrderItemFactory.createOrderItem(
                "OI002",
                2,
                BigDecimal.valueOf(-750.00)
        );

        assertNull(orderItem);
    }

    @Test
    @org.junit.jupiter.api.Order(3)
    public void createOrderItemWithZeroQuantity() {

        OrderItem orderItem = OrderItemFactory.createOrderItem(
                "OI003",
                0,
                BigDecimal.valueOf(750.00)
        );

        assertNull(orderItem);
    }

    @Test
    @org.junit.jupiter.api.Order(4)
    public void createOrderItemWithNegativeQuantity() {

        OrderItem orderItem = OrderItemFactory.createOrderItem(
                "OI004",
                -1,
                BigDecimal.valueOf(750.00)
        );

        assertNull(orderItem);
    }

    @Test
    @org.junit.jupiter.api.Order(5)
    public void createOrderItemWithEmptyId() {

        OrderItem orderItem = OrderItemFactory.createOrderItem(
                "",
                2,
                BigDecimal.valueOf(750.00)
        );

        assertNull(orderItem);
    }
}
