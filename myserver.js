// server.js
const express = require('express');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Render Postgres
});

// Create contacts table if it doesn't exist
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Contacts table ready');
  } catch (err) {
    console.error('Error creating table:', err.message);
  }
})();

// Nodemailer setup (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "fanwelmawelejunior@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Health check (optional but good for Render)
app.get('/health', (req, res) => res.send('Server is running!'));

// Submit route — store in DB AND send email
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Please fill in all fields.');
  }

  try {
    // 1️ Save to PostgreSQL
    await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    // 2️Send email to business email
await transporter.sendMail({
  from: '"FanwellTechLabs" <fanwelmawelejunior@gmail.com>',
  to: "fanwelmawelejunior@gmail.com",
  replyTo: email,
  subject: "New Contact Form Message",
  text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
});

console.log("EMAIL SENT SUCCESSFULLY");

  

    // 3️ Respond to frontend
    res.status(200).send('Message received successfully. We will contact you.');

  } catch (err) {
    console.error('Error in /submit:', err);
    res.status(500).send('Error saving message or sending email.');
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
