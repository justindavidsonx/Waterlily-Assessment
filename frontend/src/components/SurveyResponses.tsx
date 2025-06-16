import React, { useState, useEffect } from 'react';
import { Response, ApiError } from '../types.ts';
import { api } from '../services/api.ts';

const SurveyResponses: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getResponses();
      setResponses(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load responses. Please try again later.');
      console.error('Error fetching responses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      {responses.length === 0 ? (
        <p className="text-center text-gray-500">No responses yet.</p>
      ) : (
        responses.map((response) => (
          <div
            key={response.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="font-medium text-gray-900">{response.question_title}</h3>
            <p className="mt-1 text-gray-600">{response.answer}</p>
            {response.created_at && (
              <p className="mt-2 text-sm text-gray-500">
                Submitted on: {new Date(response.created_at).toLocaleString()}
              </p>
            )}
          </div>
        ))
      )}
      <div className="mt-4 text-center">
        <button
          onClick={fetchResponses}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Responses
        </button>
      </div>
    </div>
  );
};

export default SurveyResponses; 