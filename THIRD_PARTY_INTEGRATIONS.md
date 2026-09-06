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

**Q: How are sale prices and sale percentages handled across the application?**  
> *"The database `shoe` entity stores both `sale_price` and `sale_percentage`. When a sale percentage is applied (e.g. 20%), the discounted price is calculated and persisted in MySQL. In the frontend, on-sale shoes display a badge (`-20% OFF`), a strikethrough original price, and are filterable through a dedicated `/sale` route. The shopping cart automatically charges the discounted price upon checkout."*

---

## 5. Cart Axios Integration (Frontend ↔ Backend)

This section documents the Axios-based cart integration that connects the React frontend shopping cart to the Spring Boot backend. Cart state is persisted to the database for authenticated users while remaining functional locally for all users.

---

### 5.1 Files Created or Changed

| File | Role |
|---|---|
| `frontend/src/services/cartService.ts` | **Created.** Dedicated Axios service wrapping all cart and cart item REST endpoints. |
| `frontend/src/services/api.ts` | **Reused (unchanged).** Central Axios instance consumed by `cartService.ts`. No duplicate configuration was created. |
| `frontend/src/context/CartContext.tsx` | **Modified.** Cart state management updated to synchronize with the Spring Boot backend via `cartService.ts`. |
| `frontend/src/pages/CartPage.tsx` | **Existing page.** Cart UI was not restructured; it consumes `CartContext` as before. |

---

### 5.2 Axios Integration

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

### 5.3 Cart Backend Endpoints

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

### 5.4 Cart Service (`cartService.ts`)

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

### 5.5 Cart State Synchronization (`CartContext.tsx`)

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

### 5.6 Authentication and Axios Cart Requests

Authentication directly affects which Axios cart requests are permitted.

- **Unauthenticated users:** `addToCart` immediately redirects to `/login` and returns `false` before any Axios request is made. No cart data is sent to the backend.
- **Authenticated users:** Cart changes (add, update, remove, clear) are persisted to the Spring Boot backend via Axios.
- **Token attachment:** The JWT Bearer token is attached to all Axios requests automatically by the `api.ts` request interceptor, including cart requests.
- **401/403 handling:** If any cart Axios request receives a `401 Unauthorized` or `403 Forbidden` response, `CartContext` calls `logout()` and redirects to `/login`, consistent with the existing authentication system.

---

### 5.7 Cart Calculations

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

### 5.8 Error Handling

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

### 5.9 Code References

| Source | Used For |
|---|---|
| `frontend/src/services/api.ts` | Central Axios instance reused directly by `cartService.ts`. No new Axios instance was created. |
| `frontend/src/context/AuthContext.tsx` | `useAuth()` hook reused by `CartContext` to access `isAuthenticated`, `user`, and `logout()`. |
| `frontend/src/pages/CartPage.tsx` | Existing cart UI page, unchanged. Consumes `useCart()` from `CartContext` as before. |
| `CartController.java` | Existing Spring Boot REST controller referenced for `/cart/*` endpoint contracts. |
| `CartItemController.java` | Existing Spring Boot REST controller referenced for `/cartitem/*` endpoint contracts. |
| Axios official documentation | [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro) |
