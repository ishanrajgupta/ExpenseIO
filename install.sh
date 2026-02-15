#!/bin/bash

# Smart Expense & Budget Manager - Installation Script
# This script automates the setup process for local development

set -e  # Exit on error

echo "=================================="
echo "Smart Expense & Budget Manager"
echo "Automated Installation Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js detected: $NODE_VERSION${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm detected: $NPM_VERSION${NC}"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB detected${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB not detected locally${NC}"
    echo "  You can use MongoDB Atlas instead"
fi

echo ""
echo "=================================="
echo "Installing Backend Dependencies"
echo "=================================="
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Backend installation failed${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo "Installing Frontend Dependencies"
echo "=================================="
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Frontend installation failed${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo "Setting Up Environment Files"
echo "=================================="

# Backend .env
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Backend .env created${NC}"
    echo -e "${YELLOW}⚠ Please edit backend/.env with your MongoDB URI and JWT secret${NC}"
else
    echo -e "${YELLOW}⚠ Backend .env already exists${NC}"
fi

# Frontend .env
cd ../frontend
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Frontend .env created${NC}"
else
    echo -e "${YELLOW}⚠ Frontend .env already exists${NC}"
fi

cd ..

echo ""
echo "=================================="
echo "Installation Complete! 🎉"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT secret"
echo "2. Start backend:  cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "Default URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend:  http://localhost:5000"
echo ""
echo "For detailed setup instructions, see SETUP_GUIDE.md"
echo "For quick start, see QUICKSTART.md"
echo ""
echo -e "${GREEN}Happy coding! 💻${NC}"
