const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const db = new sqlite3.Database(config.database.filename, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
  createTables();
});

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      user_id INTEGER,
      answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
}

const dbOperations = {
  createUser: (email, hashedPassword, name) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  getQuestions: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM questions', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  findResponse: (userId, questionId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM responses WHERE user_id = ? AND question_id = ?',
        [userId, questionId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  updateResponse: (answer, responseId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE responses SET answer = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?',
        [answer, responseId],
        function(err) {
          if (err) reject(err);
          else resolve({ id: responseId, updated: true });
        }
      );
    });
  },

  createResponse: (questionId, userId, answer) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO responses (question_id, user_id, answer) VALUES (?, ?, ?)',
        [questionId, userId, answer],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, updated: false });
        }
      );
    });
  },

  getUserResponses: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, q.title as question_title 
        FROM responses r 
        JOIN questions q ON r.question_id = q.id 
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
      `, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = {
  db,
  dbOperations
}; 