package com.clinic.util;

import com.clinic.dao.DBConnection;

import java.sql.Connection;
import java.sql.SQLException;

public class ConnectionTest {
    public static void main(String[] args) {
        System.out.println("Testing JDBC connection to database...");
        try (Connection c = DBConnection.getConnection()) {
            if (c != null && !c.isClosed()) {
                System.out.println("Database connected successfully: " + c.getMetaData().getURL());
            } else {
                System.err.println("Failed to open connection");
                System.exit(2);
            }
        } catch (SQLException e) {
            System.err.println("Connection failed: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
