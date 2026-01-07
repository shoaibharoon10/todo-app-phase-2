Full-Stack Web App with Persistent DB & Auth
1. Objective
Evolve the Phase I In-memory Python CLI into a production-ready Full-stack Web Application. The goal is to provide a persistent storage layer and a modern web interface.

2. Architecture & Tech Stack
-	Monorepo Structure: The project must follow a monorepo layout with separate /frontend and /backend directories.

-	Backend: Developed using FastAPI and SQLModel with Python 3.13 managed via uv.

-	Frontend: Developed using Next.js (App Router) with Tailwind CSS.

-	Database: Neon DB (PostgreSQL) for persistent data storage.

-	Authentication: Integration of Better Auth for secure user login and sessions.

3. Functional Requirements
-	Task Management: Users must be able to Create, Read, Update, and Delete (CRUD) todo items via the Web UI.

-	Persistent Storage: All tasks must be stored in Neon DB so they remain available after server restarts.

-	User Auth: Implementation of a signup/login flow using Better Auth.

-	Urdu Language Support: The entire Web UI (forms, tables, buttons) must support Urdu text (UTF-8) for bonus marks (+100).

4. Implementation Steps for AI
	1. Backend Setup: Initialize a FastAPI project in /backend, configure SQLModel with the Neon DB connection string, and create a Task table schema.

	2. API Development: Create REST endpoints for GET /tasks, POST /tasks, PATCH /tasks/{id}, and DELETE /tasks/{id}.

	3. Frontend Setup: Initialize a Next.js project in /frontend and design a responsive UI using Tailwind CSS.

	4. Integration: Connect the Next.js frontend to the FastAPI backend using fetch or axios.

	5. Auth Integration: Setup Better Auth on both frontend and backend.