const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Connexion à ta base Aiven
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database!');
});

// Routes API
app.get('/api/animals', (_, res) => {
  db.query('SELECT * FROM Animal', (err, rows) => res.json(rows));
});

app.get('/api/objets', (_, res) => {
  db.query('SELECT * FROM Objet', (err, rows) => res.json(rows));
});

app.get('/api/metiers', (_, res) => {
  db.query('SELECT * FROM Metier', (err, rows) => res.json(rows));
});

app.post('/api/generate', (req, res) => {
  const { idanimal, idobjet, idmetier } = req.body;
  const sql = `SELECT * FROM Generate WHERE idanimal = ? AND idobjet = ? AND idmetier = ?`;
  db.query(sql, [idanimal, idobjet, idmetier], (err, results) => {
    if (results.length > 0) res.json(results[0]);
    else res.status(404).json({ error: 'Combinaison non trouvée' });
  });
});

app.listen(3001, () => console.log('✅ API running on http://localhost:3001'));
