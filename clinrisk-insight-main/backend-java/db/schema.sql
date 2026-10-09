-- MySQL schema for HospitalManagement
-- Creates `hospital_db` database and required tables.
CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

-- users table (sample). In production store hashed passwords (bcrypt/argon2).
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- sample user (username: admin, password: admin)
INSERT INTO users (username, password) VALUES ('admin', 'admin')
  ON DUPLICATE KEY UPDATE password = VALUES(password);

-- patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
