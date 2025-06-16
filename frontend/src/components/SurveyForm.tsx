import React, { useState, useEffect, useRef } from 'react';
import { Question, Response, FormState, ValidationError, SubmitResponseRequest } from '../types.ts';
import { api } from '../services/api.ts';

interface SurveyFormProps {
  questions: Question[];
  onSubmit: (responses: Response[]) => void;
  initialData?: Response[];
}

const SurveyForm: React.FC<SurveyFormProps> = ({ questions, onSubmit, initialData = [] }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formState, setFormState] = useState<FormState<Response[]>>({
    data: initialData,
    errors: {},
    isSubmitting: false,
    isDirty: false
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const validateQuestion = (question: Question, answer: string): ValidationError => {
    const errors: ValidationError = {};
    
    if (!answer.trim() && question.id) {
      errors[question.id] = 'This field is required';
    } else if (question.type === 'number' && isNaN(Number(answer)) && question.id) {
      errors[question.id] = 'Please enter a valid number';
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const currentAnswer = formState.data.find(r => r.question_id === currentQuestion.id)?.answer || '';
    const errors = validateQuestion(currentQuestion, currentAnswer);

    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, ...errors }
      }));
      return;
    }

    if (isLastQuestion) {
      setFormState(prev => ({ ...prev, isSubmitting: true }));
      try {
        await Promise.all(
          formState.data.map(async (response) => {
            const request: SubmitResponseRequest = {
              questionId: response.question_id,
              answer: response.answer
            };
            return api.submitResponse(request.questionId, request.answer);
          })
        );
        onSubmit(formState.data);
      } catch (error) {
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, submit: 'Failed to submit responses. Please try again.' }
        }));
      } finally {
        setFormState(prev => ({ ...prev, isSubmitting: false }));
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleAnswerChange = (value: string) => {
    const updatedData = [...formState.data];
    const existingIndex = updatedData.findIndex(r => r.question_id === currentQuestion.id!);

    if (existingIndex >= 0) {
      updatedData[existingIndex] = {
        ...updatedData[existingIndex],
        answer: value
      };
    } else {
      updatedData.push({
        question_id: currentQuestion.id!,
        answer: value,
        user_id: 0 // This will be set by the backend
      });
    }

    setFormState(prev => ({
      ...prev,
      data: updatedData,
      isDirty: true,
      errors: { ...prev.errors, [currentQuestion.id!]: '' }
    }));
  };

  const currentAnswer = formState.data.find(r => r.question_id === currentQuestion.id)?.answer || '';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">{currentQuestion.title}</h2>
        {currentQuestion.description && (
          <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
        )}

        <div className="mb-6">
          <input
            ref={inputRef}
            type={currentQuestion.type}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className={`w-full p-3 border rounded-md ${
              formState.errors[currentQuestion.id!] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter your ${currentQuestion.type} answer`}
            autoFocus
          />
          {formState.errors[currentQuestion.id!] && (
            <p className="text-red-500 text-sm mt-1">{formState.errors[currentQuestion.id!]}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentQuestionIndex === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={formState.isSubmitting}
            className={`px-4 py-2 rounded-md ${
              formState.isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLastQuestion ? (formState.isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm; 