# JWT (JSON Web Token) Authentication

**What is it?**  
JWT is a standard for securely transmitting information between parties as a JSON object. We use it to secure our API endpoints. When a user logs in successfully, the backend gives them a JWT (a long string of characters). For any future requests (like adding to a cart or checking out), the frontend sends this token back to prove the user is authenticated, rather than forcing them to log in every single time.

**Where is it integrated?**

1. **`pom.xml` (Dependencies):**  
   We included the `jjwt-api`, `jjwt-impl`, and `jjwt-jackson` libraries. These give us the tools needed to generate (create) and parse (read) the tokens securely.

2. **`application.properties`:**  
   Here we defined the `jwt.secret` (the private key used to sign the tokens so hackers can't forge them) and `jwt.expiration` (how long the token lasts before the user has to log in again).

3. **`security` package (Filters & Configuration):**  
   This is where Spring Security is configured. We have a filter that intercepts incoming HTTP requests, checks the headers for the `Authorization: Bearer <token>`, validates it, and then tells Spring Boot "Yes, this is a real user" or "No, reject this request."

4. **`AuthService.java` & `AuthController.java`:**  
   The controller handles the login endpoint. If the username and password are correct, the `AuthService` generates the token and sends it back to the frontend.

**Why this is a Best Practice:**  
JWTs are stateless, meaning the backend doesn't have to remember sessions in the database or server memory. This makes our backend fast, highly scalable, and perfect for modern REST APIs talking to React frontends!

**Reference / How we figured this out:**  
We learned how to implement the JWT filters and configure Spring Security 6 from the popular Baeldung Java tutorials, which provided a great step-by-step breakdown.  
Link: [Spring Security and JWT Guide by Baeldung](https://www.baeldung.com/spring-security-oauth-jwt)

---

## Role-Based Access Control (RBAC)

### Admin Logout Flow

- **What:** A logout button was added to the bottom of the admin sidebar in `AdminLayout.tsx`, positioned below the "Live Storefront" link and separated by a divider, mirroring the customer `ProfileSidebar` pattern. A matching logout button in the top navbar was also added in the same component.
- **Why:** Previously the admin dashboard had no way to end the authenticated session. The only way out was closing the tab, which left the JWT active in `localStorage` until its 24-hour expiry (per `jwt.expiration=86400000` in `application.properties`).
- **How:** The button calls `AuthContext.logout()`, which clears `tekkie_token` and `tekkie_store_auth` from `localStorage` and resets the auth state. Navigation uses `navigate('/login', { replace: true })` guarded by an `isLoggingOut` ref — the same pattern used in `Profile.tsx` — to prevent `AdminProtectedRoute` from racing the redirect and firing its own `/login` navigation first.
- **Where:**
  - `frontend/src/components/layout/AdminLayout.tsx` (sidebar button + top-navbar button, shared `handleLogout` handler, `isLoggingOut` ref)
  - `frontend/src/components/layout/AdminLayout.css` (`.admin-nav-link.logout-link` sidebar styling; `.admin-logout-btn` top-navbar styling)
  - `frontend/src/context/AuthContext.tsx` (`logout()` — reused, not modified)
  - `frontend/src/components/profile/ProfileSidebar.tsx` (the pattern this mirrors)


