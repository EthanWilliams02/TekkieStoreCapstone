/* ShoeFactory.java
ShoeFactory model class
Author: Lyle Solomons (230123872)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.util.Helper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ShoeFactory {

    // For normal shoes with no discount (sets sale to 0%)
    public static Shoe createShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, BigDecimal basePrice, List<String> imageUrls) {
        return createShoe(shoeId, brand, shoeName, category, description, gender, basePrice, BigDecimal.ZERO, imageUrls);
    }

    // Validates required fields, calculates discount price if on sale, and builds the Shoe
    public static Shoe createShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, BigDecimal basePrice, BigDecimal salePercentage, List<String> imageUrls) {
        // Validate required strings
        if (Helper.isNullOrEmpty(shoeId)
                || Helper.isNullOrEmpty(brand)
                || Helper.isNullOrEmpty(shoeName)
                || Helper.isNullOrEmpty(category)
                || Helper.isNullOrEmpty(description)
                || Helper.isNullOrEmpty(gender)) {
            return null;
        }

        // Validate prices and percentages
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0 || salePercentage == null || salePercentage.compareTo(BigDecimal.ZERO) < 0 || salePercentage.compareTo(BigDecimal.valueOf(100)) > 0) {
            return null;
        }

        return new Shoe.Builder()
                .setShoeId(shoeId)
                .setBrand(brand)
                .setShoeName(shoeName)
                .setCategory(category)
                .setDescription(description)
                .setGender(gender)
                .setBasePrice(basePrice)
                .setSale(salePercentage)
                .setImageUrls(imageUrls != null ? imageUrls : new ArrayList<>())
                .build();
    }

    // Handy alias when explicitly creating promotional sale shoes
    public static Shoe createSaleShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, BigDecimal basePrice, BigDecimal salePercentage, List<String> imageUrls) {
        return createShoe(shoeId, brand, shoeName, category, description, gender, basePrice, salePercentage, imageUrls);
    }
}
