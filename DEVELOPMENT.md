# TaskFlow Development Guide

## Local Development Workflow

### Initial Setup (One-time)

1. **Clone/Open the repository**
   ```bash
   cd c:\Projects\django\todo
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   copy .env.example .env
   ```

3. **Configure MongoDB**
   - **Option A:** Local MongoDB (easiest for development)
     - Install MongoDB Community Server from https://www.mongodb.com/try/download/community
     - Leave `.env` with default `MONGODB_URL=mongodb://localhost:27017`
   
   - **Option B:** MongoDB Atlas (cloud)
     - Create free cluster at https://mongodb.com/cloud/atlas
     - Get connection string
     - Update `.env` with: `MONGODB_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow`

4. **Setup Frontend**
   ```bash
   cd ..\frontend
   npm install
   ```

### Daily Development

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   .venv\Scripts\activate
   uvicorn app.main:app --reload --port 8000
   ```
   Backend runs at `http://localhost:8000`
   Swagger docs at `http://localhost:8000/docs`

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs at `http://localhost:4200`

3. **Open browser:** `http://localhost:4200`

---

## API Testing with Swagger UI

1. Go to `http://localhost:8000/docs`
2. **Register a user:**
   - Expand `POST /api/v1/auth/register`
   - Click "Try it out"
   - Enter JSON:
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "full_name": "Test User"
     }
     ```
   - Click "Execute"
   - Should return 201 Created

3. **Login:**
   - Expand `POST /api/v1/auth/login`
   - Click "Try it out"
   - Enter form data:
     - `username`: `test@example.com`
     - `password`: `password123`
   - Click "Execute"
   - Copy the `access_token` from response

4. **Authorize Swagger:**
   - Click the green "Authorize" button at top
   - Paste token in "Value" field
   - Click "Authorize"

5. **Test Task Endpoints:**
   - Now all `/tasks` endpoints will include your auth token
   - Try `POST /api/v1/tasks` to create a task
   - Try `GET /api/v1/tasks` to list tasks

---

## Backend Code Structure

```
backend/app/
├── main.py                    # FastAPI app entry, CORS, startup/shutdown
├── core/
│   ├── config.py             # Settings from .env (Pydantic BaseSettings)
│   └── security.py           # Password hashing, JWT creation
├── db/
│   ├── database.py           # Motor MongoDB connection & lifecycle
│   └── object_id.py          # ObjectId validation helper
├── models/
│   └── enums.py              # TaskStatus, TaskPriority enums
├── schemas/
│   ├── auth.py               # UserRegister, UserRead, Token schemas
│   └── task.py               # TaskCreate, TaskUpdate, TaskRead schemas
├── services/
│   ├── users.py              # User CRUD & authentication logic
│   └── tasks.py              # Task CRUD, filtering, sorting logic
└── api/
    ├── deps.py               # Dependencies: get_current_user
    └── v1/
        ├── auth.py           # /auth routes: register, login, me
        └── tasks.py          # /tasks routes: CRUD endpoints
```

---

## Frontend Code Structure

```
frontend/src/app/
├── app.component.ts          # Root component with <router-outlet>
├── app.routes.ts             # Route definitions + auth guard
├── app.config.ts             # App providers (HttpClient, interceptor)
├── auth.service.ts           # JWT auth: register, login, logout, getToken
├── task.service.ts           # Task API calls: getTasks, createTask, etc.
├── auth.interceptor.ts       # HTTP interceptor: adds Bearer token
├── auth.guard.ts             # Route guard: redirect to /login if not authed
├── login.component.ts        # Login form + error handling
├── register.component.ts     # Registration form + success message
└── tasks.component.ts        # Task list/create/filter/delete UI
```

---

## Making Backend Changes

### Adding a New Field to Task

1. **Update Schema** (`backend/app/schemas/task.py`):
   ```python
   class TaskBase(BaseModel):
       # ... existing fields ...
       new_field: str | None = None
   ```

2. **Update Service** (`backend/app/services/tasks.py`):
   - Add field to `create_task` doc dict
   - Add field to `update_task` logic if needed

3. **Test in Swagger:** Restart backend, check Swagger UI, send request with new field

### Adding a New API Endpoint

1. **Create Service Function** (`backend/app/services/tasks.py`):
   ```python
   async def get_task_stats(user_id: str) -> dict:
       db = get_database()
       # ... implement logic ...
       return {"total": 10, "done": 3}
   ```

2. **Add Route** (`backend/app/api/v1/tasks.py`):
   ```python
   @router.get("/stats", response_model=dict)
   async def stats(current_user: dict = Depends(get_current_user)) -> dict:
       return await get_task_stats(get_user_id(current_user))
   ```

3. **Test:** Visit `http://localhost:8000/docs` and test new endpoint

---

## Making Frontend Changes

### Adding a New Component

1. Create file: `frontend/src/app/my-feature.component.ts`
2. Define standalone component with `@Component` decorator
3. Add route in `app.routes.ts`:
   ```typescript
   { path: 'my-feature', component: MyFeatureComponent }
   ```

### Calling a New API Endpoint

1. **Add to Service** (`task.service.ts`):
   ```typescript
   getStats(): Observable<any> {
     return this.http.get(`${this.baseUrl}/stats`);
   }
   ```

2. **Call from Component**:
   ```typescript
   this.taskService.getStats().subscribe({
     next: (stats) => console.log(stats),
     error: (err) => console.error(err)
   });
   ```

---

## Debugging Tips

### Backend
- **Check Logs:** Backend terminal shows request logs from Uvicorn
- **Add Print Statements:** Use `print()` or `logging` module
- **MongoDB Shell:** Connect with `mongosh` to inspect database directly
- **Postman/Thunder Client:** Test API outside of Swagger UI

### Frontend
- **Browser DevTools Console:** Check for errors, API responses
- **Network Tab:** Inspect HTTP requests/responses, check headers
- **LocalStorage:** Application tab → Local Storage → check `taskflow_token`
- **Breakpoints:** Use `debugger;` statement or VS Code debugger

---

## Common Development Tasks

### Reset Database
```bash
# Connect to MongoDB
mongosh
use taskflow
db.users.deleteMany({})
db.tasks.deleteMany({})
```

### Change JWT Expiry
Edit `backend/.env`:
```
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
Restart backend.

### Test CORS Locally
1. Frontend runs on `4200`, backend on `8000` — CORS already configured
2. Check `backend/app/core/config.py` → `cors_origins` list
3. Update if testing from different port

### Add New Python Dependency
```bash
cd backend
.venv\Scripts\activate
pip install <package-name>
pip freeze > requirements.txt
```

### Add New Angular Dependency
```bash
cd frontend
npm install <package-name>
```

---

## VS Code Extensions (Recommended)

- **Python** (Microsoft)
- **Pylance** (Microsoft)
- **Angular Language Service** (Angular)
- **ESLint** (Microsoft)
- **Prettier** (Prettier)
- **MongoDB for VS Code** (MongoDB)
- **Thunder Client** (Ranga Vadhineni) — API testing

---

## Git Workflow

```bash
git add .
git commit -m "feat: add task stats endpoint"
git push origin main
```

Render will auto-deploy backend on push to `main` (if configured).
Frontend: Run `npm run deploy` to update GitHub Pages.

---

## Performance Tips

- Use `async/await` consistently in backend
- Index MongoDB fields used in queries (e.g., `user_id`, `status`)
- Enable Angular production mode for deployment (`ng build --configuration production`)
- Minimize API calls: batch requests or use state management (NgRx/Signals)

---

*Happy coding! For questions, check the [README.md](README.md) or [TaskFlow_PRD.md](TaskFlow_PRD.md).*
