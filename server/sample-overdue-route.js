// Add sample overdue books (Admin only)
router.post('/sample-overdue', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    // Get existing books and create sample overdue transactions
    const books = await Book.find().limit(10);
    
    if (books.length === 0) {
      return res.status(400).json({ message: 'No books found. Add books first.' });
    }

    const sampleTransactions = [];
    
    for (let i = 0; i < Math.min(10, books.length); i++) {
      const daysOverdue = Math.floor(Math.random() * 30) + 1; // 1-30 days overdue
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - daysOverdue);
      
      const issueDate = new Date(dueDate);
      issueDate.setDate(issueDate.getDate() - 14); // 14 days before due date
      
      const transaction = new Transaction({
        bookId: books[i]._id,
        memberId: `MEM${540924 + i}`,
        type: 'issue',
        issueDate: issueDate,
        dueDate: dueDate,
        status: 'overdue',
        processedBy: req.user.id
      });
      
      sampleTransactions.push(transaction);
    }

    await Transaction.insertMany(sampleTransactions);
    
    res.json({ 
      message: `${sampleTransactions.length} sample overdue transactions created`,
      transactions: sampleTransactions 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});