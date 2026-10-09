Final Report

Files created:
- src/main/java/com/clinic/model/Patient.java
- src/main/java/com/clinic/dao/DBConnection.java
- src/main/java/com/clinic/dao/PatientDAO.java
- src/main/java/com/clinic/servlet/GetPatientsServlet.java
- src/main/java/com/clinic/servlet/AddPatientServlet.java
- src/main/java/com/clinic/servlet/UpdatePatientServlet.java
- src/main/java/com/clinic/servlet/DeletePatientServlet.java
- src/main/java/com/clinic/servlet/LoginServlet.java
- src/main/java/com/clinic/filter/CORSFilter.java
- pom.xml
- db/schema.sql

Files modified:
- src/main/java/com/clinic/model/Patient.java (updated to match frontend shape)
- src/main/java/com/clinic/dao/PatientDAO.java (queries updated)
- src/main/java/com/clinic/servlet/*.java (adapted to new model)
- backend-java/pom.xml (set Java 17, dependencies)

React files changed:
- src/config.ts (added)
- src/services/api.ts (added)
- src/components/PatientManagement.tsx (now uses API service)

Remaining issues / notes:
- Maven is not installed on this machine; I could not run `mvn package` here. Install Maven and run `mvn package` to build the WAR.
- Tomcat or another Jakarta container is required to deploy the WAR. Ensure Tomcat 10.1+ is used (Jakarta namespace).
- Some parts of the React UI still import `sample-data` for charts and dashboards; only patient management pages were wired to the servlet backend in this change.
- Passwords are stored in plaintext in the sample `users` table. Replace with a secure password hashing strategy before production.
- Run `mysql -u root -p < backend-java/db/schema.sql` to create the DB and tables.

If you want, I can:
- Replace all other `sample-data` usages with backend calls.
- Add a Docker Compose setup with MySQL + Tomcat for local development.
- Run a local build and test once you have Maven installed.
