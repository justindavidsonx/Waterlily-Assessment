const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/survey');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', surveyRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
}); 