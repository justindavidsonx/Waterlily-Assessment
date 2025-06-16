const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getQuestions, submitResponse, getUserResponses } = require('../controllers/surveyController');

router.get('/questions', authenticateToken, getQuestions);
router.post('/responses', authenticateToken, submitResponse);
router.get('/responses', authenticateToken, getUserResponses);

module.exports = router; 