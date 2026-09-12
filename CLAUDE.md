# TekkieStoreCapstone

A capstone e-commerce project: Spring Boot backend + React/TypeScript/Vite frontend, selling sneakers (Nike/Adidas/etc). Multi-contributor student team (GitHub: sollyBug and others — MRGamieldien, EthanWilliams02, RameezKarriem, Angelo2384), heavy use of merge-commit workflow via PRs.

## Repo layout

```
/backend    Spring Boot 4.1.0, Java 21, Maven
/frontend   React 19 + TypeScript + Vite 8
AUTHENTICATION_CHANGES.md      changelog of the JWT auth build-out (backend + frontend wiring)
THIRD_PARTY_INTEGRATIONS.md    long changelog/reference: Cloudinary, Axios, TiDB, MUI, Cart, ShoeVariant, Order/OrderItem/Customer integration
frontend/explanations/         student-facing write-ups per controller + third-party integration (Cloudinary, JWT, TiDB/MySQL, env vars) + frontend_changes/caching_strategy.md
```

Read `AUTHENTICATION_CHANGES.md` and `THIRD_PARTY_INTEGRATIONS.md` before assuming something isn't implemented — they document a lot of history in detail. `frontend/explanations/` is a parallel, more tutorial-style set of docs the team is building for their presentation — check there too before writing a new explanation from scratch.

## Backend (`backend/src/main/java/za/ac/cput/tekkiestorecapstone`)

Stack: Spring Boot 4.1.0 (`spring-boot-starter-data-jpa`, `-webmvc`, `-security`, `-validation`), Java 21, MySQL (`mysql-connector-j`), JJWT 0.12.6, Cloudinary SDK 2.0.0, `commons-validator`, `spring-dotenv` (loads `backend/env/.env`, not committed — `.env.example` is). No Maven wrapper check done; use `mvn`.

### Domain (`.../domain`) — all use Builder pattern (private ctor + static nested `Builder` + `copy(existing)`)

- `Customer` — account: id, email, password (write-only, hidden from JSON), embedded `Name`, mobileNumber, embedded `Address`.
- `Address` (`@Embeddable`) — streetNumber/streetName/suburb/city/province/postalCode. Embedded in `Customer` and `DeliveryDetails`.
- `Name` (`@Embeddable`) — firstName/middleName/lastName. Embedded in `Customer`.
- `Shoe` — catalogue product: brand, shoeName, category, description, gender, basePrice, salePrice, salePercentage, `isOnSale()` derived, `imageUrls` (`@ElementCollection` → `shoe_images` table).
- `ShoeVariant` — a SKU: many:1 `Shoe`, embedded `ShoeSize`, colour, stockQuantity.
- `ShoeSize` (`@Embeddable`) — sizeValue (double), sizeRegion (UK/US). Has `@JsonCreator` ctor. Embedded in `CartItem` and `ShoeVariant`.
- `Cart` — 1:1 lazy with `Customer`, holds `List<CartItem>` (cascade all, orphan removal), totalAmount.
- `CartItem` — refs `Cart`, `Shoe`, `ShoeVariant`, embedded `ShoeSize`, quantity, unitPrice, subTotal.
- `Order` (table `orders`) — orderDate, subtotal, shippingFee, totalAmount, paymentMethod/Reference, `OrderStatus`, many:1 `Customer`, 1:many `OrderItem` (cascade all).
- `OrderItem` — **denormalized snapshot** (shoeId/shoeName/brand/size/imageUrl copied in at order time so history survives catalogue edits), quantity, unitPrice, subTotal, many:1 `Order`.
- `OrderStatus` (enum) — PENDING, PAID, PACKED, SHIPPED, DELIVERED, CANCELLED.
- `DeliveryDetails` — 1:1 with `Order`, many:1 `Customer`, embedded `Address`, courier, trackingNumber, estimatedDeliveryDate, fullName, phone, createdAt.

Money fields use `BigDecimal` throughout (not `double`) — deliberate, to avoid float rounding errors. In tests use `BigDecimal.valueOf(x)`, never a raw primitive.

### Controllers (`.../controller`) — REST verb usage is inconsistent across controllers (some `POST` for update, Order/OrderItem use `PUT`); watch this when adding endpoints

| Controller | Base path | Endpoints |
|---|---|---|
| `AuthController` | `/auth` | POST `/register`, POST `/login` (+ exception handlers for `BadCredentialsException`→401, `IllegalArgumentException`→400) |
| `CustomerController` | `/customer` | POST `/create`, GET `/read/{id}`, POST `/update`, DELETE `/delete/{id}`, GET `/getAll` |
| `ShoeController` | `/shoe` | POST `/create`, GET `/read/{id}`, POST `/update`, DELETE `/delete/{id}`, GET `/getAll` |
| `ShoeVariantController` | `/shoeVariant` | POST `/create`, GET `/read/{id}`, POST `/update`, DELETE `/delete/{id}`, GET `/getAll`, GET `/shoe/{shoeId}` |
| `CartController` | `/cart` | POST `/create`, GET `/read/{id}`, POST `/update`, DELETE `/delete/{id}`, GET `/getAll` |
| `CartItemController` | `/cartitem` | POST `/create`, GET `/read/{id}`, POST `/update`, DELETE `/delete/{id}`, GET `/getAll`, GET `/cart/{cartId}` |
| `OrderController` | `/order` | POST `/create`, GET `/read/{id}`, PUT `/update`, DELETE `/delete/{id}`, GET `/getAll`, GET `/customer/{customerId}` |
| `OrderItemController` | `/orderItem` | POST `/create`, GET `/read/{id}`, PUT `/update`, DELETE `/delete/{id}`, GET `/getAll` |
| `DeliveryDetailsController` | `/deliverydetails` | POST `/create`, GET `/read/{id}`, POST `/update`, DELETE `/delete/{id}`, GET `/getAll`, GET `/order/{orderId}` |

`ShoeController`/`ShoeVariantController`/`CustomerController` have `@CrossOrigin` for `localhost:5173`; the rest rely solely on the global CORS bean in `SecurityConfig`.

### Services / Repositories

Convention: `I<Entity>Service` interface extends generic `IService<T, ID>`, one `@Service` impl each — mostly thin CRUD over Spring Data repos. Business logic worth knowing:
- `AuthService` — duplicate-email check on register, BCrypt hash, UUID id, issues JWT via `JwtUtil`.
- `OrderService` — validates customer exists, defaults status PENDING + orderDate, computes each `OrderItem.subTotal` server-side.
- `DeliveryDetailsService` — stamps `createdAt` on create, preserves original on update.
- `CloudinaryService` — `uploadImage`/`uploadFile`/`deleteImage`/`deleteByPrefix`, folder-partitioned `shoes/{brand}`.

Repositories are `JpaRepository<Entity, String>`. Notable custom queries: `CustomerRepository.findByEmail`, `OrderRepository.findByCustomer_CustomerId`, `DeliveryDetailsRepository.findByOrder_OrderId`, `ShoeVariantRepository.findByShoe_ShoeId`, `CartItemRepository.findByCart_CartId`/`findByShoe_ShoeId`. `ShoeRepository` overrides `findAll`/`findById` with `LEFT JOIN FETCH s.imageUrls` to dodge N+1 on the image element-collection.

A separate `.../factory` package (`ShoeFactory`, `CustomerFactory`, etc.) sits in front of the Builders doing field validation (blank/negative checks via `Helper`) — used by `DatabaseSeeder` (`CommandLineRunner`, seeds `Shoe` catalogue from hardcoded Cloudinary URLs if empty) and `ShoeVariantDataInitializer` (`ApplicationRunner`, `@Transactional`, seeds variants after).

DTOs (`.../dto`) exist **only for the auth flow**: `LoginRequest`, `RegisterRequest` (has `toCustomer()` mapper), `AuthResponse`. Every other controller binds domain entities directly as request/response bodies, controlling serialization via Jackson `@JsonIgnore`/`@JsonIgnoreProperties` (hides `password`, lazy-init proxies, back-references) instead of DTOs.

### Security — ⚠️ known gap

`SecurityConfig`: CSRF disabled, session STATELESS, CORS configured for Vite origins — but the filter chain is **`.anyRequest().permitAll()`**. `JwtUtil` generates/validates tokens and `AuthService` issues them on login/register, but **no filter is wired in** to actually read/enforce the `Authorization` header — there is no `OncePerRequestFilter` anywhere in the codebase. So every endpoint is open regardless of token validity right now. This is pre-existing, not something to silently fix — flag it if asked to touch auth/security.

### Config

`application.properties` pulls from `backend/env/.env` (via `spring-dotenv`; `.env.example` documents the keys, real `.env` is gitignored): `DB_URL`/`DB_USERNAME`/`DB_PASSWORD` (MySQL, likely TiDB Cloud Serverless per `THIRD_PARTY_INTEGRATIONS.md` §4), `CLOUDINARY_CLOUD_NAME`/`_API_KEY`/`_API_SECRET`, `JWT_SECRET`. `jwt.expiration=86400000` (24h) is hardcoded, not env-driven. `spring.jpa.hibernate.ddl-auto=update`. No `server.port` override (defaults 8080). No Spring profiles in use.

### Tests (`backend/src/test/...`)

Mirrors main for `controller/`, `service/`, `factory/`, `initializer/` only — one test class per entity in each, plus Cloudinary-specific service tests (`CloudinaryServiceTest`, `CloudinaryBulkUploadTest`, `CloudinaryTempCleanupTest`). **No tests** for `SecurityConfig`, `JwtUtil`, `PasswordEncoderConfig`, `CloudinaryConfig`, repositories, DTOs, or `DatabaseSeeder`. Run with `mvn test` from `backend/`.

## Frontend (`frontend/src`)

Stack: React 19, TypeScript 7, Vite 8, react-router-dom 7 (data router), Axios 1.20, MUI 9 (+ emotion) used sparingly (mainly `Skeleton` loaders), lucide-react + react-icons for icons. `oxlint` for linting. **No test framework configured at all** (no Jest/Vitest/RTL, no `*.test.*` files, no `test` script in `package.json`).

Scripts (`frontend/`): `npm run dev` (Vite dev server, default port 5173), `npm run build`, `npm run lint` (oxlint), `npm run preview`.

### Routing (`src/routes/index.tsx`, `createBrowserRouter`)

Two trees: routes under `<Layout />` (AnnouncementBar + Navbar + `<Outlet/>` + Footer) get chrome; `/login`, `/signup`, `/forgot-password` are bare (no navbar/footer).

Under Layout: `/` (LandingPage), `/catalogue` `/men` `/women` `/new-drops` `/sale` (all render `CataloguePage`, which reads mode from the URL to filter — see `RouteMode` type), `/product/:id` (ProductDetails), `/wishlist`, `/profile`, `/delivery-details`, `/delivery-details/:orderId`, `/delivery/:orderId` (all DeliveryDetails), `/cart`, `/checkout`, `/order-confirmation[/:orderId]`, `/privacy`, `/terms`, `/faq`, `/contact`, `/about`.

Provider nesting in `App.tsx`: `AuthProvider > WishlistProvider > CartProvider > OrderProvider > RouterProvider`. The router singleton is imported directly into `CartContext.tsx` to call `router.navigate(...)` from outside React render (for 401/redirect-to-login flows).

### Context (`src/context`)

- **AuthContext** — `isAuthenticated`, `user` (localStorage `tekkie_store_auth`; JWT in `tekkie_token`). `login`, `signup`, `logout`, `updateProfile`. Calls `authService`.
- **CartContext** — backend is source of truth (no localStorage cache). `cart`, `cartCount`, `cartTotal`, `isLoading`, `error`. `addToCart` (redirects to `/login` if unauthenticated, returns bool), `removeFromCart`, `updateQuantity`, `clearCart`, `refreshCart`. Auto-logout + redirect on 401/403 from `cartService` calls.
- **OrderContext** — localStorage `tekkie_store_orders`. `createOrder`, `getOrderById`, `fetchOrderById` (backend fallback), `setActiveOrderById`, `refreshOrders`. Computes VAT (15%), payment reference, estimated arrival client-side; maps `BackendOrder` → presentation `Order`.
- **WishlistContext** — pure client-side, localStorage `tekkie_store_wishlist`, no backend calls at all.

⚠️ Two independently-defined `Order`/`OrderItem` shapes exist — one in `src/types/profile.ts`, a different one built inline in `OrderContext.tsx`. Reconcile if refactoring order types; don't assume they're the same shape.

### Services (`src/services`)

- `api.ts` — central Axios instance, `baseURL: 'http://localhost:8080'` **hardcoded** (no `VITE_*` env indirection), request interceptor attaches `Authorization: Bearer <tekkie_token>` from localStorage. No response interceptor — 401/403 handling is manual per-context.
- `authService.ts`, `cartService.ts`, `deliveryService.ts`, `orderService.ts` (also has `formatOrderStatus()` mapping backend enum → UI label), `shoeService.ts`, `shoeVariantService.ts` — thin wrappers over the matching backend endpoints above.
- `shoeService.mapBackendShoeToProduct` also does brand/gender normalization, sale/new-drop tagging, and currently hardcodes fallback image URLs for a few specific `shoeId`s with known-broken Cloudinary assets (NIKE-014, ADI-014, ADI-013, ADI-011) — a stopgap, not a general solution; check if the underlying Cloudinary assets get fixed before assuming this list is exhaustive or still needed.

### Components (`src/components`)

One directory per feature area, each with co-located `.tsx` + `.css`: `authentication/`, `cart/`, `catalogue/`, `checkout/` (no own CSS, relies on `CheckoutPage.css`), `Delivery/`, `faq/`, `home/`, `layout/`, `legal/`, `product/`, `profile/`, `shared/` (Navbar, Footer, AnnouncementBar, ProductPriceDisplay, SizeSelector), `Wishlist/`.

### Hooks (`src/hooks`) — new, added this session's WIP

`useShoes.ts` — wraps `fetchAllShoes()` with a **module-level global in-memory cache** (`globalShoeCache`, resets on full reload) so Home/Catalogue navigations don't refetch the whole catalogue every time. Documented in `frontend/explanations/frontend_changes/caching_strategy.md`.

### Types (`src/types`)

`catalogue.ts` (`ShoeProduct`, `ShoeBrand`/`Category`/`Gender`, `RouteMode`, `CatalogueFilterState`), `profile.ts` (`UserProfile`, `Order`/`OrderItem`/`OrderStatus` — the "other" Order shape, see context note above), `shoeVariant.ts` (mirrors backend `ShoeVariant`/`ShoeSize`).

### Styling

No CSS Modules/Tailwind/styled-components despite emotion+MUI being installed. Design tokens live once in `src/index.css` `:root`: `--brand-orange: #FD6701`, `--brand-orange-hover: #E55D00`, `--obsidian: #0B0D14`, `--off-white: #F4F4F5`, `--pure-white: #FFFFFF`, `--text-main/--text-muted/--text-inverse`. Reuse these tokens rather than hardcoding new colors.

## Known issues / tech debt (as of 2026-09-11)

- Backend authorization is fully open (`anyRequest().permitAll()`) — JWT is generated but never enforced server-side.
- Two divergent `Order`/`OrderItem` type definitions on the frontend.
- No automated tests on the frontend at all.
- REST verb usage for "update" is inconsistent between controllers (mostly POST, Order/OrderItem use PUT).
- `shoeService.ts` has a small hardcoded per-shoeId image-fallback patch for broken Cloudinary URLs — a stopgap.
- Frontend API base URL is hardcoded to `http://localhost:8080`, no env-based override.
