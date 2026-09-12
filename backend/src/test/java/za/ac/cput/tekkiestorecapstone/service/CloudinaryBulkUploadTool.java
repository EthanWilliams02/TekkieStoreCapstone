/* CloudinaryBulkUploadTool.java
Manual utility to upload sneaker photos to Cloudinary per brand or per file.
Named *Tool (not *Test) on purpose: mvn test's default Surefire pattern picks
up any *Test.java file automatically, and this one uploads real images to a
real account - it must only ever be run one method at a time from the IDE.
Author: Lyle Solomons (230123872)
*/

package za.ac.cput.tekkiestorecapstone.service;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Disabled("Manual utility - uploads real images to Cloudinary. Remove @Disabled locally and run one method at a time from your IDE, never via mvn test.")
public class CloudinaryBulkUploadTool {

    private CloudinaryService cloudinaryService;
    private File baseDir;

    @BeforeEach
    void setUp() {
        Cloudinary cloudinary = new Cloudinary(CloudinaryTestConfig.loadCloudinaryConfig());
        this.cloudinaryService = new CloudinaryService(cloudinary);

        // Find frontend/public directory
        this.baseDir = new File("../frontend/public");
        if (!this.baseDir.exists()) {
            this.baseDir = new File("frontend/public");
        }
    }

    // =========================================================================
    // 1. SINGLE FILE UPLOAD (Edit brand & fileName here whenever you want!)
    // =========================================================================
    @Test
    void uploadSingleCustomFile() throws IOException {
        String brand = "Adidas";
        String fileName = "adidas Samba OG.jpg"; // Change to any file you want to upload!

        uploadOneFile(brand, fileName);
    }

    // =========================================================================
    // 2. BRAND-BY-BRAND UPLOADS (Run only the brand you need!)
    // =========================================================================
    @Test
    void uploadAdidasOnly() throws IOException {
        uploadBrandFolder("Adidas");
    }

    @Test
    void uploadNikeOnly() throws IOException {
        uploadBrandFolder("Nike");
    }

    @Test
    void uploadPumaOnly() throws IOException {
        uploadBrandFolder("Puma");
    }

    @Test
    void uploadAsicsOnly() throws IOException {
        uploadBrandFolder("Asics");
    }

    @Test
    void uploadNewBalanceOnly() throws IOException {
        uploadBrandFolder("New Balance");
    }

    @Test
    void uploadVansOnly() throws IOException {
        uploadBrandFolder("Vans");
    }

    @Test
    void uploadConverseOnly() throws IOException {
        uploadBrandFolder("Converse");
    }

    @Test
    void uploadReebokOnly() throws IOException {
        uploadBrandFolder("Reebok");
    }

    // =========================================================================
    // 3. UPLOAD ALL AVAILABLE BRANDS IN ONE GO
    // =========================================================================
    @Test
    void uploadAllAvailableBrands() throws IOException {
        String[] brands = {"Adidas", "Nike", "Puma", "Asics", "New Balance", "Vans", "Converse", "Reebok"};
        for (String brand : brands) {
            File folder = new File(baseDir, brand);
            if (folder.exists() && folder.isDirectory()) {
                uploadBrandFolder(brand);
            }
        }
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================
    private void uploadOneFile(String brand, String fileName) throws IOException {
        File file = new File(new File(baseDir, brand), fileName);
        assertTrue(file.exists(), "File does not exist: " + file.getAbsolutePath());

        System.out.println("Uploading single file: " + file.getName() + " under brand " + brand + "...");
        Map<?, ?> result = cloudinaryService.uploadFile(file, brand);
        assertNotNull(result);

        String secureUrl = (String) result.get("secure_url");
        String publicId = (String) result.get("public_id");

        System.out.println("Upload successful!");
        System.out.println("Public ID:  " + publicId);
        System.out.println("Secure URL: " + secureUrl);

        saveUrlToFile(brand, fileName, secureUrl);
    }

    private void uploadBrandFolder(String brand) throws IOException {
        File brandFolder = new File(baseDir, brand);
        if (!brandFolder.exists() || !brandFolder.isDirectory()) {
            System.out.println("Folder does not exist yet: " + brandFolder.getAbsolutePath());
            return;
        }

        File[] imageFiles = brandFolder.listFiles((dir, name) -> {
            String lower = name.toLowerCase();
            return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp");
        });

        if (imageFiles == null || imageFiles.length == 0) {
            System.out.println("No images found in " + brand);
            return;
        }

        System.out.println("\n>>> UPLOADING " + brand.toUpperCase() + " (" + imageFiles.length + " files)...");

        int count = 0;
        for (File file : imageFiles) {
            try {
                Map<?, ?> result = cloudinaryService.uploadFile(file, brand);
                count++;
                String secureUrl = (String) result.get("secure_url");
                System.out.println("  [" + count + "/" + imageFiles.length + "] " + file.getName() + " -> " + secureUrl);
                saveUrlToFile(brand, file.getName(), secureUrl);
            } catch (Exception e) {
                System.err.println("  FAILED: " + file.getName() + " - " + e.getMessage());
            }
        }
        System.out.println("Finished uploading " + brand + " (" + count + " files).\n");
    }

    private synchronized void saveUrlToFile(String brand, String fileName, String url) {
        File outputFile = new File("uploaded_cloudinary_urls.txt");
        try (PrintWriter writer = new PrintWriter(new FileWriter(outputFile, true))) { // 'true' = append mode
            writer.println("[" + brand.toUpperCase() + "] " + fileName + " = " + url);
        } catch (IOException e) {
            System.err.println("Could not save to file: " + e.getMessage());
        }
    }
}
