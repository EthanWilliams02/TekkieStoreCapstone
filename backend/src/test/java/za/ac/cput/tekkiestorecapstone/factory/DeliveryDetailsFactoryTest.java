/*
DeliveryDetailsFactoryTest.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DeliveryDetailsFactoryTest {

    private static final Address address = new Address.Builder()
            .setStreetNumber("12")
            .setStreetName("Main Road")
            .setSuburb("Sea Point")
            .setCity("Cape Town")
            .setProvince("Western Cape")
            .setPostalCode("8005")
            .build();

    private static final za.ac.cput.tekkiestorecapstone.domain.Order order = new za.ac.cput.tekkiestorecapstone.domain.Order.Builder()
            .setOrderId("ORD-001")
            .build();

    @Test
    @Order(1)
    public void createDeliveryDetails() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", order, address, "Aramex", "TRK-889922", LocalDate.now());
        assertNotNull(deliveryDetails);
        assertNotNull(deliveryDetails.getOrder());
        assertEquals("ORD-001", deliveryDetails.getOrder().getOrderId());
        System.out.println(deliveryDetails.toString());
    }

    @Test
    @Order(2)
    public void createDeliveryDetailsWithNullDeliveryId() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails(null, order, address, "Aramex", "TRK-889922", LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(3)
    public void createDeliveryDetailsWithNullOrder() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", null, address, "Aramex", "TRK-889922", LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(4)
    public void createDeliveryDetailsWithEmptyCourier() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", order, address, "", "TRK-889922", LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(5)
    public void createDeliveryDetailsWithNullTrackingNumber() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", order, address, "Aramex", null, LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(6)
    public void createDeliveryDetailsWithNullAddress() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", order, null, "Aramex", "TRK-889922", LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(7)
    public void createDeliveryDetailsWithNullEstimatedDeliveryDate() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", order, address, "Aramex", "TRK-889922", null);
        assertNull(deliveryDetails);
    }

}
//completed