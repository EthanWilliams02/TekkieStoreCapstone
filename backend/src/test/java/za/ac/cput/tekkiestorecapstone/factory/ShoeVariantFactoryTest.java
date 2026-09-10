/* ShoeVariantFactoryTest.java
Test For the Factory Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ShoeVariantFactoryTest {

    private static final Shoe validShoe = ShoeFactory.createShoe(
            "S001",
            "Nike",
            "Air Max 90",
            "Sneaker",
            "Iconic lifestyle sneaker",
            "Men",
            BigDecimal.valueOf(2499.00),
            List.of("https://res.cloudinary.com/test/nike.jpg")
    );

    private static final ShoeSize validSize = new ShoeSize.Builder()
            .setSizeValue(9.5)
            .setSizeRegion("UK")
            .build();

    @Test
    @Order(1)
    public void createShoeVariant() {
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                validShoe,
                validSize,
                "Black",
                10
        );

        assertNotNull(variant);
        assertNotNull(variant.getShoe());
        assertEquals("S001", variant.getShoe().getShoeId());
        assertEquals(validSize.getSizeValue(), variant.getSize().getSizeValue());
        assertEquals(validSize.getSizeRegion(), variant.getSize().getSizeRegion());
        assertEquals("Black", variant.getColour());
        assertEquals(10, variant.getStockQuantity());
        System.out.println(variant);
    }

    @Test
    @Order(2)
    public void createShoeVariantWithNullShoe() {
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                null,
                validSize,
                "Black",
                10
        );

        assertNull(variant);
    }

    @Test
    @Order(3)
    public void createShoeVariantWithMissingColour() {
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                validShoe,
                validSize,
                "",
                10
        );

        assertNull(variant);
    }

    @Test
    @Order(4)
    public void createShoeVariantWithNullSize() {
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                validShoe,
                null,
                "Black",
                10
        );

        assertNull(variant);
    }

    @Test
    @Order(5)
    public void createShoeVariantWithNegativeStock() {
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                validShoe,
                validSize,
                "Black",
                -5
        );

        assertNull(variant);
    }
}
