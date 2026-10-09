-- Database Setup for ClinRisk
-- Run this script in MySQL Workbench to create the database and table

-- Create Database
CREATE DATABASE IF NOT EXISTS clinrisk;

-- Use the database
USE clinrisk;

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  condition VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO patients (name, age, condition) VALUES
('John Doe', 45, 'Hypertension'),
('Jane Smith', 52, 'Diabetes Type 2'),
('Michael Johnson', 38, 'Asthma'),
('Sarah Williams', 61, 'High Cholesterol');

-- Verify data
SELECT * FROM patients;
