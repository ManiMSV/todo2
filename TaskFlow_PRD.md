# Product Requirements Document
## TaskFlow — Full-Stack To-Do / Task Manager

| Field | Details |
|-------|---------|
| **Version** | 1.0 |
| **Date** | March 2026 |
| **Status** | Draft |
| **Author** | Project Owner |
| **Frontend** | Angular |
| **Backend** | FastAPI (Python) |
| **Database** | MongoDB Atlas |
| **Deployment** | Render \| GitHub Pages \| MongoDB Atlas |

---

## Table of Contents

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Features & User Stories](#2-features--user-stories)
3. [Tech Stack & Architecture](#3-tech-stack--architecture)
4. [API Endpoints](#4-api-endpoints)
5. [Deployment Plan](#5-deployment-plan)
6. [Timeline & Milestones](#6-timeline--milestones)

---

## 1. Project Overview & Goals

### 1.1 Project Summary

TaskFlow is a full-stack task management web application designed to help individuals and small teams organize, track, and complete their daily tasks efficiently. The application provides a clean, intuitive interface for managing to-dos with features like categories, priorities, due dates, and status tracking.

### 1.2 Problem Statement

Many learners and small teams lack a personalized, lightweight task manager that they fully control. Existing tools are either too complex, too expensive, or provide no learning value. TaskFlow solves this by being a hands-on, full-stack learning project that also delivers real utility.

### 1.3 Goals & Objectives

**Primary Goals**
- Build a functional, deployable full-stack task management application
- Learn and apply Angular for the frontend SPA
- Learn and apply FastAPI for building REST APIs in Python
- Use MongoDB Atlas as the cloud-hosted NoSQL database
- Deploy the full application using Render (backend), GitHub Pages (frontend), and MongoDB Atlas (DB)

**Success Metrics**
- Users can create, read, update, and delete tasks (full CRUD)
- Angular frontend communicates correctly with FastAPI backend via REST
- Application is live and accessible via public URLs
- All API endpoints are tested and documented

### 1.4 Target Users

- Individual developers learning full-stack development
- Students managing coursework and assignments
- Anyone needing a simple personal task tracker

### 1.5 Scope

**In Scope**
- User registration and login (JWT-based authentication)
- Task CRUD operations
- Task filtering by status, priority, and due date
- Responsive UI with Angular
- REST API with FastAPI
- Cloud deployment on Render + GitHub Pages

**Out of Scope (v1)**
- Team collaboration / task sharing
- Real-time notifications
- Mobile native app (iOS/Android)
- Third-party integrations (Slack, Calendar, etc.)

---

## 2. Features & User Stories

### 2.1 Feature List

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| F1 | User Authentication | Register, login, logout with JWT tokens | High |
| F2 | Task Creation | Add tasks with title, description, priority, due date, and category | High |
| F3 | Task Listing | View all tasks in a dashboard with sorting and filtering | High |
| F4 | Task Update | Edit task details and change status (To-Do, In Progress, Done) | High |
| F5 | Task Deletion | Delete individual tasks permanently | High |
| F6 | Task Filtering | Filter tasks by status, priority, and category | Medium |
| F7 | Due Date Tracking | Highlight overdue and upcoming tasks visually | Medium |
| F8 | Dashboard Stats | Show task counts by status on the home screen | Low |
| F9 | Responsive UI | Mobile-friendly layout using Angular + CSS | Medium |

### 2.2 User Stories

**Authentication**
- As a new user, I want to register with an email and password so I can create my own account.
- As a registered user, I want to log in so that I can access my tasks securely.
- As a logged-in user, I want to log out so that my session is terminated safely.

**Task Management**
- As a user, I want to create a task with a title, description, due date, priority, and category so I can capture my work clearly.
- As a user, I want to view all my tasks in a list/dashboard so I can get an overview of everything.
- As a user, I want to mark a task as "In Progress" or "Done" so I can track my progress.
- As a user, I want to edit any task's details so I can update information when things change.
- As a user, I want to delete tasks I no longer need so I can keep my list clean.

**Filtering & Organization**
- As a user, I want to filter tasks by status so I can see only pending or completed items.
- As a user, I want to filter tasks by priority so I can focus on what's most urgent.
- As a user, I want to sort tasks by due date so I can prioritize upcoming deadlines.

**Dashboard**
- As a user, I want to see a summary card showing how many tasks are To-Do, In Progress, and Done so I have a quick snapshot of my workload.

---

## 3. Tech Stack & Architecture

### 3.1 Technology Stack

| Layer | Technology | Details |
|-------|------------|---------|
| Frontend | Angular (latest) | TypeScript SPA, Angular CLI, Reactive Forms, RxJS, Angular Router |
| Styling | Angular Material / CSS | Component library + custom responsive CSS |
| Backend | FastAPI (Python) | Python 3.11+, Pydantic models, Uvicorn ASGI server |
| Auth | JWT (JSON Web Tokens) | python-jose for token creation, OAuth2PasswordBearer |
| Database | MongoDB Atlas | Cloud-hosted NoSQL, Motor (async MongoDB driver) |
| ODM | Beanie / Motor | Async MongoDB ODM or raw Motor driver with Pydantic |
| Frontend Deploy | GitHub Pages | Deployed via gh-pages npm package or GitHub Actions |
| Backend Deploy | Render | Free-tier web service, auto-deploy from GitHub |
| DB Hosting | MongoDB Atlas | Free M0 cluster, IP whitelisting, connection string in env vars |
| Version Control | GitHub | Mono-repo or split frontend/backend repos |

### 3.2 High-Level Architecture

```
┌─────────────────────┐        HTTP REST        ┌─────────────────────┐        Motor Driver        ┌─────────────────────┐
│   Angular SPA       │ ─────────────────────►  │   FastAPI on Render │ ────────────────────────►  │   MongoDB Atlas     │
│   (GitHub Pages)    │ ◄─────────────────────  │   /api/v1/* routes  │ ◄────────────────────────  │   M0 Free Cluster   │
└─────────────────────┘      JSON Response       └─────────────────────┘       Query Results        └─────────────────────┘
```

### 3.3 Data Flow

1. User opens the Angular app via GitHub Pages URL.
2. Angular makes HTTP requests to the FastAPI backend hosted on Render.
3. FastAPI processes the request, runs business logic, and queries MongoDB Atlas.
4. MongoDB returns data to FastAPI, which sends a JSON response back to Angular.
5. Angular updates the UI reactively using RxJS observables.

### 3.4 Data Models

**User Model**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated MongoDB document ID |
| `email` | String | Unique user email address (used for login) |
| `hashed_password` | String | Bcrypt-hashed password |
| `full_name` | String | Optional display name |
| `created_at` | DateTime | Account creation timestamp (UTC) |

**Task Model**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated MongoDB document ID |
| `user_id` | ObjectId | Reference to the owner User document |
| `title` | String | Task title (required, max 200 chars) |
| `description` | String | Optional detailed description |
| `status` | Enum | `todo` \| `in_progress` \| `done` (default: `todo`) |
| `priority` | Enum | `low` \| `medium` \| `high` (default: `medium`) |
| `category` | String | Optional tag/category label |
| `due_date` | DateTime | Optional deadline in UTC |
| `created_at` | DateTime | Task creation timestamp |
| `updated_at` | DateTime | Last modification timestamp |

---

## 4. API Endpoints

> **Base URL:** `https://<your-render-app>.onrender.com/api/v1`

### 4.1 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Create a new user account | No |
| `POST` | `/auth/login` | Authenticate user, return JWT access token | No |
| `GET` | `/auth/me` | Get current authenticated user's profile | Yes |

### 4.2 Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/tasks` | Get all tasks for the current user (supports filters) | Yes |
| `POST` | `/tasks` | Create a new task | Yes |
| `GET` | `/tasks/{id}` | Get a single task by ID | Yes |
| `PUT` | `/tasks/{id}` | Update all fields of a task | Yes |
| `PATCH` | `/tasks/{id}` | Partially update a task (e.g., status change) | Yes |
| `DELETE` | `/tasks/{id}` | Delete a task permanently | Yes |

### 4.3 Query Parameters for `GET /tasks`

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | String | Filter by status: `todo`, `in_progress`, `done` |
| `priority` | String | Filter by priority: `low`, `medium`, `high` |
| `category` | String | Filter by category label |
| `sort_by` | String | Sort field: `due_date`, `created_at`, `priority` |
| `order` | String | Sort direction: `asc` or `desc` (default: `asc`) |

### 4.4 Sample Request & Response

**POST `/tasks` — Request Body**
```json
{
  "title": "Complete Angular tutorial",
  "description": "Finish the RxJS chapter",
  "priority": "high",
  "category": "Learning",
  "due_date": "2026-03-20T00:00:00Z"
}
```

**Response `201 Created`**
```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Complete Angular tutorial",
  "description": "Finish the RxJS chapter",
  "status": "todo",
  "priority": "high",
  "category": "Learning",
  "due_date": "2026-03-20T00:00:00Z",
  "created_at": "2026-03-09T10:00:00Z",
  "updated_at": "2026-03-09T10:00:00Z"
}
```

---

## 5. Deployment Plan

### 5.1 Deployment Overview

| Component | Platform | Notes |
|-----------|----------|-------|
| Angular Frontend | GitHub Pages | Free static hosting via `gh-pages` branch or GitHub Actions |
| FastAPI Backend | Render (Free Tier) | Web Service, auto-deploy from GitHub, env vars in Render dashboard |
| MongoDB Database | MongoDB Atlas (M0 Free) | 512MB free cluster, connect via connection string in env var |

### 5.2 Frontend Deployment — GitHub Pages

1. Install gh-pages: `npm install gh-pages --save-dev`
2. Build with correct base-href: `ng build --base-href /repo-name/`
3. Add deploy script in `package.json`:
   ```json
   "deploy": "ng build --base-href /repo-name/ && npx gh-pages -d dist/app"
   ```
4. Run `npm run deploy` — GitHub Pages will serve from `gh-pages` branch
5. Enable GitHub Pages in repo Settings > Pages > Branch: `gh-pages`
6. **Final URL:** `https://<username>.github.io/<repo-name>`

### 5.3 Backend Deployment — Render

1. Push FastAPI code to a GitHub repository
2. Create a new **Web Service** on Render, connect to GitHub repo
3. Set **Build Command:** `pip install -r requirements.txt`
4. Set **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add environment variables in Render dashboard (see section 5.5)
6. Enable auto-deploy on push to `main` branch
7. **Final URL:** `https://<app-name>.onrender.com`

### 5.4 Database Setup — MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist IP: `0.0.0.0/0` for Render (or use Render static IP on paid plan)
4. Get connection string: `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<dbname>`
5. Store as `MONGODB_URL` environment variable on Render

### 5.5 Environment Variables

| Variable | Where Set | Description |
|----------|-----------|-------------|
| `MONGODB_URL` | Render | Full MongoDB Atlas connection string |
| `SECRET_KEY` | Render | Random secret for JWT signing (min 32 chars) |
| `ALGORITHM` | Render | JWT algorithm, typically `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Render | JWT expiry duration (e.g., `30` or `60`) |
| `API_BASE_URL` | Angular `environment.ts` | Render backend URL for HTTP requests |

### 5.6 CORS Configuration

Add `CORSMiddleware` to `main.py` to allow requests from GitHub Pages:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://<username>.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 6. Timeline & Milestones

### 6.1 Estimated Timeline (10 Weeks)

| Week | Phase | Tasks | Deliverable |
|------|-------|-------|-------------|
| 1 | Setup | Project planning, repo setup, environment config, PRD finalized | GitHub repos created |
| 2 | Backend Core | FastAPI app setup, MongoDB Atlas connection, User model & auth endpoints | Auth API working |
| 3 | Backend Tasks | Task model, CRUD endpoints, query filters, Pydantic schemas | Tasks API complete |
| 4 | Backend Polish | Error handling, input validation, API docs (Swagger auto-docs) | Tested API + Swagger UI |
| 5 | Frontend Setup | Angular project init, routing, Angular Material, auth service + interceptor | Angular scaffold ready |
| 6 | Frontend Auth | Login/Register components, JWT storage, route guards | Auth flow working |
| 7 | Frontend Tasks | Task list, create task form, task detail view, status update | Core UI functional |
| 8 | Frontend Polish | Filtering, sorting, dashboard stats, overdue highlighting, responsive design | Full UI complete |
| 9 | Integration & Testing | End-to-end testing, bug fixing, CORS setup, data validation | Integrated & tested app |
| 10 | Deployment | Deploy backend to Render, frontend to GitHub Pages, MongoDB Atlas config | **Live public app!** |

### 6.2 Milestones

| # | Milestone | Target Week | Success Criteria |
|---|-----------|-------------|-----------------|
| M1 | Backend Auth API Live | Week 2 | User can register and get JWT token |
| M2 | Full Backend API Live | Week 4 | All task CRUD endpoints tested via Swagger |
| M3 | Frontend Scaffold Ready | Week 5 | Angular app runs locally with routing |
| M4 | Auth Flow Complete | Week 6 | User can log in and see protected pages |
| M5 | Full UI Complete | Week 8 | All task features work in the browser |
| M6 | App Live in Production | Week 10 | Public URL works, all features functional |

### 6.3 Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Render free tier spins down (cold start) | High | Inform users of cold start delay or upgrade Render plan |
| CORS misconfiguration blocks frontend | Medium | Test CORS locally first, whitelist exact GitHub Pages domain |
| JWT token expiry issues in Angular | Medium | Implement HTTP interceptor to refresh/handle 401 errors |
| MongoDB Atlas IP whitelist blocks Render | Low | Set Atlas IP whitelist to `0.0.0.0/0` during development |
| Scope creep adds unplanned features | Medium | Stick to v1 scope; track future features in GitHub Issues |

---

*TaskFlow PRD v1.0 — March 2026 | Angular + FastAPI + MongoDB Atlas*
