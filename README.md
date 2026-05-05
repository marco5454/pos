# 🧊 Ice Crumble POS System

A mobile-first Point of Sale system built with the MERN stack for managing ice crumble sales, expenses, and inventory.

## 🌐 GLOBAL CONDITIONS

These rules apply to **every modification** in this project:

1. **Tech Stack is locked:** MERN (MongoDB Atlas, Express, React + Vite, Node.js, Mongoose, Axios, TailwindCSS)
2. **Font is locked:** Verdana throughout the entire app
3. **Color palette is locked — 4 colors only:**
   - Primary: Warm Coral `#FF6B6B`
   - Secondary: Golden Amber `#FFB347`
   - Accent: Soft Terracotta `#C1785A`
   - Background: Creamy Ivory `#FFF8F0`
4. **Code quality standard:** Clean, readable, well-commented code with meaningful names
5. **Mobile-first always:** Responsive and optimized for phone + tablet browsers
6. **Do not break existing features:** Check for conflicts before adding new code
7. **Consistency rule:** Follow existing file structure and naming conventions
8. **Before implementation:** State which files will be created/modified

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
ice-crumble-pos/
├── backend/
│   ├── models/
│   │   ├── Sale.js
│   │   ├── Expense.js
│   │   └── MenuItem.js
│   ├── routes/
│   │   ├── sales.js
│   │   ├── expenses.js
│   │   └── menuItems.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── POS.jsx
    │   │   ├── Expenses.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Settings.jsx
    │   ├── components/
    │   │   ├── BottomNav.jsx
    │   │   └── Layout.jsx
    │   ├── styles/
    │   │   └── theme.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## 🌐 API Endpoints

```
GET/POST          /api/sales
DELETE            /api/sales/:id
GET/POST          /api/expenses
DELETE            /api/expenses/:id
GET/POST/PUT/DELETE  /api/menu-items
```

## 📱 Features

- **POS Panel:** Quick sale processing with cart management
- **Expense Tracker:** Track ingredient and operational costs
- **Dashboard:** Revenue, expenses, and profit analytics
- **Menu Manager:** Add/edit/delete ice crumble variants

## 🚀 Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables (MONGO_URI)
4. Deploy

### Frontend (Vercel)
1. Import project to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=your_backend_url`
4. Deploy

## 📝 License

MIT