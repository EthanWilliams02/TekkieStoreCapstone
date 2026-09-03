/* ShoeControllerTest.java
ShoeControllerTest model class
Author: Lyle Solomons (230123872)
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
import za.ac.cput.tekkiestorecapstone.factory.ShoeFactory;
import za.ac.cput.tekkiestorecapstone.service.ShoeService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ShoeControllerTest {

    @Mock
    private ShoeService service;

    @InjectMocks
    private ShoeController controller;

    private static Shoe shoe;

    @BeforeEach
    void setUp() {
        shoe = ShoeFactory.createShoe(
                "S001",
                "Nike",
                "Air Max",
                "Sneaker",
                "Comfortable running shoe",
                "Unisex",
                2500.00
        );
    }

    @Test
    void a_create() {
        when(service.create(any(Shoe.class))).thenReturn(shoe);

        Shoe created = controller.create(shoe);

        assertNotNull(created);
        assertEquals(shoe.getShoeId(), created.getShoeId());

        System.out.println("Shoe ID: " + created);
    }

    @Test
    void b_read() {
        when(service.read("S001")).thenReturn(shoe);

        Shoe found = controller.read("S001");

        assertNotNull(found);
        assertEquals("S001", found.getShoeId());

        System.out.println("Shoe ID: " + found);
    }

    @Test
    void c_update() {
        Shoe updated = new Shoe.Builder().copy(shoe).setBrand("Ikes").build();

        when(service.update(any(Shoe.class))).thenReturn(updated);
        Shoe updatedUpdated = service.update(shoe);
        assertNotNull(updatedUpdated);

        System.out.println("Success: " + updatedUpdated);
    }

    @Test
    void d_delete() {
        when(service.delete("S001")).thenReturn(true);

        boolean deleted = controller.delete("S001");

        assertTrue(deleted);

        System.out.println("Success: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(shoe));

        List<Shoe> shoes = controller.getAll();

        assertNotNull(shoes);

        System.out.println("Shoes: " + shoes);
    }
}