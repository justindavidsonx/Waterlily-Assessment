import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import SurveyForm from './components/SurveyForm.tsx';
import SurveyResponses from './components/SurveyResponses.tsx';
import Auth from './components/Auth.tsx';
import { api } from './services/api.ts';
import { Question } from './types.ts';

const SurveyApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [showResponses, setShowResponses] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await api.getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (!user) {
    return <Auth />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">
                    {showResponses ? 'Survey Responses' : 'Survey Form'}
                  </h1>
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
                {showResponses ? (
                  <SurveyResponses />
                ) : (
                  <SurveyForm 
                    questions={questions} 
                    onSubmit={() => setShowResponses(true)} 
                  />
                )}
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowResponses(!showResponses)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {showResponses ? 'Back to Survey' : 'View Responses'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SurveyApp />
    </AuthProvider>
  );
};

export default App; 