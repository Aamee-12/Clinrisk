package com.clinic.dao;

import com.clinic.model.Patient;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for patients table.
 */
public class PatientDAO {
    private static final Logger LOG = Logger.getLogger(PatientDAO.class.getName());

    public List<Patient> getAllPatients() throws SQLException {
        List<Patient> list = new ArrayList<>();
        String sql = "SELECT id, name, age FROM patients ORDER BY id";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Patient p = new Patient();
                p.setId(rs.getInt("id"));
                p.setName(rs.getString("name"));
                int age = rs.getInt("age");
                if (!rs.wasNull()) p.setAge(age);
                list.add(p);
            }
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error fetching patients", e);
            throw e;
        }
        return list;
    }

    public int addPatient(Patient p) throws SQLException {
        String sql = "INSERT INTO patients (name, age) VALUES (?,?)";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, p.getName());
            if (p.getAge() != null) ps.setInt(2, p.getAge()); else ps.setNull(2, Types.INTEGER);
            int affected = ps.executeUpdate();
            if (affected == 0) return -1;
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getInt(1);
                }
            }
            return affected > 0 ? 1 : -1;
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error adding patient: " + p, e);
            throw e;
        }
    }

    public boolean updatePatient(Patient p) throws SQLException {
        String sql = "UPDATE patients SET name=?, age=? WHERE id=?";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, p.getName());
            if (p.getAge() != null) ps.setInt(2, p.getAge()); else ps.setNull(2, Types.INTEGER);
            ps.setInt(3, p.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error updating patient: " + p, e);
            throw e;
        }
    }

    public boolean deletePatient(int id) throws SQLException {
        String sql = "DELETE FROM patients WHERE id = ?";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error deleting patient id=" + id, e);
            throw e;
        }
    }
}
