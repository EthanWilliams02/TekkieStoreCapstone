/* ShoeFactory.java
ShoeFactory model class
Author: Lyle Solomons (230123872)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.util.Helper;

import java.util.ArrayList;
import java.util.List;

public class ShoeFactory {

    // Overloaded method preserving existing 7-argument signature
    public static Shoe createShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, double basePrice) {
        return createShoe(shoeId, brand, shoeName, category, description, gender, basePrice, new ArrayList<>());
    }

    // Method supporting list of image URLs (Cloudinary)
    public static Shoe createShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, double basePrice, List<String> imageUrls) {
        return createShoe(shoeId, brand, shoeName, category, description, gender, basePrice, 0.0, 0.0, imageUrls);
    }

    // Method supporting basePrice, salePrice, salePercentage, and imageUrls
    public static Shoe createShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, double basePrice, double salePrice, double salePercentage, List<String> imageUrls) {
        if (Helper.isNullOrEmpty(shoeId)
                || Helper.isNullOrEmpty(brand)
                || Helper.isNullOrEmpty(shoeName)
                || Helper.isNullOrEmpty(category)
                || Helper.isNullOrEmpty(description)
                || Helper.isNullOrEmpty(gender)) {
            return null;
        }

        if (basePrice < 0 || salePrice < 0 || salePercentage < 0) {
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
                .setSalePrice(salePrice)
                .setSalePercentage(salePercentage)
                .setImageUrls(imageUrls != null ? imageUrls : new ArrayList<>())
                .build();
    }

    // Convenience method that automatically calculates salePrice from salePercentage
    public static Shoe createSaleShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, double basePrice, double salePercentage, List<String> imageUrls) {
        double salePrice = 0.0;
        if (salePercentage > 0 && basePrice > 0) {
            salePrice = Math.round(basePrice * (1.0 - (salePercentage / 100.0)) * 100.0) / 100.0;
        }
        return createShoe(shoeId, brand, shoeName, category, description, gender, basePrice, salePrice, salePercentage, imageUrls);
    }
}
