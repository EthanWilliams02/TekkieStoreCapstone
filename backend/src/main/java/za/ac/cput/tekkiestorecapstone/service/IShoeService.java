/* IShoeService.java
IShoeService model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

import za.ac.cput.tekkiestorecapstone.domain.Shoe;

import java.util.List;

// Service contract for Shoe operations extending generic IService
public interface IShoeService extends IService<Shoe, String> {
    List<Shoe> getAll();
}
