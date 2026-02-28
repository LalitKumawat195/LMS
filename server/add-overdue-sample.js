const mongoose = require('mongoose');
const Transaction = require('./Transaction');
const Book = require('./Book');
const User = require('./User');

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
  addSampleData();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function addSampleData() {
  try {
    // Get existing books and users
    const books = await Book.find().limit(10);
    const users = await User.find({ role: 'Member' }).limit(10);
    const admin = await User.findOne({ role: 'Admin' });
    
    if (books.length === 0 || users.length === 0 || !admin) {
      console.log('Need books, users, and admin in database first');
      process.exit(1);
    }

    const sampleOverdueTransactions = [];
    
    for (let i = 0; i < Math.min(10, books.length, users.length); i++) {
      const daysOverdue = Math.floor(Math.random() * 30) + 1; // 1-30 days overdue
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - daysOverdue);
      
      const issueDate = new Date(dueDate);
      issueDate.setDate(issueDate.getDate() - 14); // 14 days before due date
      
      sampleOverdueTransactions.push({
        bookId: books[i]._id,
        memberId: users[i].memberId || `MEM${540924 + i}`,
        type: 'issue',
        issueDate: issueDate,
        dueDate: dueDate,
        status: 'overdue',
        processedBy: admin._id
      });
    }

    await Transaction.insertMany(sampleOverdueTransactions);
    console.log(`${sampleOverdueTransactions.length} sample overdue transactions added successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();