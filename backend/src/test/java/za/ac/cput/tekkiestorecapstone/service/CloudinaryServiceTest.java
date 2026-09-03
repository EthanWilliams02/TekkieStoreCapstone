/* CloudinaryServiceTest.java
Unit test for Cloudinary 3rd-party media service
Author: Lyle Solomons (230123872)
*/

package za.ac.cput.tekkiestorecapstone.service;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.MethodName.class)
public class CloudinaryServiceTest {

    private CloudinaryService cloudinaryService;
    private static String uploadedPublicId;

    @BeforeEach
    void setUp() {
        // Initialize Cloudinary with your credentials
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "nuivwupa");
        config.put("api_key", "477249257479995");
        config.put("api_secret", "sCDDOSxRy3sBcLLhs8bQrtzjAcQ");
        config.put("secure", "true");

        Cloudinary cloudinary = new Cloudinary(config);
        this.cloudinaryService = new CloudinaryService(cloudinary);
    }

    @Test
    void a_uploadFile() throws IOException {
        // Locate a real sample shoe image from the frontend assets
        File testFile = new File("../frontend/public/Adidas/adidas Samba OG.jpg");
        if (!testFile.exists()) {
            testFile = new File("frontend/public/Adidas/adidas Samba OG.jpg");
        }

        assertTrue(testFile.exists(), "Sample test image should exist at: " + testFile.getAbsolutePath());

        // Upload to Cloudinary under the "adidas" brand folder
        Map<?, ?> result = cloudinaryService.uploadFile(testFile, "adidas");

        assertNotNull(result, "Upload result should not be null");
        assertNotNull(result.get("secure_url"), "Upload result must contain a secure_url");

        String secureUrl = (String) result.get("secure_url");
        uploadedPublicId = (String) result.get("public_id");

        assertTrue(secureUrl.startsWith("https://res.cloudinary.com/"), "URL must be a valid Cloudinary HTTPS URL");

        System.out.println("=================================================");
        System.out.println("CLOUDINARY UPLOAD SUCCESSFUL!");
        System.out.println("Public ID:  " + uploadedPublicId);
        System.out.println("Secure URL: " + secureUrl);
        System.out.println("=================================================");
    }

    @Test
    void b_verifyCredentials() {
        assertNotNull(cloudinaryService);
        System.out.println("CloudinaryService successfully instantiated and configured.");
    }
}
