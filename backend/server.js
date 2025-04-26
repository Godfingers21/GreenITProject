const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Ajustez selon votre frontend
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) return res.status(401).json({ error: 'Non authentifié' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
};

// Routes existantes
app.get('/api/animals', (_, res) => {
  db.query('SELECT * FROM Animal', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/objets', (_, res) => {
  db.query('SELECT * FROM Objet', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/metiers', (_, res) => {
  db.query('SELECT * FROM Metier', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/generate', (req, res) => {
  const { idanimal, idobjet, idmetier } = req.body;
  const sql = `SELECT * FROM Generate WHERE idanimal = ? AND idobjet = ? AND idmetier = ?`;
  db.query(sql, [idanimal, idobjet, idmetier], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) res.json(results[0]);
    else res.status(404).json({ error: 'Combinaison non trouvée' });
  });
});

// Nouvelles routes d'authentification
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    db.query('SELECT * FROM Utilisateur WHERE email = ? OR username = ?', [email, username], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) return res.status(409).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insérer l'utilisateur
      db.query(
        'INSERT INTO Utilisateur (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // Créer un token JWT
          const token = jwt.sign(
            { id: result.insertId, username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
          );
          
          // Envoyer le cookie avec le token
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
          });
          
          res.status(201).json({ message: 'Utilisateur créé avec succès', user: { id: result.insertId, username } });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    db.query('SELECT * FROM Utilisateur WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      
      const user = results[0];
      
      // Vérifier le mot de passe
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      
      // Créer un token JWT
      const token = jwt.sign(
        { id: user.idutilisateur, username: user.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      // Envoyer le cookie avec le token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });
      
      res.json({ 
        message: 'Connexion réussie', 
        user: { id: user.idutilisateur, username: user.username } 
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

// Vérifier si l'utilisateur est connecté
app.get('/api/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Collection de l'utilisateur
app.post('/api/collection/add', authenticateToken, (req, res) => {
  const { idgenerate } = req.body;
  const idutilisateur = req.user.id;
  
  // Vérifier si déjà dans la collection
  db.query(
    'SELECT * FROM Collection WHERE idutilisateur = ? AND idgenerate = ?',
    [idutilisateur, idgenerate],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length > 0) {
        return res.status(409).json({ message: 'Déjà dans votre collection' });
      }
      
      // Ajouter à la collection
      db.query(
        'INSERT INTO Collection (idutilisateur, idgenerate) VALUES (?, ?)',
        [idutilisateur, idgenerate],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Ajouté à votre collection' });
        }
      );
    }
  );
});

app.get('/api/collection', authenticateToken, (req, res) => {
  const idutilisateur = req.user.id;
  
  db.query(
    `SELECT g.*, c.date_ajout 
     FROM Collection c
     JOIN Generate g ON c.idgenerate = g.idgenerate
     WHERE c.idutilisateur = ?
     ORDER BY c.date_ajout DESC`,
    [idutilisateur],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.delete('/api/collection/:idgenerate', authenticateToken, (req, res) => {
  const { idgenerate } = req.params;
  const idutilisateur = req.user.id;
  
  db.query(
    'DELETE FROM Collection WHERE idutilisateur = ? AND idgenerate = ?',
    [idutilisateur, idgenerate],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Item non trouvé' });
      res.json({ message: 'Supprimé de votre collection' });
    }
  );
});

app.listen(3001, () => console.log('✅ API running on http://localhost:3001'));