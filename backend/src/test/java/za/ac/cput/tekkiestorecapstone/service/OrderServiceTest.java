package za.ac.cput.tekkiestorecapstone.service;

/* OrderServiceTest.java
OrderServiceTest model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;
import za.ac.cput.tekkiestorecapstone.factory.CustomerFactory;
import za.ac.cput.tekkiestorecapstone.factory.OrderFactory;
import za.ac.cput.tekkiestorecapstone.factory.OrderItemFactory;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class OrderServiceTest {

    @Mock
    OrderRepository repo;

    @Mock
    CustomerRepository customerRepo;

    @InjectMocks
    OrderService service;

    private static Customer customer;
    private static OrderItem item;
    private static Order order;

    @BeforeEach
    void setUp() {
        Customer baseCustomer = CustomerFactory.createCustomer(
                "C001",
                "John",
                "Michael",
                "Smith",
                "johnsmith@gmail.com",
                "0821234567",
                "12",
                "Main Road",
                "Claremont",
                "Cape Town",
                "7708"
        );
        customer = new Customer.Builder().copy(baseCustomer).setPassword("SecretPassword123!").build();

        item = OrderItemFactory.createOrderItem(
                "OI001",
                "SH001",
                "Air Max 90",
                "Nike",
                "UK 8",
                "/images/nike.jpg",
                1,
                BigDecimal.valueOf(1500.00)
        );

        order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                BigDecimal.valueOf(1500.00),
                BigDecimal.valueOf(0.0),
                BigDecimal.valueOf(1500.00),
                "card",
                "PAY001",
                OrderStatus.PENDING,
                customer,
                List.of(item)
        );
    }

    @Test
    void a_create() {
        when(customerRepo.findById("C001")).thenReturn(Optional.of(customer));
        when(repo.save(any(Order.class))).thenReturn(order);

        Order created = service.create(order);

        assertNotNull(created);
        assertEquals(order.getOrderId(), created.getOrderId());
        assertEquals("C001", created.getCustomer().getCustomerId());
        assertEquals(OrderStatus.PENDING, created.getStatus());

        System.out.println("Success: " + created);
    }

    @Test
    void a_create_withNoCustomer_returnsNull() {
        Order orderWithoutCustomer = new Order.Builder()
                .copy(order)
                .setCustomer(null)
                .build();

        Order created = service.create(orderWithoutCustomer);

        assertNull(created);
    }

    @Test
    void a_create_withNonExistentCustomer_returnsNull() {
        Customer nonExistentCustomer = new Customer.Builder()
                .setCustomerId("NON_EXISTENT")
                .build();

        Order orderWithUnknownCustomer = new Order.Builder()
                .copy(order)
                .setCustomer(nonExistentCustomer)
                .build();

        when(customerRepo.findById("NON_EXISTENT")).thenReturn(Optional.empty());

        Order created = service.create(orderWithUnknownCustomer);

        assertNull(created);
    }

    @Test
    void b_read() {
        when(repo.findById(order.getOrderId())).thenReturn(Optional.of(order));

        Order read = service.read(order.getOrderId());

        assertNotNull(read);
        assertEquals("ORD001", read.getOrderId());

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        Order updated = new Order.Builder()
                .copy(order)
                .setPaymentReference("PAY002")
                .build();

        when(repo.existsById(updated.getOrderId())).thenReturn(true);
        when(repo.save(any(Order.class))).thenReturn(updated);

        Order updatedOrder = service.update(updated);

        assertNotNull(updatedOrder);
        assertEquals("PAY002", updatedOrder.getPaymentReference());

        System.out.println("Success: " + updatedOrder);
    }

    @Test
    void c_update_nonExistent() {
        Order nonExistent = new Order.Builder()
                .copy(order)
                .setOrderId("NON_EXISTENT")
                .build();

        when(repo.existsById("NON_EXISTENT")).thenReturn(false);

        Order result = service.update(nonExistent);

        assertNull(result);
    }

    @Test
    void d_delete() {
        when(repo.existsById(order.getOrderId())).thenReturn(true);

        boolean success = service.delete(order.getOrderId());

        verify(repo).deleteById(order.getOrderId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void d_delete_nonExistent() {
        when(repo.existsById("NON_EXISTENT")).thenReturn(false);

        boolean success = service.delete("NON_EXISTENT");

        assertFalse(success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(order));

        List<Order> all = service.getAll();

        assertNotNull(all);
        assertEquals(1, all.size());

        System.out.println("Success: " + all);
    }

    @Test
    void f_getOrdersByCustomerId() {
        when(repo.findByCustomer_CustomerId("C001")).thenReturn(List.of(order));

        List<Order> customerOrders = service.getOrdersByCustomerId("C001");

        assertNotNull(customerOrders);
        assertEquals(1, customerOrders.size());
        assertEquals("ORD001", customerOrders.get(0).getOrderId());

        System.out.println("Success: " + customerOrders);
    }

    @Test
    void g_customerPasswordNeverExposedInOrderJson() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(order);

        System.out.println("Order JSON: " + json);
        assertFalse(json.contains("SecretPassword123!"), "Password hash or value must never appear in JSON");
        assertFalse(json.contains("\"password\""), "Password property should not be serialized");
    }
}