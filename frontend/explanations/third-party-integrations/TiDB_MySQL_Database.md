# TiDB MySQL Database Integration

**What is it?**  
TiDB Cloud is a fully-managed, cloud-based database that is compatible with MySQL. Instead of hosting a local database on our own computers (which would make it impossible for teammates to share the same data), we use TiDB to host our database in the cloud (AWS). 

**Where is it integrated?**

1. **`pom.xml` (Dependencies):**  
   We included the `mysql-connector-j` dependency here. This is the driver that acts as a translator, allowing our Java Spring Boot application to speak the MySQL language so it can communicate with TiDB.

2. **`application.properties`:**  
   This is the command center for our database connection. It contains:
   - **`spring.datasource.url`:** The exact web address (AWS endpoint) where our TiDB database lives.
   - **`spring.datasource.username` & `password`:** The credentials allowing us to securely log in.
   - **`spring.jpa.hibernate.ddl-auto=update`:** A magical Spring Boot setting that automatically creates and updates our database tables based on our Java Classes (Domain Models), so we don't have to write raw SQL scripts.

3. **`repository` package (e.g., `ShoeRepository.java`):**  
   We use Spring Data JPA `JpaRepository` interfaces. These interfaces act as the bridge between our backend and TiDB. When we call `repository.save()` or `repository.findAll()`, Spring Boot automatically generates the MySQL query and sends it to TiDB for us.

**Why this is a Best Practice:**  
Using a cloud-hosted database ensures all developers and users are seeing the exact same live data. Additionally, using Spring Data JPA instead of writing raw SQL (JDBC) protects us from SQL Injection attacks and significantly speeds up development time!

**Reference / How we figured this out:**  
We used the PingCAP (creators of TiDB) official guide on connecting a Spring Boot application to TiDB Cloud using Hibernate and Spring Data JPA.  
Link: [Build a Spring Boot Application with TiDB](https://docs.pingcap.com/tidb/stable/dev-guide-build-application-using-spring-boot)
