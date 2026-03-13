# MedoseTracker API
> A RESTful API for managing medicines and tracking daily dose adherence.

## Overview

MedoseTracker API is a RESTful backend service built with Node.js, Express, and MongoDB that allows users to manage their medicines and track their daily doses. The API provides secure authentication using JSON Web Tokens and enables users to record when a dose is taken or missed, as well as view adherence summaries.

This project was built as a backend practice project to learn API design, authentication, database modeling, and middleware usage in a real-world scenario.

## Features

- User registration and login
- JWT-based authentication with access and refresh tokens
- Secure cookie storage for refresh tokens
- CRUD operations for medicines
- Dose logging for each medicine
- Retrieve doses taken today
- View adherence summary for a medicine
- Role-based access control
- MongoDB database with Mongoose schemas

## Project Structure

```
medose-tracker-api
│
├── config
│   ├── db.js
│   └── roles.js
│
├── controller
│   ├── auth.js
│   ├── medicine.js
│   └── dose.js
│
├── middleware
│   ├── auth.js
│   └── ownership.js
│
├── model
│   ├── User.js
│   ├── Medicine.js
│   └── Dose.js
│
├── routes
│   ├── api
│   │   ├── medicine.js
│   │   └── dose.js
│   └── auth.js
│
├── .env.example
├── package.json
└── server.js
```

## Authentication Flow

The API uses a token-based authentication system:

1. A user logs in and receives an **access token** and a **refresh token**.
2. The access token is used to access protected routes.
3. The refresh token is stored in an HTTP-only cookie.
4. When the access token expires, the client can call the `/auth/refresh` route to obtain a new access token.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive access token |
| GET | /auth/logout | Logout and clear refresh token |
| GET | /auth/refresh | Generate a new access token |

### Medicines

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/medicine | Create a medicine |
| GET | /api/medicine | Get all medicines for the user |
| GET | /api/medicine/:id | Get a specific medicine |
| PUT | /api/medicine/:id | Update a medicine |
| DELETE | /api/medicine/:id | Delete a medicine |

### Dose Tracking

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/dose/:medId | Log a dose for a medicine |
| GET | /api/dose/:medId/today | Get today's doses |
| GET | /api/dose/:medId/summary | Get adherence summary |

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```
PORT=your-port
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
DATABASE_URI=your-mongodb-connection-string
```

## Installation

Clone the repository and install dependencies.

```
git clone <repository-url>
cd medose-tracker-api
npm install
```

Create a `.env` file and then start the server.

```
npm run dev
```

## Purpose of the Project

This project was built as a learning exercise to practice backend development concepts such as:

- REST API design
- Authentication with JWT
- Role-based middleware
- MongoDB schema design
- Handling user-specific data securely

## License

*This project is licensed under the MIT License.*