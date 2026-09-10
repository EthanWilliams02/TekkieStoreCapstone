package za.ac.cput.tekkiestorecapstone.factory;

/* OrderItemFactory.java
OrderItemFactory model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.util.Helper;
import java.math.BigDecimal;

public class OrderItemFactory {

    public static OrderItem createOrderItem(String orderItemId,
                                            int quantity,
                                            BigDecimal unitPrice) {
        return createOrderItem(orderItemId, null, null, null, null, null, quantity, unitPrice);
    }

    public static OrderItem createOrderItem(String orderItemId,
                                            String shoeId,
                                            String shoeName,
                                            String brand,
                                            String size,
                                            String imageUrl,
                                            int quantity,
                                            BigDecimal unitPrice) {

        if (Helper.isNullOrEmpty(orderItemId)) {
            return null;
        }

        if (quantity <= 0 || unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) < 0) {
            return null;
        }

        return new OrderItem.Builder()
                .setOrderItemId(orderItemId)
                .setShoeId(shoeId)
                .setShoeName(shoeName)
                .setBrand(brand)
                .setSize(size)
                .setImageUrl(imageUrl)
                .setQuantity(quantity)
                .setUnitPrice(unitPrice)
                .setSubTotal(unitPrice.multiply(BigDecimal.valueOf(quantity)))
                .build();
    }
}