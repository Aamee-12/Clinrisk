<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.clinic.model.Patient" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Patient Management</title>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; background: #f3f4f6; color: #111827; }
        header { background: #1f4e79; color: white; padding: 16px 20px; }
        header .top-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; }
        main { max-width: 1040px; margin: 20px auto; padding: 0 14px; }
        .card { background: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); padding: 20px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { padding: 11px 10px; border-bottom: 1px solid #d1d5db; text-align: left; }
        th { background: #f8fafc; font-weight: 700; color: #111827; }
        input[type="text"], input[type="number"] { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; }
        button { padding: 10px 14px; border: none; border-radius: 6px; cursor: pointer; color: white; background: #1f4e79; }
        button.secondary { background: #475569; }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: end; }
        .message { padding: 14px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.95rem; }
        .message.success { background: #d1fae5; color: #065f46; }
        .message.error { background: #fee2e2; color: #b91c1c; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .logout { color: white; text-decoration: none; font-size: 0.95rem; }
    </style>
</head>
<body>
<% String username = (String) request.getAttribute("username"); %>
<header>
    <div class="top-row">
        <div>
            <h1>Patient Management</h1>
            <p>Manage patients in the hospital database.</p>
            <% if (username != null) { %>
                <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.85;">Signed in as <strong><%= username %></strong></p>
            <% } %>
        </div>
        <a class="logout" href="<%= request.getContextPath() %>/logout">Logout</a>
    </div>
</header>
<main>
    <div class="card">
        <%
            String message = (String) request.getAttribute("message");
            String error = (String) request.getAttribute("error");
            List<Patient> patients = (List<Patient>) request.getAttribute("patients");
        %>
        <% if (message != null) { %>
            <div class="message success"><%= message %></div>
        <% } %>
        <% if (error != null) { %>
            <div class="message error"><%= error %></div>
        <% } %>

        <h2>Existing Patients</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <% if (patients != null && !patients.isEmpty()) {
                    for (Patient p : patients) { %>
                        <tr>
                            <td><%= p.getId() %></td>
                            <td><%= p.getName() %></td>
                            <td><%= p.getAge() != null ? p.getAge() : "" %></td>
                            <td class="actions">
                                <form action="<%= request.getContextPath() %>/PatientActionServlet" method="post" style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                                    <input type="hidden" name="action" value="update" />
                                    <input type="hidden" name="id" value="<%= p.getId() %>" />
                                    <input type="text" name="name" value="<%= p.getName() %>" required placeholder="Name" />
                                    <input type="number" name="age" min="0" value="<%= p.getAge() != null ? p.getAge() : "" %>" placeholder="Age" />
                                    <button type="submit">Update</button>
                                </form>
                                <form action="<%= request.getContextPath() %>/PatientActionServlet" method="post" onsubmit="return confirm('Delete patient <%= p.getName() %>?');" style="display:inline-flex; align-items:center; margin-left: 8px;">
                                    <input type="hidden" name="action" value="delete" />
                                    <input type="hidden" name="id" value="<%= p.getId() %>" />
                                    <button type="submit" class="secondary">Delete</button>
                                </form>
                            </td>
                        </tr>
                <%  }
                } else { %>
                    <tr><td colspan="4">No patients found. Use the form below to add the first patient.</td></tr>
                <% } %>
            </tbody>
        </table>
    </div>

    <div class="card">
        <h2>Add New Patient</h2>
        <form action="<%= request.getContextPath() %>/PatientActionServlet" method="post">
            <input type="hidden" name="action" value="add" />
            <div class="form-grid">
                <label>
                    Name<br />
                    <input type="text" name="name" required />
                </label>
                <label>
                    Age<br />
                    <input type="number" name="age" min="0" />
                </label>
                <div style="display:flex; align-items:flex-end;">
                    <button type="submit">Add Patient</button>
                </div>
            </div>
        </form>
    </div>
</main>
</body>
</html>
