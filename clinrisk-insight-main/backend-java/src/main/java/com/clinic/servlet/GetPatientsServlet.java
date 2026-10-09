package com.clinic.servlet;

import com.clinic.dao.PatientDAO;
import com.clinic.model.Patient;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/GetPatientsServlet")
public class GetPatientsServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(GetPatientsServlet.class.getName());
    private final PatientDAO dao = new PatientDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);
        try (PrintWriter out = resp.getWriter()) {
            List<Patient> patients = dao.getAllPatients();
            out.print(gson.toJson(patients));
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Failed to fetch patients", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try (PrintWriter out = resp.getWriter()) {
                out.print(gson.toJson(new ErrorResponse("DB error", e.getMessage())));
            }
        }
    }

    private void setJsonResponse(HttpServletResponse resp) {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
    }

    static class ErrorResponse {
        String error;
        String details;
        ErrorResponse(String error, String details) { this.error = error; this.details = details; }
    }
}
