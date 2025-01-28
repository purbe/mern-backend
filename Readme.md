# MERN Backend

A backend server for a MERN (MongoDB, Express, React, Node.js) application. This project provides RESTful APIs to support the application's functionality.

## Features

- RESTful API structure
- CRUD operations for managing resources
- MongoDB as the database
- JWT-based authentication and authorization
- Environment-based configuration
- Error handling middleware

## Prerequisites

Make sure you have the following installed on your system:

- Node.js (>= 16.x)
- npm or yarn
- MongoDB (local or cloud-based)

## Installation

Follow these steps 
1. Clone the repository:

   ```bash
   git clone https://github.com/purbe/mern-backend.git

2. Navigate to the project directory:
  
   ```bash 
   cd mern-backend

3. Install dependencies:
   ```bash
   npm install
4. Create a .env file in the root directory and configure the following variables:
   ``` 
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
5. Start the development server:
   ``` 
   npm run dev
6. The backend server will be running on http://localhost:5000

## API Endpoints
Here’s an example of the available API endpoints:

## Auth Endpoints

      POST /api/auth/register - Register a new user
      POST /api/auth/login - Log in with user credentials
      User Endpoints
      GET /api/users - Get all users (Admin only)
      GET /api/users/:id - Get a user by ID
      PUT /api/users/:id - Update user details
      DELETE /api/users/:id - Delete a user

## Scripts
Here are the available npm scripts:
```
npm run dev - Start the server in development mode with hot reload
npm start - Start the server in production mode
npm run lint - Run ESLint to check code quality


