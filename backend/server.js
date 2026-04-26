const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Database Connection (from environment variables)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "contacts_db"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Routes

// Health check
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Get all contacts
app.get("/api/contacts", (req, res) => {
  db.query("SELECT * FROM contacts", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Add contact
app.post("/api/contacts", (req, res) => {
  const { name, phone } = req.body;

  db.query(
    "INSERT INTO contacts (name, phone) VALUES (?, ?)",
    [name, phone],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Contact added successfully" });
    }
  );
});

// Delete contact
app.delete("/api/contacts/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM contacts WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Contact deleted" });
  });
});

// Port (VERY IMPORTANT for Beanstalk)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
