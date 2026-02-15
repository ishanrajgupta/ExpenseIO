# Quick Start Guide

Get the Smart Expense & Budget Manager up and running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- MongoDB running (local or Atlas)

## 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd expense-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2. Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
# Default values should work for local development
```

## 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 4. Access Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## 5. Create Account

1. Click "Create a new account"
2. Fill in your details
3. Start tracking expenses!

---

## Default Categories

### Expense Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Rent
- Insurance
- Groceries
- Personal Care
- Gifts & Donations

### Income Categories
- Salary
- Freelance
- Business
- Investment
- Rental Income

---

## Sample Data (Optional)

Want to test with sample data? Run these commands in MongoDB:

```javascript
// In MongoDB shell or Compass
use expense-tracker

// Sample transactions (replace USER_ID with your user ID)
db.transactions.insertMany([
  {
    user: ObjectId("YOUR_USER_ID"),
    type: "expense",
    category: "Food & Dining",
    amount: 45.50,
    description: "Lunch at restaurant",
    date: new Date(),
    isDeleted: false
  },
  {
    user: ObjectId("YOUR_USER_ID"),
    type: "income",
    category: "Salary",
    amount: 5000,
    description: "Monthly salary",
    date: new Date(),
    isDeleted: false
  }
])
```

---

## Common Commands

### Backend
```bash
npm run dev     # Start development server
npm start       # Start production server
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

---

## Troubleshooting

**Can't connect to MongoDB?**
- Verify MongoDB is running: `mongod --version`
- Check connection string in `backend/.env`

**Port already in use?**
- Change PORT in `backend/.env` (default: 5000)
- Change port in `frontend/vite.config.js` (default: 3000)

**Frontend not loading?**
- Clear browser cache
- Check `VITE_API_URL` in `frontend/.env`
- Verify backend is running

---

## What's Next?

1. ✅ Add your first transaction
2. ✅ Set up a monthly budget
3. ✅ View analytics on dashboard
4. ✅ Explore different categories
5. ✅ Try dark mode!

## Learn More

- 📖 [Full Setup Guide](SETUP_GUIDE.md)
- 📡 [API Documentation](API_DOCUMENTATION.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 🗺️ [Project Roadmap](ROADMAP.md)

---

**Happy expense tracking! 💰📊**
