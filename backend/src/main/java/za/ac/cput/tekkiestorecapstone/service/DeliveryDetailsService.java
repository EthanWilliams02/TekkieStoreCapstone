/*
DeliveryDetailsService.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DeliveryDetailsService implements IDeliveryDetailsService {
    private final DeliveryDetailsRepository repo;
    private final OrderRepository orderRepo;

    @Autowired
    public DeliveryDetailsService(DeliveryDetailsRepository repo, OrderRepository orderRepo) {
        this.repo = repo;
        this.orderRepo = orderRepo;
    }

    /**
     * Builds a full name from a Name object, safely skipping any null/blank parts.
     * Never produces the literal word "null" in the output.
     */
    private String buildFullName(Name name) {
        if (name == null) return "";
        StringBuilder sb = new StringBuilder();
        if (name.getFirstName() != null && !name.getFirstName().isBlank()) {
            sb.append(name.getFirstName().trim());
        }
        if (name.getMiddleName() != null && !name.getMiddleName().isBlank()) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(name.getMiddleName().trim());
        }
        if (name.getLastName() != null && !name.getLastName().isBlank()) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(name.getLastName().trim());
        }
        return sb.toString();
    }

    /**
     * Resolves the persisted Order from the database, then derives and populates
     * the Customer, fullName, phone, and province on the DeliveryDetails before saving.
     * The Order is the source of truth for which Customer owns the delivery.
     */
    private void enrichFromOrder(DeliveryDetails deliveryDetails) {
        if (deliveryDetails == null) return;
        if (deliveryDetails.getOrder() == null || deliveryDetails.getOrder().getOrderId() == null) return;

        Order persistedOrder = orderRepo.findById(deliveryDetails.getOrder().getOrderId()).orElse(null);
        if (persistedOrder == null) return;

        // Always use the persisted order (loads correct customer FK)
        deliveryDetails.setOrder(persistedOrder);

        Customer customer = persistedOrder.getCustomer();
        if (customer == null) return;

        // Populate the customer FK column
        deliveryDetails.setCustomer(customer);

        // Populate full_name from the customer's Name parts (safe, no "null" literals)
        String fullName = buildFullName(customer.getName());
        if (!fullName.isBlank()) {
            deliveryDetails.setFullName(fullName);
        }

        // Populate phone from customer's mobile number
        if (customer.getMobileNumber() != null && !customer.getMobileNumber().isBlank()) {
            deliveryDetails.setPhone(customer.getMobileNumber());
        }

        // Populate province from customer's address into embedded delivery address
        if (customer.getAddress() != null && customer.getAddress().getProvince() != null && !customer.getAddress().getProvince().isBlank()) {
            String province = customer.getAddress().getProvince().trim();
            if (deliveryDetails.getAddress() != null) {
                deliveryDetails.getAddress().setProvince(province);
            } else {
                deliveryDetails.setAddress(new Address.Builder().setProvince(province).build());
            }
        }
    }

    @Override
    public DeliveryDetails create(DeliveryDetails deliveryDetails) {
        if (deliveryDetails == null) {
            return null;
        }
        enrichFromOrder(deliveryDetails);
        deliveryDetails.setCreatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        return this.repo.save(deliveryDetails);
    }

    @Override
    public DeliveryDetails read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public DeliveryDetails update(DeliveryDetails deliveryDetails) {
        if (deliveryDetails == null) {
            return null;
        }
        enrichFromOrder(deliveryDetails);
        if (deliveryDetails.getDeliveryId() != null) {
            this.repo.findById(deliveryDetails.getDeliveryId()).ifPresent(existing -> {
                if (existing.getCreatedAt() != null) {
                    deliveryDetails.setCreatedAt(existing.getCreatedAt());
                }
            });
        }
        return this.repo.save(deliveryDetails);
    }

    @Override
    public boolean delete(String variantId) {
        this.repo.deleteById(variantId);
        return true;
    }

    @Override
    public List<DeliveryDetails> getAll() {
        return this.repo.findAll();
    }

    @Override
    public DeliveryDetails getByOrderId(String orderId) {
        if (orderId == null) {
            return null;
        }
        return repo.findByOrder_OrderId(orderId).orElse(null);
    }
}
