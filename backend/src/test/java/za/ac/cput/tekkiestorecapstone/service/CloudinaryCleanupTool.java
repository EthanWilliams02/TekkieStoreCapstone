/* CloudinaryCleanupTool.java
Manual utility to clean up / delete Cloudinary folders or categories on demand.
Named *Tool (not *Test) and @Disabled on purpose: mvn test's default Surefire
pattern picks up any *Test.java file automatically, and this one deletes real
uploaded images - it must only ever be run one method at a time from the IDE.
Author: Lyle Solomons (230123872)
*/

package za.ac.cput.tekkiestorecapstone.service;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@Disabled("Manual utility - deletes real Cloudinary images. Remove @Disabled locally and run one method at a time from your IDE, never via mvn test.")
public class CloudinaryCleanupTool {

    private CloudinaryService cloudinaryService;

    @BeforeEach
    void setUp() {
        Cloudinary cloudinary = new Cloudinary(CloudinaryTestConfig.loadCloudinaryConfig());
        this.cloudinaryService = new CloudinaryService(cloudinary);
    }

    /**
     * Deletes the old test folder 'tekkiestore/' created during earlier testing
     */
    @Test
    void cleanupOldTekkieStoreFolder() throws Exception {
        System.out.println("Cleaning up old 'tekkiestore/' folder from earlier tests...");
        Map<?, ?> result = cloudinaryService.deleteByPrefix("tekkiestore/");
        System.out.println("Result: " + result);
        assertNotNull(result);
    }

    /**
     * Deletes all images under the 'shoes/adidas/' folder
     */
    @Test
    void cleanupAdidasFolder() throws Exception {
        System.out.println("Deleting all images in 'shoes/adidas/'...");
        Map<?, ?> result = cloudinaryService.deleteByPrefix("shoes/adidas/");
        System.out.println("Result: " + result);
        assertNotNull(result);
    }

    /**
     * Deletes all images under the 'shoes/nike/' folder
     */
    @Test
    void cleanupNikeFolder() throws Exception {
        System.out.println("Deleting all images in 'shoes/nike/'...");
        Map<?, ?> result = cloudinaryService.deleteByPrefix("shoes/nike/");
        System.out.println("Result: " + result);
        assertNotNull(result);
    }

    /**
     * Deletes all images under the 'shoes/puma/' folder
     */
    @Test
    void cleanupPumaFolder() throws Exception {
        System.out.println("Deleting all images in 'shoes/puma/'...");
        Map<?, ?> result = cloudinaryService.deleteByPrefix("shoes/puma/");
        System.out.println("Result: " + result);
        assertNotNull(result);
    }

    /**
     * Deletes all images under the 'shoes/reebok/' folder
     */
    @Test
    void cleanupReebokFolder() throws Exception {
        System.out.println("Deleting all images in 'shoes/reebok/'...");
        Map<?, ?> result = cloudinaryService.deleteByPrefix("shoes/reebok/");
        System.out.println("Result: " + result);
        assertNotNull(result);
    }

    /**
     * Deletes EVERYTHING under the 'shoes/' folder
     */
    @Test
    void cleanupAllShoesFolder() throws Exception {
        System.out.println("Deleting ALL images in 'shoes/'...");
        Map<?, ?> result = cloudinaryService.deleteByPrefix("shoes/");
        System.out.println("Result: " + result);
        assertNotNull(result);
    }
}
