package za.ac.cput.tekkiestorecapstone.service;

/* OrderService.java
OrderService model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository repo;
    private final CustomerRepository customerRepo;

    @Autowired
    public OrderService(OrderRepository repo, CustomerRepository customerRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
    }

    @Override
    public Order create(Order order) {
        if (order == null || order.getCustomer() == null || order.getCustomer().getCustomerId() == null) {
            return null;
        }

        Customer customer = this.customerRepo.findById(order.getCustomer().getCustomerId()).orElse(null);
        if (customer == null) {
            return null;
        }

        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);

        if (order.getOrderDate() == null) {
            order.setOrderDate(new Date());
        }

        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
                item.setSubTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }

        return this.repo.save(order);
    }

    @Override
    public Order read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public Order update(Order order) {
        if (order == null || order.getOrderId() == null || !this.repo.existsById(order.getOrderId())) {
            return null;
        }
        return this.repo.save(order);
    }

    @Override
    public boolean delete(String s) {
        if (s == null || !this.repo.existsById(s)) {
            return false;
        }
        this.repo.deleteById(s);
        return true;
    }

    @Override
    public List<Order> getAll() {
        return this.repo.findAll();
    }

    @Override
    public List<Order> getOrdersByCustomerId(String customerId) {
        if (customerId == null) {
            return List.of();
        }
        return this.repo.findByCustomer_CustomerId(customerId);
    }
}