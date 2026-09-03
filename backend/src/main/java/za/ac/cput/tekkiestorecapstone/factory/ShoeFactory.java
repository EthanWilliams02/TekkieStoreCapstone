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
        if (Helper.isNullOrEmpty(shoeId)
                || Helper.isNullOrEmpty(brand)
                || Helper.isNullOrEmpty(shoeName)
                || Helper.isNullOrEmpty(category)
                || Helper.isNullOrEmpty(description)
                || Helper.isNullOrEmpty(gender)) {
            return null;
        }

        if (basePrice < 0) {
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
                .setImageUrls(imageUrls != null ? imageUrls : new ArrayList<>())
                .build();
    }
}
