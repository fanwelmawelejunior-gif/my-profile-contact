const express = require("express");
const { Pool} = require("pg");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool= new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    message TEXT
  )
`);

app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.send("We have received your message! Thanks for reaching out.");
  } catch (err) {
    res.status(500).send("Error saving message");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
