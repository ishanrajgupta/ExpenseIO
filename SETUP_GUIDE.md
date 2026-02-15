# Setup & Installation Guide

Complete guide to set up the Smart Expense & Budget Manager on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **MongoDB** (Community Edition OR MongoDB Atlas)
  - Local: https://www.mongodb.com/try/download/community
  - Cloud: https://www.mongodb.com/cloud/atlas (Free tier available)

- **Git** (for cloning the repository)
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd expense-tracker
```

---

## Step 2: MongoDB Setup

### Option A: Local MongoDB

1. **Start MongoDB service**

   **Windows:**
   ```bash
   net start MongoDB
   ```

   **macOS/Linux:**
   ```bash
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

2. **Verify MongoDB is running**
   ```bash
   mongo --version
   ```

3. **Your connection string will be:**
   ```
   mongodb://localhost:27017/expense-tracker
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create free account** at https://www.mongodb.com/cloud/atlas

2. **Create a new cluster**
   - Click "Build a Database"
   - Select FREE tier (M0)
   - Choose your preferred region
   - Click "Create"

3. **Create database user**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `expenseuser`
   - Password: (create a strong password)
   - Database User Privileges: "Read and write to any database"

4. **Whitelist your IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

5. **Get connection string**
   - Go to "Database" → "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `myFirstDatabase` with `expense-tracker`

---

## Step 3: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Copy example env file
   cp .env.example .env
   ```

4. **Edit .env file** with your values

   **For Local MongoDB:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
   JWT_EXPIRE=30d
   ```

   **For MongoDB Atlas:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://expenseuser:yourpassword@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
   JWT_EXPIRE=30d
   ```

   **Generate secure JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Start the backend server**

   **Development mode (with auto-restart):**
   ```bash
   npm run dev
   ```

   **Production mode:**
   ```bash
   npm start
   ```

6. **Verify backend is running**
   - Open browser and go to: http://localhost:5000/api/health
   - You should see: `{"success":true,"message":"Server is running"}`

---

## Step 4: Frontend Setup

1. **Open a new terminal** (keep backend running)

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   ```bash
   # Copy example env file
   cp .env.example .env
   ```

5. **Edit .env file**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open browser and go to: http://localhost:3000
   - You should see the login page

---

## Step 5: Create Your First Account

1. Click "Create a new account" on the login page
2. Fill in your details:
   - Full Name: Your Name
   - Email: your.email@example.com
   - Password: (minimum 6 characters)
3. Click "Create account"
4. You'll be redirected to the dashboard

---

## Project Structure Overview

```
expense-tracker/
├── backend/                    # Backend API (Node.js + Express)
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── .env                   # Environment variables (create this)
│   ├── .env.example           # Example env file
│   ├── package.json           # Backend dependencies
│   └── server.js              # Entry point
│
└── frontend/                   # Frontend (React + Vite)
    ├── public/                # Static files
    ├── src/
    │   ├── components/        # React components
    │   ├── context/           # Context providers
    │   ├── pages/             # Page components
    │   ├── utils/             # Utility functions
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── .env                   # Environment variables (create this)
    ├── .env.example           # Example env file
    ├── package.json           # Frontend dependencies
    └── vite.config.js         # Vite configuration
```

---

## Available Scripts

### Backend Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests (if configured)
npm test
```

### Frontend Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Verification Checklist

After setup, verify everything works:

- [ ] Backend server running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can access health endpoint: http://localhost:5000/api/health
- [ ] Can create a new account
- [ ] Can login successfully
- [ ] Dashboard loads with empty state
- [ ] Can add a transaction
- [ ] Can view transactions
- [ ] Can set a budget
- [ ] Charts display correctly
- [ ] Dark mode toggle works

---

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Cannot connect to MongoDB"

**Solutions:**
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas: Verify IP is whitelisted
- Check database user credentials

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env
PORT=5001
```

### Issue: Frontend shows "Network Error"

**Solutions:**
- Verify backend is running
- Check `VITE_API_URL` in frontend/.env
- Check browser console for errors
- Ensure no CORS issues

### Issue: Styles not loading correctly

**Solution:**
```bash
cd frontend
npm install tailwindcss postcss autoprefixer
npm run dev
```

---

## Development Tips

1. **Keep both servers running**
   - Terminal 1: Backend (`cd backend && npm run dev`)
   - Terminal 2: Frontend (`cd frontend && npm run dev`)

2. **Use nodemon for backend**
   - Automatically restarts on file changes
   - Already configured in `package.json`

3. **Hot Module Replacement (HMR)**
   - Vite provides instant updates in browser
   - No need to refresh manually

4. **Browser DevTools**
   - Press F12 to open
   - Check Console for errors
   - Use Network tab to debug API calls

5. **VS Code Extensions (Recommended)**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier

---

## Database Management

### View Database with MongoDB Compass

1. Download: https://www.mongodb.com/try/download/compass
2. Connect using your MongoDB URI
3. Browse collections: `users`, `transactions`, `budgets`

### Useful MongoDB Commands

```bash
# Connect to MongoDB shell
mongo

# Show databases
show dbs

# Use expense-tracker database
use expense-tracker

# Show collections
show collections

# View all users
db.users.find()

# View all transactions
db.transactions.find()

# Clear all data (CAUTION!)
db.users.deleteMany({})
db.transactions.deleteMany({})
db.budgets.deleteMany({})
```

---

## Next Steps

1. **Explore the application**
   - Add some transactions
   - Set up budgets
   - View analytics

2. **Customize**
   - Modify categories in backend models
   - Change theme colors in Tailwind config
   - Add new features

3. **Deploy**
   - Read `DEPLOYMENT.md` for production deployment
   - Set up MongoDB Atlas
   - Deploy to Railway/Render/Vercel

---

## Getting Help

- **Documentation**: Check README.md and API_DOCUMENTATION.md
- **Issues**: Create an issue on GitHub
- **Questions**: Discussion forum on GitHub

---

## Success! 🎉

Your development environment is now set up and ready to use!

Start building amazing expense tracking features! 💰📊
