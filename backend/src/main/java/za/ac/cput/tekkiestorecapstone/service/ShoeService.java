/* ShoeService.java
ShoeService model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;

import java.util.List;

@Service
public class ShoeService implements IShoeService {
    private final ShoeRepository repo;

    // Injects the Spring Data JPA repository
    @Autowired ShoeService(ShoeRepository repo) {
        this.repo = repo;
    }

    // Saves a new shoe record
    @Override
    public Shoe create(Shoe shoe) {
        return this.repo.save(shoe);
    }

    // Looks up a shoe by ID, returns null if not found
    @Override
    public Shoe read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    // Saves changes to an existing shoe
    @Override
    public Shoe update(Shoe shoe) {
        return this.repo.save(shoe);
    }

    // Deletes a shoe by its ID
    @Override
    public boolean delete(String s) {
        this.repo.deleteById(s);
        return true;
    }

    // Returns all shoes from the database
    @Override
    public List<Shoe> getAll() {
        return this.repo.findAll();
    }
}
