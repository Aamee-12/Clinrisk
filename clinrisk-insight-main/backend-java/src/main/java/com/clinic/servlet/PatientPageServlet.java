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
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/patients")
public class PatientPageServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(PatientPageServlet.class.getName());
    private final PatientDAO dao = new PatientDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            String flashMessage = (String) session.getAttribute("flashMessage");
            if (flashMessage != null) {
                req.setAttribute("message", flashMessage);
                session.removeAttribute("flashMessage");
            }
            String username = (String) session.getAttribute("user");
            if (username != null) {
                req.setAttribute("username", username);
            }
        }

        try {
            List<Patient> patients = dao.getAllPatients();
            req.setAttribute("patients", patients);
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Failed to load patients", e);
            req.setAttribute("error", "Unable to load patient list: " + e.getMessage());
        }

        req.getRequestDispatcher("/WEB-INF/jsp/patientManagement.jsp").forward(req, resp);
    }
}
