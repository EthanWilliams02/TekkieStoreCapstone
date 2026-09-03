/*
DeliveryDetailsControllerTest.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
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
import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.factory.DeliveryDetailsFactory;
import za.ac.cput.tekkiestorecapstone.service.DeliveryDetailsService;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class DeliveryDetailsControllerTest {

    @Mock
    private DeliveryDetailsService service;

    @InjectMocks
    private DeliveryDetailsController controller;

    private static DeliveryDetails deliveryDetails;

    @BeforeEach
    void setUp() {
        Address address = new Address.Builder()
                .setStreetNumber("12")
                .setStreetName("Main Road")
                .setSuburb("Sea Point")
                .setCity("Cape Town")
                .setPostalCode("8005")
                .build();

        deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails(
                "D001",
                address,
                "Aramex",
                "TRK-889922",
                LocalDate.now()
        );
    }

    @Test
    void a_create() {
        when(service.create(any(DeliveryDetails.class))).thenReturn(deliveryDetails);

        DeliveryDetails created = controller.create(deliveryDetails);

        assertNotNull(created);
        assertEquals(deliveryDetails.getDeliveryId(), created.getDeliveryId());

        System.out.println("Delivery ID: " + created);
    }

    @Test
    void b_read() {
        when(service.read("D001")).thenReturn(deliveryDetails);

        DeliveryDetails found = controller.read("D001");

        assertNotNull(found);
        assertEquals("D001", found.getDeliveryId());

        System.out.println("Delivery ID: " + found);
    }

    @Test
    void c_update() {
        DeliveryDetails updated = new DeliveryDetails.Builder().copy(deliveryDetails).setCourier("DHL").build();

        when(service.update(any(DeliveryDetails.class))).thenReturn(updated);
        DeliveryDetails updatedUpdated = service.update(deliveryDetails);
        assertNotNull(updatedUpdated);

        System.out.println("Success: " + updatedUpdated);
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
        when(service.getAll()).thenReturn(List.of(deliveryDetails));

        List<DeliveryDetails> allDeliveryDetails = controller.getAll();

        assertNotNull(allDeliveryDetails);

        System.out.println("Delivery Details: " + allDeliveryDetails);
    }
}