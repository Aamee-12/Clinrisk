package com.clinic.servlet;

import com.clinic.dao.PatientDAO;
import com.clinic.model.Patient;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/AddPatientServlet")
public class AddPatientServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(AddPatientServlet.class.getName());
    private final PatientDAO dao = new PatientDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);
        req.setCharacterEncoding("UTF-8");

        try (PrintWriter out = resp.getWriter()) {
            Patient p = parsePatient(req);
            if (p == null || p.getName() == null || p.getName().isBlank()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(new ErrorResponse("Missing required patient name", "Provide name and optional age.")));
                return;
            }

            int id = dao.addPatient(p);
            if (id > 0) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                out.print(gson.toJson(new StatusResponse("saved", id)));
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print(gson.toJson(new ErrorResponse("Failed to insert patient", "No rows were affected.")));
            }
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "DB error while adding patient", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().print(gson.toJson(new ErrorResponse("Database error", e.getMessage())));
        }
    }

    private Patient parsePatient(HttpServletRequest req) throws IOException {
        String contentType = req.getContentType();
        if (contentType != null && contentType.contains("application/json")) {
            try {
                Patient p = gson.fromJson(req.getReader(), Patient.class);
                if (p != null) {
                    return p;
                }
            } catch (Exception ignored) {
                // Fallback to request parameters below
            }
        }

        Patient p = new Patient();
        p.setName(req.getParameter("name"));
        String ageParam = req.getParameter("age");
        if (ageParam != null && !ageParam.isBlank()) {
            try {
                p.setAge(Integer.valueOf(ageParam));
            } catch (NumberFormatException ignored) {
                // invalid age will be ignored and handled by validation
            }
        }
        return p;
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

    static class StatusResponse {
        String status;
        Integer id;
        StatusResponse(String status, Integer id) { this.status = status; this.id = id; }
    }
}
