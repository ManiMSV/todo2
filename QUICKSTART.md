# TaskFlow — Quick Start Guide

Welcome to **TaskFlow**! This guide will get you up and running in 10 minutes.

---

## 🎯 What You Need

- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **MongoDB** (Option A: Local install OR Option B: Free MongoDB Atlas account)

---

## 🚀 5-Minute Local Setup

### Step 1: Clone the Project

```bash
cd c:\Projects\django\todo
```

### Step 2: Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

**Optional:** Edit `.env` if using MongoDB Atlas:
```
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow
```

### Step 3: Start Backend

```bash
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at `http://localhost:8000`  
🔍 API docs at `http://localhost:8000/docs`

Leave this terminal open!

---

### Step 4: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm start
```

✅ Frontend running at `http://localhost:4200`

Leave this terminal open!

---

## 🎉 Test the App

1. Open browser: `http://localhost:4200`
2. Click **"Register here"**
3. Create an account (e.g., `user@example.com` / `password123`)
4. Login
5. Create your first task!

---

## 📚 Next Steps

- **Read Full Docs:** [README.md](README.md)
- **Deploy to Production:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Development Guide:** [DEVELOPMENT.md](DEVELOPMENT.md)
- **Feature Requirements:** [TaskFlow_PRD.md](TaskFlow_PRD.md)

---

## 🐛 Troubleshooting

### Backend won't start
- **Error: `ModuleNotFoundError`** → Run `pip install -r requirements.txt`
- **Error: `Connection refused`** → Install MongoDB locally or use Atlas

### Frontend won't start
- **Error: `command not found: ng`** → Run `npm install` first
- **Error: `EACCES`** → Run terminal as administrator (Windows)

### Can't login after registration
- Check backend terminal for errors
- Open `http://localhost:8000/docs`, try `/auth/login` manually
- Verify MongoDB is running (`mongosh` to test connection)

### CORS errors in browser
- Default config allows `localhost:4200` — no action needed
- If using different port, update `backend/.env` → `CORS_ORIGINS`

---

## 🔧 Common Commands

| Task | Command |
|------|---------|
| Start backend | `cd backend && .venv\Scripts\activate && uvicorn app.main:app --reload` |
| Start frontend | `cd frontend && npm start` |
| Test API | Open `http://localhost:8000/docs` |
| Reset database | `mongosh` → `use taskflow` → `db.dropDatabase()` |
| Install new Python package | `pip install <package> && pip freeze > requirements.txt` |
| Install new npm package | `npm install <package>` |

---

## 🌟 Features Available

✅ User registration & login  
✅ JWT-based authentication  
✅ Create, edit, delete tasks  
✅ Filter by status (To-Do, In Progress, Done)  
✅ Filter by priority (Low, Medium, High)  
✅ Sort by date, priority  
✅ Protected routes (can't access /tasks without login)  
✅ Responsive UI  
✅ Full REST API with Swagger docs  

---

## 📖 Learning Resources

- **FastAPI:** https://fastapi.tiangolo.com/
- **Angular:** https://angular.dev/
- **MongoDB:** https://www.mongodb.com/docs/
- **JWT:** https://jwt.io/introduction

---

**Need help?** Check [DEVELOPMENT.md](DEVELOPMENT.md) for detailed guides!

🎯 Happy task managing! 🚀
