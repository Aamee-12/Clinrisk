<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hospital Management Login</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
        .container { max-width: 420px; margin: 80px auto; padding: 24px; background: white; border-radius: 12px; box-shadow: 0 14px 32px rgba(0,0,0,.08); }
        h1 { margin-bottom: 16px; font-size: 24px; }
        label { display: block; margin-top: 12px; font-weight: bold; }
        input[type="text"], input[type="password"] { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1; margin-top: 6px; }
        button { margin-top: 18px; padding: 10px 16px; border: none; border-radius: 8px; background: #2563eb; color: white; font-size: 16px; cursor: pointer; }
        .alert { padding: 12px 14px; border-radius: 8px; margin-bottom: 16px; }
        .alert.error { background: #fee2e2; color: #991b1b; }
        .alert.success { background: #d1fae5; color: #065f46; }
        .helper { margin-top: 12px; font-size: 14px; color: #475569; }
    </style>
</head>
<body>
<div class="container">
    <h1>Hospital Management Login</h1>
    <%
        String message = (String) request.getAttribute("message");
        String error = (String) request.getAttribute("error");
    %>
    <% if (message != null) { %>
        <div class="alert success"><%= message %></div>
    <% } %>
    <% if (error != null) { %>
        <div class="alert error"><%= error %></div>
    <% } %>

    <form action="<%= request.getContextPath() %>/LoginServlet" method="post">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="admin" required autofocus />

        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="admin" required />

        <button type="submit">Sign in</button>
    </form>
    <div class="helper">Use the sample account: <strong>admin/admin</strong></div>
</div>
</body>
</html>
