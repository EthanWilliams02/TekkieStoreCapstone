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
