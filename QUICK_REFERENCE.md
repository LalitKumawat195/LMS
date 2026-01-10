# Quick Reference for Team Members

## 🚀 Getting Started (First Time)

```bash
# 1. Clone the project
git clone https://github.com/your-username/LMS.git
cd LMS

# 2. Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# 3. Create .env file in server folder
# Copy from TEAM_GUIDE.md

# 4. Switch to your branch in GitHub Desktop
# feature/nikhil-book-management
# feature/pratiksha-ui-components  
# feature/menka-reports-analytics
```

## 🏃‍♂️ Daily Workflow

```bash
# 1. Start development server
npm run dev

# 2. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# 3. Make your changes
# 4. Commit in GitHub Desktop
# 5. Push to GitHub
```

## 📁 Where to Write Code

### Menka (Resources):
- **Frontend**: `client/src/components/ResourceList.js`, `AddResource.js`
- **Backend**: `server/models/Resource.js`, `server/routes/resources.js`

### Pratiksha (Members):
- **Frontend**: `client/src/components/MemberList.js`, `AddMember.js`
- **Backend**: `server/models/Member.js`, `server/routes/members.js`

### Nikhil (Fines):
- **Frontend**: `client/src/components/FinesList.js`, `PaymentForm.js`
- **Backend**: `server/models/Fine.js`, `server/routes/fines.js`

### Lalit (Integration):
- **Frontend**: `client/src/components/IssueReturn.js`, `Analytics.js`
- **Backend**: `server/models/Transaction.js`, `server/routes/transactions.js`

## 🔧 Common Issues & Solutions

**Problem**: `npm run dev` doesn't work
**Solution**: Make sure you ran `npm install` in all 3 folders (root, client, server)

**Problem**: Database connection error
**Solution**: Check if `.env` file exists in server folder with correct MongoDB URL

**Problem**: Can't see my changes
**Solution**: Make sure you're on your correct branch in GitHub Desktop

## 📞 Need Help?
Contact Lalit Kumawat (Team Leader) for any issues!