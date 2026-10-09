import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345', // Add your MySQL password here
  database: 'clinrisk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health Check Route
app.get('/api/test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT 1 as test');
    connection.release();
    
    res.json({
      success: true,
      message: 'Backend is running and connected to MySQL',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Get All Patients
app.get('/api/patients', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM `patients`');
    connection.release();
    
    console.log(`Fetched ${rows.length} patients from MySQL`);
    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message,
    });
  }
});

// Insert New Patient
app.post('/api/patients', async (req, res) => {
  try {
    const { name, age, condition } = req.body;

    // Basic validation
    if (!name || !age || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Name, age, and condition are required',
      });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO `patients` (`name`, `age`, `condition`) VALUES (?, ?, ?)',
      [name, age, condition]
    );
    connection.release();

    console.log(`Inserted patient ${name} (id=${result.insertId}) into MySQL`);
    res.status(201).json({
      success: true,
      message: 'Patient added successfully',
      data: {
        id: result.insertId,
        name,
        age,
        condition,
      },
    });
  } catch (error) {
    console.error('Error inserting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to insert patient',
      error: error.message,
    });
  }
});

// Get Patient by ID
app.get('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM `patients` WHERE `id` = ?',
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
      error: error.message,
    });
  }
});

// Update Patient
app.put('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, condition } = req.body;

    if (!name || !age || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Name, age, and condition are required',
      });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE `patients` SET `name` = ?, `age` = ?, `condition` = ? WHERE `id` = ?',
      [name, age, condition, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: {
        id: parseInt(id),
        name,
        age,
        condition,
      },
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message,
    });
  }
});

// Delete Patient
app.delete('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM `patients` WHERE `id` = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient',
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Frontend should be running on http://localhost:8080`);
  console.log(`✅ CORS enabled for frontend communication`);

  (async () => {
    try {
      const connection = await pool.getConnection();
      await connection.query('SELECT 1');
      connection.release();
      console.log('✅ MySQL connection verified successfully.');
    } catch (error) {
      console.error('❌ MySQL startup connection failed:', error.message);
    }
  })();
});
