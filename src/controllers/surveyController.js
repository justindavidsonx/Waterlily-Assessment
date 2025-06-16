const { dbOperations } = require('../services/database');

const getQuestions = async (req, res, next) => {
  try {
    const questions = await dbOperations.getQuestions();
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

const submitResponse = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.user.userId;

    const existingResponse = await dbOperations.findResponse(userId, questionId);
    const result = existingResponse
      ? await dbOperations.updateResponse(answer, existingResponse.id)
      : await dbOperations.createResponse(questionId, userId, answer);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getUserResponses = async (req, res, next) => {
  try {
    const responses = await dbOperations.getUserResponses(req.user.userId);
    res.json(responses);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestions,
  submitResponse,
  getUserResponses
}; 