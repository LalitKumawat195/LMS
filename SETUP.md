# Setup Instructions

## Prerequisites
- Node.js installed
- MongoDB installed and running
- GitHub Desktop

## Installation Steps

1. **Clone Repository**
   ```
   git clone https://github.com/YOUR_USERNAME/LMS.git
   cd LMS
   ```

2. **Install Dependencies**
   ```
   npm run install-all
   ```

3. **Start MongoDB**
   - Windows: Start MongoDB service
   - Mac/Linux: `mongod`

4. **Run Application**
   ```
   npm run dev
   ```

## URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Default Test User
After registration, you can login with your created credentials.

## Team Workflow
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit
4. Push and create Pull Request

## File Structure
```
LMS/
├── client/           # React frontend
│   ├── App.js
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   └── AuthContext.js
└── server/           # Node.js backend
    ├── index.js
    ├── User.js
    └── auth.js
```