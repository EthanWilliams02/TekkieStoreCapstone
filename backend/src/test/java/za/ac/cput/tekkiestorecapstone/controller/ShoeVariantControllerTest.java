/* ShoeVariantControllerTest.java
ShoeVariantControllerTest model class
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/
package za.ac.cput.tekkiestorecapstone.controller;

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
import za.ac.cput.tekkiestorecapstone.service.ShoeVariantService;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ShoeVariantControllerTest {

    @Mock
    private ShoeVariantService service;

    @InjectMocks
    private ShoeVariantController controller;

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
                15
        );
    }

    @Test
    void a_create() {
        when(service.create(any(ShoeVariant.class))).thenReturn(shoeVariant);

        ShoeVariant created = controller.create(shoeVariant);

        assertNotNull(created);
        assertEquals(shoeVariant.getVariantId(), created.getVariantId());
        assertNotNull(created.getShoe());
        assertEquals("S001", created.getShoe().getShoeId());
        assertEquals("Black", created.getColour());
        assertEquals(15, created.getStockQuantity());
        verify(service).create(shoeVariant);

        System.out.println("ShoeVariant: " + created);
    }

    @Test
    void b_read() {
        when(service.read("V001")).thenReturn(shoeVariant);

        ShoeVariant found = controller.read("V001");

        assertNotNull(found);
        assertEquals("V001", found.getVariantId());
        assertNotNull(found.getShoe());
        assertEquals("S001", found.getShoe().getShoeId());
        assertEquals(shoeVariant.getColour(), found.getColour());
        verify(service).read("V001");

        System.out.println("ShoeVariant: " + found);
    }

    @Test
    void c_update() {
        ShoeVariant updated = new ShoeVariant.Builder()
                .copy(shoeVariant)
                .setColour("White")
                .setStockQuantity(20)
                .build();

        when(service.update(any(ShoeVariant.class))).thenReturn(updated);

        ShoeVariant result = controller.update(shoeVariant);

        assertNotNull(result);
        assertEquals("V001", result.getVariantId());
        assertEquals("White", result.getColour());
        assertEquals(20, result.getStockQuantity());
        assertNotNull(result.getShoe());
        assertEquals("S001", result.getShoe().getShoeId());
        verify(service).update(shoeVariant);

        System.out.println("Success: " + result);
    }

    @Test
    void d_delete() {
        when(service.delete("V001")).thenReturn(true);

        boolean deleted = controller.delete("V001");

        assertTrue(deleted);
        verify(service).delete("V001");

        System.out.println("Success: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(shoeVariant));

        List<ShoeVariant> variants = controller.getAll();

        assertNotNull(variants);
        assertEquals(1, variants.size());
        assertEquals(shoeVariant.getVariantId(), variants.get(0).getVariantId());
        assertNotNull(variants.get(0).getShoe());
        assertEquals("S001", variants.get(0).getShoe().getShoeId());
        verify(service).getAll();

        System.out.println("ShoeVariants: " + variants);
    }

    // -----------------------------------------------------------------------
    // GET /shoeVariant/shoe/{shoeId} tests
    // -----------------------------------------------------------------------

    @Test
    void f_getVariantsByShoeId_returnsMatchingVariants() {
        // S001: UK7 Black (10), UK8 Black (5), UK9 Black (0)
        ShoeVariant v7 = ShoeVariantFactory.createShoeVariant(
                "V001", shoe, ShoeSizeFactory.createShoeSize(7.0, "UK"), "Black", 10);
        ShoeVariant v8 = ShoeVariantFactory.createShoeVariant(
                "V002", shoe, ShoeSizeFactory.createShoeSize(8.0, "UK"), "Black", 5);
        ShoeVariant v9 = ShoeVariantFactory.createShoeVariant(
                "V003", shoe, ShoeSizeFactory.createShoeSize(9.0, "UK"), "Black", 0);

        when(service.getVariantsByShoeId("S001")).thenReturn(List.of(v7, v8, v9));

        List<ShoeVariant> result = controller.getVariantsByShoeId("S001");

        assertNotNull(result);
        assertEquals(3, result.size());
        result.forEach(v -> assertEquals("S001", v.getShoe().getShoeId()));
        // stock=0 variant must still be returned so the UI can show it as disabled
        assertTrue(result.stream().anyMatch(v -> v.getStockQuantity() == 0));
        verify(service).getVariantsByShoeId("S001");

        System.out.println("ShoeVariants by shoe: " + result);
    }

    @Test
    void g_getVariantsByShoeId_unknownShoeReturnsEmpty() {
        when(service.getVariantsByShoeId("UNKNOWN")).thenReturn(Collections.emptyList());

        List<ShoeVariant> result = controller.getVariantsByShoeId("UNKNOWN");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(service).getVariantsByShoeId("UNKNOWN");

        System.out.println("Success: empty list for unknown shoe");
    }
}
