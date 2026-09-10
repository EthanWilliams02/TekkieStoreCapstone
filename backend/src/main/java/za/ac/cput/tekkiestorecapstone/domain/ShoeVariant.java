
/* ShoeVariant.java
Domain Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class ShoeVariant {
    @Id
    private String variantId;

    // Many variants belong to one Shoe; shoe_id is the FK column in shoe_variant table.
    // @JsonIgnoreProperties prevents Hibernate proxy serialisation issues and stops any
    // future bidirectional recursion if Shoe ever gains a back-reference collection.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shoe_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "variants"})
    private Shoe shoe;

    @Embedded
    @Valid
    private ShoeSize size;

    @NotBlank(message = "Colour cannot be blank")
    private String colour;

    @PositiveOrZero(message = "Stock quantity cannot be negative")
    private int stockQuantity;

    protected ShoeVariant() {}

    private ShoeVariant(Builder builder) {
        this.variantId = builder.variantId;
        this.shoe = builder.shoe;
        this.size = builder.size;
        this.colour = builder.colour;
        this.stockQuantity = builder.stockQuantity;
    }

    public String getVariantId() {
        return variantId;
    }

    public Shoe getShoe() {
        return shoe;
    }

    public ShoeSize getSize() {
        return size;
    }

    public String getColour() {
        return colour;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    @Override
    public String toString() {
        return "ShoeVariant{" +
                "variantId='" + variantId + '\'' +
                ", shoeId=" + (shoe != null ? shoe.getShoeId() : "null") +
                ", size=" + size +
                ", colour='" + colour + '\'' +
                ", stockQuantity=" + stockQuantity +
                '}';
    }

    public static class Builder {
        private String variantId;
        private Shoe shoe;
        private ShoeSize size;
        private String colour;
        private int stockQuantity;

        public Builder setVariantId(String variantId) {
            this.variantId = variantId;
            return this;
        }

        public Builder setShoe(Shoe shoe) {
            this.shoe = shoe;
            return this;
        }

        public Builder setSize(ShoeSize size) {
            this.size = size;
            return this;
        }

        public Builder setColour(String colour) {
            this.colour = colour;
            return this;
        }

        public Builder setStockQuantity(int stockQuantity) {
            this.stockQuantity = stockQuantity;
            return this;
        }

        public Builder copy(ShoeVariant shoeVariant) {
            this.variantId = shoeVariant.variantId;
            this.shoe = shoeVariant.shoe;
            this.size = shoeVariant.size;
            this.colour = shoeVariant.colour;
            this.stockQuantity = shoeVariant.stockQuantity;
            return this;
        }

        public ShoeVariant build() {
            return new ShoeVariant(this);
        }
    }
}
