/* ShoeController.java
ShoeController model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.service.CloudinaryService;
import za.ac.cput.tekkiestorecapstone.service.ShoeService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shoe")
@CrossOrigin(origins = "http://localhost:5173")
public class ShoeController {
    private final ShoeService service;
    private final CloudinaryService cloudinaryService;

    // Injects the shoe service and the Cloudinary upload service
    @Autowired ShoeController(ShoeService service, CloudinaryService cloudinaryService) {
        this.service = service;
        this.cloudinaryService = cloudinaryService;
    }

    // POST: Add a new shoe to the database
    @PostMapping("/create")
    public Shoe create(@Valid @RequestBody Shoe shoe) {
        return service.create(shoe);
    }

    // GET: Fetch one shoe by its ID
    @GetMapping("/read/{id}")
    public Shoe read(@PathVariable String id) {
        return service.read(id);
    }

    // POST: Save updates to an existing shoe
    @PostMapping("/update")
    public Shoe update(@Valid @RequestBody Shoe shoe) {
        return service.update(shoe);
    }

    // DELETE: Remove a shoe by its ID
    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return service.delete(id);
    }

    // GET: Fetch all shoes for the store catalogue
    @GetMapping("/getAll")
    public List<Shoe> getAll() {
        return service.getAll();
    }

    // POST: Upload a single product image (admin picks a file, gets back a hosted URL
    // to store in Shoe.imageUrls). "brand" only controls which cloud folder it's filed
    // under — the caller never needs to know or care that Cloudinary is the backing store.
    @PostMapping(value = "/upload-image", consumes = "multipart/form-data")
    public Map<String, String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "brand", required = false) String brand) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file was uploaded.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image files are allowed.");
        }
        try {
            Map<?, ?> result = cloudinaryService.uploadImage(file, brand);
            return Map.of("url", String.valueOf(result.get("secure_url")));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Image upload failed. Please try again.");
        }
    }
}
