/* ShoeFactoryTest.java
ShoeFactoryTest model class
Author: Lyle Solomons (230123872)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

// Enables tests to run in order using @Order
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ShoeFactoryTest {

    private final List<String> sampleImages = List.of(
            "https://res.cloudinary.com/test/image1.jpg",
            "https://res.cloudinary.com/test/image2.jpg"
    );

    @Test
    @Order(1)
    public void createShoe() {
        Shoe shoe = ShoeFactory.createShoe(
                "S001",
                "Adidas",
                "Campus 00s",
                "Sneaker",
                "Comfortable everyday sneaker",
                "Unisex",
                1999.00,
                sampleImages
        );
        assertNotNull(shoe);
        assertEquals("S001", shoe.getShoeId());
        assertEquals("Adidas", shoe.getBrand());
        assertEquals(1999.00, shoe.getBasePrice());
        assertEquals(0.0, shoe.getSalePrice());
        assertEquals(0.0, shoe.getSalePercentage());
        assertFalse(shoe.isOnSale());
        assertEquals(2, shoe.getImageUrls().size());
        System.out.println("Regular shoe created: " + shoe);
    }

    @Test
    @Order(2)
    public void createShoeWithoutBrand() {
        Shoe shoe = ShoeFactory.createShoe(
                "S001",
                "",
                "Campus 00s",
                "Sneaker",
                "Comfortable everyday sneaker",
                "Unisex",
                1999.00,
                sampleImages
        );
        assertNull(shoe);
    }

    @Test
    @Order(3)
    public void createSaleShoe() {
        Shoe saleShoe = ShoeFactory.createSaleShoe(
                "S002",
                "Nike",
                "Air Max 90",
                "Sneaker",
                "Classic visible air cushioning",
                "Unisex",
                2000.00,
                20.0,
                sampleImages
        );
        assertNotNull(saleShoe);
        assertEquals("S002", saleShoe.getShoeId());
        assertEquals(2000.00, saleShoe.getBasePrice());
        assertEquals(1600.00, saleShoe.getSalePrice());
        assertEquals(20.0, saleShoe.getSalePercentage());
        assertTrue(saleShoe.isOnSale());
        System.out.println("Sale shoe created: " + saleShoe);
    }

    @Test
    @Order(4)
    public void createSaleShoeWithNegativePercentage() {
        Shoe saleShoe = ShoeFactory.createSaleShoe(
                "S003",
                "Nike",
                "Air Max 90",
                "Sneaker",
                "Classic visible air cushioning",
                "Unisex",
                2000.00,
                -15.0,
                sampleImages
        );
        assertNull(saleShoe);
    }

    @Test
    @Order(5)
    public void createShoeWithNegativePrice() {
        Shoe shoe = ShoeFactory.createShoe(
                "S004",
                "Nike",
                "Air Max 90",
                "Sneaker",
                "Classic visible air cushioning",
                "Unisex",
                -100.00,
                sampleImages
        );
        assertNull(shoe);
    }

    @Test
    @Order(6)
    public void createShoeWithSalePercentageDirectly() {
        Shoe shoe = ShoeFactory.createShoe(
                "S005",
                "Puma",
                "Suede Classic",
                "Casual",
                "Iconic suede silhouette",
                "Unisex",
                1500.00,
                10.0,
                sampleImages
        );
        assertNotNull(shoe);
        assertEquals(1350.00, shoe.getSalePrice());
        assertEquals(10.0, shoe.getSalePercentage());
        assertTrue(shoe.isOnSale());
    }
}