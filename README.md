# BookNest Digital Library

A simple Library Management System built with React, Node.js, and MongoDB.

## Features

- **Admin** - Manage everything
- **Librarian** - Handle books and circulation
- **Member** - Borrow and return books

### What You Can Do
- Add/manage books
- Issue and return books
- Track overdue books
- Calculate fines (₹10/day)
- Generate reports
- Send notifications

## Quick Start

### 1. Install
```bash
# Install server
cd server
npm install

# Install client
cd ../client
npm install
```

### 2. Setup Database
Create `server/.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Run
```bash
# Start server (Terminal 1)
cd server
npm start

# Start client (Terminal 2)
cd client
npm start
```

### 4. Open
- App: http://localhost:3000
- API: http://localhost:5000

## Tech Stack
- React + Fluent UI
- Node.js + Express
- MongoDB

## Project Structure
```
LMS/
├── client/          # React app
├── server/          # Node.js API
└── README.md
```

## Need Help?

**MongoDB not connecting?**
- Check your connection string
- Make sure MongoDB is running

**Port already in use?**
```bash
npx kill-port 5000
npx kill-port 3000
```

---

Made with ❤️ for libraries
