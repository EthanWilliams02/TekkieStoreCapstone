# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

---

## Profile, Contact Us, Cart and Authentication Changes

This section documents all updates made to the Profile page, Contact Us page, Footer, Cart Axios integration, and Cart login requirement.

### Profile Page

- **What was fixed**:
  - In Edit Profile mode, input icons (User, Mail, Phone) previously collided with and overlapped input text, placeholder strings, borders, and form controls due to low selector specificity and competing global `.form-input` definitions from `CheckoutPage.css`.
  - Buttons in the form actions row were also made fully responsive on smaller mobile viewports.
- **Files changed**:
  - `frontend/src/components/profile/Profile.css`
- **How the icon/input overlap was solved**:
  - Re-scoped input styles under `.profile-form .form-input`, `.profile-card .form-input`, and `.input-wrapper .form-input` with `padding: 0 16px 0 46px !important;` and `box-sizing: border-box;` ensuring user typing and placeholders never collide with the icon area.
  - Positioned `.profile-form .input-icon` with `position: absolute; left: 14px; top: 50%; transform: translateY(-50%); z-index: 2; pointer-events: none;` so icons remain vertically centered and never intercept user clicks or focus.
  - Added mobile responsiveness in `@media (max-width: 480px)` ensuring `.profile-form .form-actions` stacks cleanly with full touch target width.

### Contact Us

- **Files created**:
  - `frontend/src/pages/ContactUs.tsx`: React component for the Contact Us page featuring page header, helpful topic pills, contact form, direct contact details, and quick FAQ callout.
  - `frontend/src/pages/ContactUs.css`: Responsive stylesheet following TekkieStore brand design tokens (`--brand-orange`, `--obsidian`, `--off-white`, `--pure-white`).
- **Files modified**:
  - `frontend/src/routes/index.tsx`: Registered `{ path: '/contact', element: <ContactUs /> }` within the root `<Layout />` route.
  - `frontend/src/components/shared/Footer.tsx`: Converted raw anchor link `<li><a href="/contact">Contact Us</a></li>` to `<Link to="/contact">Contact Us</Link>` using React Router.
- **How form validation works**:
  - Validates `fullName` (cannot be empty, minimum 2 characters).
  - Validates `email` (cannot be empty, strict RFC compliant email regular expression `^[^\s@]+@[^\s@]+\.[^\s@]+$`).
  - Validates `subject` (cannot be empty).
  - Validates `message` (cannot be empty, minimum 10 characters).
  - Validates fields on blur and validates the complete form upon submit.
  - Prevents form submission when any validation error is present.
  - Displays inline error indicators with `AlertCircle` icons and `aria-invalid` tags.
  - Displays a clean success banner ("Message Received!") upon valid submission and clears all input fields.

### Cart Axios Integration

- **Files created/changed**:
  - `frontend/src/services/cartService.ts`: Created dedicated Cart API service wrapping the central Axios instance.
  - `frontend/src/context/CartContext.tsx`: Connected cart state management to Spring Boot backend via Axios.
  - `frontend/src/pages/CartPage.tsx`: Added subtle loading indicator and error notice banner.
- **Axios instance & service used**:
  - Reused `frontend/src/services/api.ts` (`http://localhost:8080`) with automatic JWT bearer token attachment via request interceptors.
- **Backend endpoints called & HTTP methods**:
  - `GET /cart/read/{id}`: Retrieves existing `Cart` entity for the authenticated user.
  - `POST /cart/create`: Creates a new `Cart` entity.
  - `POST /cart/update`: Updates an existing `Cart` entity total.
  - `DELETE /cart/delete/{id}`: Deletes a `Cart` entity.
  - `GET /cartitem/getAll`: Retrieves all cart item records from Spring Boot.
  - `GET /cartitem/read/{id}`: Retrieves a specific cart item record.
  - `POST /cartitem/create`: Inserts a `CartItem` entity.
  - `POST /cartitem/update`: Updates an existing `CartItem` entity quantity and subtotal.
  - `DELETE /cartitem/delete/{id}`: Deletes a `CartItem` entity.
- **How cart state is updated**:
  - Add to cart updates local state and sends `cartService.updateCartItem` (or `createCartItem`) with composite key `${userCartId}___${product.id}-${size}` and updates total via `cartService.updateCart`.
  - Update quantity adjusts the item in state, updates the entity in Spring Boot, and recalculates the cart total.
  - Remove item deletes the entity from the database via `DELETE /cartitem/delete/{id}` and updates the cart total.
  - Clear cart iterates and deletes all user items on the backend.
- **How cart totals are calculated**:
  - Effective item price dynamically evaluates sales: `product.isOnSale && product.salePrice ? product.salePrice : product.price`.
  - Item subtotal: `effectivePrice * quantity`.
  - Cart total: sum of all line items' subtotals.
  - Shipping fee: R150 standard, or R0 when cart total is R1,000 or greater.
- **How errors are handled**:
  - All Axios operations use `try/catch` with descriptive console warnings and user-friendly inline messages.
  - If a 401 or 403 status code is returned, `logout()` is triggered and the user is redirected to `/login`.
  - Network errors gracefully fall back to local cart state to prevent UI crashes.
- **How cart count synchronization works**:
  - `cartCount` is computed from `cart.reduce((total, item) => total + item.quantity, 0)` in `CartContext`.
  - The navigation bar (`Navbar.tsx`) consumes `cartCount` directly from `useCart()`, ensuring immediate synchronization on Add to Cart, Remove, Quantity Change, and Clear Cart.

### Cart Authentication

- **How the application determines whether a user is logged in**:
  - Evaluates `isAuthenticated` from `useAuth()` (backed by `tekkie_store_auth` and `tekkie_token` in `localStorage`).
- **Which existing authentication system is reused**:
  - Reused `frontend/src/context/AuthContext.tsx` and `frontend/src/services/authService.ts`.
- **Where the Add to Cart authentication check occurs**:
  - Centralized inside `addToCart` in `frontend/src/context/CartContext.tsx`.
  - Additional protection integrated into `CatalogueProductCard.tsx` and `ProductDetails.tsx`.
- **How unauthenticated users are redirected to Login**:
  - When `addToCart` is called while `!isAuthenticated`, `router.navigate('/login')` is immediately executed and the function returns `false`.
- **Axios & Cart state prevention**:
  - When unauthenticated, no items are added to state, `cartCount` remains unchanged, and zero Axios requests are dispatched.
- **Public browsing allowed**:
  - Unauthenticated users can freely browse the Landing page, Catalogue (`/catalogue`, `/men`, `/women`, `/new-drops`, `/sale`), Product Details (`/product/:id`), Contact Us (`/contact`), FAQ (`/faq`), Privacy Policy, and Terms without being redirected.

### Backend Changes

- **Backend modifications**:
  - The existing Spring Boot backend already contains the required REST endpoints on `CartController` and `CartItemController`:
    - `CartController.java` (`/cart/create`, `/cart/read/{id}`, `/cart/update`, `/cart/delete/{id}`, `/cart/getAll`)
    - `CartItemController.java` (`/cartitem/create`, `/cartitem/read/{id}`, `/cartitem/update`, `/cartitem/delete/{id}`, `/cartitem/getAll`)
  - No modifications to the backend architecture or controller contracts were necessary; all endpoints were verified with `mvn test-compile`.

---

## Code References

- **Existing component reused from**:
  - `frontend/src/components/layout/Layout.tsx` (Main shell wrapping Navbar, Outlet, and Footer)
  - `frontend/src/components/shared/Navbar.tsx` (Shared header and dynamic cart counter badge)
  - `frontend/src/components/shared/Footer.tsx` (Shared footer and navigation link)
  - `frontend/src/components/legal/LegalPageHeader.tsx` (Accent bar and title typography inspiration)
  - `frontend/src/components/cart/CartItemCard.tsx` (Existing Cart item rendering)
  - `frontend/src/components/cart/OrderSummary.tsx` (Existing totals calculation and checkout navigation)
- **Existing Axios setup reused from**:
  - `frontend/src/services/api.ts` (Central Axios instance with base URL `http://localhost:8080` and token interceptor)
- **Existing authentication logic reused from**:
  - `frontend/src/context/AuthContext.tsx` (`useAuth`, `isAuthenticated`, `user`, `logout`)
  - `frontend/src/services/authService.ts` (`login`, `register`, `AuthResponse`, `RegisterPayload`)
- **Existing Login navigation referenced from**:
  - `frontend/src/routes/index.tsx` (React Router Data Router `router.navigate('/login')`)
- **Existing form styling referenced from**:
  - `frontend/src/components/profile/Profile.css` (Input wrappers, icons, form groups, buttons)
  - `frontend/src/components/authentication/AuthContainer.css` (Focus states, input styling, and colors)
- **Existing Spring Boot endpoints located in**:
  - `backend/src/main/java/za/ac/cput/tekkiestorecapstone/controller/CartController.java` (`/cart/**`)
  - `backend/src/main/java/za/ac/cput/tekkiestorecapstone/controller/CartItemController.java` (`/cartitem/**`)
- **Official Documentation**:
  - React Router: https://reactrouter.com/ (Data router navigation and route trees)
  - Axios: https://axios-http.com/ (HTTP client and interceptor patterns)
  - Spring Boot & Spring Data JPA: https://spring.io/projects/spring-boot (REST controllers and repository queries)
