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

@WebServlet("/UpdatePatientServlet")
public class UpdatePatientServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(UpdatePatientServlet.class.getName());
    private final PatientDAO dao = new PatientDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);
        req.setCharacterEncoding("UTF-8");
        try (BufferedReader reader = req.getReader(); PrintWriter out = resp.getWriter()) {
            Patient p = gson.fromJson(reader, Patient.class);
            if (p == null || p.getId() == 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(new SimpleResponse(false, "Missing patient id or invalid body")));
                return;
            }
            boolean ok = dao.updatePatient(p);
            out.print(gson.toJson(new SimpleResponse(ok, ok ? "Updated" : "Not found")));
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "DB error while updating patient", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try (PrintWriter out = resp.getWriter()) {
                out.print(gson.toJson(new SimpleResponse(false, e.getMessage())));
            }
        }
    }

    private void setJsonResponse(HttpServletResponse resp) {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
    }

    static class SimpleResponse { boolean success; String message; SimpleResponse(boolean s, String m) { success = s; message = m; } }
}
