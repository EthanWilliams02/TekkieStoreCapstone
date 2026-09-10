# Environment Variables (.env)

## Overview
We use a `.env` file to store sensitive information like database passwords, Cloudinary API keys, and JWT secrets. 

## Why?
**Security.** If we hardcode passwords directly into our Java code or `application.properties`, anyone who looks at our GitHub repository can steal them. 

By putting them in a local `.env` file and adding that file to `.gitignore`, our secrets stay on our own computers and never get pushed to the internet.

## Where Does This Come From?
This is an industry standard based on **The Twelve-Factor App** methodology (specifically *Factor III: Config*). It states that all modern applications should strictly separate their configuration (passwords, URLs) from their actual source code.

## How It Works in Our App
1. **`spring-dotenv`**: We added this library to our `pom.xml`. It automatically reads the `.env` file when Spring Boot starts.
2. **`application.properties`**: Instead of real passwords, it now uses placeholders like `spring.datasource.password=${DB_PASSWORD}`.
3. **`.env.example`**: We push an empty template to GitHub so other developers know what variables they need to create their own `.env` file.

## References / Sources
- **The Twelve-Factor App (Config)**: [https://12factor.net/config](https://12factor.net/config) (The industry manifesto that established this practice)
- **Spring-Dotenv Library**: [https://github.com/paulschwarz/spring-dotenv](https://github.com/paulschwarz/spring-dotenv) (The official documentation for the library we used)
- **Baeldung Tutorial**: [Properties with Spring and Spring Boot](https://www.baeldung.com/properties-with-spring) (Tutorial explaining how Spring injects these variables)
