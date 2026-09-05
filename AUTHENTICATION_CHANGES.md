# Authentication System Changes & End-to-End Wiring

This document lists all changes made to implement full end-to-end authentication (Spring Boot backend + React/Vite frontend via Axios) for `TekkieStoreCapstone`.

---

## Backend Changes

- **`backend/pom.xml`**
  - Added `spring-boot-starter-security` and JJWT dependencies (`io.jsonwebtoken:jjwt-api:0.12.6`, `jjwt-impl:0.12.6`, `jjwt-jackson:0.12.6`) for password hashing, security filtering, and JWT token handling.
  - _Status:_ modified existing — added security starter and JJWT dependencies.

- **`backend/src/main/resources/application.properties`**
  - Added `jwt.secret` and `jwt.expiration` configuration properties for HMAC signing and token lifespan.
  - _Status:_ modified existing — appended JWT configuration properties.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/domain/Customer.java`**
  - Added `password` private field with getter, setter, `Builder.setPassword(...)`, updated `Builder.copy(...)` and constructor to preserve the entity's builder pattern.
  - _Status:_ modified existing — added password field and corresponding Builder and accessor methods.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/dto/LoginRequest.java`**
  - Created a DTO containing `email` and `password` fields for authentication requests.
  - _Status:_ new code.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/dto/AuthResponse.java`**
  - Created a DTO returning `customerId`, `email`, `name`, and `token` upon successful login or registration.
  - _Status:_ new code.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/dto/RegisterRequest.java`**
  - Created a DTO capturing registration parameters (`email`, `password`, `fullName`, `firstName`, `lastName`, `mobileNumber`) and converting them to domain `Customer` entity instances.
  - _Status:_ new code.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/repository/CustomerRepository.java`**
  - Added `Optional<Customer> findByEmail(String email)` query method to enable looking up existing accounts by email.
  - _Status:_ modified existing — declared `findByEmail` repository method.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/security/PasswordEncoderConfig.java`**
  - Created a Spring `@Configuration` defining a `BCryptPasswordEncoder` bean for hashing and verifying passwords.
  - _Status:_ new code.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/security/JwtUtil.java`**
  - Created a utility component for HMAC-SHA token generation (`generateToken(email)`), token validation (`validateToken(token)`), and email claim extraction (`extractEmail(token)`).
  - _Status:_ new code.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/security/SecurityConfig.java`**
  - Created a minimal Spring Security configuration permitting `/auth/**` without authentication, keeping other endpoints currently open, disabling CSRF for stateless REST, and configuring CORS for Vite dev origins (`http://localhost:5173`, `http://localhost:*`).
  - _Status:_ new code.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/service/AuthService.java`**
  - Implemented authentication business logic: `register` hashes passwords with BCrypt before saving to `CustomerRepository` and returns an `AuthResponse` with JWT; `login` verifies credentials via `passwordEncoder.matches(...)` and throws `BadCredentialsException` on failure.
  - _Status:_ new code.

- **`backend/src/main/java/za/ac/cput/tekkiestorecapstone/controller/AuthController.java`**
  - Created REST controller exposing `POST /auth/register` and `POST /auth/login`, with `@ExceptionHandler(BadCredentialsException.class)` returning a clean 401 JSON body (`{"status": 401, "error": "Unauthorized", "message": "..."}`).
  - _Status:_ new code.

- **`backend/src/test/java/za/ac/cput/tekkiestorecapstone/service/AuthServiceTest.java`**
  - Created unit tests verifying customer registration, BCrypt password encryption, JWT issuance, successful login, invalid password rejection, and non-existent email handling.
  - _Status:_ new code.

- **`backend/src/test/java/za/ac/cput/tekkiestorecapstone/controller/AuthControllerTest.java`**
  - Created unit tests verifying `AuthController` register and login endpoints and verifying that `BadCredentialsException` maps to HTTP 401.
  - _Status:_ new code.

---

## Frontend Changes

- **`frontend/src/services/api.ts`**
  - Added an Axios request interceptor that retrieves `tekkie_token` from `localStorage` and automatically attaches `Authorization: Bearer <token>` to all outgoing HTTP requests.
  - _Status:_ modified existing — added request interceptor for JWT authorization header.

- **`frontend/src/services/authService.ts`**
  - Created authentication service with `login(email, password)` and `register(payload)` making real HTTP POST calls to `/auth/login` and `/auth/register` and exporting TypeScript contract interfaces (including `mobileNumber` and `phone`).
  - _Status:_ new code.

- **`frontend/src/context/AuthContext.tsx`**
  - Replaced mocked `login` and `signup` functions with asynchronous calls to `authService`, storing the returned JWT token into `localStorage` under `tekkie_token`, setting real user data from the API response into state, passing mobile numbers, and updating `logout` to clean up user state and stored token.
  - _Status:_ modified existing — replaced mocked login() and signup() with real API calls and token persistence.

- **`frontend/src/pages/Login.tsx`**
  - Updated `handleSubmit` to await the asynchronous `login()` call, display inline error messages on rejected credentials, provide visual loading feedback on the submit button, and navigate to `/catalogue` only upon success.
  - _Status:_ modified existing — made handleSubmit async, added error and loading states, and rendered inline error feedback.

- **`frontend/src/pages/SignUp.tsx`**
  - Added mobile phone number input field (`Phone` icon from `lucide-react`, type `tel`), wired `form.phone` to state and `handleChange`, updated `handleSubmit` to validate password matching, pass `phone: form.phone` to `signup()`, and render inline error messages if registration fails.
  - _Status:_ modified existing — added mobile number field, async submit handling, and error/loading feedback.

- **`frontend/src/components/authentication/AuthContainer.css`**
  - Reverted the auth page color scheme from orange to a sleek obsidian/grey palette while preserving all structural styling: ambient background glow blobs, diffuse shadow, rounded corners, glow ring around the card border, filled inputs that turn pure white on focus, obsidian submit button with hover lift, and obsidian links with muted hover states.
  - _Status:_ modified existing — recolored accents, borders, buttons, and glow rings to black and grey.
