/* ShoeVariantDataInitializer.java
 * ApplicationRunner component to seed ShoeVariant records for all existing Shoe entities.
 * Ensures every shoe has appropriate UK size variants and sensible stock quantities.
 * Author: Redah Gamieldien (222641681)
 */

package za.ac.cput.tekkiestorecapstone.initializer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.factory.ShoeSizeFactory;
import za.ac.cput.tekkiestorecapstone.factory.ShoeVariantFactory;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
@Order(2)
public class ShoeVariantDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ShoeVariantDataInitializer.class);

    private final ShoeRepository shoeRepository;
    private final ShoeVariantRepository shoeVariantRepository;

    public ShoeVariantDataInitializer(ShoeRepository shoeRepository,
                                      ShoeVariantRepository shoeVariantRepository) {
        this.shoeRepository = shoeRepository;
        this.shoeVariantRepository = shoeVariantRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedShoeVariants();
    }

    public int seedShoeVariants() {
        List<Shoe> existingShoes = shoeRepository.findAll();
        if (existingShoes.isEmpty()) {
            log.info("[ShoeVariantInitializer] No existing shoes found in database to seed variants for.");
            return 0;
        }

        List<ShoeVariant> allNewVariants = new ArrayList<>();

        for (Shoe shoe : existingShoes) {
            String shoeId = shoe.getShoeId();
            if (shoeId == null || shoeId.trim().isEmpty()) {
                continue;
            }

            // Check if this specific shoe already has variants seeded to avoid duplicates
            List<ShoeVariant> existingVariants = shoeVariantRepository.findByShoe_ShoeId(shoeId);
            if (existingVariants != null && !existingVariants.isEmpty()) {
                log.debug("[ShoeVariantInitializer] Shoe {} already has {} variants. Skipping.", shoeId, existingVariants.size());
                continue;
            }

            List<ShoeVariant> variantsForShoe = generateVariantsForShoe(shoe);
            allNewVariants.addAll(variantsForShoe);
        }

        if (!allNewVariants.isEmpty()) {
            shoeVariantRepository.saveAll(allNewVariants);
            log.info("[ShoeVariantInitializer] Successfully seeded {} shoe variants across {} shoes.",
                    allNewVariants.size(), existingShoes.size());
        } else {
            log.info("[ShoeVariantInitializer] All shoes already have variants registered. No new variants seeded.");
        }

        return allNewVariants.size();
    }

    /**
     * Generates a list of valid ShoeVariants for a given managed Shoe entity.
     */
    public List<ShoeVariant> generateVariantsForShoe(Shoe shoe) {
        List<ShoeVariant> variants = new ArrayList<>();
        double[] sizes = determineSizesByGender(shoe.getGender());
        String colour = extractColour(shoe.getShoeName());

        for (int i = 0; i < sizes.length; i++) {
            double sizeVal = sizes[i];
            ShoeSize shoeSize = ShoeSizeFactory.createShoeSize(sizeVal, "UK");
            if (shoeSize == null) {
                continue;
            }

            String sizeLabel = formatSizeLabel(sizeVal);
            String variantId = shoe.getShoeId() + "-UK" + sizeLabel;
            int stockQuantity = calculateStockQuantity(shoe.getShoeId(), i, sizes.length);

            // Create variant using the managed shoe entity
            ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                    variantId,
                    shoe,
                    shoeSize,
                    colour,
                    stockQuantity
            );

            if (variant != null) {
                variants.add(variant);
            }
        }

        return variants;
    }

    /**
     * Determines the UK size list based on Shoe gender.
     * Men: UK 6 to 12
     * Women: UK 3 to 9
     * Unisex: UK 4 to 11
     */
    public static double[] determineSizesByGender(String gender) {
        if (gender == null) {
            return new double[]{6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0};
        }
        String g = gender.trim().toLowerCase(Locale.ROOT);
        if (g.contains("women") || g.contains("female") || g.equals("w")) {
            return new double[]{3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0};
        } else if (g.contains("unisex")) {
            return new double[]{4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0};
        } else {
            // Default to Men (or Men's sizing)
            return new double[]{6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0};
        }
    }

    public static String extractColour(String shoeName) {
        if (shoeName == null || shoeName.trim().isEmpty()) {
            return "Original";
        }

        String[] words = shoeName.trim().split("\\s+");
        String lastWord = words[words.length - 1].toLowerCase(Locale.ROOT);

        switch (lastWord) {
            case "black": return "Black";
            case "white": return "White";
            case "red": return "Red";
            case "blue":
            case "navy": return "Blue";
            case "green": return "Green";
            case "grey":
            case "gray": return "Grey";
            case "orange": return "Orange";
            case "yellow":
            case "gold": return "Yellow";
            case "pink": return "Pink";
            case "purple": return "Purple";
            case "brown": return "Brown";
            case "beige":
            case "cream":
            case "sail": return "Cream";
            case "silver": return "Silver";
            default: return "Original";
        }
    }

    /**
     * Formats size label to avoid floating point trailing zeroes, and format half sizes safely.
     * e.g., 6.0 -> "6", 8.5 -> "8_5"
     */
    public static String formatSizeLabel(double size) {
        if (size == Math.floor(size)) {
            return String.valueOf((int) size);
        } else {
            return String.valueOf(size).replace('.', '_');
        }
    }

    /**
     * Generates a sensible stock quantity (5 to 15), with an occasional 0 for demo/testing out-of-stock sizes.
     * Deterministic based on shoeId hash and size index so it doesn't change randomly across restarts.
     */
    public static int calculateStockQuantity(String shoeId, int sizeIndex, int totalSizes) {
        // Deterministic baseline stock between 5 and 15
        int hash = Math.abs((shoeId + sizeIndex).hashCode());
        int stock = 5 + (hash % 11); // 5 to 15

        // Let the last size be out of stock (0) for roughly 1 in every 3 shoes to demonstrate the disabled UI state
        int shoeNum = Math.abs(shoeId.hashCode());
        if (shoeNum % 3 == 0 && sizeIndex == totalSizes - 1) {
            return 0;
        }

        return stock;
    }
}
