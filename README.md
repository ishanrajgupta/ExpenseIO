# Smart Expense & Budget Manager

A full-stack MERN application for tracking expenses, managing budgets, and analyzing spending patterns with smart insights and real-time alerts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 🚀 Features

### 🔐 Authentication & Security
- Secure user registration and login with JWT authentication
- Password hashing using bcrypt (10 salt rounds)
- Protected routes on both frontend and backend
- Role-based architecture (user/admin ready)
- Input validation and comprehensive error handling

### 💸 Expense & Income Management
- Add, edit, and delete transactions (soft delete)
- Category-based classification (15+ categories)
- Date-wise and month-wise filtering
- Notes and tags support
- Full CRUD operations with validation

### 📊 Budget Management
- Monthly total budget setup
- Category-wise budget limits
- Real-time budget tracking
- Overspending detection with smart alerts
- Automatic budget calculations

### 📈 Analytics & Reports
- **Dashboard Summary**: Income, expenses, and savings overview
- **Charts & Visualizations**:
  - Pie chart for category-wise expenses
  - Bar chart for monthly comparison
  - Line chart for expense trends
- Transaction history with filters
- Category breakdown analysis

### 🧠 Smart Features
- Auto-categorization suggestions
- Monthly spending insights
- Comparative analysis (month-over-month)
- Smart tips and recommendations
- Budget alerts at 80% and 100% thresholds

### 🎨 Modern UI/UX
- Clean, responsive design (mobile + desktop)
- Dark mode and light mode support
- Loading states and skeleton screens
- Toast notifications for user actions
- Accessible UI (ARIA friendly)

## 🛠️ Tech Stack

### Frontend
- **React.js** 18.2 with Hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Heroicons** - Icon library

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** - Input validation
- RESTful API architecture
- Centralized error handling

### Development Tools
- **Nodemon** - Auto-restart for development
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── transactionController.js
│   │   ├── budgetController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorMiddleware.js    # Error handling
│   │   └── validateMiddleware.js # Input validation
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Transaction.js        # Transaction schema
│   │   └── Budget.js             # Budget schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── analyticsRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx        # Main layout with sidebar
    │   │   ├── PrivateRoute.jsx  # Route protection
    │   │   └── TransactionModal.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Authentication state
    │   │   └── ThemeContext.jsx  # Theme state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx     # Analytics dashboard
    │   │   ├── Transactions.jsx  # Transaction management
    │   │   ├── Budget.jsx        # Budget management
    │   │   └── Settings.jsx      # User settings
    │   ├── utils/
    │   │   └── api.js            # Axios configuration
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js

```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd expense-tracker
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Random secure string for JWT
# - PORT: Backend port (default: 5000)

# Start backend server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env:
# - VITE_API_URL: Backend API URL (default: http://localhost:5000/api)

# Start frontend development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, data: { user, token } }
```

#### Login User
```
POST /api/auth/login
Body: { email, password }
Response: { success, data: { user, token } }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: user }
```

#### Update Profile
```
PUT /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Body: { name, email, password, currency, monthlyBudget }
Response: { success, data: user }
```

### Transaction Endpoints

#### Get All Transactions
```
GET /api/transactions?type=expense&month=1&year=2024
Headers: { Authorization: "Bearer <token>" }
Response: { success, count, data: [] }
```

#### Create Transaction
```
POST /api/transactions
Headers: { Authorization: "Bearer <token>" }
Body: { type, category, amount, description, date, notes, tags }
Response: { success, data: transaction }
```

#### Update Transaction
```
PUT /api/transactions/:id
Headers: { Authorization: "Bearer <token>" }
Body: { type, category, amount, description, date, notes }
Response: { success, data: transaction }
```

#### Delete Transaction (Soft Delete)
```
DELETE /api/transactions/:id
Headers: { Authorization: "Bearer <token>" }
Response: { success, message }
```

#### Get Transaction Statistics
```
GET /api/transactions/stats/summary?month=1&year=2024
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: { totalIncome, totalExpense, savings, categoryBreakdown } }
```

### Budget Endpoints

#### Get Current Budget
```
GET /api/budgets/current
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: budget }
```

#### Create/Update Budget
```
POST /api/budgets
Headers: { Authorization: "Bearer <token>" }
Body: { month, year, totalBudget, categoryBudgets: [{ category, limit }] }
Response: { success, data: budget, alerts: [] }
```

#### Get Budget Alerts
```
GET /api/budgets/alerts/check
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: alerts[] }
```

### Analytics Endpoints

#### Get Dashboard Analytics
```
GET /api/analytics/dashboard?month=1&year=2024
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: { summary, categoryBreakdown, recentTransactions } }
```

#### Get Monthly Comparison
```
GET /api/analytics/monthly-comparison?months=6
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: [] }
```

#### Get Expense Trends
```
GET /api/analytics/trends?days=30
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: [] }
```

#### Get Spending Insights
```
GET /api/analytics/insights
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: insights[] }
```

## 🏗️ Architecture & Best Practices

### Backend Architecture
- **MVC Pattern**: Clear separation of concerns
- **Middleware Pipeline**: Auth → Validation → Controller → Response
- **Error Handling**: Centralized error handler with proper HTTP codes
- **Database Indexing**: Optimized queries with compound indexes
- **Soft Delete**: Transactions are soft-deleted for data recovery
- **Schema Validation**: Mongoose schemas with built-in validation

### Frontend Architecture
- **Component-Based**: Reusable, modular React components
- **Context API**: Global state for auth and theme
- **Protected Routes**: HOC for route authorization
- **API Layer**: Centralized Axios instance with interceptors
- **Responsive Design**: Mobile-first Tailwind CSS approach

### Security Measures
- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- HTTP-only cookies consideration (ready for implementation)
- Input validation on both client and server
- CORS configuration
- SQL injection prevention (NoSQL with Mongoose)
- XSS protection through React's built-in sanitization

### Performance Optimizations
- Database indexing on frequently queried fields
- Pagination ready architecture
- Lazy loading for charts
- Skeleton loading states
- Debounced search (ready for implementation)
- Code splitting with React Router

## 🎯 Future Enhancements

- [ ] Export reports to PDF/Excel
- [ ] Recurring transactions
- [ ] Multiple currency support with conversion
- [ ] Receipt upload and OCR
- [ ] Email notifications for budget alerts
- [ ] Data backup and restore
- [ ] Advanced analytics with AI predictions
- [ ] Multi-user support (family/team budgets)
- [ ] Mobile app (React Native)
- [ ] Integration with banking APIs

## 📦 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in your hosting platform
2. Update MongoDB URI to production database
3. Set NODE_ENV to 'production'
4. Deploy from Git repository

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL=<production-api-url>`
4. Configure redirects for SPA routing

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Backend tests (to be implemented)
cd backend
npm test

# Frontend tests (to be implemented)
cd frontend
npm test
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub Profile]

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email your-email@example.com or open an issue.

---

## Resume-Ready Project Description

**Smart Expense & Budget Manager** - Full-stack MERN application with JWT authentication, RESTful APIs, and responsive React UI

**Key Achievements:**
- Developed secure authentication system with bcrypt password hashing and JWT tokens
- Implemented comprehensive expense tracking with 15+ categories and soft-delete functionality
- Built real-time budget monitoring with smart alerts at 80% and 100% thresholds
- Created interactive analytics dashboard with Recharts visualizations (pie, bar, line charts)
- Designed responsive UI with Tailwind CSS, dark mode, and ARIA accessibility
- Architected scalable backend with MongoDB indexing and centralized error handling
- Integrated spending insights engine with month-over-month comparative analysis

**Technologies:** React.js, Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Tailwind CSS, Recharts, Vite, REST APIs

**Skills Demonstrated:** Full-stack development, API design, database modeling, authentication & authorization, state management (Context API), responsive design, data visualization, security best practices
