package com.clinic.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Simple JDBC connection helper for the ClinRisk application.
 */
public final class DBConnection {
    private static final Logger LOG = Logger.getLogger(DBConnection.class.getName());

    private static final String DB_HOST = get("DB_HOST", "localhost");
    private static final String DB_PORT = get("DB_PORT", "3306");
    private static final String DB_NAME = get("DB_NAME", "clinrisk");
    private static final String DB_USER = get("DB_USER", "root");
    private static final String DB_PASS = get("DB_PASS", "12345");
    private static final String JDBC_URL = String.format(
            "jdbc:mysql://%s:%s/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
            DB_HOST,
            DB_PORT,
            DB_NAME
    );

    private DBConnection() {
        // utility class
    }

    private static String get(String key, String defaultVal) {
        String prop = System.getProperty(key);
        if (prop != null && !prop.isEmpty()) {
            return prop;
        }
        String env = System.getenv(key);
        return (env != null && !env.isEmpty()) ? env : defaultVal;
    }

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            LOG.info("MySQL JDBC driver loaded successfully.");
        } catch (ClassNotFoundException e) {
            LOG.log(Level.SEVERE, "MySQL JDBC driver class not found. Make sure mysql-connector-j is on the classpath.", e);
        }
        // Ensure the target database and patients table exist with a compatible schema.
        String urlNoDb = String.format(
                "jdbc:mysql://%s:%s/?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                DB_HOST,
                DB_PORT
        );
        try (Connection c = DriverManager.getConnection(urlNoDb, DB_USER, DB_PASS);
             java.sql.Statement s = c.createStatement()) {
            String createDb = String.format("CREATE DATABASE IF NOT EXISTS %s CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", DB_NAME);
            s.executeUpdate(createDb);
            LOG.info("Verified database exists: " + DB_NAME);
        } catch (SQLException e) {
            LOG.log(Level.WARNING, "Could not create/verify database '" + DB_NAME + "' using " + urlNoDb + ". Please ensure MySQL is running and credentials are correct.", e);
        }

        // Create patients table if missing (compatible, forgiving schema)
        String createTableSql = "CREATE TABLE IF NOT EXISTS patients (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "name VARCHAR(255) NOT NULL, " +
                "age INT NULL, " +
                "condition VARCHAR(500) NULL, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        try (Connection c = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS);
             java.sql.Statement s = c.createStatement()) {
            s.executeUpdate(createTableSql);
            LOG.info("Ensured patients table exists in: " + DB_NAME);
        } catch (SQLException e) {
            LOG.log(Level.WARNING, "Unable to ensure patients table in database '" + DB_NAME + "'", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        // Primary attempt
        try {
            Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS);
            LOG.info("Connected successfully to MySQL database: " + DB_NAME + " as user=" + DB_USER);
            return conn;
        } catch (SQLException firstEx) {
            LOG.log(Level.WARNING, "Primary DB connection failed for user=" + DB_USER + ". Will try common fallbacks.", firstEx);
            // Try common fallback credential permutations (development convenience only)
            String[] tryUsers = {DB_USER, "root"};
            String[] tryPasses = {DB_PASS, "", "root", "12345"};
            for (String u : tryUsers) {
                for (String p : tryPasses) {
                    // skip the primary combination already tried
                    if (u.equals(DB_USER) && p.equals(DB_PASS)) continue;
                    try {
                        Connection c = DriverManager.getConnection(JDBC_URL, u, p);
                        LOG.info(String.format("Connected to %s with fallback user=%s pwdSet=%b", DB_NAME, u, p != null && !p.isEmpty()));
                        return c;
                    } catch (SQLException ignored) {
                        // try next
                    }
                }
            }
            LOG.log(Level.SEVERE, "All DB connection attempts failed for URL: " + JDBC_URL + " user: " + DB_USER);
            throw firstEx;
        }
    }
}
