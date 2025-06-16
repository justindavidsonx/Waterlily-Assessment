const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('survey.db');

const sampleQuestions = [
  // Demographic Information
  {
    title: 'What is your age?',
    description: 'Please enter your current age in years.',
    type: 'number'
  },
  {
    title: 'What is your gender?',
    description: 'Please select your gender identity.',
    type: 'text'
  },
  {
    title: 'What is your marital status?',
    description: 'Please select your current marital status.',
    type: 'text'
  },
  {
    title: 'Do you have any children?',
    description: 'Please indicate if you have any children.',
    type: 'text'
  },
  {
    title: 'What is your current living situation?',
    description: 'Please describe your current living arrangement.',
    type: 'text'
  },

  // Health Information
  {
    title: 'Do you have any chronic health conditions?',
    description: 'Please list any chronic health conditions you have been diagnosed with.',
    type: 'text'
  },
  {
    title: 'How would you rate your overall health?',
    description: 'Please rate your current health status from 1 (Poor) to 5 (Excellent).',
    type: 'number'
  },
  {
    title: 'Do you require assistance with daily activities?',
    description: 'Please indicate if you need help with activities like bathing, dressing, or eating.',
    type: 'text'
  },
  {
    title: 'Are you currently taking any medications?',
    description: 'Please list any medications you are currently taking.',
    type: 'text'
  },
  {
    title: 'Have you been hospitalized in the past year?',
    description: 'Please indicate if you have had any hospital stays in the last 12 months.',
    type: 'text'
  },

  // Financial Information
  {
    title: 'What is your annual household income?',
    description: 'Please enter your approximate annual household income.',
    type: 'number'
  },
  {
    title: 'Do you have long-term care insurance?',
    description: 'Please indicate if you have any long-term care insurance coverage.',
    type: 'text'
  },
  {
    title: 'What are your primary sources of income?',
    description: 'Please list your main sources of income (e.g., employment, retirement, investments).',
    type: 'text'
  },
  {
    title: 'Do you own your home?',
    description: 'Please indicate if you own or rent your primary residence.',
    type: 'text'
  },
  {
    title: 'What are your expected future care needs?',
    description: 'Please describe any anticipated future care requirements.',
    type: 'text'
  }
];

db.serialize(() => {
  // Create tables if they don't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);

  // Clear existing questions
  db.run('DELETE FROM questions');

  // Insert sample questions
  const insertQuestion = db.prepare('INSERT INTO questions (title, description, type, category) VALUES (?, ?, ?, ?)');
  
  sampleQuestions.forEach(question => {
    const category = question.title.includes('age') || question.title.includes('gender') || 
                    question.title.includes('marital') || question.title.includes('children') || 
                    question.title.includes('living') ? 'demographic' :
                    question.title.includes('health') || question.title.includes('condition') || 
                    question.title.includes('medication') || question.title.includes('hospital') ? 'health' : 'financial';
    
    insertQuestion.run(question.title, question.description, question.type, category);
  });

  insertQuestion.finalize();
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database seeded successfully');
  }
}); 