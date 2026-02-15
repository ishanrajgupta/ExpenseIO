# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "currency": "USD",
    "token": "jwt_token_here"
  }
}
```

---

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "currency": "USD",
    "monthlyBudget": 5000,
    "token": "jwt_token_here"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "currency": "USD",
    "monthlyBudget": 5000
  }
}
```

---

### Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "password": "newpassword123",
  "currency": "EUR",
  "monthlyBudget": 6000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Updated",
    "email": "john.new@example.com",
    "role": "user",
    "currency": "EUR",
    "monthlyBudget": 6000,
    "token": "new_jwt_token_here"
  }
}
```

---

## Transaction Endpoints

### Get All Transactions
**GET** `/transactions`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type` (optional): "income" or "expense"
- `category` (optional): Category name
- `month` (optional): Month number (1-12)
- `year` (optional): Year (e.g., 2024)
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Example:** `/transactions?type=expense&month=1&year=2024`

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "transaction_id",
      "user": "user_id",
      "type": "expense",
      "category": "Food & Dining",
      "amount": 45.50,
      "description": "Lunch at restaurant",
      "date": "2024-01-15T12:00:00.000Z",
      "notes": "Team lunch",
      "tags": ["work", "food"],
      "isDeleted": false,
      "createdAt": "2024-01-15T12:05:00.000Z",
      "updatedAt": "2024-01-15T12:05:00.000Z"
    }
  ]
}
```

---

### Get Single Transaction
**GET** `/transactions/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "transaction_id",
    "user": "user_id",
    "type": "expense",
    "category": "Food & Dining",
    "amount": 45.50,
    "description": "Lunch at restaurant",
    "date": "2024-01-15T12:00:00.000Z",
    "notes": "Team lunch",
    "tags": ["work", "food"]
  }
}
```

---

### Create Transaction
**POST** `/transactions`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "expense",
  "category": "Food & Dining",
  "amount": 45.50,
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "notes": "Team lunch",
  "tags": ["work", "food"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "transaction_id",
    "user": "user_id",
    "type": "expense",
    "category": "Food & Dining",
    "amount": 45.50,
    "description": "Lunch at restaurant",
    "date": "2024-01-15T00:00:00.000Z",
    "notes": "Team lunch",
    "tags": ["work", "food"],
    "isDeleted": false,
    "createdAt": "2024-01-15T12:05:00.000Z",
    "updatedAt": "2024-01-15T12:05:00.000Z"
  }
}
```

---

### Update Transaction
**PUT** `/transactions/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "expense",
  "category": "Food & Dining",
  "amount": 50.00,
  "description": "Updated lunch amount",
  "date": "2024-01-15",
  "notes": "Team lunch - corrected amount"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "transaction_id",
    "amount": 50.00,
    "description": "Updated lunch amount",
    "notes": "Team lunch - corrected amount"
  }
}
```

---

### Delete Transaction
**DELETE** `/transactions/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction deleted"
}
```

---

### Get Transaction Statistics
**GET** `/transactions/stats/summary`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year (e.g., 2024)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.00,
    "totalExpense": 3500.00,
    "savings": 1500.00,
    "categoryBreakdown": [
      {
        "_id": "Food & Dining",
        "total": 850.00,
        "count": 25
      },
      {
        "_id": "Transportation",
        "total": 450.00,
        "count": 15
      }
    ]
  }
}
```

---

## Budget Endpoints

### Get All Budgets
**GET** `/budgets`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "budget_id",
      "user": "user_id",
      "month": 1,
      "year": 2024,
      "totalBudget": 5000,
      "totalSpent": 3500,
      "categoryBudgets": [],
      "isActive": true
    }
  ]
}
```

---

### Get Budget by Month
**GET** `/budgets/:year/:month`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "budget_id",
    "user": "user_id",
    "month": 1,
    "year": 2024,
    "totalBudget": 5000,
    "totalSpent": 3500,
    "categoryBudgets": [
      {
        "category": "Food & Dining",
        "limit": 800,
        "spent": 650,
        "alertSent80": false,
        "alertSent100": false
      }
    ],
    "status": "good",
    "percentage": 70,
    "remaining": 1500
  }
}
```

---

### Get Current Budget
**GET** `/budgets/current`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "budget_id",
    "user": "user_id",
    "month": 1,
    "year": 2024,
    "totalBudget": 5000,
    "totalSpent": 3500,
    "categoryBudgets": [],
    "status": "good",
    "percentage": 70,
    "remaining": 1500
  }
}
```

---

### Create or Update Budget
**POST** `/budgets`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "month": 1,
  "year": 2024,
  "totalBudget": 5000,
  "categoryBudgets": [
    {
      "category": "Food & Dining",
      "limit": 800
    },
    {
      "category": "Transportation",
      "limit": 500
    }
  ]
}
```

**Response (201/200):**
```json
{
  "success": true,
  "data": {
    "_id": "budget_id",
    "user": "user_id",
    "month": 1,
    "year": 2024,
    "totalBudget": 5000,
    "totalSpent": 0,
    "categoryBudgets": [
      {
        "category": "Food & Dining",
        "limit": 800,
        "spent": 0,
        "alertSent80": false,
        "alertSent100": false
      }
    ]
  },
  "alerts": []
}
```

---

### Get Budget Alerts
**GET** `/budgets/alerts/check`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "warning",
      "level": "category",
      "category": "Food & Dining",
      "message": "Food & Dining: 85.5% of budget used",
      "percentage": 85.5
    },
    {
      "type": "danger",
      "level": "total",
      "message": "You have exceeded your total monthly budget by 5.2%",
      "percentage": 105.2
    }
  ]
}
```

---

## Analytics Endpoints

### Get Dashboard Analytics
**GET** `/analytics/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `month` (optional): Month number
- `year` (optional): Year

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 5000,
      "totalExpense": 3500,
      "savings": 1500,
      "incomeCount": 2,
      "expenseCount": 45
    },
    "categoryBreakdown": [
      {
        "_id": "Food & Dining",
        "total": 850,
        "count": 25
      }
    ],
    "recentTransactions": []
  }
}
```

---

### Get Monthly Comparison
**GET** `/analytics/monthly-comparison`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `months` (optional): Number of months (default: 6)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jan",
      "year": 2024,
      "income": 5000,
      "expense": 3500,
      "savings": 1500
    },
    {
      "month": "Feb",
      "year": 2024,
      "income": 5200,
      "expense": 3800,
      "savings": 1400
    }
  ]
}
```

---

### Get Expense Trends
**GET** `/analytics/trends`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `days` (optional): Number of days (default: 30)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "total": 125.50,
      "count": 3
    },
    {
      "date": "2024-01-16",
      "total": 89.00,
      "count": 2
    }
  ]
}
```

---

### Get Spending Insights
**GET** `/analytics/insights`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "increase",
      "category": "Food & Dining",
      "message": "Your Food & Dining expenses increased by 22.5% this month",
      "percentage": 22.5,
      "currentAmount": 850,
      "previousAmount": 694
    },
    {
      "type": "top-spending",
      "category": "Rent",
      "message": "Rent is your highest expense category this month",
      "amount": 1200
    },
    {
      "type": "average",
      "message": "Your average daily spending is $116.67",
      "amount": 116.67
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error message",
  "stack": "Error stack trace (only in development)"
}
```

---

## Category Lists

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
- Other Expense

### Income Categories
- Salary
- Freelance
- Business
- Investment
- Rental Income
- Other Income
