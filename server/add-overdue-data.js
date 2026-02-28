const mongoose = require('mongoose');
require('dotenv').config();

const transactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  issueDate: Date,
  dueDate: Date,
  status: String,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const books = await mongoose.connection.db.collection('books').find().limit(10).toArray();
    const users = await mongoose.connection.db.collection('users').find({ role: 'Member' }).limit(10).toArray();
    const librarian = await mongoose.connection.db.collection('users').findOne({ role: 'Librarian' });
    
    if (!books.length || !users.length || !librarian) {
      console.log('Need books, members, and librarian in database first');
      process.exit(1);
    }

    const overdueTransactions = [];
    for (let i = 0; i < Math.min(5, books.length, users.length); i++) {
      const daysOverdue = Math.floor(Math.random() * 20) + 5;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - daysOverdue);
      
      const issueDate = new Date(dueDate);
      issueDate.setDate(issueDate.getDate() - 14);
      
      overdueTransactions.push({
        bookId: books[i]._id,
        memberId: users[i]._id,
        type: 'issue',
        issueDate,
        dueDate,
        status: 'overdue',
        processedBy: librarian._id,
        createdAt: issueDate,
        updatedAt: new Date()
      });
    }

    await Transaction.insertMany(overdueTransactions);
    console.log(`${overdueTransactions.length} overdue transactions created`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });