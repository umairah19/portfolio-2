const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "portfolio_db",
  port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Portfolio API Running Successfully");
});

// GET: Display all projects
app.get("/api/projects", (req, res) => {
  const sql = "SELECT * FROM projects ORDER BY id ASC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch projects",
        error: err
      });
    }

    res.json(result);
  });
});

// POST: Add new project
app.post("/api/projects", (req, res) => {
  const { title, category, description, tags } = req.body;

  const sql =
    "INSERT INTO projects (title, category, description, tags) VALUES (?, ?, ?, ?)";

  db.query(sql, [title, category, description, tags], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to add project",
        error: err
      });
    }

    res.json({
      message: "Project added successfully",
      id: result.insertId
    });
  });
});

// PUT: Update existing project
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title, category, description, tags } = req.body;

  const sql =
    "UPDATE projects SET title = ?, category = ?, description = ?, tags = ? WHERE id = ?";

  db.query(sql, [title, category, description, tags, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update project",
        error: err
      });
    }

    res.json({
      message: "Project updated successfully"
    });
  });
});

// DELETE: Delete project
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM projects WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete project",
        error: err
      });
    }

    res.json({
      message: "Project deleted successfully"
    });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});