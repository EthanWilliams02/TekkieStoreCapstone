/* ShoeVariantServiceTest.java
Test For the Service Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.factory.ShoeFactory;
import za.ac.cput.tekkiestorecapstone.factory.ShoeSizeFactory;
import za.ac.cput.tekkiestorecapstone.factory.ShoeVariantFactory;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ShoeVariantServiceTest {

    @Mock
    ShoeVariantRepository repo;

    @InjectMocks
    ShoeVariantService service;

    private static Shoe shoe;
    private static ShoeVariant shoeVariant;
    private static ShoeSize size;

    @BeforeEach
    void setUp() {
        shoe = ShoeFactory.createShoe(
                "S001",
                "Nike",
                "Air Max 90",
                "Sneaker",
                "Iconic lifestyle sneaker",
                "Men",
                BigDecimal.valueOf(2499.00),
                List.of("https://res.cloudinary.com/test/nike.jpg")
        );

        size = ShoeSizeFactory.createShoeSize(7.0, "UK");

        shoeVariant = ShoeVariantFactory.createShoeVariant(
                "V001",
                shoe,
                size,
                "Black",
                10
        );
    }

    @Test
    void a_create() {
        when(repo.save(any(ShoeVariant.class))).thenReturn(shoeVariant);

        ShoeVariant created = service.create(shoeVariant);

        assertNotNull(created);
        assertEquals(shoeVariant.getVariantId(), created.getVariantId());
        assertNotNull(created.getShoe());
        assertEquals("S001", created.getShoe().getShoeId());
        assertEquals("Black", created.getColour());
        assertEquals(10, created.getStockQuantity());
        verify(repo).save(shoeVariant);

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(shoeVariant.getVariantId()))
                .thenReturn(Optional.of(shoeVariant));

        ShoeVariant read = service.read(shoeVariant.getVariantId());

        assertNotNull(read);
        assertEquals("V001", read.getVariantId());
        assertNotNull(read.getShoe());
        assertEquals("S001", read.getShoe().getShoeId());
        verify(repo).findById(shoeVariant.getVariantId());

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        ShoeVariant updated = new ShoeVariant.Builder()
                .copy(shoeVariant)
                .setColour("White")
                .setStockQuantity(20)
                .build();

        when(repo.save(any(ShoeVariant.class))).thenReturn(updated);

        ShoeVariant result = service.update(shoeVariant);

        assertNotNull(result);
        assertEquals("V001", result.getVariantId());
        assertEquals("White", result.getColour());
        assertEquals(20, result.getStockQuantity());
        assertNotNull(result.getShoe());
        assertEquals("S001", result.getShoe().getShoeId());
        verify(repo).save(shoeVariant);

        System.out.println("Success: " + result);
    }

    @Test
    void d_delete() {
        boolean success = service.delete(shoeVariant.getVariantId());

        verify(repo).deleteById(shoeVariant.getVariantId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(shoeVariant));

        List<ShoeVariant> all = service.getAll();

        assertNotNull(all);
        assertEquals(1, all.size());
        assertEquals(shoeVariant.getVariantId(), all.get(0).getVariantId());
        assertNotNull(all.get(0).getShoe());
        assertEquals("S001", all.get(0).getShoe().getShoeId());
        verify(repo).findAll();

        System.out.println("Success: " + all);
    }

    // -----------------------------------------------------------------------
    // getVariantsByShoeId tests
    // -----------------------------------------------------------------------

    @Test
    void f_getVariantsByShoeId_returnsMatchingVariants() {
        // S001 has UK7 Black (stock 10), UK8 Black (stock 5), UK9 Black (stock 0)
        ShoeVariant v7Black = ShoeVariantFactory.createShoeVariant(
                "V001", shoe, ShoeSizeFactory.createShoeSize(7.0, "UK"), "Black", 10);
        ShoeVariant v8Black = ShoeVariantFactory.createShoeVariant(
                "V002", shoe, ShoeSizeFactory.createShoeSize(8.0, "UK"), "Black", 5);
        ShoeVariant v9Black = ShoeVariantFactory.createShoeVariant(
                "V003", shoe, ShoeSizeFactory.createShoeSize(9.0, "UK"), "Black", 0);

        when(repo.findByShoe_ShoeId("S001")).thenReturn(List.of(v7Black, v8Black, v9Black));

        List<ShoeVariant> result = service.getVariantsByShoeId("S001");

        assertNotNull(result);
        assertEquals(3, result.size());
        // All belong to S001
        result.forEach(v -> assertEquals("S001", v.getShoe().getShoeId()));
        // Verify stock=0 variant is still returned (UI handles disabled state)
        assertTrue(result.stream().anyMatch(v -> v.getStockQuantity() == 0));
        verify(repo).findByShoe_ShoeId("S001");

        System.out.println("Success: " + result);
    }

    @Test
    void g_getVariantsByShoeId_unknownShoeReturnsEmpty() {
        when(repo.findByShoe_ShoeId("UNKNOWN")).thenReturn(Collections.emptyList());

        List<ShoeVariant> result = service.getVariantsByShoeId("UNKNOWN");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(repo).findByShoe_ShoeId("UNKNOWN");

        System.out.println("Success: empty list for unknown shoe");
    }

    @Test
    void h_getVariantsByShoeId_multipleColours() {
        ShoeVariant blackUK7 = ShoeVariantFactory.createShoeVariant(
                "V001", shoe, ShoeSizeFactory.createShoeSize(7.0, "UK"), "Black", 10);
        ShoeVariant whiteUK7 = ShoeVariantFactory.createShoeVariant(
                "V004", shoe, ShoeSizeFactory.createShoeSize(7.0, "UK"), "White", 3);

        when(repo.findByShoe_ShoeId("S001")).thenReturn(List.of(blackUK7, whiteUK7));

        List<ShoeVariant> result = service.getVariantsByShoeId("S001");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(v -> "Black".equals(v.getColour())));
        assertTrue(result.stream().anyMatch(v -> "White".equals(v.getColour())));
        verify(repo).findByShoe_ShoeId("S001");

        System.out.println("Success: " + result);
    }
}
