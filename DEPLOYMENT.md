# TaskFlow Deployment Checklist

## ✅ Prerequisites
- [ ] MongoDB Atlas account & M0 cluster created
- [ ] GitHub repository set up (can be one repo or split frontend/backend)
- [ ] Render account created (free tier)
- [ ] Node.js & npm installed locally
- [ ] Python 3.11+ installed locally

---

## 🗄️ Database Setup (MongoDB Atlas)

1. [ ] Create free M0 cluster at https://mongodb.com/cloud/atlas
2. [ ] Create database user with strong password
3. [ ] Whitelist IP address: `0.0.0.0/0` (for development; lock down in production)
4. [ ] Copy connection string (format: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>`)
5. [ ] Test connection locally by updating `backend/.env` with the connection string

---

## 🔧 Backend Deployment (Render)

1. [ ] Push backend code to GitHub repository
2. [ ] Go to https://render.com and sign in
3. [ ] Click **New +** → **Web Service**
4. [ ] Connect your GitHub repo
5. [ ] Configure service:
   - **Name:** `taskflow-api` (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend` (if using monorepo)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
   - **Plan:** Free
6. [ ] Add environment variables in Render dashboard:
   ```
   MONGODB_URL=<your-atlas-connection-string>
   SECRET_KEY=<random-32-char-secret>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=["http://localhost:4200"]
   ```
7. [ ] Click **Create Web Service** and wait for deployment
8. [ ] Note your backend URL: `https://<your-service-name>.onrender.com`
9. [ ] Test API: Visit `https://<your-service-name>.onrender.com/docs` to see Swagger UI
10. [ ] **Important:** Add GitHub Pages URL to `CORS_ORIGINS` once frontend is deployed

---

## 🌐 Frontend Deployment (GitHub Pages)

1. [ ] Edit `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://<your-render-service>.onrender.com/api/v1'
   };
   ```
2. [ ] Install gh-pages:
   ```bash
   cd frontend
   npm install gh-pages --save-dev
   ```
3. [ ] Add deploy script to `frontend/package.json`:
   ```json
   "scripts": {
     "deploy": "ng build --configuration production --base-href /taskflow/ && npx gh-pages -d dist/frontend/browser"
   }
   ```
   *(Replace `/taskflow/` with your repo name if different)*
4. [ ] Build and deploy:
   ```bash
   npm run deploy
   ```
5. [ ] Enable GitHub Pages:
   - Go to GitHub repo → **Settings** → **Pages**
   - Source: **Branch: `gh-pages`** → `/ (root)` → Save
6. [ ] Wait 1-2 minutes, then access: `https://<your-username>.github.io/taskflow/`
7. [ ] Update Render `CORS_ORIGINS` to include:
   ```
   CORS_ORIGINS=["https://<your-username>.github.io"]
   ```
8. [ ] Redeploy backend on Render to apply CORS changes

---

## 🧪 Post-Deployment Testing

1. [ ] Open frontend URL in browser: `https://<your-username>.github.io/taskflow/`
2. [ ] Click "Register here" and create a test account
3. [ ] Login with test credentials
4. [ ] Create a new task
5. [ ] Filter tasks by status/priority
6. [ ] Change task status to "In Progress" and "Done"
7. [ ] Delete a task
8. [ ] Logout and verify you're redirected to login page
9. [ ] Check browser DevTools Console for any CORS or API errors
10. [ ] Test on mobile device for responsiveness

---

## 🔐 Security Hardening (Production)

- [ ] Change `SECRET_KEY` to a strong random string (min 32 chars)
- [ ] Restrict MongoDB Atlas IP whitelist to Render's static IP (paid Render plan) or known IPs
- [ ] Update `CORS_ORIGINS` to only allow your GitHub Pages domain (remove `localhost`)
- [ ] Enable HTTPS for all connections (Render/GitHub Pages provide this by default)
- [ ] Review Render logs for suspicious activity
- [ ] Set appropriate `ACCESS_TOKEN_EXPIRE_MINUTES` (e.g., 30-60 minutes)
- [ ] Consider adding rate limiting to API endpoints

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors in browser | Update `CORS_ORIGINS` in Render env vars to include GitHub Pages URL |
| 502 Bad Gateway on Render | Check Render logs; ensure `uvicorn` command is correct |
| 401 Unauthorized after login | Check token storage in browser DevTools → Application → LocalStorage |
| Frontend shows blank page | Check browser console for errors; verify `base-href` in deploy script |
| MongoDB connection timeout | Verify Atlas IP whitelist includes `0.0.0.0/0` or Render IP |
| Tasks not loading | Open Swagger docs (`/docs`) and test API directly; check auth token |

---

## 📊 Render Free Tier Notes

- **Cold starts:** Free services spin down after 15 minutes of inactivity. First request after idle may take 30-60 seconds.
- **Uptime:** Free tier has 750 hours/month limit (enough for continuous uptime).
- **Logs:** Check Render dashboard → Logs for debugging.
- **Upgrades:** Upgrade to paid plan for faster performance and static IPs.

---

## ✅ Deployment Complete!

Once all checklist items are done, your TaskFlow app is live:
- **Frontend:** `https://<your-username>.github.io/taskflow/`
- **Backend API:** `https://<your-service-name>.onrender.com`
- **Database:** MongoDB Atlas M0 cluster

Share your app URL and enjoy your full-stack task manager! 🎉

---

*For detailed PRD and architecture, see [TaskFlow_PRD.md](TaskFlow_PRD.md)*
