# TaskFlow

## Overview

TaskFlow is a professional full-stack task management application that allows users to organize their tasks on a Kanban-style board with columns and priority indicators.

## Features

- **Board**: Displays the main workspace.
- **Columns**: Organizes tasks by their current status.
- **Tasks**: Individual units of work.
- **Create Task**: Add new tasks with validation.
- **Edit Task**: Update task details inline.
- **Delete Task**: Remove tasks permanently with confirmation.
- **Move Task**: Transfer tasks between columns seamlessly.
- **Priority**: Mark tasks as Low, Medium, or High priority.
- **Priority Filter**: Filter the board to see only specific priority tasks.
- **Validation**: Enforces strict backend validation (e.g. required titles).
- **Error Handling**: Graceful error UI and normalized JSON API errors.
- **SQLite persistence**: All data is saved reliably via SQLite.

## Project Structure

```
TaskFlow/
├── backend/
│   ├── data/            # SQLite database
│   ├── src/
│   │   ├── config/      # Environment config
│   │   ├── controllers/ # HTTP logic
│   │   ├── db/          # Database connection & seed
│   │   ├── middleware/  # Error handlers
│   │   ├── routes/      # Express routing
│   │   ├── services/    # Business logic & queries
│   │   └── utils/       # Utility classes (AppError)
│   └── tests/           # Jest validation/query suites
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Common & Layout UI
        ├── features/    # Board & Tasks feature boundaries
        ├── hooks/       # Async utilities
        ├── services/    # Global API client
        └── utils/       # Helpers
```

## Technology Stack

Backend:
- Node.js
- Express
- SQLite (better-sqlite3)

Frontend:
- React
- Vite
- CSS (Vanilla)

## Requirements

- Node.js (v18+)
- npm

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database

To initialize the SQLite database and seed the mock data:
```bash
cd backend
node src/db/seed.js
```

## Running Backend

```bash
cd backend
npm start
```
The server will run at `http://localhost:5000`.

## Running Frontend

```bash
cd frontend
npm run dev
```
The client will be available at `http://localhost:5173`.

## Testing

```bash
cd backend
npm test
```

## Build

```bash
cd frontend
npm run build
```

## API

### 1. Get Board
- **Method**: `GET`
- **Endpoint**: `/api/boards/:boardId`
- **Purpose**: Fetch a board along with its nested columns and tasks.
- **Response**: Returns the complete nested board object.

### 2. Get Tasks
- **Method**: `GET`
- **Endpoint**: `/api/tasks`
- **Purpose**: Fetch all tasks (supports query parameter `?priority=`).
- **Response**: Array of task objects.

### 3. Create Task
- **Method**: `POST`
- **Endpoint**: `/api/tasks`
- **Purpose**: Create a new task.
- **Request body**:
  ```json
  {
    "title": "New Task",
    "description": "Details",
    "columnId": 1,
    "priority": "Medium"
  }
  ```
- **Response**: Returns the created task object.

### 4. Update Task
- **Method**: `PUT`
- **Endpoint**: `/api/tasks/:taskId`
- **Purpose**: Modify an existing task's title, description, or priority.
- **Request body**:
  ```json
  {
    "title": "Updated",
    "description": "New details",
    "priority": "High"
  }
  ```
- **Response**: Returns the updated task object.

### 5. Delete Task
- **Method**: `DELETE`
- **Endpoint**: `/api/tasks/:taskId`
- **Purpose**: Remove a task.
- **Response**: Status `204 No Content` on success.

### 6. Move Task
- **Method**: `PATCH`
- **Endpoint**: `/api/tasks/:taskId/column`
- **Purpose**: Update a task's column placement.
- **Request body**:
  ```json
  {
    "columnId": 2
  }
  ```
- **Response**: Returns the moved task object.
