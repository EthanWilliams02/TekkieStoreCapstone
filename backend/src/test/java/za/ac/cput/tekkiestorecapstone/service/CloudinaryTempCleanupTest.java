/* CloudinaryTempCleanupTest.java
Temporary test runner to clean up / delete Cloudinary folders or categories on demand
Author: Lyle Solomons (230123872)
*/

package za.ac.cput.tekkiestorecapstone.service;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class CloudinaryTempCleanupTest {

    private CloudinaryService cloudinaryService;

    @BeforeEach
    void setUp() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "nuivwupa");
        config.put("api_key", "477249257479995");
        config.put("api_secret", "sCDDOSxRy3sBcLLhs8bQrtzjAcQ");
        config.put("secure", "true");

        Cloudinary cloudinary = new Cloudinary(config);
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
