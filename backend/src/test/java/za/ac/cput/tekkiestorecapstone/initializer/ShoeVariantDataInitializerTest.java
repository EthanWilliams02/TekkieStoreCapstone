/* ShoeVariantDataInitializerTest.java
 * Test suite for the ShoeVariantDataInitializer component.
 * Author: Redah Gamieldien (222641681)
 */

package za.ac.cput.tekkiestorecapstone.initializer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.factory.ShoeFactory;
import za.ac.cput.tekkiestorecapstone.factory.ShoeSizeFactory;
import za.ac.cput.tekkiestorecapstone.factory.ShoeVariantFactory;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShoeVariantDataInitializerTest {

    @Mock
    private ShoeRepository shoeRepository;

    @Mock
    private ShoeVariantRepository shoeVariantRepository;

    @InjectMocks
    private ShoeVariantDataInitializer initializer;

    private Shoe menShoe;
    private Shoe womenShoe;

    @BeforeEach
    void setUp() {
        menShoe = ShoeFactory.createShoe(
                "NIKE-001",
                "Nike",
                "Air Max 90 Triple Black",
                "Sneaker",
                "Classic runner",
                "Men",
                BigDecimal.valueOf(2599.00),
                List.of("https://example.com/nike.jpg")
        );

        womenShoe = ShoeFactory.createShoe(
                "ADI-001",
                "Adidas",
                "Gazelle Blue",
                "Casual",
                "Retro classic",
                "Women",
                BigDecimal.valueOf(1899.00),
                List.of("https://example.com/adi.jpg")
        );
    }

    @Test
    void testSeedShoeVariants_whenTableEmpty_seedsAllShoes() {
        when(shoeRepository.findAll()).thenReturn(List.of(menShoe, womenShoe));
        when(shoeVariantRepository.findByShoe_ShoeId("NIKE-001")).thenReturn(Collections.emptyList());
        when(shoeVariantRepository.findByShoe_ShoeId("ADI-001")).thenReturn(Collections.emptyList());

        int seeded = initializer.seedShoeVariants();

        // Men has 7 sizes (6-12), Women has 7 sizes (3-9) -> 14 total
        assertEquals(14, seeded);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ShoeVariant>> captor = ArgumentCaptor.forClass(List.class);
        verify(shoeVariantRepository).saveAll(captor.capture());

        List<ShoeVariant> saved = captor.getValue();
        assertEquals(14, saved.size());

        // Check men's variant details
        ShoeVariant menVariant = saved.stream()
                .filter(v -> v.getShoe().getShoeId().equals("NIKE-001") && v.getSize().getSizeValue() == 6.0)
                .findFirst()
                .orElse(null);

        assertNotNull(menVariant);
        assertEquals("NIKE-001-UK6", menVariant.getVariantId());
        assertEquals("Black", menVariant.getColour());
        assertEquals("UK", menVariant.getSize().getSizeRegion());
        assertTrue(menVariant.getStockQuantity() >= 0);

        // Check women's variant details
        ShoeVariant womenVariant = saved.stream()
                .filter(v -> v.getShoe().getShoeId().equals("ADI-001") && v.getSize().getSizeValue() == 3.0)
                .findFirst()
                .orElse(null);

        assertNotNull(womenVariant);
        assertEquals("ADI-001-UK3", womenVariant.getVariantId());
        assertEquals("Blue", womenVariant.getColour());
        assertEquals("UK", womenVariant.getSize().getSizeRegion());
    }

    @Test
    void testSeedShoeVariants_whenVariantsAlreadyExist_doesNotDuplicate() {
        when(shoeRepository.findAll()).thenReturn(List.of(menShoe));

        ShoeSize size = ShoeSizeFactory.createShoeSize(8.0, "UK");
        ShoeVariant existing = ShoeVariantFactory.createShoeVariant(
                "NIKE-001-UK8", menShoe, size, "Black", 10
        );

        when(shoeVariantRepository.findByShoe_ShoeId("NIKE-001")).thenReturn(List.of(existing));

        int seeded = initializer.seedShoeVariants();

        assertEquals(0, seeded);
        verify(shoeVariantRepository, never()).saveAll(anyList());
    }

    @Test
    void testDetermineSizesByGender() {
        double[] menSizes = ShoeVariantDataInitializer.determineSizesByGender("Men");
        assertArrayEquals(new double[]{6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0}, menSizes);

        double[] womenSizes = ShoeVariantDataInitializer.determineSizesByGender("Women");
        assertArrayEquals(new double[]{3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0}, womenSizes);

        double[] unisexSizes = ShoeVariantDataInitializer.determineSizesByGender("Unisex");
        assertArrayEquals(new double[]{4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0}, unisexSizes);

        // Null/default fallback
        double[] defaultSizes = ShoeVariantDataInitializer.determineSizesByGender(null);
        assertArrayEquals(new double[]{6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0}, defaultSizes);
    }

    @Test
    void testExtractColour() {
        assertEquals("Black", ShoeVariantDataInitializer.extractColour("Air Max 90 Triple Black"));
        assertEquals("White", ShoeVariantDataInitializer.extractColour("Air Max 90 Triple White"));
        assertEquals("Red", ShoeVariantDataInitializer.extractColour("Air Max 90 University Red"));
        assertEquals("Blue", ShoeVariantDataInitializer.extractColour("Gazelle Blue"));
        assertEquals("Green", ShoeVariantDataInitializer.extractColour("Gazelle Green"));
        assertEquals("Grey", ShoeVariantDataInitializer.extractColour("Spiritain 2000 Grey"));
        assertEquals("Orange", ShoeVariantDataInitializer.extractColour("Spiritain 2000 Orange"));
        assertEquals("Silver", ShoeVariantDataInitializer.extractColour("P-6000 Metallic Silver"));
        assertEquals("Original", ShoeVariantDataInitializer.extractColour("Superstar Custom"));
        assertEquals("Original", ShoeVariantDataInitializer.extractColour(null));
    }

    @Test
    void testFormatSizeLabel() {
        assertEquals("6", ShoeVariantDataInitializer.formatSizeLabel(6.0));
        assertEquals("8_5", ShoeVariantDataInitializer.formatSizeLabel(8.5));
        assertEquals("11", ShoeVariantDataInitializer.formatSizeLabel(11.0));
    }

    @Test
    void testCalculateStockQuantity() {
        int stock = ShoeVariantDataInitializer.calculateStockQuantity("NIKE-001", 0, 7);
        assertTrue(stock >= 0 && stock <= 15);
    }
}
