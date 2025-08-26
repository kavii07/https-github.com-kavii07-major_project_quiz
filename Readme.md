# Quiz Game - Real-time Multiplayer

This is a real-time multiplayer quiz game built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**. Each player answers questions independently, and the game ends when all players finish answering.

## Features

- **Real-time Gameplay** using **Socket.io**
- **Independent Player Progress** tracking
- **Game Ends Automatically** when all users finish
- **MongoDB Integration** for session and question storage

## Tech Stack

- **Frontend**: React, React Router, Axios, Context API
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/quiz-game.git
cd quiz-game
```

### 2. Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the **backend** directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quiz-game
JWT_SECRET=your_secret_key
```

### 4. Start the Backend Server

```sh
cd backend
npm start
```

### 5. Start the Frontend Server

```sh
cd frontend
npm start
```

---

## API Endpoints

### 1. Start Game Session

**Endpoint:** `POST /api/game/start` **Headers:** `{ Authorization: token }` **Response:**

```json
{
  "session": {
    "_id": "SESSION_ID",
    "questions": [...],
    "players": ["USER_1", "USER_2"]
  }
}
```

### 2. Submit Answer (via Socket.io)

**Event:** `answer:submit` **Payload:**

```json
{
  "sessionId": "SESSION_ID",
  "userId": "USER_ID",
  "answer": "USER_ANSWER"
}
```

### 3. Receive Next Question (via Socket.io)

**Event:** `question:send` **Payload:**

```json
{
  "question": {
    "questionText": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"]
  }
}
```

### 4. Receive Game End Event (via Socket.io)

**Event:** `game:end` **Payload:**

```json
{
  "scores": {
    "USER_1": 3,
    "USER_2": 2
  }
}
```

---

## Database Schema

### Game Session Model

```js
const gameSessionSchema = new mongoose.Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    scores: { type: Map, of: Number },
    status: { type: String, enum: ['waiting', 'ongoing', 'finished'], default: 'waiting' },
    userProgress: { type: Map, of: Number },
});
```

---

## Game Logic

1. **User joins the game**, and a session is created.
2. **Each user receives questions independently** through `question:send` event.
3. **User submits answers** through `answer:submit` event.
4. **User progress is tracked** via `userProgress` field.
5. **Game ends when all users finish** answering all questions.
6. **Final scores are sent** through `game:end` event.

---
