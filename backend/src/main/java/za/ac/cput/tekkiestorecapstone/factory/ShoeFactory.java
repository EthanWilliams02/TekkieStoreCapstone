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

    // Overload for regular retail shoes (defaults salePercentage to 0.0)
    public static Shoe createShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, double basePrice, List<String> imageUrls) {
        return createShoe(shoeId, brand, shoeName, category, description, gender, basePrice, 0.0, imageUrls);
    }

    // Unified master method: handles validation, automatic salePrice calculation from salePercentage, and builds Shoe
    public static Shoe createShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, double basePrice, double salePercentage, List<String> imageUrls) {
        if (Helper.isNullOrEmpty(shoeId)
                || Helper.isNullOrEmpty(brand)
                || Helper.isNullOrEmpty(shoeName)
                || Helper.isNullOrEmpty(category)
                || Helper.isNullOrEmpty(description)
                || Helper.isNullOrEmpty(gender)) {
            return null;
        }

        if (basePrice < 0 || salePercentage < 0 || salePercentage > 100) {
            return null;
        }

        double salePrice = 0.0;
        if (salePercentage > 0) {
            salePrice = Math.round(basePrice * (1.0 - (salePercentage / 100.0)) * 100.0) / 100.0;
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

    // Convenience alias preserving explicit readability for promotional items
    public static Shoe createSaleShoe(String shoeId, String brand, String shoeName, String category, String description, String gender, double basePrice, double salePercentage, List<String> imageUrls) {
        return createShoe(shoeId, brand, shoeName, category, description, gender, basePrice, salePercentage, imageUrls);
    }
}
