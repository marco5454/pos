# 🚀 Quick Start Guide - Ice Crumble POS

Dependencies are already installed! Follow these steps to run the app:

## ⚡ Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (free M0 tier)
3. Create a database user:
   - Database Access → Add New Database User
   - Username: `icecrumble`
   - Password: Create a strong password (save it!)
4. Whitelist your IP:
   - Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
5. Get connection string:
   - Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password

## ⚡ Step 2: Configure Backend

Create the `.env` file in the backend folder:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your MongoDB connection string:
```
MONGO_URI=mongodb+srv://icecrumble:YOUR_PASSWORD@cluster.mongodb.net/ice-crumble-pos?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

## ⚡ Step 3: Start the App

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

Wait for:
```
✅ Connected to MongoDB Atlas
🚀 Server running on port 5000
```

### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

The app will open at: **http://localhost:3000**

## ✅ Test the App

1. **Add Menu Items:**
   - Click Settings (⚙️) at bottom
   - Add item: "Mango Crumble" - ₱50
   - Add item: "Strawberry Delight" - ₱45

2. **Make a Sale:**
   - Click POS (🛒) at bottom
   - Tap menu items to add to cart
   - Click "Confirm Sale"

3. **View Dashboard:**
   - Click Dashboard (📊) at bottom
   - See your revenue and statistics!

4. **Track Expenses:**
   - Click Expenses (💰) at bottom
   - Add an expense (e.g., "Mango puree" - ₱200)

## 🎉 You're Ready!

The app is now running and ready to use. All features are working:
- ✅ POS system with cart
- ✅ Expense tracking
- ✅ Dashboard analytics
- ✅ Menu management

## 📱 Mobile Testing

Open Chrome DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M) to test mobile view.

## 🛑 Stop the App

Press `Ctrl+C` in both terminal windows to stop the servers.

---

**Need help?** Check SETUP.md for detailed instructions and troubleshooting.