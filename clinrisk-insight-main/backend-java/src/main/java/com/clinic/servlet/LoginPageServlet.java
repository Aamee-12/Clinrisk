package com.clinic.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/login")
public class LoginPageServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getSession(false) != null) {
            String error = (String) req.getSession().getAttribute("loginError");
            if (error != null) {
                req.setAttribute("error", error);
                req.getSession().removeAttribute("loginError");
            }
            String message = (String) req.getSession().getAttribute("loginMessage");
            if (message != null) {
                req.setAttribute("message", message);
                req.getSession().removeAttribute("loginMessage");
            }
        }
        req.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(req, resp);
    }
}
