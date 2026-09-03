# 3rd-Party Integrations & RESTful API Guide
**Project:** TekkieStoreCapstone  
**Author:** Lyle Solomons  

---

## 1. Quick Overview

In this project, we use two third-party tools to handle data and media efficiently:

| Tool | Where It Lives | Purpose |
|---|---|---|
| **Cloudinary** | Backend (Spring Boot) | Hosts, optimizes, and delivers shoe photos via CDN so MySQL only stores simple URL strings. |
| **Axios** | Frontend (React) | Sends HTTP requests (`GET`, `POST`) from React to Spring Boot REST endpoints and automatically parses JSON. |

---

## 2. Cloudinary Integration (Backend)

- **Official Docs:** [https://cloudinary.com/documentation/java_integration](https://cloudinary.com/documentation/java_integration)
- **GitHub SDK:** [https://github.com/cloudinary/cloudinary_java](https://github.com/cloudinary/cloudinary_java)

### Setup Steps:
1. **Maven Dependency (`pom.xml`):**
   ```xml
   <dependency>
       <groupId>com.cloudinary</groupId>
       <artifactId>cloudinary-http5</artifactId>
       <version>2.0.0</version>
   </dependency>
   ```

2. **Credentials (`application.properties`):**
   ```properties
   cloudinary.cloud-name=nuivwupa
   cloudinary.api-key=477249257479995
   cloudinary.api-secret=sCDDOSxRy3sBcLLhs8bQrtzjAcQ
   ```

3. **Configuration Bean (`CloudinaryConfig.java`):**
   Initializes Cloudinary using the credentials from `application.properties` so Spring can inject it anywhere.
   ```java
   @Bean
   public Cloudinary cloudinary() {
       Map<String, String> config = new HashMap<>();
       config.put("cloud_name", cloudName);
       config.put("api_key", apiKey);
       config.put("api_secret", apiSecret);
       config.put("secure", "true");
       return new Cloudinary(config);
   }
   ```

4. **Service Wrapper (`CloudinaryService.java`):**
   Provides helper methods to upload and delete files. Automatically partitions shoes into brand folders:
   - `uploadImage(MultipartFile, brand)` &rarr; for uploads from the web/browser.
   - `uploadFile(File, brand)` &rarr; for bulk/script uploads from disk.
   - `deleteImage(publicId)` &rarr; removes images from the cloud.

5. **Unit Testing (`CloudinaryServiceTest.java`):**
   Tests live upload functionality and asserts that Cloudinary successfully responds with a valid `https://res.cloudinary.com/...` URL and public ID.

6. **Database Seeder (`DatabaseSeeder.java`):**
   Implements Spring Boot's `CommandLineRunner` to automatically seed MySQL on startup with real sneakers (Adidas, Nike, Puma) and their corresponding live Cloudinary image URLs so `GET /shoe/getAll` returns real data immediately.

---

## 3. Axios Integration (Frontend)

- **Official Docs:** [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)
- **GitHub Repository:** [https://github.com/axios/axios](https://github.com/axios/axios)

### Why Axios instead of native `fetch()`?
- **Automatic JSON Transformation:** `response.data` is already a parsed JavaScript object (no manual `await res.json()` needed).
- **Centralized Base URL:** Set `baseURL: 'http://localhost:8080'` once, so you don't repeat the full server address across components.
- **Better Error Handling:** Automatically rejects promises and jumps to `catch` on HTTP 4xx/5xx status codes.
- **Timeout Protection:** Cancels requests that hang too long (e.g. 10 seconds).

### Setup Steps:
1. **Install Package (`package.json`):**
   ```bash
   cd frontend
   npm install axios
   ```

2. **Central Client Instance (`src/services/api.ts`):**
   Creates a reusable Axios instance configured to communicate with the Spring Boot server:
   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:8080',
     headers: {
       'Content-Type': 'application/json',
     },
     timeout: 10000,
   });

   export default api;
   ```

3. **Data Service Wrapper (`src/services/shoeService.ts`):**
   Defines clean API methods and transforms backend entities into frontend types directly from the database:
   ```typescript
   import api from './api';

   // GET all sneakers
   export const fetchAllShoes = async () => {
     const response = await api.get('/shoe/getAll');
     return response.data;
   };

   // GET shoe by ID
   export const fetchShoeById = async (id: string) => {
     const response = await api.get(`/shoe/read/${id}`);
     return response.data;
   };
   ```

4. **Component Consumption (`CataloguePage.tsx` & `ProductDetails.tsx`):**
   Calls `fetchAllShoes()` inside React's `useEffect()` to render live products and Cloudinary images:
   ```typescript
   useEffect(() => {
     fetchAllShoes().then((shoes) => {
       setAllProducts(shoes);
     });
   }, []);
   ```

5. **CORS Configuration (Backend):**
   Because the React frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:8080`, browsers enforce Cross-Origin Resource Sharing (CORS) security.
   We enabled browser access by annotating controllers with:
   ```java
   @CrossOrigin(origins = "http://localhost:5173")
   @RestController
   @RequestMapping("/shoe")
   public class ShoeController { ... }
   ```

---

## 4. Presentation Cheatsheet (Quick Talking Points)

**Q: Why use Cloudinary instead of saving images in MySQL?**  
> *"Storing binary images in MySQL bloats the database and slows down queries. Storing URLs in MySQL while Cloudinary hosts the images gives us fast CDN delivery and zero database strain."*

**Q: Why use Axios instead of native `fetch()`?**  
> *"Axios simplifies API calls with automatic JSON transformation, centralized base URLs, and better error handling for server errors."*

**Q: How is this a RESTful integration?**  
> *"The backend exposes stateless HTTP endpoints (`GET /shoe/getAll`, `POST /shoe/create`). The frontend consumes these via Axios, receiving JSON responses with product data and Cloudinary image links."*

**Q: How did you organize your cloud folders and handle genders (Men, Women, Kids)?**  
> *"We structured folders as `shoes/<brand>/` (e.g. `shoes/adidas/`). Gender is stored as a column in MySQL rather than hardcoded into folder paths, which prevents duplicate photo uploads for unisex shoes and keeps the cloud clean for future additions like `accessories/<brand>/`."*

**Q: How did you optimize image load times for large (7MB–10MB) raw photos?**  
> *"We utilized Cloudinary's dynamic on-the-fly transformations (`f_auto,q_auto,w_800`). Cloudinary automatically compresses the image, converts it into modern WebP format, and resizes it to 800px on their global CDN, shrinking file sizes by over 95% for instant page loads."*
