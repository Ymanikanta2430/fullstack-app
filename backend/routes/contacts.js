const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all contacts
router.get("/", (req, res) => {
  db.query("SELECT * FROM contacts", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Add contact
router.post("/", (req, res) => {
  const { name, phone } = req.body;
  db.query(
    "INSERT INTO contacts (name, phone) VALUES (?, ?)",
    [name, phone],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Contact added" });
    }
  );
});

// Delete contact
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM contacts WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Deleted" });
  });
});

module.exports = router;
