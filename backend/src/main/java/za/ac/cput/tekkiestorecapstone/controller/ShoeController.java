/* ShoeController.java
ShoeController model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.service.ShoeService;

import java.util.List;

@RestController
@RequestMapping("/shoe")
@CrossOrigin(origins = "http://localhost:5173")
public class ShoeController {
    private final ShoeService service;

    // Injects the shoe service
    @Autowired ShoeController(ShoeService service) {
        this.service = service;
    }

    // POST: Add a new shoe to the database
    @PostMapping("/create")
    public Shoe create(@RequestBody Shoe shoe) {
        return service.create(shoe);
    }

    // GET: Fetch one shoe by its ID
    @GetMapping("/read/{id}")
    public Shoe read(@PathVariable String id) {
        return service.read(id);
    }

    // POST: Save updates to an existing shoe
    @PostMapping("/update")
    public Shoe update(@RequestBody Shoe shoe) {
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
}
