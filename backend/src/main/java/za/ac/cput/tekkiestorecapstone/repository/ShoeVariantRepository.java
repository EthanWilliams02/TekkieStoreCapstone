
/* ShoeVariantRepository.java
Repository Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoeVariantRepository extends JpaRepository<ShoeVariant, String> {

    // Fetches all variants and their parent Shoe in ONE query instead of one
    // lazy-loaded round trip per variant over the cloud network (N+1). Deliberately
    // does NOT also join Shoe.imageUrls here: joining that collection in from the
    // variant side (343 base rows) multiplies rows per image before Hibernate can
    // de-duplicate, which is slower, not faster. imageUrls being EAGER + @BatchSize
    // on Shoe handles that separately, in a couple of batched queries.
    @Query("SELECT DISTINCT sv FROM ShoeVariant sv LEFT JOIN FETCH sv.shoe")
    @Override
    List<ShoeVariant> findAll();

    // Returns all variants whose parent Shoe has the given shoeId
    @Query("SELECT DISTINCT sv FROM ShoeVariant sv LEFT JOIN FETCH sv.shoe s WHERE s.shoeId = :shoeId")
    List<ShoeVariant> findByShoe_ShoeId(@Param("shoeId") String shoeId);
}
