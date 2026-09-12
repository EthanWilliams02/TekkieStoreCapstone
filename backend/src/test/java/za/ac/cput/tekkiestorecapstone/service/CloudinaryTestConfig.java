/* CloudinaryTestConfig.java
Shared helper for the manual Cloudinary test-utilities in this package: reads Cloudinary
credentials from backend/env/.env instead of hardcoding them, so real secrets never end up
committed in source. Not used by the main app - Spring + spring-dotenv handles that.
*/

package za.ac.cput.tekkiestorecapstone.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

final class CloudinaryTestConfig {

    private CloudinaryTestConfig() {
    }

    static Map<String, String> loadCloudinaryConfig() {
        Path envFile = Path.of("env/.env");
        if (!Files.exists(envFile)) {
            envFile = Path.of("backend/env/.env");
        }
        if (!Files.exists(envFile)) {
            throw new IllegalStateException(
                    "Could not find env/.env or backend/env/.env - copy env/.env.example and fill in your own Cloudinary credentials.");
        }

        Map<String, String> values = new HashMap<>();
        try {
            for (String line : Files.readAllLines(envFile)) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                    continue;
                }
                int separator = trimmed.indexOf('=');
                values.put(trimmed.substring(0, separator).trim(), trimmed.substring(separator + 1).trim());
            }
        } catch (IOException e) {
            throw new IllegalStateException("Could not read " + envFile + " for Cloudinary test config", e);
        }

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", values.get("CLOUDINARY_CLOUD_NAME"));
        config.put("api_key", values.get("CLOUDINARY_API_KEY"));
        config.put("api_secret", values.get("CLOUDINARY_API_SECRET"));
        config.put("secure", "true");
        return config;
    }
}
