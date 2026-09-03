/* DatabaseSeeder.java
Automatic database seeder to populate MySQL with shoes and live Cloudinary URLs
Author: Lyle Solomons (230123872)
*/

package za.ac.cput.tekkiestorecapstone.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.factory.ShoeFactory;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ShoeRepository shoeRepository;

    @Autowired
    public DatabaseSeeder(ShoeRepository shoeRepository) {
        this.shoeRepository = shoeRepository;
    }

    @Override
    public void run(String... args) {
        // Only seed if the database has no shoes
        if (shoeRepository.count() > 0) {
            System.out.println("Database already contains " + shoeRepository.count() + " shoes. Skipping seed.");
            return;
        }

        System.out.println("Seeding MySQL with sneakers and live Cloudinary URLs...");

        List<Shoe> shoes = new ArrayList<>();

        // ==========================================
        // ADIDAS
        // ==========================================
        shoes.add(ShoeFactory.createShoe("ADI-001", "Adidas", "Campus 00s", "Sneaker",
                "Chunky skate-inspired sneaker with premium suede upper and padded collar.", "Unisex", 1999.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470411/shoes/adidas/adidas_Campus_00s.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-002", "Adidas", "Gazelle Bold", "Casual",
                "Iconic Gazelle silhouette stacked on a triple-layer platform sole.", "Women", 2199.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470419/shoes/adidas/adidas_Gazelle_Bold.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-003", "Adidas", "Gazelle Blue", "Casual",
                "Timeless low-profile classic in royal blue suede with contrast white stripes.", "Unisex", 1899.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470425/shoes/adidas/adidas_Gazelle_Blue.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-004", "Adidas", "Gazelle Green", "Casual",
                "Vintage heritage trainer in collegiate green suede with gum rubber outsole.", "Unisex", 1899.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470430/shoes/adidas/adidas_Gazelle_Green.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-005", "Adidas", "Handball Spezial", "Casual",
                "Classic indoor court shoe crafted in rich suede with signature T-toe overlay.", "Unisex", 1999.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470437/shoes/adidas/adidas_Handball_Spezial.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-006", "Adidas", "Handball Spezial Sky Blue", "Casual",
                "Pastel sky blue edition of the legendary 1979 Spezial court sneaker.", "Unisex", 1999.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470445/shoes/adidas/adidas_Handball_Spezial_SkyBlue.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-007", "Adidas", "Samba OG", "Casual",
                "The street style icon. Supple leather upper, suede overlays, and classic gum sole.", "Unisex", 2099.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470452/shoes/adidas/adidas_Samba_OG.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-008", "Adidas", "Sambae", "Casual",
                "Elevated take on the Samba featuring a translucent gum platform sole.", "Women", 2299.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470475/shoes/adidas/adidas_Sambae.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-009", "Adidas", "SL 72 OG", "Trainer",
                "Lightweight retro running shoe originally debuted for the 1972 Munich games.", "Unisex", 1799.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470482/shoes/adidas/adidas_SL_72_OG.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-010", "Adidas", "Spiritain 2000 Grey", "Trainer",
                "Y2K-inspired technical runner with breathable mesh and responsive cushioning.", "Men", 2399.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470486/shoes/adidas/adidas_Spiritain_2000_Grey.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-011", "Adidas", "Spiritain 2000 Orange", "Trainer",
                "Vibrant metallic orange accents meet modern lifestyle comfort.", "Men", 2399.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470490/shoes/adidas/adidas_Spiritain_2000_Orange.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-012", "Adidas", "Superstar ADV", "Sneaker",
                "Skateboarding edition of the shell-toe classic with reinforced ollie zones.", "Unisex", 1899.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470494/shoes/adidas/adidas_Superstar_ADV.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-013", "Adidas", "Superstar II", "Casual",
                "The classic hip-hop and basketball legend with iconic rubber shell toe.", "Unisex", 1799.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470500/shoes/adidas/adidas_Superstar_II.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-014", "Adidas", "Superstar Lux", "Casual",
                "Premium luxury edition made with ultra-soft leather throughout the lining and upper.", "Unisex", 2599.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470516/shoes/adidas/adidas_Superstar_Lux.jpg")));

        shoes.add(ShoeFactory.createShoe("ADI-015", "Adidas", "VL Court Base", "Casual",
                "Clean everyday skate-style sneaker with synthetic leather and vulcanized sole.", "Men", 1299.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470519/shoes/adidas/adidas_VL_Court_Base.jpg")));

        // ==========================================
        // NIKE
        // ==========================================
        shoes.add(ShoeFactory.createShoe("NIKE-001", "Nike", "Air Max 90 Triple Black", "Sneaker",
                "Nothing as fly, nothing as proven. Stays true to its running roots with iconic Waffle sole.", "Men", 2799.00,
                Arrays.asList(
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470523/shoes/nike/Air_Max_90_Black.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470527/shoes/nike/Air_Max_90_Black_2.jpg"
                )));

        shoes.add(ShoeFactory.createShoe("NIKE-002", "Nike", "Air Max 90 University Red", "Sneaker",
                "Bold red colorway featuring Max Air cushioning and stitched overlays.", "Men", 2799.00,
                Arrays.asList(
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470531/shoes/nike/Air_Max_90_University_Red.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470535/shoes/nike/Air_Max_90_University_Red_2.jpg"
                )));

        shoes.add(ShoeFactory.createShoe("NIKE-003", "Nike", "Air Max 90 Triple White", "Sneaker",
                "Crisp all-white leather construction with visible Air Max unit in the heel.", "Unisex", 2799.00,
                Arrays.asList(
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470539/shoes/nike/Air_Max_90_White.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470552/shoes/nike/Air_Max_90_White_2.jpg"
                )));

        shoes.add(ShoeFactory.createShoe("NIKE-004", "Nike", "Air Force 1 '07 EasyOn", "Casual",
                "Hands-free collapsible heel makes stepping into an icon effortless.", "Unisex", 2399.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470556/shoes/nike/Nike_Air_Force_1_07_EasyOn.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-005", "Nike", "Air Force 1 '07", "Casual",
                "The radiance lives on. Pristine leather, crisp edges, and Air-Sole cushioning.", "Unisex", 2299.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470562/shoes/nike/Nike_Air_Force_1_07.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-006", "Nike", "Air Max 95 Big Bubble", "Sneaker",
                "Human anatomy-inspired design with graduated panels and large visible air bubbles.", "Men", 3299.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470565/shoes/nike/Nike_Air_Max_95_Big_Bubble.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-007", "Nike", "Court Vision Low", "Casual",
                "Fastbreak style meets modern comfort inspired by 1980s basketball silhouettes.", "Men", 1499.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470570/shoes/nike/Nike_Court_Vision_Low.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-008", "Nike", "Flex Train", "Trainer",
                "Lightweight, flexible training shoe built for gym workouts and agility.", "Men", 1599.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470573/shoes/nike/Nike_Flex_Train.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-009", "Nike", "SB Air Max Ishod", "Sneaker",
                "Signature skate shoe for Ishod Wair with cupsole durability and Max Air tech.", "Men", 2199.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470579/shoes/nike/Nike_SB_Air_Max_Ishod.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-010", "Nike", "SB Chron 2 Canvas", "Casual",
                "Flexible canvas skate shoe with recycled materials and comfortable foam insole.", "Unisex", 1299.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470583/shoes/nike/Nike_SB_Chron_2_Canvas.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-011", "Nike", "SB Dunk Low Pro", "Sneaker",
                "The coveted skate icon with padded tongue, Zoom Air unit, and grippy cupsole.", "Unisex", 2499.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470588/shoes/nike/Nike_SB_Dunk_Low_Pro.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-012", "Nike", "SB Force 58", "Sneaker",
                "Modern cupsole skate innovation with canvas-suede durability and heritage DNA.", "Unisex", 1699.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470598/shoes/nike/Nike_SB_Force_58.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-013", "Nike", "V5 RNR", "Trainer",
                "Futuristic running trainer with bold geometric sole tooling and breathable upper.", "Unisex", 2299.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470604/shoes/nike/Nike_V5_RNR.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-014", "Nike", "Zoom Vomero 5", "Trainer",
                "Tech-heavy early 2000s runner featuring Zoom Air cushioning and plastic cage accents.", "Unisex", 3199.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470613/shoes/nike/Nike_Zoom_Vomero_5.jpg")));

        shoes.add(ShoeFactory.createShoe("NIKE-015", "Nike", "P-6000 Black", "Trainer",
                "A mash-up of past Pegasus running shoes with breathable mesh and horizontal overlays.", "Unisex", 2399.00,
                Arrays.asList(
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470619/shoes/nike/P-6000_Black.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470626/shoes/nike/P-6000_Black_2.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470632/shoes/nike/P-6000_Black_3.jpg"
                )));

        shoes.add(ShoeFactory.createShoe("NIKE-016", "Nike", "P-6000 Metallic Silver", "Trainer",
                "Early 2000s tech aesthetics with shining metallic chrome overlays.", "Unisex", 2399.00,
                Arrays.asList(
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470639/shoes/nike/P-6000_Metalic.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470658/shoes/nike/P-6000_Metalic_2.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470663/shoes/nike/P-6000_Metalic_3.jpg"
                )));

        shoes.add(ShoeFactory.createShoe("NIKE-017", "Nike", "P-6000 Triple White", "Trainer",
                "Clean monochromatic white edition of the beloved chunky lifestyle trainer.", "Unisex", 2399.00,
                Arrays.asList(
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470680/shoes/nike/P-6000_White.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470687/shoes/nike/P-6000_White_2.jpg",
                        "https://res.cloudinary.com/nuivwupa/image/upload/v1788470693/shoes/nike/P-6000_White_3.jpg"
                )));

        // ==========================================
        // PUMA
        // ==========================================
        shoes.add(ShoeFactory.createShoe("PUM-001", "Puma", "CA Pro Classic", "Casual",
                "Heritage California 1980s court silhouette with stacked midsole and premium leather.", "Unisex", 1699.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470697/shoes/puma/PUMA_CA_Pro_Classic.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-002", "Puma", "Court Classic Clean", "Casual",
                "Minimalist tennis sneaker engineered for effortless everyday pairing.", "Unisex", 1299.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470715/shoes/puma/PUMA_Court_Classic_Clean.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-003", "Puma", "H-Street Etoile", "Trainer",
                "Reissued running spike reimagined for ultra-lightweight street fashion.", "Women", 1999.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470761/shoes/puma/PUMA_H-Street_Etoile.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-004", "Puma", "Palermo Moda", "Casual",
                "Terrace legend celebrating Italian coastal vibes with signature T-toe design.", "Women", 1799.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470766/shoes/puma/PUMA_Palermo_Moda.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-005", "Puma", "Palermo Premium", "Casual",
                "Deluxe suede and leather construction with gold foil brand callouts.", "Unisex", 1899.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470769/shoes/puma/PUMA_Palermo_Premium.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-006", "Puma", "Park Lifestyle Easy SD", "Casual",
                "Casual skate-inspired court sneaker built for weekend comfort.", "Men", 1399.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470774/shoes/puma/PUMA_Park_Lifestyle_Easy_SD.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-007", "Puma", "RS-X", "Sneaker",
                "Re-invention of the Running System silhouette with chunky extreme proportions.", "Unisex", 2199.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470778/shoes/puma/PUMA_RS-X.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-008", "Puma", "Speedcat Ballet Dress-Up II", "Casual",
                "Motorsport-meets-ballet hybrid silhouette that took TikTok street fashion by storm.", "Women", 1899.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470782/shoes/puma/PUMA_Speedcat_Ballet_Dress-Up_II.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-009", "Puma", "Speedcat OG", "Casual",
                "Formula 1 racing driver footwear repurposed for sleek low-profile streetwear.", "Unisex", 1999.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470798/shoes/puma/PUMA_Speedcat.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-010", "Puma", "Suede Bloom", "Casual",
                "Floral pastel accents bloom across the iconic 1968 Puma Suede upper.", "Women", 1699.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470808/shoes/puma/PUMA_Suede_Bloom.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-011", "Puma", "Suede Classic", "Casual",
                "The undisputed original street icon that defined b-boys and hip-hop culture.", "Unisex", 1599.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470813/shoes/puma/PUMA_Suede_Classic.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-012", "Puma", "Suede XL", "Sneaker",
                "Remixed with extra-fat laces, heavily padded tongue, and chunky skate profile.", "Unisex", 1799.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470817/shoes/puma/PUMA_Suede_XL.jpg")));

        shoes.add(ShoeFactory.createShoe("PUM-013", "Puma", "Tackle L", "Casual",
                "Low-profile retro trainer combining leather and rubber for effortless style.", "Men", 1499.00,
                List.of("https://res.cloudinary.com/nuivwupa/image/upload/v1788470820/shoes/puma/PUMA_Tackle_L.jpg")));

        // Save all shoes to MySQL
        shoeRepository.saveAll(shoes);
        System.out.println("SUCCESS: Seeded " + shoes.size() + " sneakers with live Cloudinary URLs into MySQL!");
    }
}
