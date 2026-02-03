const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

let dbReady = false;

async function initDB() {
  if (dbReady) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    dbReady = true;
    console.log('Database ready');
  } catch (err) {
    console.error('DB init failed, retrying...', err.message);
  }
}

app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await initDB();

    await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    res.send('Message received successfully. We will contact you.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving message');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mydesign.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));
