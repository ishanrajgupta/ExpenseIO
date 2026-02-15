# Deployment Guide

This guide covers deploying the Smart Expense & Budget Manager to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

- MongoDB Atlas account (or MongoDB server)
- Backend hosting (Railway, Render, Heroku, or AWS)
- Frontend hosting (Vercel, Netlify, or AWS S3 + CloudFront)
- Node.js 16+ installed locally

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a new cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Set up database access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set permissions to "Read and write to any database"

4. **Whitelist IP addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP address

5. **Get connection string**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with your database name (e.g., `expense-tracker`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

---

## Backend Deployment

### Option 1: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize project**
```bash
cd backend
railway init
```

4. **Set environment variables**
```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=<your-mongodb-atlas-uri>
railway variables set JWT_SECRET=<your-random-secret-key>
railway variables set JWT_EXPIRE=30d
railway variables set PORT=5000
```

5. **Deploy**
```bash
railway up
```

6. **Get your app URL**
```bash
railway open
```

### Option 2: Render

1. **Create account** at https://render.com

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure build settings**
   - Name: `expense-tracker-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add environment variables**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-random-secret-key>
   JWT_EXPIRE=30d
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 3: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login**
```bash
heroku login
```

3. **Create app**
```bash
cd backend
heroku create expense-tracker-api
```

4. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-atlas-uri>
heroku config:set JWT_SECRET=<your-random-secret-key>
heroku config:set JWT_EXPIRE=30d
```

5. **Deploy**
```bash
git push heroku main
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the project**
```bash
cd frontend
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Set environment variables** in Vercel Dashboard
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_URL=<your-backend-url>/api`

5. **Redeploy** to apply environment variables
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
cd frontend
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Configure environment variables**
   - Go to Site settings → Build & deploy → Environment
   - Add: `VITE_API_URL=<your-backend-url>/api`

5. **Configure redirects** for SPA routing
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Option 3: Manual Deployment to AWS S3

1. **Build the project**
```bash
cd frontend
npm run build
```

2. **Create S3 bucket**
   - Name: `expense-tracker-app`
   - Enable static website hosting
   - Make bucket public

3. **Upload files**
```bash
aws s3 sync dist/ s3://expense-tracker-app --delete
```

4. **Configure CloudFront** (optional but recommended)
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain

---

## Environment Variables

### Backend (.env)

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

# JWT
JWT_SECRET=your_super_secret_random_string_here_min_32_chars
JWT_EXPIRE=30d

# CORS (optional - if frontend and backend on different domains)
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api
```

**Security Tips:**
- Never commit `.env` files to Git
- Use strong, random strings for `JWT_SECRET` (minimum 32 characters)
- Rotate secrets regularly
- Use different secrets for development and production

**Generate secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Post-Deployment Checklist

### Backend Verification

1. **Health Check**
```bash
curl https://your-backend-domain.com/api/health
```
Expected response:
```json
{"success": true, "message": "Server is running"}
```

2. **Test Registration**
```bash
curl -X POST https://your-backend-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Check CORS**
   - Open frontend in browser
   - Check browser console for CORS errors
   - If errors occur, add CORS configuration to backend

### Frontend Verification

1. **Test Pages**
   - Login page loads
   - Registration works
   - Dashboard displays correctly
   - All routes are accessible

2. **Check API Connection**
   - Open browser DevTools → Network tab
   - Verify API calls are going to correct backend URL
   - Check for 401/404 errors

3. **Performance Check**
   - Test on mobile device
   - Check loading times
   - Verify charts render correctly

### Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] Strong JWT secret in production
- [ ] MongoDB connection string uses strong password
- [ ] CORS configured correctly
- [ ] Error messages don't expose sensitive info
- [ ] Rate limiting configured (optional)
- [ ] Environment variables properly set

---

## Monitoring & Maintenance

### Application Monitoring

1. **Backend Logs**
   - Railway: `railway logs`
   - Render: Check dashboard logs
   - Heroku: `heroku logs --tail`

2. **Database Monitoring**
   - MongoDB Atlas Dashboard
   - Check connection count
   - Monitor storage usage
   - Review slow queries

3. **Error Tracking** (Optional)
   - Integrate Sentry.io
   - Set up error alerts
   - Monitor performance metrics

### Backup Strategy

1. **Database Backups**
   - MongoDB Atlas provides automated backups on paid tiers
   - Manual backup: Use `mongodump` command
   ```bash
   mongodump --uri="<your-mongodb-uri>" --out=/backup/path
   ```

2. **Code Backups**
   - Use Git version control
   - Push to GitHub/GitLab regularly
   - Tag releases for easy rollback

---

## Troubleshooting

### Common Issues

**Issue: Frontend can't connect to backend**
- Check `VITE_API_URL` is set correctly
- Verify CORS is configured on backend
- Check if backend is running

**Issue: Authentication not working**
- Verify JWT_SECRET is same on all backend instances
- Check token is being sent in Authorization header
- Clear localStorage and login again

**Issue: Database connection fails**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Issue: Build fails**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version matches requirements (16+)
- Review build logs for specific errors

---

## Scaling Considerations

### When to Scale

- Response times > 1 second
- Database queries slow (> 100ms)
- High traffic (> 10,000 requests/day)
- Database storage > 80%

### Scaling Options

1. **Horizontal Scaling**
   - Add more backend instances (load balancer)
   - Use Redis for session management
   - Implement caching layer

2. **Database Optimization**
   - Add more indexes
   - Implement database sharding
   - Use read replicas
   - Archive old data

3. **CDN & Caching**
   - Use CDN for static assets
   - Implement API response caching
   - Browser caching for assets

---

## Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Search for similar issues on GitHub
4. Create an issue with detailed error logs

---

**Congratulations! Your app is now deployed and ready for production use! 🚀**
