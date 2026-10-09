# 🚀 Quick Start Guide

## Start the Application (3 Easy Steps)

### 1️⃣ Start Tomcat (Backend)
```powershell
cd "C:\Users\DELL\Downloads\apache-tomcat-10.1.55-windows-x64\apache-tomcat-10.1.55\bin"
.\startup.bat
# Wait 2-3 seconds for Tomcat to start
```

Or for debugging output:
```powershell
cd "C:\Users\DELL\Downloads\apache-tomcat-10.1.55-windows-x64\apache-tomcat-10.1.55\bin"
.\catalina.bat run
```

### 2️⃣ Start React (Frontend)  
```powershell
# From the project root: C:\Users\DELL\Desktop\proj\clinrisk-insight-main
npm run dev
# Opens http://localhost:5173 automatically
```

### 3️⃣ Test in Browser
- Open http://localhost:5173
- Click **"Test Backend Connection"** → Should show ✅
- Add a patient (name + age)
- Verify it appears in the list
- Try deleting it

---

## 📍 Verify Both Services Running

### Check Tomcat (Backend)
```powershell
# Should return a JSON array
Invoke-WebRequest "http://localhost:8080/HospitalManagement/GetPatientsServlet"
```

### Check React (Frontend)
Open http://localhost:5173 in browser - should load the Patient Management page

---

## 🔐 Database Info
```
Host: localhost:3306
Database: hospital_db
Username: root
Password: 12345
```

---

## 📁 Key Deployment Locations

**Backend (Tomcat):**
```
C:\Users\DELL\Downloads\apache-tomcat-10.1.55-windows-x64\apache-tomcat-10.1.55\webapps\HospitalManagement
```

**Frontend (React source):**
```
C:\Users\DELL\Desktop\proj\clinrisk-insight-main
```

**MySQL:**
```
Database: hospital_db
Tables: users, patients
```

---

## 🛑 Stop the Application

```powershell
# Stop Tomcat (while running with catalina.bat run)
# Press Ctrl+C in the terminal

# OR stop the Windows service
# net stop Tomcat10.1
```

```powershell
# Stop React dev server
# Press Ctrl+C in the npm terminal
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 8080 already in use | Kill process: `netstat -ano \| findstr :8080` then `taskkill /PID <pid>` |
| MySQL connection error | Verify MySQL is running: `Test-NetConnection localhost -Port 3306` |
| React can't reach backend | Check Tomcat started successfully |
| CORS error in console | CORS is enabled - should not appear for localhost |

---

## 📊 System Test

After both services are running:

1. **Backend Test:**
   ```powershell
   Invoke-WebRequest "http://localhost:8080/HospitalManagement/GetPatientsServlet" | ConvertFrom-Json
   ```
   Expected: `[]` (empty array)

2. **Frontend Test:**
   - Open http://localhost:5173
   - Click "Test Backend Connection"
   - Expected: "✅ Backend is connected!"

3. **Database Test:**
   ```powershell
   # Using mysql CLI if available
   mysql -u root -p hospital_db -e "SELECT * FROM patients;"
   ```
   Expected: Empty table initially

---

**Everything is deployed and ready to go!** 🎉
