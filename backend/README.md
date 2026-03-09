# TaskFlow Backend (FastAPI + MongoDB)

## Run locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Open Swagger docs at `http://127.0.0.1:8000/docs`.

## Auth flow notes

- Register with `POST /api/v1/auth/register`.
- Login with `POST /api/v1/auth/login` using form-data (`username` = email, `password` = password).
- Use returned bearer token for protected `/api/v1/tasks` endpoints.

## Render start command

```bash
uvicorn app.main:app --host 0.0.0.0 --port 10000
```
