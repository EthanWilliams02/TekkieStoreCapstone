/*
 * AddressFactory.java
 * Factory for Address Value Object
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class AddressFactory {

    public static Address createAddress(
            String streetNumber,
            String streetName,
            String suburb,
            String city,
            String province,
            String postalCode) {

        if (Helper.isNullOrEmpty(streetNumber)
                || Helper.isNullOrEmpty(streetName)
                || Helper.isNullOrEmpty(suburb)
                || Helper.isNullOrEmpty(city)
                || Helper.isNullOrEmpty(postalCode)) {
            return null;
        }

        return new Address.Builder()
                .setStreetNumber(streetNumber)
                .setStreetName(streetName)
                .setSuburb(suburb)
                .setCity(city)
                .setProvince(province)
                .setPostalCode(postalCode)
                .build();
    }

    public static Address createAddress(
            String streetNumber,
            String streetName,
            String suburb,
            String city,
            String postalCode) {
        return createAddress(streetNumber, streetName, suburb, city, null, postalCode);
    }
}