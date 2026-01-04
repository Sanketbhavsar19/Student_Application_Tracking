import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_applications (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        date_of_birth DATE NOT NULL,
        address VARCHAR(500) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'United States',
        program_of_interest VARCHAR(255) NOT NULL,
        previous_education TEXT NOT NULL,
        gpa DECIMAL(3,2),
        test_scores VARCHAR(255),
        extracurricular_activities TEXT,
        personal_statement TEXT NOT NULL,
        application_status VARCHAR(50) DEFAULT 'submitted',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

app.post('/api/applications', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    address,
    city,
    state,
    zip_code,
    country,
    program_of_interest,
    previous_education,
    gpa,
    test_scores,
    extracurricular_activities,
    personal_statement,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO student_applications (
        first_name, last_name, email, phone, date_of_birth, address, city, state,
        zip_code, country, program_of_interest, previous_education, gpa, test_scores,
        extracurricular_activities, personal_statement
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, created_at;`,
      [
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        address,
        city,
        state,
        zip_code,
        country,
        program_of_interest,
        previous_education,
        gpa || null,
        test_scores || null,
        extracurricular_activities || null,
        personal_statement,
      ]
    );

    res.json({
      id: result.rows[0].id,
      created_at: result.rows[0].created_at,
    });
  } catch (err) {
    console.error('Error inserting application:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM student_applications ORDER BY created_at DESC;'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.get('/api/applications/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM student_applications WHERE id = $1;',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

const PORT = process.env.PORT || 5000;

await initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
