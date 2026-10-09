README

This backend implements Java Servlets + DAO + MySQL with a JSP-based user interface for the ClinRisk hospital management app.

Prerequisites
- Java 17 JDK installed
- Maven installed (for building the WAR)
- MySQL server installed and running
- Tomcat 10.1+ or another Jakarta Servlet 6 compatible container for deployment

Installing MySQL on Windows (optional quick method)

Using Chocolatey (requires admin PowerShell):

```powershell
choco install mysql -y
```

Using Winget:

```powershell
winget install Oracle.MySQL
```

After installation, ensure the MySQL service is running and you can connect via `mysql -u root -p`.

Setup steps (Windows)

1) Import the database schema

```powershell
mysql -u root -p < backend-java/db/schema.sql
```

2) Configure DB credentials (optional). You can set environment variables or edit `DBConnection` defaults:

```powershell
#$env:DB_HOST='localhost'
#$env:DB_PORT='3306'
#$env:DB_NAME='hospital_db'
#$env:DB_USER='root'
#$env:DB_PASS='root'
```

3) Build the project (produces WAR)

```powershell
cd backend-java
mvn package
```

4) Deploy the WAR to Tomcat 10.1+ (copy `target/HospitalManagement-1.0.0.war` to `TOMCAT_HOME/webapps/` and start Tomcat)

5) Access the JSP application at `http://localhost:8080/HospitalManagement/` and log in with the sample account: `admin` / `admin`.

The JSP UI is served directly by Tomcat from the deployed WAR. Open the root URL in a browser and log in with the sample account.

If you are also running the legacy React frontend during development, set `REACT_APP_BACKEND_BASE` to point at `http://localhost:8080/HospitalManagement`.

API endpoints (examples)

- GET patients: `GET /HospitalManagement/GetPatientsServlet` → returns JSON array of patients
- Add patient: `POST /HospitalManagement/AddPatientServlet` with JSON `{name, age}` → returns created patient JSON
- Update patient: `POST /HospitalManagement/UpdatePatientServlet` with JSON `{id, name, age}` → returns {success,message}
- Delete patient: `POST /HospitalManagement/DeletePatientServlet?id=123` → returns {success,message}
- Login: `POST /HospitalManagement/LoginServlet` with `{username,password}` → {success,message}

Notes
- CORS is enabled for development via `CORSFilter` (allows all origins). Tighten in production.
- The sample `users` table contains a plaintext admin user (`admin`/`admin`)—replace with hashed passwords in production.

MySQL Workbench / Manual SQL

If you prefer to run SQL manually in MySQL Workbench, use the following commands:

```sql
CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (username, password) VALUES ('admin', 'admin')
	ON DUPLICATE KEY UPDATE password = VALUES(password);

CREATE TABLE IF NOT EXISTS patients (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	age INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

JDBC URL used by the backend:

```
jdbc:mysql://localhost:3306/hospital_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

Default DB credentials used by `DBConnection` (change via environment variables if needed):

- username: `root`
- password: `root`

If your MySQL root password is different, either set the environment variables `DB_USER` and `DB_PASS` before starting Tomcat, or edit `backend-java/src/main/java/com/clinic/dao/DBConnection.java` to change the defaults.

Testing JDBC connection (optional)

After building the project you can run a small Java test that attempts to open a JDBC connection:

```powershell
cd backend-java
mvn -q compile exec:java -Dexec.mainClass="com.clinic.util.ConnectionTest"
```

This will print `Database connected successfully: jdbc:mysql://...` if the connection succeeds.
