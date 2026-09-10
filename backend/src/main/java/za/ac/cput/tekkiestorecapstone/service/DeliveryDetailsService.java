/*
DeliveryDetailsService.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DeliveryDetailsService implements IDeliveryDetailsService {
    private final DeliveryDetailsRepository repo;

    @Autowired
    public DeliveryDetailsService(DeliveryDetailsRepository repo, OrderRepository orderRepo) {
        this.repo = repo;
    }



    @Override
    public DeliveryDetails create(DeliveryDetails deliveryDetails) {
        if (deliveryDetails == null) {
            return null;
        }
        
        DeliveryDetails newDelivery = new DeliveryDetails.Builder()
                .copy(deliveryDetails)
                .setCreatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();
                
        return this.repo.save(newDelivery);
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
        
        DeliveryDetails finalDetails = deliveryDetails;
        if (deliveryDetails.getDeliveryId() != null) {
            DeliveryDetails existing = this.repo.findById(deliveryDetails.getDeliveryId()).orElse(null);
            if (existing != null && existing.getCreatedAt() != null) {
                finalDetails = new DeliveryDetails.Builder()
                        .copy(deliveryDetails)
                        .setCreatedAt(existing.getCreatedAt())
                        .build();
            }
        }
        return this.repo.save(finalDetails);
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
