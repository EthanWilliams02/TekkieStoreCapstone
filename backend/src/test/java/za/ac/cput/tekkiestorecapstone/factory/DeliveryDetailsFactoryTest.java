/*
DeliveryDetailsFactoryTest.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.core.annotation.Order;
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
            .setPostalCode("8005")
            .build();

    @Test
    @Order(1)
    public void createDeliveryDetails() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", address, "Aramex", "TRK-889922", LocalDate.now());
        assertNotNull(deliveryDetails);
        System.out.println(deliveryDetails.toString());
    }

    @Test
    @Order(2)
    public void createDeliveryDetailsWithNullDeliveryId() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails(null, address, "Aramex", "TRK-889922", LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(3)
    public void createDeliveryDetailsWithEmptyCourier() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", address, "", "TRK-889922", LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(4)
    public void createDeliveryDetailsWithNullTrackingNumber() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", address, "Aramex", null, LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(5)
    public void createDeliveryDetailsWithNullAddress() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", null, "Aramex", "TRK-889922", LocalDate.now());
        assertNull(deliveryDetails);
    }

    @Test
    @Order(6)
    public void createDeliveryDetailsWithNullEstimatedDeliveryDate() {
        DeliveryDetails deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", address, "Aramex", "TRK-889922", null);
        assertNull(deliveryDetails);
    }

}
//completed