package com.clinic.servlet;

import com.clinic.dao.PatientDAO;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/DeletePatientServlet")
public class DeletePatientServlet extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(DeletePatientServlet.class.getName());
    private final PatientDAO dao = new PatientDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);
        req.setCharacterEncoding("UTF-8");
        String idParam = req.getParameter("id");
        try (PrintWriter out = resp.getWriter()) {
            if (idParam == null || idParam.isBlank()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(new SimpleResponse(false, "Missing id parameter")));
                return;
            }
            int id;
            try {
                id = Integer.parseInt(idParam);
            } catch (NumberFormatException nfe) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(new SimpleResponse(false, "Invalid id parameter")));
                return;
            }
            boolean ok = dao.deletePatient(id);
            out.print(gson.toJson(new SimpleResponse(ok, ok ? "Deleted" : "Not found")));
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "DB error while deleting patient", e);
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
