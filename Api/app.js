import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(cors({ origin: "http://localhost:5173", credentials: true }))

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'secret-key'

// Initialize SQLite database connection
const db = new sqlite3.Database('./weeboDb.db');

// Create 'users' table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging in');
      } else if (!row) {
        res.status(401).send('Invalid username or password');
      } else {
        const isValidPassword = await bcrypt.compare(password, row.password);
        if (isValidPassword) {
          const token = jwt.sign({ userId: row.id }, JWT_SECRET);
          res.cookie('token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            path: '/',
            domain: 'localhost',
            httpOnly: true,
            secure: true
          });
          res.send({ token, "username": username });
        } else {
          res.status(401).send('Invalid username or password');
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});
// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error registering user');
      } else {
        res.send('User registered successfully');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.isAuthenticated = false;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    res.locals.isAuthenticated = true;
    next();
  } catch (ex) {
    res.locals.isAuthenticated = false;
    next();
  }
}

app.get('/protect', verifyToken, (req, res) => {
  const isAuthenticated = res.locals.isAuthenticated;
  if (isAuthenticated) {
    // User is authenticated, send protected data
    const data = {
      message: 'This is protected data!',
      isAuthenticated: true
    };
    res.json(data);
  } else {
    // User is not authenticated, send error response
    const data = {
      error: 'Access denied. User is not authenticated.',
      isAuthenticated: false
    };
    res.status(401).json(data);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
