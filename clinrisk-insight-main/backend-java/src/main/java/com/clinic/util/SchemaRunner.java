package com.clinic.util;

import com.clinic.dao.DBConnection;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Executes SQL statements from backend-java/db/schema.sql against the configured database.
 */
public class SchemaRunner {
    public static void main(String[] args) {
        String path = "backend-java/db/schema.sql";
        System.out.println("Running schema file: " + path);
        try (Connection c = DBConnection.getConnection(); Statement s = c.createStatement(); BufferedReader r = new BufferedReader(new FileReader(path))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = r.readLine()) != null) {
                line = line.trim();
                if (line.startsWith("--") || line.isEmpty()) continue;
                sb.append(line).append(' ');
                if (line.endsWith(";")) {
                    String sql = sb.toString();
                    sql = sql.substring(0, sql.length() - 1).trim();
                    System.out.println("Executing: " + (sql.length() > 120 ? sql.substring(0, 120) + "..." : sql));
                    s.execute(sql);
                    sb.setLength(0);
                }
            }
            System.out.println("Schema execution completed.");
        } catch (Exception e) {
            System.err.println("Schema execution failed: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
