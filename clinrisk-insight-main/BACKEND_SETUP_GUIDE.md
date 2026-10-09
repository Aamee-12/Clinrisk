# Backend Setup Guide - Node.js + Express + MySQL

## 📋 Overview
This guide helps you set up a complete backend server for your React + Vite frontend project.

**Architecture:**
- Frontend: React + Vite (running on `http://localhost:8080`)
- Backend: Node.js + Express (running on `http://localhost:3001`)
- Database: MySQL (local instance via MySQL Workbench)

---

## ✅ Step 1: Database Setup

### 1.1 Open MySQL Workbench
1. Launch MySQL Workbench
2. Connect to your local MySQL server
3. Open a new SQL tab

### 1.2 Create Database and Table
Copy the contents of `database-setup.sql` file and run it in MySQL Workbench:

```sql
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
```

### 1.3 Verify Database
In MySQL Workbench, run:
```sql
SELECT * FROM patients;
```
You should see the 4 sample patients.

---

## 🔐 Step 2: Configure MySQL Password

### 2.1 Update server.js with Your MySQL Password
1. Open `server.js` in VS Code
2. Find this line (around line 13):
   ```javascript
   password: '', // Add your MySQL password here
   ```
3. Replace `''` with your MySQL root password:
   ```javascript
   password: 'your_mysql_password',
   ```

**Example:**
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'MySecurePassword123', // Your actual MySQL password
  database: 'clinrisk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

---

## 📦 Step 3: Install Dependencies

All required packages (express, mysql2, cors) are already in your `package.json`.
Just install them:

### Using Bun (recommended for your project):
```bash
bun install
```

### Or using npm:
```bash
npm install
```

### Or using yarn:
```bash
yarn install
```

---

## 🚀 Step 4: Run the Backend Server

### Option 1: Using Node.js directly
```bash
node server.js
```

### Option 2: Using Bun (if installed)
```bash
bun server.js
```

**Expected Output:**
```
🚀 Backend server running on http://localhost:3001
📊 Frontend should be running on http://localhost:8080
✅ CORS enabled for frontend communication
```

---

## 🧪 Step 5: Test the Backend

### 5.1 Test Connection Endpoint
Open your browser and visit:
```
http://localhost:3001/api/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Backend is running and connected to MySQL",
  "timestamp": "2026-05-30T10:30:45.123Z"
}
```

### 5.2 Fetch All Patients
Open your browser and visit:
```
http://localhost:3001/api/patients
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "age": 45,
      "condition": "Hypertension",
      "created_at": "2026-05-30T10:00:00.000Z",
      "updated_at": "2026-05-30T10:00:00.000Z"
    },
    ...
  ]
}
```

---

## 🎨 Step 6: Connect Frontend to Backend

### 6.1 Use the PatientManagement Component
A complete example component is provided in: `src/components/PatientManagement.tsx`

### 6.2 Add to Your Router
1. Open `src/router.tsx`
2. Import the component:
   ```typescript
   import PatientManagement from './components/PatientManagement';
   ```

3. Add a route for it (example):
   ```typescript
   {
     path: '/patients',
     component: PatientManagement,
   }
   ```

### 6.3 Make Frontend Requests
The `PatientManagement` component already includes all fetch examples:

#### **Fetch All Patients:**
```javascript
const response = await fetch('http://localhost:3001/api/patients');
const data = await response.json();
```

#### **Add a Patient:**
```javascript
const response = await fetch('http://localhost:3001/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    age: 45,
    condition: 'Hypertension',
  }),
});
const data = await response.json();
```

#### **Fetch Single Patient:**
```javascript
const response = await fetch('http://localhost:3001/api/patients/1');
const data = await response.json();
```

#### **Update Patient:**
```javascript
const response = await fetch('http://localhost:3001/api/patients/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated Name',
    age: 46,
    condition: 'Updated Condition',
  }),
});
const data = await response.json();
```

#### **Delete Patient:**
```javascript
const response = await fetch('http://localhost:3001/api/patients/1', {
  method: 'DELETE',
});
const data = await response.json();
```

---

## 🐛 Troubleshooting

### Issue: "Cannot reach backend"
**Solution:**
1. Make sure backend is running: `node server.js`
2. Check it's on port 3001: http://localhost:3001/api/test
3. Verify frontend is on port 8080

### Issue: "Database connection failed"
**Solution:**
1. Check MySQL is running (MySQL Workbench is connected)
2. Verify password in `server.js` is correct
3. Verify database `clinrisk` exists
4. Verify table `patients` exists

### Issue: CORS errors in browser console
**Solution:**
- The backend already has CORS enabled
- Clear browser cache or open in incognito mode
- Restart the backend server

### Issue: "password field is empty" error
**Solution:**
- Update the password in `server.js` line 13 with your MySQL password

---

## 📝 Running Everything Together

### Terminal 1 - Backend:
```bash
node server.js
```

### Terminal 2 - Frontend:
```bash
bun run dev
# or
npm run dev
```

Then open your browser:
- Frontend: `http://localhost:8080`
- Backend Test: `http://localhost:3001/api/test`

---

## 📚 API Endpoints Reference

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/test` | Test backend connection | - |
| GET | `/api/patients` | Get all patients | - |
| GET | `/api/patients/:id` | Get patient by ID | - |
| POST | `/api/patients` | Add new patient | `{name, age, condition}` |
| PUT | `/api/patients/:id` | Update patient | `{name, age, condition}` |
| DELETE | `/api/patients/:id` | Delete patient | - |

---

## 🎯 Summary

You now have:
✅ Database setup with patients table
✅ Backend server (Express + MySQL)
✅ CORS enabled for frontend communication
✅ Full CRUD API endpoints
✅ Frontend component with examples
✅ Connection testing capability

**Next Steps:**
1. Run database setup in MySQL Workbench
2. Update password in server.js
3. Start backend: `node server.js`
4. Start frontend: `bun run dev`
5. Visit http://localhost:8080 and test the patient management system

---

## ❓ Questions?

Refer to:
- [Express Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [CORS Documentation](https://github.com/expressjs/cors)
