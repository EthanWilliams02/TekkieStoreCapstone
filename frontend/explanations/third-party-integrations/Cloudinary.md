# Cloudinary Integration

**What is it?**  
Cloudinary is a third-party cloud service that we use to host all our images (like shoe pictures). Instead of saving images directly in our MySQL database (which is slow and expensive), we upload them to Cloudinary and only save the generated image URL (the link) in our database.

**Where is it integrated?**

1. **`application.properties`:** 
   This is where we tell our application *how* to log in to Cloudinary. It holds our API Key, Secret, and Cloud Name.

2. **`CloudinaryConfig.java` (in the `config` package):** 
   This class grabs the credentials from `application.properties` and creates a `Cloudinary` Bean. A "Bean" is just an object that Spring Boot manages for us so we don't have to keep recreating it.

3. **`CloudinaryService.java` (in the `service` package):** 
   This is the worker class. It uses the `Cloudinary` Bean to actually send files to the cloud. Whenever we want to add a new shoe picture, we call this service.

4. **`Shoe.java` (in the `domain` package):**
   Our Shoe domain model has a `List<String> imageUrls`. This is where we store the links we get back from Cloudinary. 

**Why this is a Best Practice:**  
By separating our images from our database, our database stays lightweight and fast. Cloudinary also uses a CDN (Content Delivery Network), meaning images load extremely fast for the user on the frontend!

**Reference / How we figured this out:**  
We referenced the official Cloudinary Java documentation to understand how to configure the `Cloudinary` Bean properly in a Spring Boot environment.  
Link: [Cloudinary Java Integration Guide](https://cloudinary.com/documentation/java_integration)
