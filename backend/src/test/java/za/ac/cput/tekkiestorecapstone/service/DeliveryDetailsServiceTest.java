/*
DeliveryDetailsServiceTest.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
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
import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.factory.DeliveryDetailsFactory;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class DeliveryDetailsServiceTest {
    @Mock
    DeliveryDetailsRepository repo;

    @Mock
    OrderRepository orderRepo;

    @InjectMocks
    DeliveryDetailsService service;
    private static DeliveryDetails deliveryDetails;

    @BeforeEach
    void setUp() {
        Address address = new Address.Builder()
                .setStreetNumber("12")
                .setStreetName("Main Road")
                .setSuburb("Sea Point")
                .setCity("Cape Town")
                .setProvince("Western Cape")
                .setPostalCode("8005")
                .build();

        Order order = new Order.Builder()
                .setOrderId("ORD-001")
                .build();

        deliveryDetails = DeliveryDetailsFactory.createDeliveryDetails("D001", order, address, "Aramex", "TRK-889922", LocalDate.now());
    }

    @Test
    void a_create() {
        when(repo.save(any(DeliveryDetails.class))).thenReturn(deliveryDetails);

        DeliveryDetails created =  service.create(deliveryDetails);

        assertNotNull(created);
        assertEquals(created.getDeliveryId(),  deliveryDetails.getDeliveryId());
        assertNotNull(created.getOrder());
        assertEquals("ORD-001", created.getOrder().getOrderId());
        assertNotNull(created.getCreatedAt());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(deliveryDetails.getDeliveryId())).thenReturn(Optional.of(deliveryDetails));

        DeliveryDetails read =  service.read(deliveryDetails.getDeliveryId());
        assertNotNull(read);
        assertNotNull(read.getOrder());
        assertEquals("ORD-001", read.getOrder().getOrderId());

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        DeliveryDetails updated = new DeliveryDetails.Builder().copy(deliveryDetails).setCourier("DHL").build();

        when(repo.save(any(DeliveryDetails.class))).thenReturn(updated);
        DeliveryDetails updatedUpdated = service.update(deliveryDetails);
        assertNotNull(updatedUpdated);
        assertNotNull(updatedUpdated.getOrder());

        System.out.println("Success: " + updatedUpdated);

    }

    @Test
    void d_delete() {
        boolean success = service.delete(deliveryDetails.getDeliveryId());
        verify(repo).deleteById(deliveryDetails.getDeliveryId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(deliveryDetails));
        List<DeliveryDetails> all = service.getAll();

        assertNotNull(all);
        System.out.println("Success: " + all);
    }

    @Test
    void f_getByOrderId() {
        when(repo.findByOrder_OrderId("ORD-001")).thenReturn(Optional.of(deliveryDetails));

        DeliveryDetails found = service.getByOrderId("ORD-001");

        assertNotNull(found);
        assertNotNull(found.getOrder());
        assertEquals("ORD-001", found.getOrder().getOrderId());
        assertEquals(deliveryDetails.getDeliveryId(), found.getDeliveryId());

        System.out.println("Success: " + found);
    }
}