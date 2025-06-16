# Waterlily - Long-term Care Assessment Form System

A comprehensive system for collecting demographic, health, and financial information to predict long-term care needs and costs.

## Project Structure

```
├── src/                    # Backend source code
│   ├── config/            # Configuration settings
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── app.js            # Main application file
├── frontend/             # React frontend
│   └── src/
│       ├── components/   # React components
│       ├── contexts/     # React contexts
│       ├── services/     # API services
│       └── types/        # TypeScript types
└── seed.js              # Database seeding script
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd waterlily
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Create a `.env` file in the root directory:
```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

## Database Setup

1. Initialize the database with sample data:
```bash
node seed.js
```

This will:
- Create the necessary database tables
- Add sample questions for demographic, health, and financial information
- Set up the database schema with proper relationships

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a separate terminal, start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Survey
- GET `/api/questions` - Get all questions
- POST `/api/responses` - Submit a response
- GET `/api/responses` - Get user's responses

## Features

- User authentication and authorization
- Categorized questions (demographic, health, financial)
- Response management with update capability
- Real-time validation
- Progress tracking
- Responsive design

## Development

- Backend uses Express.js with SQLite
- Frontend uses React with TypeScript
- Authentication uses JWT
- Styling uses Tailwind CSS

## Security

- Passwords are hashed using bcrypt
- JWT for secure authentication
- CORS enabled for frontend access
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 