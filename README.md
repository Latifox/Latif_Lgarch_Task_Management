# Task Manager Application

A full-stack task management application with user authentication, task CRUD operations, and containerized deployment.

## Project Structure

```
task-manager/
├── backend/               # Node.js Express backend
│   ├── src/               # Source code
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration files
│   │   └── index.js       # Entry point
│   ├── tests/             # Test files
│   └── package.json       # Backend dependencies
├── frontend/              # React frontend
│   ├── src/               # Source code
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main component
│   ├── tests/             # Test files
│   └── package.json       # Frontend dependencies
├── .github/               # GitHub configuration
│   └── workflows/         # GitHub Actions workflows
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Main Dockerfile
└── README.md              # Project documentation
```

## Features

- **User Authentication**: Register, login, logout
- **Task Management**: Create, read, update, delete tasks
- **Task Properties**: Title, description, status, priority, category, due date
- **Filtering & Sorting**: Filter tasks by status, priority, or category
- **Responsive Design**: Mobile-friendly interface
- **API Documentation**: Swagger UI

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Swagger for API Documentation
- Jest for Testing

### Frontend
- React with TypeScript
- React Router for Navigation
- Context API for State Management
- Tailwind CSS for Styling
- Jest and React Testing Library

### DevOps
- Docker & Docker Compose for Containerization
- GitHub Actions for CI/CD
- Automated Testing and Deployment

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Docker & Docker Compose (optional)

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. Start the backend:
   ```
   cd backend
   npm install
   npm run dev
   ```

3. Start the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

4. Access the application at `http://localhost:3000`

### Using Docker

```
docker-compose up
```

Access the application at `http://localhost:3000`

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Testing

### Backend Tests
```
cd backend
npm test
```

### Frontend Tests
```
cd frontend
npm test
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. On every push to `main` or `develop`, tests are automatically run.
2. On successful test completion on the `main` branch, a deployment artifact is created.
3. Test coverage reports are generated for code quality monitoring.

## License

This project is licensed under the MIT License. 