# SafePath AI - Deployment Guide

This project is structured for a dual-platform deployment:
- **Frontend**: Next.js (Vercel)
- **Backend**: Node.js/Express (Render)

## 1. Backend (Render)
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Create a new **Web Service**.
3. Connect your repository.
4. Set the **Root Directory** to `backend`.
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `PORT`: 5000 (usually default).

## 2. Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/dashboard).
2. Create a new project and import your repository.
3. Vercel will auto-detect Next.js.
4. Set the **Root Directory** to `safepathai-project`.
5. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: The URL of your Render backend (e.g., `https://safepath-api.onrender.com/api`).
   - `MONGODB_URI`: (Optional) If you also use Next.js API routes.

## 3. Important Note on CORS
The backend is already configured with the `cors` package. Once you have your Vercel URL, you can restrict access in `backend/server.js` by providing the `origin` option to `cors()`.
