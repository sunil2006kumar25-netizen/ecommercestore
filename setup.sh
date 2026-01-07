#!/bin/bash

# TechStore E-Commerce - Quick Start Guide

echo "================================"
echo "TechStore E-Commerce Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14+)"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "✅ Backend ready!"
echo ""

# Frontend info
cd ..
echo "🎨 Frontend is ready to serve!"
echo ""

echo "================================"
echo "To start the application:"
echo "================================"
echo ""
echo "1. Start Backend (in terminal 1):"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Start Frontend (in terminal 2):"
echo "   cd frontend"
echo "   python3 -m http.server 8000"
echo ""
echo "3. Open browser:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:8000"
echo ""
echo "================================"
echo "Default Test Credentials:"
echo "================================"
echo ""
echo "Email: john@example.com"
echo "Password: password123"
echo ""
echo "Or register a new account on login.html"
