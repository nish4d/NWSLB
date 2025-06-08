# Express MongoDB API

A simple REST API built with Express.js and MongoDB for handling user data.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on http://localhost:3000

## API Endpoints

### POST /api/users

Create a new user entry with name, email, and comment.

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "comment": "This is a comment"
}
```

### GET /api/users

Retrieve all user entries from the database.

## Response Format

### Success Response

```json
{
  "message": "Data saved successfully",
  "id": "objectId"
}
```

### Error Response

```json
{
  "error": "Error message"
}
```
