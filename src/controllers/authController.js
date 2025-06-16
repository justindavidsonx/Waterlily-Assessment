const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbOperations } = require('../services/database');
const config = require('../config');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await dbOperations.createUser(email, hashedPassword, name);
    const token = jwt.sign({ userId }, config.jwtSecret);
    
    res.json({ token });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dbOperations.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
}; 