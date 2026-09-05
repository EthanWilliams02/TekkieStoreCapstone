/*
 * CustomerRepository.java
 * Repository for Customer Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.Customer;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Optional<Customer> findByEmail(String email);
}