package com.clinic.servlet;

import com.clinic.dao.PatientDAO;
import com.clinic.model.Patient;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/PatientActionServlet")
public class PatientActionServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(PatientActionServlet.class.getName());
    private final PatientDAO dao = new PatientDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        HttpSession session = req.getSession(true);
        String action = req.getParameter("action");
        String flashMessage;

        if (action == null || action.isBlank()) {
            flashMessage = "No action provided.";
            session.setAttribute("flashMessage", flashMessage);
            resp.sendRedirect(req.getContextPath() + "/patients");
            return;
        }

        try {
            switch (action) {
                case "add" -> flashMessage = handleAdd(req);
                case "update" -> flashMessage = handleUpdate(req);
                case "delete" -> flashMessage = handleDelete(req);
                default -> flashMessage = "Unknown action: " + action;
            }
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Database operation failed", e);
            flashMessage = "Database error: " + e.getMessage();
        } catch (Exception e) {
            LOG.log(Level.SEVERE, "Unexpected error processing patient action", e);
            flashMessage = "Unexpected error: " + e.getMessage();
        }

        session.setAttribute("flashMessage", flashMessage);
        resp.sendRedirect(req.getContextPath() + "/patients");
    }

    private String handleAdd(HttpServletRequest req) throws SQLException {
        String name = req.getParameter("name");
        Integer age = parseAge(req.getParameter("age"));
        if (name == null || name.isBlank()) {
            return "Patient name is required.";
        }
        Patient patient = new Patient(name.trim(), age);
        int id = dao.addPatient(patient);
        if (id > 0) {
            return "Patient added successfully.";
        }
        return "Failed to add patient. Please check the database connection and table setup.";
    }

    private String handleUpdate(HttpServletRequest req) throws SQLException {
        String idParam = req.getParameter("id");
        String name = req.getParameter("name");
        if (idParam == null || idParam.isBlank()) {
            return "Patient ID is required for update.";
        }
        if (name == null || name.isBlank()) {
            return "Patient name is required.";
        }
        int id;
        try {
            id = Integer.parseInt(idParam);
        } catch (NumberFormatException ex) {
            return "Invalid patient ID.";
        }
        Integer age = parseAge(req.getParameter("age"));
        Patient patient = new Patient(id, name.trim(), age);
        boolean updated = dao.updatePatient(patient);
        return updated ? "Patient updated successfully." : "Patient not found.";
    }

    private String handleDelete(HttpServletRequest req) throws SQLException {
        String idParam = req.getParameter("id");
        if (idParam == null || idParam.isBlank()) {
            return "Patient ID is required for deletion.";
        }
        int id;
        try {
            id = Integer.parseInt(idParam);
        } catch (NumberFormatException ex) {
            return "Invalid patient ID.";
        }
        boolean deleted = dao.deletePatient(id);
        return deleted ? "Patient deleted successfully." : "Patient not found.";
    }

    private Integer parseAge(String ageValue) {
        if (ageValue == null || ageValue.isBlank()) {
            return null;
        }
        try {
            return Integer.valueOf(ageValue.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
