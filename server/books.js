const express = require('express');
const jwt = require('jsonwebtoken');
const Book = require('./Book');
const Transaction = require('./Transaction');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is librarian or admin
const checkLibrarianOrAdmin = (req, res, next) => {
  if (req.user.role !== 'Librarian' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Librarian or Admin role required.' });
  }
  next();
};

// Get all books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get overdue books (must be before /:id route)
router.get('/overdue', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const Payment = require('./Payment');
    
    // First update overdue status
    await Transaction.updateMany(
      {
        type: 'issue',
        status: 'active',
        dueDate: { $lt: new Date() }
      },
      { status: 'overdue' }
    );

    // Get all paid transaction IDs
    const paidTransactions = await Payment.find().distinct('transactionId');

    const overdueTransactions = await Transaction.find({
      type: 'issue',
      status: 'overdue',
      _id: { $nin: paidTransactions } // Exclude paid transactions
    })
    .populate('bookId', 'title author isbn category')
    .populate('processedBy', 'name')
    .sort({ dueDate: 1 });
    
    // Calculate current fine for each overdue transaction
    const transactionsWithFines = overdueTransactions.map(transaction => {
      const overdueDays = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));
      const currentFine = overdueDays * 10;
      return {
        ...transaction.toObject(),
        currentFine,
        overdueDays
      };
    });
    
    res.json(transactionsWithFines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new book (Librarian/Admin only)
router.post('/', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      addedBy: req.user.id
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Book with this ISBN already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Add 50 sample books (Admin only)
router.post('/sample', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const sampleBooks = [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", category: "Fiction", publisher: "Scribner", year: "1925", copies: 5, location: "A1-001" },
      { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", category: "Fiction", publisher: "J.B. Lippincott", year: "1960", copies: 3, location: "A1-002" },
      { title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", category: "Fiction", publisher: "Secker & Warburg", year: "1949", copies: 4, location: "A1-003" },
      { title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0-14-143951-8", category: "Fiction", publisher: "T. Egerton", year: "1813", copies: 2, location: "A1-004" },
      { title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "978-0-316-76948-0", category: "Fiction", publisher: "Little, Brown", year: "1951", copies: 3, location: "A1-005" },
      { title: "Lord of the Flies", author: "William Golding", isbn: "978-0-571-05686-2", category: "Fiction", publisher: "Faber & Faber", year: "1954", copies: 4, location: "A1-006" },
      { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0-547-92822-7", category: "Fiction", publisher: "George Allen & Unwin", year: "1937", copies: 6, location: "A1-007" },
      { title: "Fahrenheit 451", author: "Ray Bradbury", isbn: "978-1-4516-7331-9", category: "Fiction", publisher: "Ballantine Books", year: "1953", copies: 3, location: "A1-008" },
      { title: "Brave New World", author: "Aldous Huxley", isbn: "978-0-06-085052-4", category: "Fiction", publisher: "Chatto & Windus", year: "1932", copies: 2, location: "A1-009" },
      { title: "The Lord of the Rings", author: "J.R.R. Tolkien", isbn: "978-0-544-00341-5", category: "Fiction", publisher: "George Allen & Unwin", year: "1954", copies: 5, location: "A1-010" },
      { title: "Animal Farm", author: "George Orwell", isbn: "978-0-452-28424-1", category: "Fiction", publisher: "Secker & Warburg", year: "1945", copies: 4, location: "A1-011" },
      { title: "Of Mice and Men", author: "John Steinbeck", isbn: "978-0-14-017739-8", category: "Fiction", publisher: "Covici Friede", year: "1937", copies: 3, location: "A1-012" },
      { title: "The Grapes of Wrath", author: "John Steinbeck", isbn: "978-0-14-303943-3", category: "Fiction", publisher: "The Viking Press", year: "1939", copies: 2, location: "A1-013" },
      { title: "One Flew Over the Cuckoo's Nest", author: "Ken Kesey", isbn: "978-0-14-118123-4", category: "Fiction", publisher: "Viking Press", year: "1962", copies: 3, location: "A1-014" },
      { title: "The Scarlet Letter", author: "Nathaniel Hawthorne", isbn: "978-0-14-243726-4", category: "Fiction", publisher: "Ticknor & Fields", year: "1850", copies: 2, location: "A1-015" },
      { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "978-0-553-38016-3", category: "Science", publisher: "Bantam Books", year: "1988", copies: 4, location: "B1-001" },
      { title: "The Origin of Species", author: "Charles Darwin", isbn: "978-0-14-043205-1", category: "Science", publisher: "John Murray", year: "1859", copies: 2, location: "B1-002" },
      { title: "Cosmos", author: "Carl Sagan", isbn: "978-0-345-33135-9", category: "Science", publisher: "Random House", year: "1980", copies: 3, location: "B1-003" },
      { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "978-0-19-929114-4", category: "Science", publisher: "Oxford University Press", year: "1976", copies: 2, location: "B1-004" },
      { title: "Silent Spring", author: "Rachel Carson", isbn: "978-0-618-24906-0", category: "Science", publisher: "Houghton Mifflin", year: "1962", copies: 3, location: "B1-005" },
      { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", category: "Technology", publisher: "Prentice Hall", year: "2008", copies: 5, location: "C1-001" },
      { title: "The Pragmatic Programmer", author: "David Thomas", isbn: "978-0-20-161622-4", category: "Technology", publisher: "Addison-Wesley", year: "1999", copies: 4, location: "C1-002" },
      { title: "Design Patterns", author: "Gang of Four", isbn: "978-0-20-163361-0", category: "Technology", publisher: "Addison-Wesley", year: "1994", copies: 3, location: "C1-003" },
      { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0-26-203384-8", category: "Technology", publisher: "MIT Press", year: "2009", copies: 6, location: "C1-004" },
      { title: "Code Complete", author: "Steve McConnell", isbn: "978-0-73-561967-8", category: "Technology", publisher: "Microsoft Press", year: "2004", copies: 4, location: "C1-005" },
      { title: "The Art of War", author: "Sun Tzu", isbn: "978-1-59-030963-7", category: "History", publisher: "Ancient Text", year: "500 BC", copies: 3, location: "D1-001" },
      { title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0-06-231609-7", category: "History", publisher: "Harvill Secker", year: "2014", copies: 5, location: "D1-002" },
      { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "978-0-39-331755-8", category: "History", publisher: "W. W. Norton", year: "1997", copies: 3, location: "D1-003" },
      { title: "The Diary of a Young Girl", author: "Anne Frank", isbn: "978-0-55-329407-1", category: "Biography", publisher: "Contact Publishing", year: "1947", copies: 4, location: "E1-001" },
      { title: "Steve Jobs", author: "Walter Isaacson", isbn: "978-1-45-165863-9", category: "Biography", publisher: "Simon & Schuster", year: "2011", copies: 3, location: "E1-002" },
      { title: "Long Walk to Freedom", author: "Nelson Mandela", isbn: "978-0-31-610326-8", category: "Biography", publisher: "Little, Brown", year: "1994", copies: 2, location: "E1-003" },
      { title: "The Autobiography of Malcolm X", author: "Malcolm X", isbn: "978-0-34-531271-8", category: "Biography", publisher: "Grove Press", year: "1965", copies: 3, location: "E1-004" },
      { title: "Einstein: His Life and Universe", author: "Walter Isaacson", isbn: "978-0-74-324559-8", category: "Biography", publisher: "Simon & Schuster", year: "2007", copies: 2, location: "E1-005" },
      { title: "Oxford English Dictionary", author: "Oxford University Press", isbn: "978-0-19-861186-8", category: "Reference", publisher: "Oxford University Press", year: "2020", copies: 2, location: "F1-001" },
      { title: "Encyclopedia Britannica", author: "Britannica Editorial", isbn: "978-1-59-339292-5", category: "Reference", publisher: "Encyclopædia Britannica", year: "2019", copies: 1, location: "F1-002" },
      { title: "Merriam-Webster Dictionary", author: "Merriam-Webster", isbn: "978-0-87-779829-8", category: "Reference", publisher: "Merriam-Webster", year: "2021", copies: 3, location: "F1-003" },
      { title: "The Elements of Style", author: "William Strunk Jr.", isbn: "978-0-20-530902-3", category: "Reference", publisher: "Harcourt", year: "1959", copies: 4, location: "F1-004" },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "978-0-37-427563-1", category: "Non-Fiction", publisher: "Farrar, Straus and Giroux", year: "2011", copies: 3, location: "G1-001" },
      { title: "The Power of Habit", author: "Charles Duhigg", isbn: "978-1-40-006928-6", category: "Non-Fiction", publisher: "Random House", year: "2012", copies: 4, location: "G1-002" },
      { title: "Atomic Habits", author: "James Clear", isbn: "978-0-73-521129-2", category: "Non-Fiction", publisher: "Avery", year: "2018", copies: 5, location: "G1-003" },
      { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", isbn: "978-1-98-217740-9", category: "Non-Fiction", publisher: "Free Press", year: "1989", copies: 3, location: "G1-004" },
      { title: "How to Win Friends and Influence People", author: "Dale Carnegie", isbn: "978-0-67-172737-2", category: "Non-Fiction", publisher: "Simon & Schuster", year: "1936", copies: 4, location: "G1-005" },
      { title: "The Lean Startup", author: "Eric Ries", isbn: "978-0-30-788789-4", category: "Technology", publisher: "Crown Business", year: "2011", copies: 3, location: "C1-006" },
      { title: "Zero to One", author: "Peter Thiel", isbn: "978-0-80-414195-4", category: "Technology", publisher: "Crown Business", year: "2014", copies: 2, location: "C1-007" },
      { title: "The Innovator's Dilemma", author: "Clayton Christensen", isbn: "978-0-87-584585-2", category: "Technology", publisher: "Harvard Business Review Press", year: "1997", copies: 3, location: "C1-008" },
      { title: "Educated", author: "Tara Westover", isbn: "978-0-39-935096-5", category: "Biography", publisher: "Random House", year: "2018", copies: 4, location: "E1-006" },
      { title: "Becoming", author: "Michelle Obama", isbn: "978-1-52-476313-4", category: "Biography", publisher: "Crown Publishing", year: "2018", copies: 5, location: "E1-007" },
      { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", isbn: "978-1-40-005217-2", category: "Science", publisher: "Crown Publishers", year: "2010", copies: 3, location: "B1-006" },
      { title: "Freakonomics", author: "Steven Levitt", isbn: "978-0-06-073132-6", category: "Non-Fiction", publisher: "William Morrow", year: "2005", copies: 3, location: "G1-006" },
      { title: "The Tipping Point", author: "Malcolm Gladwell", isbn: "978-0-31-634662-7", category: "Non-Fiction", publisher: "Little, Brown", year: "2000", copies: 4, location: "G1-007" },
      { title: "Outliers", author: "Malcolm Gladwell", isbn: "978-0-31-601792-3", category: "Non-Fiction", publisher: "Little, Brown", year: "2008", copies: 3, location: "G1-008" }
    ];

    const booksWithUser = sampleBooks.map(book => ({
      ...book,
      addedBy: req.user.id
    }));

    const insertedBooks = await Book.insertMany(booksWithUser, { ordered: false });
    res.status(201).json({ 
      message: `${insertedBooks.length} sample books added successfully`,
      books: insertedBooks 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Some sample books already exist and were skipped' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Update book (Librarian/Admin only)
router.put('/:id', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete book (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search books
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const query = req.params.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Issue book (Librarian/Admin only)
router.post('/:id/issue', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const { memberId } = req.body;
    
    if (!memberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.available <= 0) {
      return res.status(400).json({ message: 'No copies available for issue' });
    }

    // Create transaction record
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const transaction = new Transaction({
      bookId: book._id,
      memberId,
      type: 'issue',
      dueDate: dueDate,
      processedBy: req.user.id
    });
    await transaction.save();

    // Update book counts
    book.available -= 1;
    book.issued = (book.issued || 0) + 1;
    await book.save();

    res.json({ 
      message: 'Book issued successfully', 
      book,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return book (Librarian/Admin only)
router.post('/:id/return', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const { memberId } = req.body;
    
    if (!memberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find active transaction for this book and member
    const activeTransaction = await Transaction.findOne({
      bookId: book._id,
      memberId,
      status: 'active'
    });

    if (!activeTransaction) {
      return res.status(400).json({ message: 'No active issue found for this member' });
    }

    // Create return transaction
    const returnDate = new Date();
    const overdueDays = returnDate > new Date(activeTransaction.dueDate) ? 
      Math.ceil((returnDate - new Date(activeTransaction.dueDate)) / (1000 * 60 * 60 * 24)) : 0;
    const fine = overdueDays * 10; // ₹10 per day

    const returnTransaction = new Transaction({
      bookId: book._id,
      memberId,
      type: 'return',
      dueDate: activeTransaction.dueDate, // Copy due date from issue transaction
      fine: fine,
      processedBy: req.user.id
    });
    await returnTransaction.save();

    // Update active transaction status
    activeTransaction.status = 'returned';
    await activeTransaction.save();

    // Update book counts
    book.available += 1;
    book.issued = Math.max((book.issued || 0) - 1, 0);
    await book.save();

    res.json({ 
      message: 'Book returned successfully', 
      book,
      transaction: returnTransaction,
      fine: fine,
      overdueDays: overdueDays
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction history
router.get('/transactions/history', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    // Update overdue status first
    await Transaction.updateMany(
      {
        type: 'issue',
        status: 'active',
        dueDate: { $lt: new Date() }
      },
      { status: 'overdue' }
    );

    const transactions = await Transaction.find()
      .populate('bookId', 'title author isbn')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Insert 50 sample books directly
router.post('/insert-sample', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const books = [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", category: "Fiction", publisher: "Scribner", year: "1925", copies: 5, available: 5, location: "A1-001", addedBy: req.user.id },
      { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", category: "Fiction", publisher: "J.B. Lippincott", year: "1960", copies: 3, available: 3, location: "A1-002", addedBy: req.user.id },
      { title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", category: "Fiction", publisher: "Secker & Warburg", year: "1949", copies: 4, available: 4, location: "A1-003", addedBy: req.user.id },
      { title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0-14-143951-8", category: "Fiction", publisher: "T. Egerton", year: "1813", copies: 2, available: 2, location: "A1-004", addedBy: req.user.id },
      { title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "978-0-316-76948-0", category: "Fiction", publisher: "Little, Brown", year: "1951", copies: 3, available: 3, location: "A1-005", addedBy: req.user.id },
      { title: "Lord of the Flies", author: "William Golding", isbn: "978-0-571-05686-2", category: "Fiction", publisher: "Faber & Faber", year: "1954", copies: 4, available: 4, location: "A1-006", addedBy: req.user.id },
      { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0-547-92822-7", category: "Fiction", publisher: "George Allen & Unwin", year: "1937", copies: 6, available: 6, location: "A1-007", addedBy: req.user.id },
      { title: "Fahrenheit 451", author: "Ray Bradbury", isbn: "978-1-4516-7331-9", category: "Fiction", publisher: "Ballantine Books", year: "1953", copies: 3, available: 3, location: "A1-008", addedBy: req.user.id },
      { title: "Brave New World", author: "Aldous Huxley", isbn: "978-0-06-085052-4", category: "Fiction", publisher: "Chatto & Windus", year: "1932", copies: 2, available: 2, location: "A1-009", addedBy: req.user.id },
      { title: "The Lord of the Rings", author: "J.R.R. Tolkien", isbn: "978-0-544-00341-5", category: "Fiction", publisher: "George Allen & Unwin", year: "1954", copies: 5, available: 5, location: "A1-010", addedBy: req.user.id },
      { title: "Animal Farm", author: "George Orwell", isbn: "978-0-452-28424-1", category: "Fiction", publisher: "Secker & Warburg", year: "1945", copies: 4, available: 4, location: "A1-011", addedBy: req.user.id },
      { title: "Of Mice and Men", author: "John Steinbeck", isbn: "978-0-14-017739-8", category: "Fiction", publisher: "Covici Friede", year: "1937", copies: 3, available: 3, location: "A1-012", addedBy: req.user.id },
      { title: "The Grapes of Wrath", author: "John Steinbeck", isbn: "978-0-14-303943-3", category: "Fiction", publisher: "The Viking Press", year: "1939", copies: 2, available: 2, location: "A1-013", addedBy: req.user.id },
      { title: "One Flew Over the Cuckoo's Nest", author: "Ken Kesey", isbn: "978-0-14-118123-4", category: "Fiction", publisher: "Viking Press", year: "1962", copies: 3, available: 3, location: "A1-014", addedBy: req.user.id },
      { title: "The Scarlet Letter", author: "Nathaniel Hawthorne", isbn: "978-0-14-243726-4", category: "Fiction", publisher: "Ticknor & Fields", year: "1850", copies: 2, available: 2, location: "A1-015", addedBy: req.user.id },
      { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "978-0-553-38016-3", category: "Science", publisher: "Bantam Books", year: "1988", copies: 4, available: 4, location: "B1-001", addedBy: req.user.id },
      { title: "The Origin of Species", author: "Charles Darwin", isbn: "978-0-14-043205-1", category: "Science", publisher: "John Murray", year: "1859", copies: 2, available: 2, location: "B1-002", addedBy: req.user.id },
      { title: "Cosmos", author: "Carl Sagan", isbn: "978-0-345-33135-9", category: "Science", publisher: "Random House", year: "1980", copies: 3, available: 3, location: "B1-003", addedBy: req.user.id },
      { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "978-0-19-929114-4", category: "Science", publisher: "Oxford University Press", year: "1976", copies: 2, available: 2, location: "B1-004", addedBy: req.user.id },
      { title: "Silent Spring", author: "Rachel Carson", isbn: "978-0-618-24906-0", category: "Science", publisher: "Houghton Mifflin", year: "1962", copies: 3, available: 3, location: "B1-005", addedBy: req.user.id },
      { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", category: "Technology", publisher: "Prentice Hall", year: "2008", copies: 5, available: 5, location: "C1-001", addedBy: req.user.id },
      { title: "The Pragmatic Programmer", author: "David Thomas", isbn: "978-0-20-161622-4", category: "Technology", publisher: "Addison-Wesley", year: "1999", copies: 4, available: 4, location: "C1-002", addedBy: req.user.id },
      { title: "Design Patterns", author: "Gang of Four", isbn: "978-0-20-163361-0", category: "Technology", publisher: "Addison-Wesley", year: "1994", copies: 3, available: 3, location: "C1-003", addedBy: req.user.id },
      { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0-26-203384-8", category: "Technology", publisher: "MIT Press", year: "2009", copies: 6, available: 6, location: "C1-004", addedBy: req.user.id },
      { title: "Code Complete", author: "Steve McConnell", isbn: "978-0-73-561967-8", category: "Technology", publisher: "Microsoft Press", year: "2004", copies: 4, available: 4, location: "C1-005", addedBy: req.user.id },
      { title: "The Art of War", author: "Sun Tzu", isbn: "978-1-59-030963-7", category: "History", publisher: "Ancient Text", year: "500 BC", copies: 3, available: 3, location: "D1-001", addedBy: req.user.id },
      { title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0-06-231609-7", category: "History", publisher: "Harvill Secker", year: "2014", copies: 5, available: 5, location: "D1-002", addedBy: req.user.id },
      { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "978-0-39-331755-8", category: "History", publisher: "W. W. Norton", year: "1997", copies: 3, available: 3, location: "D1-003", addedBy: req.user.id },
      { title: "The Diary of a Young Girl", author: "Anne Frank", isbn: "978-0-55-329407-1", category: "Biography", publisher: "Contact Publishing", year: "1947", copies: 4, available: 4, location: "E1-001", addedBy: req.user.id },
      { title: "Steve Jobs", author: "Walter Isaacson", isbn: "978-1-45-165863-9", category: "Biography", publisher: "Simon & Schuster", year: "2011", copies: 3, available: 3, location: "E1-002", addedBy: req.user.id },
      { title: "Long Walk to Freedom", author: "Nelson Mandela", isbn: "978-0-31-610326-8", category: "Biography", publisher: "Little, Brown", year: "1994", copies: 2, available: 2, location: "E1-003", addedBy: req.user.id },
      { title: "The Autobiography of Malcolm X", author: "Malcolm X", isbn: "978-0-34-531271-8", category: "Biography", publisher: "Grove Press", year: "1965", copies: 3, available: 3, location: "E1-004", addedBy: req.user.id },
      { title: "Einstein: His Life and Universe", author: "Walter Isaacson", isbn: "978-0-74-324559-8", category: "Biography", publisher: "Simon & Schuster", year: "2007", copies: 2, available: 2, location: "E1-005", addedBy: req.user.id },
      { title: "Oxford English Dictionary", author: "Oxford University Press", isbn: "978-0-19-861186-8", category: "Reference", publisher: "Oxford University Press", year: "2020", copies: 2, available: 2, location: "F1-001", addedBy: req.user.id },
      { title: "Encyclopedia Britannica", author: "Britannica Editorial", isbn: "978-1-59-339292-5", category: "Reference", publisher: "Encyclopædia Britannica", year: "2019", copies: 1, available: 1, location: "F1-002", addedBy: req.user.id },
      { title: "Merriam-Webster Dictionary", author: "Merriam-Webster", isbn: "978-0-87-779829-8", category: "Reference", publisher: "Merriam-Webster", year: "2021", copies: 3, available: 3, location: "F1-003", addedBy: req.user.id },
      { title: "The Elements of Style", author: "William Strunk Jr.", isbn: "978-0-20-530902-3", category: "Reference", publisher: "Harcourt", year: "1959", copies: 4, available: 4, location: "F1-004", addedBy: req.user.id },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "978-0-37-427563-1", category: "Non-Fiction", publisher: "Farrar, Straus and Giroux", year: "2011", copies: 3, available: 3, location: "G1-001", addedBy: req.user.id },
      { title: "The Power of Habit", author: "Charles Duhigg", isbn: "978-1-40-006928-6", category: "Non-Fiction", publisher: "Random House", year: "2012", copies: 4, available: 4, location: "G1-002", addedBy: req.user.id },
      { title: "Atomic Habits", author: "James Clear", isbn: "978-0-73-521129-2", category: "Non-Fiction", publisher: "Avery", year: "2018", copies: 5, available: 5, location: "G1-003", addedBy: req.user.id },
      { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", isbn: "978-1-98-217740-9", category: "Non-Fiction", publisher: "Free Press", year: "1989", copies: 3, available: 3, location: "G1-004", addedBy: req.user.id },
      { title: "How to Win Friends and Influence People", author: "Dale Carnegie", isbn: "978-0-67-172737-2", category: "Non-Fiction", publisher: "Simon & Schuster", year: "1936", copies: 4, available: 4, location: "G1-005", addedBy: req.user.id },
      { title: "The Lean Startup", author: "Eric Ries", isbn: "978-0-30-788789-4", category: "Technology", publisher: "Crown Business", year: "2011", copies: 3, available: 3, location: "C1-006", addedBy: req.user.id },
      { title: "Zero to One", author: "Peter Thiel", isbn: "978-0-80-414195-4", category: "Technology", publisher: "Crown Business", year: "2014", copies: 2, available: 2, location: "C1-007", addedBy: req.user.id },
      { title: "The Innovator's Dilemma", author: "Clayton Christensen", isbn: "978-0-87-584585-2", category: "Technology", publisher: "Harvard Business Review Press", year: "1997", copies: 3, available: 3, location: "C1-008", addedBy: req.user.id },
      { title: "Educated", author: "Tara Westover", isbn: "978-0-39-935096-5", category: "Biography", publisher: "Random House", year: "2018", copies: 4, available: 4, location: "E1-006", addedBy: req.user.id },
      { title: "Becoming", author: "Michelle Obama", isbn: "978-1-52-476313-4", category: "Biography", publisher: "Crown Publishing", year: "2018", copies: 5, available: 5, location: "E1-007", addedBy: req.user.id },
      { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", isbn: "978-1-40-005217-2", category: "Science", publisher: "Crown Publishers", year: "2010", copies: 3, available: 3, location: "B1-006", addedBy: req.user.id },
      { title: "Freakonomics", author: "Steven Levitt", isbn: "978-0-06-073132-6", category: "Non-Fiction", publisher: "William Morrow", year: "2005", copies: 3, available: 3, location: "G1-006", addedBy: req.user.id },
      { title: "The Tipping Point", author: "Malcolm Gladwell", isbn: "978-0-31-634662-7", category: "Non-Fiction", publisher: "Little, Brown", year: "2000", copies: 4, available: 4, location: "G1-007", addedBy: req.user.id },
      { title: "Outliers", author: "Malcolm Gladwell", isbn: "978-0-31-601792-3", category: "Non-Fiction", publisher: "Little, Brown", year: "2008", copies: 3, available: 3, location: "G1-008", addedBy: req.user.id }
    ];

    const result = await Book.insertMany(books, { ordered: false });
    res.json({ message: `${result.length} books inserted successfully`, books: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

module.exports = router;