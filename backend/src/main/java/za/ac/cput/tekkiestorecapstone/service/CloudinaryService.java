/* CloudinaryService.java
Service class to interact with Cloudinary API
Author: Lyle Solomons (230123872)
*/

package za.ac.cput.tekkiestorecapstone.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Uploads an image from a REST API request (MultipartFile)
     * 
     * @param file  The uploaded file
     * @param brand The shoe brand (e.g., "Nike", "Adidas", "Puma") used for folder
     *              partitioning
     * @return Cloudinary upload result map containing "secure_url" and "public_id"
     */
    public Map<?, ?> uploadImage(MultipartFile file, String brand) throws IOException {
        String cleanBrand = brand != null ? brand.trim().toLowerCase().replaceAll("\\s+", "_") : "general";
        String folderPath = "shoes/" + cleanBrand;

        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", folderPath,
                "use_filename", true,
                "unique_filename", false,
                "overwrite", true));
    }

    /**
     * Uploads an image from a local File path (useful for seeding and bulk uploads)
     * 
     * @param file  The local file
     * @param brand The shoe brand
     * @return Cloudinary upload result map
     */
    public Map<?, ?> uploadFile(File file, String brand) throws IOException {
        String cleanBrand = brand != null ? brand.trim().toLowerCase().replaceAll("\\s+", "_") : "general";
        String folderPath = "shoes/" + cleanBrand;

        return cloudinary.uploader().upload(file, ObjectUtils.asMap(
                "folder", folderPath,
                "use_filename", true,
                "unique_filename", false,
                "overwrite", true));
    }

    /**
     * Deletes an image from Cloudinary by its public ID
     * 
     * @param publicId Cloudinary public_id
     * @return Cloudinary destroy response map
     */
    public Map<?, ?> deleteImage(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Deletes all images matching a folder prefix (e.g., "shoes/adidas/", "shoes/nike/", "tekkiestore/")
     * @param prefix The folder or public_id prefix
     * @return Cloudinary delete result map
     */
    public Map<?, ?> deleteByPrefix(String prefix) throws Exception {
        return cloudinary.api().deleteResourcesByPrefix(prefix, ObjectUtils.emptyMap());
    }
}
