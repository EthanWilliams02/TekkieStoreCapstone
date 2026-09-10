package za.ac.cput.tekkiestorecapstone.factory;

/* OrderFactory.java
OrderFactory model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;
import za.ac.cput.tekkiestorecapstone.util.Helper;

import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

public class OrderFactory {

    public static Order createOrder(String orderId,
                                    Date orderDate,
                                    BigDecimal totalAmount,
                                    String paymentReference) {
        return createOrder(orderId, orderDate, totalAmount, OrderStatus.PENDING, paymentReference);
    }

    public static Order createOrder(String orderId,
                                    Date orderDate,
                                    BigDecimal totalAmount,
                                    OrderStatus status,
                                    String paymentReference) {

        if (Helper.isNullOrEmpty(orderId)
                || orderDate == null
                || Helper.isNullOrEmpty(paymentReference)) {
            return null;
        }

        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            return null;
        }

        OrderStatus orderStatus = (status == null) ? OrderStatus.PENDING : status;

        return new Order.Builder()
                .setOrderId(orderId)
                .setOrderDate(orderDate)
                .setSubtotal(totalAmount)
                .setTotalAmount(totalAmount)
                .setStatus(orderStatus)
                .setPaymentReference(paymentReference)
                .build();
    }

    public static Order createOrder(String orderId,
                                    Date orderDate,
                                    BigDecimal subtotal,
                                    BigDecimal shippingFee,
                                    BigDecimal totalAmount,
                                    String paymentMethod,
                                    String paymentReference,
                                    OrderStatus status,
                                    Customer customer,
                                    List<OrderItem> orderItems) {

        if (Helper.isNullOrEmpty(orderId)
                || orderDate == null
                || customer == null) {
            return null;
        }

        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) < 0 || subtotal == null || subtotal.compareTo(BigDecimal.ZERO) < 0) {
            return null;
        }

        OrderStatus orderStatus = (status == null) ? OrderStatus.PENDING : status;

        return new Order.Builder()
                .setOrderId(orderId)
                .setOrderDate(orderDate)
                .setSubtotal(subtotal)
                .setShippingFee(shippingFee)
                .setTotalAmount(totalAmount)
                .setPaymentMethod(paymentMethod)
                .setPaymentReference(paymentReference)
                .setStatus(orderStatus)
                .setCustomer(customer)
                .setOrderItems(orderItems)
                .build();
    }
}