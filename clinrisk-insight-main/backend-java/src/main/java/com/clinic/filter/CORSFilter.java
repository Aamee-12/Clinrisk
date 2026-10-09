package com.clinic.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Simple CORS filter to enable cross-origin requests for development.
 * In production restrict Access-Control-Allow-Origin to a specific origin.
 */
@WebFilter("/*")
public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // no-op
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String origin = req.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*");
        }
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // Pre-flight request
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // no-op
    }
}
