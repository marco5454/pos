# 🧊 Ice Crumble POS - Setup Guide

Complete setup instructions for the Ice Crumble Point of Sale system.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** (free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for version control)

## 🚀 Quick Start

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (choose the free M0 tier)
3. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose Password authentication
   - Save username and password
4. Whitelist your IP address:
   - Go to Network Access
   - Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Get your connection string:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# Use your favorite text editor (nano, vim, or VS Code)
nano .env
```

**Edit your `.env` file:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ice-crumble-pos?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Start the backend server:**
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB Atlas
📊 Database: ice-crumble-pos
🚀 Server running on port 5000
```

### Step 3: Frontend Setup

Open a **new terminal window** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional for development)
cp .env.example .env

# Start the development server
npm run dev
```

The app will open automatically at `http://localhost:3000`

## ✅ Verify Installation

1. **Backend Health Check:**
   - Open browser: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","message":"Ice Crumble POS API is running"}`

2. **Frontend:**
   - Open browser: `http://localhost:3000`
   - Should see the Ice Crumble POS interface

3. **Test the App:**
   - Go to Settings → Add a menu item (e.g., "Mango Crumble", ₱50)
   - Go to POS → Click the item to add to cart
   - Confirm the sale
   - Go to Dashboard → See your first sale!

## 📱 Features Overview

### 1. POS Panel (`/pos`)
- Grid display of menu items
- Tap to add to cart
- Adjust quantities
- Process sales

### 2. Expense Tracker (`/expenses`)
- Add expenses with categories (Ingredients, Packaging, Others)
- View expense history
- Delete expenses

### 3. Dashboard (`/dashboard`)
- View revenue, expenses, and profit
- Toggle between Today/Week/Month views
- See best-selling items
- Expense breakdown chart

### 4. Settings (`/settings`)
- Add new menu items
- Edit item names and prices
- Delete menu items

## 🌐 Deployment

### Deploy Backend to Render

1. Create account at [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** ice-crumble-pos-api
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Add Environment Variable:**
     - Key: `MONGO_URI`
     - Value: Your MongoDB connection string
5. Click "Create Web Service"
6. Copy your backend URL (e.g., `https://ice-crumble-pos-api.onrender.com`)

### Deploy Frontend to Vercel

1. Create account at [Vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Add Environment Variable:**
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-url.onrender.com/api`
5. Click "Deploy"

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify Node.js version (v16+)

### Frontend can't connect to backend
- Check backend is running on port 5000
- Verify VITE_API_URL in frontend/.env
- Check browser console for CORS errors

### MongoDB connection errors
- Verify username/password in connection string
- Check Network Access settings in MongoDB Atlas
- Ensure cluster is active (not paused)

## 📞 Support

For issues or questions:
1. Check this setup guide
2. Review the main README.md
3. Check browser console for errors
4. Verify all environment variables are set correctly

## 🎨 Design System

**LOCKED - Do not modify:**
- **Font:** Verdana (all elements)
- **Colors:**
  - Primary: Warm Coral `#FF6B6B`
  - Secondary: Golden Amber `#FFB347`
  - Accent: Soft Terracotta `#C1785A`
  - Background: Creamy Ivory `#FFF8F0`

## 📝 Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload during development
2. **API Testing:** Use tools like Postman or Thunder Client to test API endpoints
3. **Database Viewing:** Use MongoDB Compass to view your database
4. **Mobile Testing:** Use browser dev tools to test responsive design

---

**Happy Selling! 🧊**