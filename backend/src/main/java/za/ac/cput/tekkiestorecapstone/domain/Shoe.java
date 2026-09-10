/* Shoe.java
Shoe model class
Author: Lyle Solomons (230123872)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderBy;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.math.RoundingMode;

import java.util.ArrayList;
import java.util.List;

// Main JPA entity mapped to the shoe table
@Entity
public class Shoe {
    @Id
    private String shoeId;
    @NotBlank(message = "Brand is required")
    private String brand;
    @NotBlank(message = "Shoe name is required")
    private String shoeName;
    @NotBlank(message = "Category is required")
    private String category;
    private String description;
    @NotBlank(message = "Gender is required")
    private String gender;
    
    @PositiveOrZero(message = "Base price cannot be negative")
    private BigDecimal basePrice;
    @PositiveOrZero(message = "Sale price cannot be negative")
    private BigDecimal salePrice;
    @PositiveOrZero(message = "Sale percentage cannot be negative")
    private BigDecimal salePercentage;

    // Stores multiple Cloudinary image URLs in a separate child table (shoe_images)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "shoe_images", joinColumns = @JoinColumn(name = "shoe_id"))
    @Column(name = "image_url")
    @OrderBy
    private List<String> imageUrls = new ArrayList<>();

    // Required default constructor for JPA
    protected Shoe(){

    }

    // Private constructor used by the Builder pattern
    private Shoe(Builder builder){
        this.shoeId = builder.shoeId;
        this.brand = builder.brand;
        this.shoeName = builder.shoeName;
        this.category = builder.category;
        this.description = builder.description;
        this.gender = builder.gender;
        this.basePrice = builder.basePrice;
        this.salePrice = builder.salePrice;
        this.salePercentage = builder.salePercentage;
        this.imageUrls = builder.imageUrls != null ? builder.imageUrls : new ArrayList<>();
    }

    // Getter methods to access private fields
    public String getShoeId() {
        return shoeId;
    }

    public String getBrand() {
        return brand;
    }
    public String getShoeName() {
        return shoeName;
    }
    public String getCategory() {
        return category;
    }
    public String getDescription() {
        return description;
    }
    public String getGender() {
        return gender;
    }
    public BigDecimal getBasePrice() {
        return basePrice;
    }
    public BigDecimal getSalePrice() {
        return salePrice;
    }
    public BigDecimal getSalePercentage() {
        return salePercentage;
    }
    public boolean isOnSale() {
        return salePercentage != null && salePercentage.compareTo(BigDecimal.ZERO) > 0 
                && salePrice != null && salePrice.compareTo(BigDecimal.ZERO) > 0;
    }
    public List<String> getImageUrls() {
        return imageUrls;
    }

    @Override
    public String toString() {
        return "Shoe{" +
                "shoeId='" + shoeId + '\'' +
                ", brand='" + brand + '\'' +
                ", shoeName='" + shoeName + '\'' +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", gender='" + gender + '\'' +
                ", basePrice=" + basePrice +
                ", salePrice=" + salePrice +
                ", salePercentage=" + salePercentage +
                ", imageUrls=" + imageUrls +
                '}';
    }

    // Static Builder class that implements the Builder Design Pattern.
    public static class Builder{
        private String shoeId;
        private String brand;
        private String shoeName;
        private String category;
        private String description;
        private String gender;
        private BigDecimal basePrice;
        private BigDecimal salePrice;
        private BigDecimal salePercentage;
        private List<String> imageUrls = new ArrayList<>();

        public Builder setShoeId(String shoeId) {
            this.shoeId = shoeId;
            return this;
        }
        public Builder setBrand(String brand) {
            this.brand = brand;
            return this;
        }
        public Builder setShoeName(String shoeName) {
            this.shoeName = shoeName;
            return this;
        }
        public Builder setCategory(String category) {
            this.category = category;
            return this;
        }
        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }
        public Builder setGender(String gender) {
            this.gender = gender;
            return this;
        }
        public Builder setBasePrice(BigDecimal basePrice) {
            this.basePrice = basePrice;
            return this;
        }
        public Builder setSalePrice(BigDecimal salePrice) {
            this.salePrice = salePrice;
            return this;
        }
        public Builder setSalePercentage(BigDecimal salePercentage) {
            this.salePercentage = salePercentage;
            return this;
        }
        // Calculates sale price automatically when a discount percentage is applied
        public Builder setSale(BigDecimal salePercentage) {
            this.salePercentage = salePercentage;
            if (salePercentage != null && salePercentage.compareTo(BigDecimal.ZERO) > 0 && this.basePrice != null && this.basePrice.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountFactor = BigDecimal.ONE.subtract(salePercentage.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                this.salePrice = this.basePrice.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);
            } else {
                this.salePrice = BigDecimal.ZERO;
            }
            return this;
        }
        public Builder setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
            return this;
        }

        // Copies values from an existing Shoe instance
        public Builder copy(Shoe shoe){
            this.shoeId = shoe.shoeId;
            this.brand = shoe.brand;
            this.shoeName = shoe.shoeName;
            this.category = shoe.category;
            this.description = shoe.description;
            this.gender = shoe.gender;
            this.basePrice = shoe.basePrice;
            this.salePrice = shoe.salePrice;
            this.salePercentage = shoe.salePercentage;
            this.imageUrls = shoe.imageUrls != null ? new ArrayList<>(shoe.imageUrls) : new ArrayList<>();
            return this;
        }

        // Returns the newly constructed immutable Shoe object
        public Shoe build(){
            return new Shoe(this);
        }
    }
}
