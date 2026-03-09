# TaskFlow — Full-Stack To-Do Task Manager

**Tech Stack:**
- Frontend: Angular (standalone components)
- Backend: FastAPI + Python
- Database: MongoDB Atlas
- Deployment: Render (backend) + GitHub Pages (frontend)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running locally OR MongoDB Atlas account

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate      # macOS/Linux

pip install -r requirements.txt
copy .env.example .env
# Edit .env with your MongoDB connection string

uvicorn app.main:app --reload --port 8000
```

Backend will run at `http://localhost:8000`. Swagger docs: `http://localhost:8000/docs`.

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run at `http://localhost:4200` and automatically proxy to the backend API.

### 3️⃣ Test the App

1. Open `http://localhost:4200`
2. Click "Register here" and create an account
3. Login with your credentials
4. Create, filter, and manage tasks!

---

## 📁 Project Structure

```
todo/
├── backend/               # FastAPI Python backend
│   ├── app/
│   │   ├── api/v1/       # Auth & task endpoints
│   │   ├── core/         # Config & security utils
│   │   ├── db/           # MongoDB connection
│   │   ├── models/       # Enums & data models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # Business logic for users & tasks
│   │   └── main.py       # FastAPI app entry point
│   ├── requirements.txt
│   └── .env.example
├── frontend/             # Angular SPA
│   ├── src/app/
│   │   ├── auth.service.ts       # JWT auth service
│   │   ├── task.service.ts       # Task API service
│   │   ├── auth.interceptor.ts   # HTTP token injector
│   │   ├── auth.guard.ts         # Route protection
│   │   ├── login.component.ts
│   │   ├── register.component.ts
│   │   └── tasks.component.ts
│   ├── package.json
│   └── angular.json
└── TaskFlow_PRD.md       # Full product requirements doc
```

---

## 🔒 Authentication Flow

1. **Register:** POST to `/api/v1/auth/register` with email/password
2. **Login:** POST to `/api/v1/auth/login` (form-data: username=email, password=password)
3. **Token:** Receive JWT access token, stored in `localStorage`
4. **Protected Routes:** Angular `authGuard` checks token; HTTP interceptor adds `Authorization: Bearer <token>` header

---

## 🧪 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Create new user | No |
| `POST` | `/api/v1/auth/login` | Login, get JWT token | No |
| `GET` | `/api/v1/auth/me` | Get current user profile | Yes |
| `GET` | `/api/v1/tasks` | List all tasks (supports filters) | Yes |
| `POST` | `/api/v1/tasks` | Create new task | Yes |
| `GET` | `/api/v1/tasks/{id}` | Get single task | Yes |
| `PUT` | `/api/v1/tasks/{id}` | Full update of task | Yes |
| `PATCH` | `/api/v1/tasks/{id}` | Partial update (e.g., status only) | Yes |
| `DELETE` | `/api/v1/tasks/{id}` | Delete task | Yes |

**Filter Parameters for `GET /tasks`:**
- `status_filter`: `todo`, `in_progress`, `done`
- `priority`: `low`, `medium`, `high`
- `category`: any string
- `sort_by`: `created_at`, `due_date`, `priority`
- `order`: `asc` or `desc`

---

## 🌐 Deployment

### Backend — Render

1. Push `backend/` to a GitHub repo
2. Create a new Web Service on [Render](https://render.com)
3. Set **Build Command:** `pip install -r requirements.txt`
4. Set **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. Add environment variables in Render dashboard:
   - `MONGODB_URL`: Your MongoDB Atlas connection string
   - `SECRET_KEY`: Random 32+ character string
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
   - `CORS_ORIGINS`: `["https://<your-username>.github.io"]`
6. Deploy! Backend URL: `https://<app-name>.onrender.com`

### Frontend — GitHub Pages

1. Edit `frontend/src/environments/environment.prod.ts` with your Render backend URL
2. Install gh-pages: `npm install gh-pages --save-dev`
3. Add deploy script in `package.json`:
   ```json
   "deploy": "ng build --configuration production --base-href /taskflow/ && npx gh-pages -d dist/frontend/browser"
   ```
4. Run: `npm run deploy`
5. Enable GitHub Pages in repo Settings → Pages → Branch: `gh-pages`
6. Access: `https://<your-username>.github.io/taskflow/`

### Database — MongoDB Atlas

1. Create free M0 cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create database user with read/write permissions
3. Whitelist IP: `0.0.0.0/0` (for development; restrict in production)
4. Copy connection string and set as `MONGODB_URL` in Render

---

## ✅ Features Implemented (PRD v1.0)

- ✅ User registration and login (JWT-based)
- ✅ Task CRUD (create, read, update, delete)
- ✅ Task status tracking (To-Do, In Progress, Done)
- ✅ Priority levels (low, medium, high)
- ✅ Filtering by status, priority, category
- ✅ Sorting by due date, created date, priority
- ✅ Responsive UI with inline styles
- ✅ Protected routes with auth guard
- ✅ HTTP interceptor for token injection
- ✅ Full REST API with Swagger docs

---

## 🛠️ Development Notes

### Backend
- Uses async Motor driver for MongoDB
- Pydantic schemas for validation
- JWT tokens with `python-jose`
- Bcrypt password hashing via `passlib`
- Auto-generated Swagger UI at `/docs`

### Frontend
- Angular 19 standalone components (no NgModules)
- RxJS observables for API calls
- Template-driven forms with `FormsModule`
- Route guards for authentication
- HTTP interceptor for token attachment

### Security
- Passwords hashed with bcrypt
- JWT tokens required for protected endpoints
- CORS configured per environment
- Unique email index on user collection

---

## 📚 Next Steps (Future Enhancements)

- [ ] Task sharing between users
- [ ] Real-time notifications (WebSockets)
- [ ] Recurring tasks
- [ ] Task attachments
- [ ] Calendar integration
- [ ] Mobile app (React Native / Flutter)
- [ ] Email reminders for due tasks
- [ ] Dashboard analytics & charts

---

## 📄 License

MIT License — feel free to use this project for learning or personal use.

---

**Built with ❤️ as a full-stack learning project | March 2026**
