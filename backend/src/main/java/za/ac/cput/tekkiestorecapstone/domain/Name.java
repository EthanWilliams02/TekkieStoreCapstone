/*
 * Name.java
 * Name Value Object
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.domain;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class Name {
    @NotBlank(message = "First name cannot be blank")
    private String firstName;
    private String middleName;
    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    protected Name(){}

    private Name(Builder build){
        this.firstName= build.firstName;
        this.middleName= build.middleName;
        this.lastName= build.lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    @Override
    public String toString() {
        return "Name{" +
                "firstName='" + firstName + '\'' +
                ", middleName='" + middleName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }

    public static class Builder{
        private String firstName;
        private String middleName;
        private String lastName;

        public Builder setFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder setMiddleName(String middleName) {
            this.middleName = middleName;
            return this;
        }

        public Builder setLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder copy(Name name){
            this.firstName= name.firstName;
            this.middleName= name.middleName;
            this.lastName = name.lastName;
            return this;
        }
        public Name build(){return new Name(this);}
    }
}
