/* ShoeRepository.java
ShoeRepository model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;

import java.util.List;
import java.util.Optional;

// JPA Repository providing basic CRUD operations for the Shoe entity
@Repository
public interface ShoeRepository extends JpaRepository<Shoe, String> {

    // Fetches all shoes and their images in ONE single SQL query over the cloud network
    @Query("SELECT DISTINCT s FROM Shoe s LEFT JOIN FETCH s.imageUrls")
    @Override
    List<Shoe> findAll();

    // Fetches a single shoe and its images in ONE single SQL query over the cloud network
    @Query("SELECT s FROM Shoe s LEFT JOIN FETCH s.imageUrls WHERE s.shoeId = :id")
    @Override
    Optional<Shoe> findById(@Param("id") String id);
}
