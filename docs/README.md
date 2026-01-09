# Library Management System (LMS)

## 📚 Library Automation & Book Tracking App

### Team Members
- Member 1: [Lalit Kumawat] - [Leader]
- Member 2: [Nikhil Kunder] - [Member] 
- Member 3: [Pratiksha Lad] - [Member]
- Member 4: [Menka Rajak] - [Member]

### Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Version Control**: Git + GitHub Desktop

### Development requirements
## User Authentication & Role Management
    1. User registration and login system
    2. Logout functionality
    3. Role-based access (Student, Librarian, Admin)
    4. Separate dashboards for each user role
## Student Module
    1. Student login and profile management
    2. Search books by title, author, or category
    3. View real-time book availability
    4. View real-time book availability
    5. Check issue and return dates
    6. View fine details (if any)
    7. Receive due date and overdue notifications
## Librarian / Admin Module
    1. Secure admin login
    2. Add new books to the library system
    3. Update book information
    4. Delete outdated or damaged books
    5. Manage book categories and authors
    6. Issue books to students
    7. Accept returned books
    8. Calculate fines for late returns
    9. Manage student records
## Book Management System
    1. Maintain complete book inventory
    2. Track book status (Available / Issued)
    3. Store book details such as:
        Book title
        Author
        Category
        Quantity
    4. Prevent duplicate or invalid book entries
## Issue & Return Management
    1. Issue books with issue date and due date
    2. Automatically update book availability
    3. Return book processing
    4. Store complete issue/return history
    5. Prevent issuing unavailable books
## Fine Management System
    1. Automatic fine calculation for overdue books
    2. Display fine amount to students
    3. Maintain fine payment records
    4. Fine rules managed by librarian
## Search & Filtering
    1. Quick search functionality
    2. Filter books by category or author
    3. Search using keywords
    4. Fast and accurate results
## Notification System
    1. Due date reminders
    2. Overdue notifications
    3. Book return confirmation alerts
    4. Optional email or system notifications
## Dashboard & Reports
    1. Admin dashboard with key statistics
    2. Reports on:
        Issued books
        Returned books
        Overdue books
        Fine collection
    3. Student activity reports
   

### Project Structure
```
LMS/
├── client/          # React frontend
├── server/          # Node.js backend
├── docs/           # Documentation
└── README.md
```

### Quick Start
1. Clone the repository
2. Run `npm run install-all` to install dependencies
3. Run `npm run dev` to start both client and server

### Collaboration Guidelines
- Always pull latest changes before starting work
- Create feature branches for new features
- Use descriptive commit messages
- Test your code before pushing
- Create pull requests for code review