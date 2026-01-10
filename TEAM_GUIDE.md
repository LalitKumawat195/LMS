# LMS Team Development Guide - Updated Assignments

## Project Structure Overview

```
LMS/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── Login.js       # Login page
│   │   ├── Register.js    # Registration page
│   │   ├── Dashboard.js   # Main dashboard
│   │   └── components/    # Your new components go here
├── server/                # Backend (Node.js/Express)
│   ├── index.js          # Main server file
│   ├── auth.js           # Authentication routes
│   ├── User.js           # User database model
│   └── routes/           # Your new API routes go here
└── package.json          # Root dependencies
```

## Team Member Assignments & Where to Code

### 🔹 Menka Rajak - Resource Management System

**Your Tasks:**
- Manage library resources (books, journals, digital media)
- Resource cataloging and inventory
- Resource availability tracking
- Resource categories and classifications

**Where to write code:**

**Frontend (client/src/):**
```
Create these new files:
├── components/
│   ├── ResourceList.js      # Display all resources
│   ├── AddResource.js       # Add new resource form
│   ├── EditResource.js      # Edit resource form
│   ├── ResourceSearch.js    # Search resources
│   └── ResourceCategories.js # Manage categories
```

**Backend (server/):**
```
Create these new files:
├── models/
│   └── Resource.js          # Resource database model
├── routes/
│   └── resources.js         # Resource API routes
```

**Example Resource.js model:**
```javascript
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  type: { type: String, enum: ['Book', 'Journal', 'Digital', 'Magazine'], required: true },
  category: { type: String, required: true },
  isbn: String,
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  location: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
```

---

### 🔹 Pratiksha Lad - Members Management System

**Your Tasks:**
- Member registration and profiles
- Member types (Student, Faculty, Staff)
- Membership status tracking
- Member search and management

**Where to write code:**

**Frontend (client/src/):**
```
Create these new files:
├── components/
│   ├── MemberList.js        # Display all members
│   ├── AddMember.js         # Add new member form
│   ├── EditMember.js        # Edit member form
│   ├── MemberProfile.js     # Member profile view
│   └── MemberSearch.js      # Search members
```

**Backend (server/):**
```
Create these new files:
├── models/
│   └── Member.js            # Member database model
├── routes/
│   └── members.js           # Member API routes
```

**Example Member.js model:**
```javascript
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  memberType: { type: String, enum: ['Student', 'Faculty', 'Staff'], required: true },
  department: String,
  status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
  expiryDate: Date
});

module.exports = mongoose.model('Member', memberSchema);
```

---

### 🔹 Nikhil Kunder - Fine Management System

**Your Tasks:**
- Calculate overdue fines
- Fine payment tracking
- Fine reports and history
- Fine rules and policies

**Where to write code:**

**Frontend (client/src/):**
```
Create these new files:
├── components/
│   ├── FinesList.js         # Display all fines
│   ├── FineCalculator.js    # Calculate fines
│   ├── PaymentForm.js       # Fine payment form
│   ├── FineHistory.js       # Fine payment history
│   └── FineRules.js         # Fine rules management
```

**Backend (server/):**
```
Create these new files:
├── models/
│   ├── Fine.js              # Fine database model
│   └── Payment.js           # Payment database model
├── routes/
│   └── fines.js             # Fine API routes
```

**Example Fine.js model:**
```javascript
const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  fineAmount: { type: Number, required: true },
  reason: { type: String, required: true },
  dueDate: { type: Date, required: true },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Paid', 'Waived'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date
});

module.exports = mongoose.model('Fine', fineSchema);
```

---

### 🔹 Lalit Kumawat - Integration & Core Features

**Your Tasks:**
- Issue/Return transactions
- Dashboard analytics and KPIs
- Reports and data export
- System integration and testing
- Authentication enhancements

**Where to write code:**

**Frontend (client/src/):**
```
Create these new files:
├── components/
│   ├── IssueReturn.js       # Issue/Return interface
│   ├── TransactionHistory.js # Transaction records
│   ├── Analytics.js         # Advanced analytics
│   ├── Reports.js           # System reports
│   └── Settings.js          # System settings
```

**Backend (server/):**
```
Create these new files:
├── models/
│   └── Transaction.js       # Transaction database model
├── routes/
│   ├── transactions.js      # Transaction API routes
│   └── analytics.js         # Analytics API routes
```

---

## How to Add Your Components to the App

### 1. Create Your Component File
Example: `client/src/components/ResourceList.js`

### 2. Import and Use in Dashboard.js
```javascript
// In Dashboard.js, add your import
import ResourceList from './components/ResourceList';

// Add to the dashboard content
{selectedPivot === 'resources' && <ResourceList />}
```

### 3. Add New Navigation Tab
```javascript
// In Dashboard.js, add new PivotItem
<PivotItem headerText="Resources" itemKey="resources" />
<PivotItem headerText="Members" itemKey="members" />
<PivotItem headerText="Fines" itemKey="fines" />
<PivotItem headerText="Transactions" itemKey="transactions" />
```

## API Development (Backend)

### 1. Create Route File
Example: `server/routes/resources.js`
```javascript
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new resource
router.post('/', async (req, res) => {
  const resource = new Resource(req.body);
  try {
    const savedResource = await resource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
```

### 2. Register Route in server/index.js
```javascript
// Add this line in server/index.js
app.use('/api/resources', require('./routes/resources'));
app.use('/api/members', require('./routes/members'));
app.use('/api/fines', require('./routes/fines'));
app.use('/api/transactions', require('./routes/transactions'));
```

## Frontend API Calls

### Using axios to call your APIs:
```javascript
import axios from 'axios';

// GET data
const fetchResources = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/resources');
    setResources(response.data);
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
};

// POST data
const addResource = async (resourceData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/resources', resourceData);
    console.log('Resource added:', response.data);
  } catch (error) {
    console.error('Error adding resource:', error);
  }
};
```

## Git Workflow

### Branch Names:
- **Menka**: `feature/menka-resource-management`
- **Pratiksha**: `feature/pratiksha-members-management`
- **Nikhil**: `feature/nikhil-fine-management`
- **Lalit**: `feature/lalit-integration-stuff`

### Daily Workflow:
1. **Switch to your branch** in GitHub Desktop
2. **Make changes** to your assigned files
3. **Test your code**: `npm run dev`
4. **Commit changes** in GitHub Desktop
5. **Push to GitHub**
6. **Create Pull Request** when feature is complete

## Environment Setup

Create `server/.env` file:
```
MONGODB_URI=mongodb+srv://lalittkumawat02_db_user:ZJMnQBHJGHbn4Tje@lms.exlpllt.mongodb.net/lms
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

## Quick Start Checklist

- [ ] Clone repository
- [ ] Switch to your assigned branch
- [ ] Run `npm install` in root, client, and server folders
- [ ] Create your component files in the right folders
- [ ] Test your code with `npm run dev`
- [ ] Commit and push regularly

**Remember**: Each person works on their own branch, so you won't interfere with each other's code!