package com.clinic.servlet;

import com.clinic.dao.DBConnection;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(LoginServlet.class.getName());
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        String contentType = req.getContentType();
        boolean isJson = contentType != null && contentType.contains("application/json");

        if (!isJson) {
            String username = req.getParameter("username");
            String password = req.getParameter("password");
            if (username == null || username.isBlank() || password == null || password.isBlank()) {
                req.getSession(true).setAttribute("loginError", "Username and password are required.");
                resp.sendRedirect(req.getContextPath() + "/login");
                return;
            }

            try {
                if (authenticate(username.trim(), password)) {
                    req.getSession(true).setAttribute("user", username.trim());
                    resp.sendRedirect(req.getContextPath() + "/patients");
                } else {
                    req.getSession(true).setAttribute("loginError", "Invalid username or password.");
                    resp.sendRedirect(req.getContextPath() + "/login");
                }
            } catch (SQLException e) {
                LOG.log(Level.SEVERE, "DB error on login", e);
                req.getSession(true).setAttribute("loginError", "Database error. Please try again later.");
                resp.sendRedirect(req.getContextPath() + "/login");
            }
            return;
        }

        setJsonResponse(resp);
        try (BufferedReader reader = req.getReader(); PrintWriter out = resp.getWriter()) {
            Credentials creds = gson.fromJson(reader, Credentials.class);
            if (creds == null || creds.username == null || creds.password == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(new LoginResponse(false, "Missing credentials")));
                return;
            }

            String sql = "SELECT id FROM users WHERE username = ? AND password = ?"; // plaintext passwords in sample schema
            try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setString(1, creds.username);
                ps.setString(2, creds.password);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        out.print(gson.toJson(new LoginResponse(true, "OK")));
                    } else {
                        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        out.print(gson.toJson(new LoginResponse(false, "Invalid credentials")));
                    }
                }
            } catch (SQLException e) {
                LOG.log(Level.SEVERE, "DB error on login", e);
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print(gson.toJson(new LoginResponse(false, "Database error")));
            }
        }
    }

    private void setJsonResponse(HttpServletResponse resp) {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
    }
    

    private boolean authenticate(String username, String password) throws SQLException {
        String sql = "SELECT id FROM users WHERE username = ? AND password = ?";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    static class Credentials { String username; String password; }
    static class LoginResponse { boolean success; String message; LoginResponse(boolean s, String m) { success = s; message = m; } }
}
