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

import java.util.ArrayList;
import java.util.List;

//represents a shoe entity in the system.
@Entity
public class Shoe {
    @Id
    private String shoeId;
    private String brand;
    private String shoeName;
    private String category;
    private String description;
    private String gender;
    private double basePrice;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "shoe_images", joinColumns = @JoinColumn(name = "shoe_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    //Default constructor
    protected Shoe(){

    }

    // Constructor that uses the Builder object to initialize fields
    private Shoe(Builder builder){
        this.shoeId = builder.shoeId;
        this.brand = builder.brand;
        this.shoeName = builder.shoeName;
        this.category = builder.category;
        this.description = builder.description;
        this.gender = builder.gender;
        this.basePrice = builder.basePrice;
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
    public double getBasePrice() {
        return basePrice;
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
                ", basePrice='" + basePrice + '\'' +
                ", imageUrls='" + imageUrls + '\'' +
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
        private double basePrice;
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
        public Builder setBasePrice(double basePrice) {
            this.basePrice = basePrice;
            return this;
        }
        public Builder setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
            return this;
        }

        //Copies values from an existing Admin object
        public Builder copy(Shoe shoe){
            this.shoeId = shoe.shoeId;
            this.brand = shoe.brand;
            this.shoeName = shoe.shoeName;
            this.category = shoe.category;
            this.description = shoe.description;
            this.gender = shoe.gender;
            this.basePrice = shoe.basePrice;
            this.imageUrls = shoe.imageUrls != null ? new ArrayList<>(shoe.imageUrls) : new ArrayList<>();
            return this;
        }

        //Builds and returns a new Admin object
        public Shoe build(){
            return new Shoe(this);
        }
    }
}
