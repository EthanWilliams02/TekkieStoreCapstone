import { ShoeProduct } from '../types/catalogue';

/**
 * All shoe products are fetched dynamically from the Spring Boot REST API
 * (GET http://localhost:8080/shoe/getAll) connected to MySQL and Cloudinary.
 */
export const SHOES_DATA: ShoeProduct[] = [];
