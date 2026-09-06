# 3rd-Party Integrations & RESTful API Guide
**Project:** TekkieStoreCapstone  
**Author:** Lyle Solomons  

---

## 1. Quick Overview

In this project, we use four third-party tools to handle data, media, cloud persistence, and user experience efficiently:

| Tool | Where It Lives | Purpose |
|---|---|---|
| **TiDB Cloud** | Cloud DBaaS (AWS Frankfurt) | Cloud-hosted, distributed MySQL-compatible database providing persistent online storage with TLS encryption so the app is accessible anywhere without a local MySQL daemon. |
| **Cloudinary** | Backend (Spring Boot) | Hosts, optimizes, and delivers shoe photos via global CDN so the database only stores lightweight URL strings. |
| **Axios** | Frontend (React) | Sends HTTP requests (`GET`, `POST`) from React to Spring Boot REST endpoints and automatically parses JSON. |
| **MUI Skeleton** | Frontend (React / Material UI) | Provides animated placeholder skeleton screens (`@mui/material/Skeleton`) during asynchronous cloud fetch requests to improve perceived performance and eliminate Cumulative Layout Shift (CLS). |

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
- **Timeout Protection:** Cancels requests that hang too long (e.g. 30 seconds for cloud roundtrips).

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
     timeout: 30000, // 30s timeout protects against premature connection aborts under cloud database latency
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

## 4. TiDB Cloud Serverless Integration (Cloud Database)

- **Official Docs:** [https://docs.pingcap.com/tidbcloud/](https://docs.pingcap.com/tidbcloud/)
- **Spring Boot Guide:** [https://docs.pingcap.com/tidbcloud/integrate-tidb-with-spring-boot](https://docs.pingcap.com/tidbcloud/integrate-tidb-with-spring-boot)
- **MySQL Connector/J Guide:** [https://dev.mysql.com/doc/connector-j/en/](https://dev.mysql.com/doc/connector-j/en/)

### Why TiDB Cloud Serverless?
- **100% MySQL Protocol Compatibility:** TiDB speaks the native MySQL 8.0 wire protocol. Our existing `com.mysql:mysql-connector-j` driver, Spring Data JPA repositories, entity relationships, and queries worked out of the box with zero Java code changes.
- **Cloud-Native & Distributed:** Eliminates dependence on `localhost:3306`. Team members and deployed frontend clients can query and mutate real cloud data from anywhere.
- **High Availability & Auto-Scaling:** Hosted on AWS Frankfurt (`eu-central-1`) with built-in replication, automated backups, and serverless compute scaling.
- **Enterprise-Grade Transport Security:** Enforces TLS 1.2/1.3 encryption across all database traffic over the public internet.

### Setup Steps:
1. **Cluster Provisioning:**
   Created a free Serverless cluster instance (`tekkiestore-db`) hosted on AWS Frankfurt (`eu-central-1`) via the TiDB Cloud Console.

2. **Database Initialization:**
   Executed schema creation via TiDB Chat2Query / SQL Editor:
   ```sql
   CREATE DATABASE tekkiestore_db;
   ```

3. **DataSource Configuration (`backend/src/main/resources/application.properties`):**
   Configured Spring Boot's HikariCP connection pool with the remote gateway and identity verification:
   ```properties
   spring.datasource.url=jdbc:mysql://gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/tekkiestore_db?sslMode=VERIFY_IDENTITY&useUnicode=true&characterEncoding=utf8
   spring.datasource.username=2Hq9uUcv1XQhb1H.root
   spring.datasource.password=kaWqFVCZevV4uOoM
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   spring.jpa.hibernate.ddl-auto=update
   ```

4. **Automated Schema Provisioning (Hibernate ORM):**
   With `spring.jpa.hibernate.ddl-auto=update`, Hibernate scans our `@Entity` models (`Shoe`, `ShoeVariant`, `Customer`, `Cart`, `Order`, etc.) and automatically generates all relational tables, foreign key constraints, and indexes in `tekkiestore_db` upon startup.

5. **Automated Cloud Seeding (`DatabaseSeeder.java`):**
   Spring Boot's `DatabaseSeeder` detects an empty database on first boot (`count == 0`) and automatically seeds all 45+ sneakers with live Cloudinary image URLs directly into TiDB Cloud.

6. **Remote Cloud Latency Optimization (The N+1 Query & `JOIN FETCH` Solution):**
   - **The Challenge with Cloud DBaaS:** Connecting to a remote database in the cloud (AWS Frankfurt) introduces network latency (~150ms round trip per query) that does not exist on `localhost:3306`.
   - **The Problem (N+1 Queries):** The `Shoe` entity stores multiple Cloudinary image URLs in an `@ElementCollection`. By default, Spring Data JPA executes 1 query to fetch the shoes and then 45 separate queries across the internet to fetch each shoe's image URLs (the classic **N+1 query problem**). This took over 13 seconds and caused the frontend Axios client to hit its timeout and abort the connection (`An established connection was aborted by the software in your host machine`).
   - **The Standard Solution (`ShoeRepository.java`):**
     We defined a standard JPQL `LEFT JOIN FETCH` query on the repository:
     ```java
     @Repository
     public interface ShoeRepository extends JpaRepository<Shoe, String> {

         // Fetches all shoes and their image URLs in ONE single SQL JOIN query
         @Query("SELECT DISTINCT s FROM Shoe s LEFT JOIN FETCH s.imageUrls")
         @Override
         List<Shoe> findAll();

         // Fetches a single shoe and its images in ONE single SQL JOIN query
         @Query("SELECT s FROM Shoe s LEFT JOIN FETCH s.imageUrls WHERE s.shoeId = :id")
         @Override
         Optional<Shoe> findById(@Param("id") String id);
     }
     ```
     Hibernate now executes **one single SQL JOIN query** instead of 46 round trips. Database response time dropped from ~13.3s to ~300ms.
   - **Where We Found This Solution (Videos, Websites & Documentation):**
     - 🎥 **YouTube Tutorial:** [Thorben Janssen: "JOIN FETCH with Hibernate - The end of n+1 select issues"](https://www.youtube.com/results?search_query=thorben+janssen+join+fetch+hibernate+n%2B1) *(Java Champion Thorben Janssen demonstrates how Hibernate executes N+1 select queries and how `JOIN FETCH` forces a single SQL query).*
     - 🎥 **YouTube / Devoxx Conference Talk:** [Devoxx: "The best way to fetch associations with JPA and Hibernate"](https://www.youtube.com/results?search_query=devoxx+the+best+way+to+fetch+associations+with+jpa+and+hibernate) *(Deep dive on performance pitfalls in ORM mapping).*
     - 🌐 **Baeldung Tutorial:** [Baeldung: How to Solve the N+1 Problem in Hibernate](https://www.baeldung.com/hibernate-n1-queries) *(Comprehensive written guide detailing how to identify and eliminate N+1 queries using JPQL).*
     - 🌐 **Baeldung Tutorial:** [Baeldung: JPA Join Fetch vs Join](https://www.baeldung.com/jpa-join-vs-join-fetch) *(Explains the technical difference between an inner join and a fetch join).*
     - 🌐 **Vlad Mihalcea (Hibernate Core Contributor):** [The best way to solve the N+1 query problem with Hibernate](https://vladmihalcea.com/n-plus-1-query-problem/) *(Technical breakdown on optimizing collection fetching).*
     - 📚 **Spring Official Documentation:** [Spring Data JPA Reference: Defining Query Methods with @Query](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.query-methods.at-query) *(Official Spring documentation on overriding repository methods with JPQL).*
     - 💬 **Stack Overflow Discussion:** [Stack Overflow: "An established connection was aborted by the software in your host machine" in Spring Boot](https://stackoverflow.com/questions/28664064/an-established-connection-was-aborted-by-the-software-in-your-host-machine) *(Explains that Windows WSAECONNABORTED error code 10053 occurs when the HTTP client disconnects while the server is writing output).*

7. **Shoe Image Ordering (Main Photo Guarantee):**
   - **The Problem:** In MySQL / TiDB, the `shoe_images` table stores photos without any automatic order. For sneakers with multiple photos (like Nike P-6000 or Air Max 90), MySQL sometimes returned the back angle (`_3.jpg`) first instead of the main front photo (`shoe.jpg`). This made the catalogue display the wrong angle.
   - **The Simple Solution:**
     1. **Frontend (`src/services/shoeService.ts`):** Added a simple `sortShoeImages()` helper. It checks if an image has `_2` or `_3` in its filename. If it does not, it's the main photo and is kept at index 0.
     2. **Backend (`Shoe.java`):** Added `@OrderBy` to the `imageUrls` list so Hibernate also asks the database to sort image records.

---

## 5. Component Libraries & Material UI (MUI) Skeleton (Frontend UI/UX)

- **Official Skeleton Docs:** [https://mui.com/material-ui/react-skeleton/](https://mui.com/material-ui/react-skeleton/)
- **MUI Component Catalog:** [https://mui.com/material-ui/all-components/](https://mui.com/material-ui/all-components/)
- **NPM Package:** `@mui/material` (with peer dependencies `@emotion/react` and `@emotion/styled`)
- **GitHub Repository:** [https://github.com/mui/material-ui](https://github.com/mui/material-ui)

### What is a Component Library?
In React, everything on screen is composed of **components** (reusable pieces of UI like buttons, cards, dialogs, and loaders).
* **Without a component library:** Developers must write custom HTML (`<div>`), hundreds of lines of complex CSS (keyframes, responsive breakpoints, flexbox/grid), and manual JavaScript state handlers from scratch for every widget.
* **With a component library:** Professional teams (like Google, Material UI, or open-source foundations) design, test, optimize, and publish pre-built, accessible components as an **npm package**. You simply install the package, import the desired component, and customize its appearance using **props** (properties).

### The Standard 4-Step Workflow for ANY Component Library:
1. **Browse the Documentation:** Visit the library's website (e.g., [mui.com](https://mui.com/)) to find the component you need and preview interactive code examples.
2. **Install via npm:** Run `npm install <package-name>` inside the `frontend` directory.
3. **Import into your React file:** Use named imports at the top of your component (e.g., `import Skeleton from '@mui/material/Skeleton';`).
4. **Configure with Props:** Pass properties to control size, shape, animation, and behavior (e.g., `variant="rounded" animation="wave"`).

### Why MUI Skeleton instead of generic spinners or blank screens?
1. **Industry-Standard Component:** Material UI is the benchmark React UI component library used across enterprise web applications, built according to Google Material Design standards.
2. **Superior Perceived Performance:** Rather than presenting a blank screen or a generic spinning wheel, skeleton screens render the exact visual shape and layout of incoming shoe cards, images, titles, and buttons. This provides instant visual feedback and makes the application feel significantly faster.
3. **Eliminates Cumulative Layout Shift (CLS):** Pre-allocating exact dimensions (e.g. 300px card heights, 500px main gallery image) prevents sudden layout jumping and page reflow when cloud images and product data finish loading.
4. **Prevents Premature "Not Found" Flashes:** On the `ProductDetails` page, asynchronous database queries take a fraction of a second over the cloud. Showing a skeleton layout during this brief transition prevents the UI from prematurely flashing a false "Product Not Found" screen before data arrives.

### Setup Steps:
1. **Install Packages (`package.json`):**
   ```bash
   cd frontend
   npm install @mui/material @emotion/react @emotion/styled
   ```

2. **Trending Section Skeletons (`src/components/home/TrendingSection.tsx`):**
   When the homepage mounts, 4 animated skeleton cards render while the database query is in flight:
   ```tsx
   import Skeleton from '@mui/material/Skeleton';

   {loading ? (
     Array.from({ length: 4 }).map((_, idx) => (
       <div key={idx} className="product-card" aria-hidden="true">
         {/* 1. Rounded rectangle matching the 300px shoe image */}
         <Skeleton
           variant="rounded"       // Shape: "text" | "circular" | "rectangular" | "rounded"
           width="100%"            // Takes full container width
           height={300}            // Exact height of the product image
           animation="wave"        // Options: "wave" (shimmer across) | "pulse" (fade in/out) | false
           sx={{ borderRadius: '12px', mb: 2 }} // 'sx' is MUI's theme styling prop
         />
         {/* 2. Text lines matching brand, title, and price tags */}
         <div className="product-info">
           <Skeleton variant="text" width="35%" height={16} animation="wave" />
           <Skeleton variant="text" width="75%" height={24} animation="wave" />
           <Skeleton variant="text" width="40%" height={20} animation="wave" />
         </div>
       </div>
     ))
   ) : ...}
   ```

3. **Catalogue Grid Skeletons (`src/pages/CataloguePage.tsx`):**
   Renders a 6-card placeholder grid (`<Skeleton variant="rounded" height={280} />`) that accurately mirrors the responsive product catalogue cards until cloud data is received.

4. **Product Details Two-Column Skeleton (`src/pages/ProductDetails.tsx`):**
   Renders a 500px hero image skeleton, 3 thumbnail placeholders (85x85px), brand, title, pricing badges, and button shapes during initial load, ensuring a seamless transition to the full product view.

### Popular Component Libraries Reference Directory
| Library | Website | Best Use Cases |
|---|---|---|
| **Material UI (MUI)** | [https://mui.com/](https://mui.com/) | Enterprise web apps, comprehensive component catalogue (Skeletons, Badges, Modals, Drawers). |
| **Lucide Icons** | [https://lucide.dev/](https://lucide.dev/) | Clean, lightweight SVG icon components (used in TekkieStore for shopping cart, search, trash, arrows). |
| **Chakra UI** | [https://chakra-ui.com/](https://chakra-ui.com/) | Accessible, modular components with flexible prop-based styling. |
| **Shadcn UI** | [https://ui.shadcn.com/](https://ui.shadcn.com/) | Copy-paste Tailwind components that you directly control in your source tree. |

---

## 6. Presentation Cheatsheet (Quick Talking Points)

**Q: Why use Cloudinary instead of saving images in MySQL?**  
> *"Storing binary images in MySQL bloats the database and slows down queries. Storing URLs in MySQL while Cloudinary hosts the images gives us fast CDN delivery and zero database strain."*

**Q: Why use Axios instead of native `fetch()`?**  
> *"Axios simplifies API calls with automatic JSON transformation, centralized base URLs, configurable timeouts, and cleaner promise error handling."*

**Q: Why did you migrate the database to TiDB Cloud instead of keeping it on localhost (`localhost:3306`)?**  
> *"Localhost databases tie the project to a single machine. TiDB Cloud Serverless provides a cloud-native DBaaS hosted on AWS Frankfurt. It gives our entire team a single source of truth, supports remote deployments, and guarantees high availability without maintaining local MySQL server daemons."*

**Q: Did you have to rewrite your repositories or queries to support TiDB Cloud?**  
> *"No. Because TiDB is 100% MySQL 8.0 protocol-compatible and our application uses Spring Data JPA / Hibernate, the persistence layer is database-agnostic. We only updated our JDBC connection string with `sslMode=VERIFY_IDENTITY` in `application.properties`."*

**Q: What is the N+1 query problem, and how did you resolve it after migrating to TiDB Cloud?**  
> *"On a local database, latency is negligible, but with a remote cloud database (AWS Frankfurt), every round trip incurs network travel time. When fetching shoes, Hibernate initially sent 1 query to get the shoes and then 45 separate queries to fetch the image collection for each shoe (N+1 queries), taking over 13 seconds. We resolved this by adding a standard JPQL `LEFT JOIN FETCH` query to `ShoeRepository`, which instructs Hibernate to fetch all shoes and images in a single SQL JOIN query in under half a second."*

**Q: Why did you experience "connection was aborted by the software in your host machine" and how was it solved?**  
> *"Axios had a 10-second timeout. Because the unoptimized remote queries took 13+ seconds, Axios terminated the request at 10 seconds. When Spring Boot finished and attempted to stream the JSON to Tomcat, the socket was already closed by the client. We solved it by optimizing `ShoeRepository` to 1 query with `JOIN FETCH` (300ms) and adjusting the Axios timeout to 30 seconds (`timeout: 30000`) in `api.ts`."*

**Q: Why use Material UI Skeletons instead of a standard spinning loading circle?**  
> *"Spinning wheels offer no visual preview of content and cause sudden layout jumping (Cumulative Layout Shift) once data loads. Skeletons from Material UI (`@mui/material/Skeleton`) provide visual wireframes of the upcoming sneaker cards, giving the user immediate visual feedback and significantly improving perceived speed."*

**Q: How is security handled when connecting to the cloud database over the internet?**  
> *"All database traffic is encrypted in transit using TLS 1.2/1.3. We configured `sslMode=VERIFY_IDENTITY` in our JDBC URL, which forces the MySQL driver to cryptographically verify the server's TLS certificate against trusted AWS Certificate Authorities, preventing man-in-the-middle attacks."*

**Q: How is this a RESTful integration?**  
> *"The backend exposes stateless HTTP endpoints (`GET /shoe/getAll`, `POST /shoe/create`). The frontend consumes these via Axios, receiving JSON responses with product data and Cloudinary image links."*

**Q: How did you organize your cloud folders and handle genders (Men, Women, Kids)?**  
> *"We structured folders as `shoes/<brand>/` (e.g. `shoes/adidas/`). Gender is stored as a column in MySQL rather than hardcoded into folder paths, which prevents duplicate photo uploads for unisex shoes and keeps the cloud clean for future additions like `accessories/<brand>/`."*

**Q: How did you optimize image load times for large (7MB–10MB) raw photos?**  
> *"We utilized Cloudinary's dynamic on-the-fly transformations (`f_auto,q_auto,w_800`). Cloudinary automatically compresses the image, converts it into modern WebP format, and resizes it to 800px on their global CDN, shrinking file sizes by over 95% for instant page loads."*

**Q: How are sale prices and sale percentages handled across the application?**  
> *"The database `shoe` entity stores both `sale_price` and `sale_percentage`. When a sale percentage is applied (e.g. 20%), the discounted price is calculated and persisted in MySQL. In the frontend, on-sale shoes display a badge (`-20% OFF`), a strikethrough original price, and are filterable through a dedicated `/sale` route. The shopping cart automatically charges the discounted price upon checkout."*

---

## 7. Cart Axios Integration (Frontend ↔ Backend)

This section documents the Axios-based cart integration that connects the React frontend shopping cart to the Spring Boot backend. Cart state is persisted to the database for authenticated users while remaining functional locally for all users.

---

### 7.1 Files Created or Changed

| File | Role |
|---|---|
| `frontend/src/services/cartService.ts` | **Created.** Dedicated Axios service wrapping all cart and cart item REST endpoints. |
| `frontend/src/services/api.ts` | **Reused (unchanged).** Central Axios instance consumed by `cartService.ts`. No duplicate configuration was created. |
| `frontend/src/context/CartContext.tsx` | **Modified.** Cart state management updated to synchronize with the Spring Boot backend via `cartService.ts`. |
| `frontend/src/pages/CartPage.tsx` | **Existing page.** Cart UI was not restructured; it consumes `CartContext` as before. |

---

### 7.2 Axios Integration

The cart integration reuses the existing central Axios instance defined in `frontend/src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});
```

- **Backend base URL:** `http://localhost:8080`
- **Communication:** All cart Axios requests are made from the React frontend to the Spring Boot REST API over HTTP.
- **JWT headers:** The existing request interceptor in `api.ts` automatically attaches the `Authorization: Bearer <token>` header from `localStorage` (`tekkie_token`) to every outgoing request. `cartService.ts` does not manage tokens directly — it inherits authentication from the shared instance.
- **No duplication:** A second Axios instance was not created. `cartService.ts` imports and reuses `api` directly.

---

### 7.3 Cart Backend Endpoints

All endpoints listed below are actually called by the frontend cart implementation.

**Cart (`/cart`)**

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/cart/read/{id}` | Retrieve a cart by its ID |
| `POST` | `/cart/create` | Create a new cart record |
| `POST` | `/cart/update` | Update an existing cart (total amount) |
| `DELETE` | `/cart/delete/{id}` | Delete a cart by ID |

**Cart Items (`/cartitem`)**

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/cartitem/getAll` | Retrieve all cart item records |
| `GET` | `/cartitem/read/{id}` | Retrieve a single cart item by ID |
| `POST` | `/cartitem/create` | Create a new cart item |
| `POST` | `/cartitem/update` | Update an existing cart item (quantity, subtotal) |
| `DELETE` | `/cartitem/delete/{id}` | Delete a cart item by ID |

> Spring Boot controllers: `CartController.java` and `CartItemController.java`.

---

### 7.4 Cart Service (`cartService.ts`)

`frontend/src/services/cartService.ts` is a dedicated service module that wraps all cart-related Axios calls. It exports a `cartService` object with the following functions:

**Cart functions:**

| Function | Axios Request | Purpose |
|---|---|---|
| `getCart(cartId)` | `GET /cart/read/{id}` | Retrieve a cart by ID. Returns `null` on failure. |
| `createCart(cart)` | `POST /cart/create` | Create a new cart entity. |
| `updateCart(cart)` | `POST /cart/update` | Update cart total. Falls back to `createCart` if the cart does not yet exist. |
| `deleteCart(cartId)` | `DELETE /cart/delete/{id}` | Delete a cart. Returns `false` on failure. |

**Cart item functions:**

| Function | Axios Request | Purpose |
|---|---|---|
| `getAllCartItems()` | `GET /cartitem/getAll` | Retrieve all cart items. Returns `[]` on failure. |
| `getCartItem(cartItemId)` | `GET /cartitem/read/{id}` | Retrieve a single cart item. Returns `null` on failure. |
| `createCartItem(cartItem)` | `POST /cartitem/create` | Create a new cart item. |
| `updateCartItem(cartItem)` | `POST /cartitem/update` | Update a cart item. Falls back to `createCartItem` if the item does not yet exist. |
| `deleteCartItem(cartItemId)` | `DELETE /cartitem/delete/{id}` | Delete a cart item. Returns `false` on failure. |

**TypeScript interfaces exported by `cartService.ts`:**

```typescript
export interface BackendCart {
  cartId: string;
  totalAmount: number;
}

export interface BackendCartItem {
  cartItemId: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}
```

---

### 7.5 Cart State Synchronization (`CartContext.tsx`)

`CartContext.tsx` manages cart state for the entire application and synchronizes it with the Spring Boot backend for authenticated users. The cart also persists locally in `localStorage` under the key `tekkie_store_cart` for resilience.

**Cart item ID scheme:**  
Each cart item is identified on the backend using a composite string key:
```
<userCartId>___<productId>-<selectedSize>
```
This allows filtering all items belonging to a specific user from the shared `GET /cartitem/getAll` response.

**`refreshCart()`:**  
On authentication, `refreshCart()` is called automatically. It:
1. Calls `getCart(userCartId)` to check if a backend cart exists.
2. Calls `getAllCartItems()` and filters items whose `cartItemId` starts with `<userCartId>___`.
3. If backend items exist, they are merged into the local cart state (quantities updated from backend).
4. If no backend items exist but local items do, they are pushed to the backend via `createCartItem` and `updateCart`.

**`addToCart(product, size, quantity)`:**  
1. Updates local state immediately for instant UI feedback.
2. Calls `updateCartItem(...)` to upsert the item on the backend (falls back to `createCartItem` on 404/failure).
3. Calls `updateCart(...)` to update the cart total.

**`updateQuantity(cartId, quantity)`:**  
1. Updates local state.
2. Calls `updateCartItem(...)` with the new quantity and recalculated subtotal.
3. Recalculates the full cart total and calls `updateCart(...)`.

**`removeFromCart(cartId)`:**  
1. Removes the item from local state.
2. Calls `deleteCartItem(backendItemId)`.
3. Recalculates the cart total and calls `updateCart(...)`.

**`clearCart()`:**  
1. Clears local state to `[]`.
2. Iterates over all previous items and calls `deleteCartItem` for each.
3. Calls `updateCart(...)` with `totalAmount: 0`.

**Cart count:**  
`cartCount` is a `useMemo` derived value — the sum of all item quantities — consumed by the navigation bar to display a live item count badge.

---

### 7.6 Authentication and Axios Cart Requests

Authentication directly affects which Axios cart requests are permitted.

- **Unauthenticated users:** `addToCart` immediately redirects to `/login` and returns `false` before any Axios request is made. No cart data is sent to the backend.
- **Authenticated users:** Cart changes (add, update, remove, clear) are persisted to the Spring Boot backend via Axios.
- **Token attachment:** The JWT Bearer token is attached to all Axios requests automatically by the `api.ts` request interceptor, including cart requests.
- **401/403 handling:** If any cart Axios request receives a `401 Unauthorized` or `403 Forbidden` response, `CartContext` calls `logout()` and redirects to `/login`, consistent with the existing authentication system.

---

### 7.7 Cart Calculations

Pricing logic in `CartContext.tsx` accounts for sale prices:

| Value | Calculation |
|---|---|
| **Effective unit price** | `product.salePrice` if `product.isOnSale && product.salePrice`, otherwise `product.price` |
| **Line subtotal** | `effectiveUnitPrice × quantity` |
| **Cart total** | Sum of all line subtotals (`cartTotal` via `useMemo`) |
| **Backend `subTotal`** | Sent to Spring Boot as `unitPrice × quantity` per cart item |
| **Backend `totalAmount`** | Sent to Spring Boot as the recalculated full cart total on every mutation |

Shipping is not calculated in `CartContext.tsx`.

---

### 7.8 Error Handling

| Scenario | Handling |
|---|---|
| Backend cart/item request fails | Wrapped in `try/catch`; a warning is logged to the console (`console.warn`). Local cart state is unaffected. |
| `getCart` / `getAllCartItems` fails | Returns `null` or `[]` gracefully; the local cart continues to function. |
| `createCart` / `createCartItem` fails | Exception propagates to the caller's `catch` block in `CartContext`. |
| `updateCart` / `updateCartItem` fails | Falls back to the corresponding `create` call inside `cartService.ts`. |
| `deleteCartItem` fails | Returns `false`; warning logged. |
| Network timeout | Axios cancels the request after 10 000 ms (set in `api.ts`). |
| `401` / `403` response | `CartContext` calls `logout()` and navigates to `/login`. |
| `isLoading` state | Set to `true` during `refreshCart()` and `false` on completion. Consumers can render loading indicators. |
| `error` state | A user-facing string `'Unable to synchronize cart with the server. Local cart remains active.'` is set on `refreshCart` failure for non-auth errors. |

The local cart stored in `localStorage` acts as a fallback — if any backend call fails, the user's cart items remain visible and usable in the UI.

---

### 7.9 Code References

| Source | Used For |
|---|---|
| `frontend/src/services/api.ts` | Central Axios instance reused directly by `cartService.ts`. No new Axios instance was created. |
| `frontend/src/context/AuthContext.tsx` | `useAuth()` hook reused by `CartContext` to access `isAuthenticated`, `user`, and `logout()`. |
| `frontend/src/pages/CartPage.tsx` | Existing cart UI page, unchanged. Consumes `useCart()` from `CartContext` as before. |
| `CartController.java` | Existing Spring Boot REST controller referenced for `/cart/*` endpoint contracts. |
| `CartItemController.java` | Existing Spring Boot REST controller referenced for `/cartitem/*` endpoint contracts. |
| Axios official documentation | [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro) |
