/*
DeliveryDetailsFactory.java
Author: Rameez Karriem
Student Number: 222357320
Date: 18 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.util.Helper;

import java.time.LocalDate;

public class DeliveryDetailsFactory {
    public static DeliveryDetails createDeliveryDetails(String deliveryId, Order order, Address address, String courier, String trackingNumber, LocalDate estimatedDeliveryDate) {
        if (Helper.isNullOrEmpty(deliveryId)
                || Helper.isNullOrEmpty(courier)
                || Helper.isNullOrEmpty(trackingNumber)) {
            return null;
        }

        if (order == null) {
            return null;
        }

        if (address == null) {
            return null;
        }

        if (estimatedDeliveryDate == null) {
            return null;
        }

        return new DeliveryDetails.Builder()
                .setDeliveryId(deliveryId)
                .setOrder(order)
                .setAddress(address)
                .setCourier(courier)
                .setTrackingNumber(trackingNumber)
                .setEstimatedDeliveryDate(estimatedDeliveryDate)
                .build();
    }
}