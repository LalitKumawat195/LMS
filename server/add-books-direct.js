const mongoose = require('mongoose');
require('dotenv').config();

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  publisher: String,
  year: String,
  copies: { type: Number, required: true, default: 1 },
  available: { type: Number, required: true },
  issued: { type: Number, default: 0 },
  location: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

bookSchema.pre('save', function(next) {
  if (this.isNew) this.available = this.copies;
  next();
});

const Book = mongoose.model('Book', bookSchema);

mongoose.connect('mongodb+srv://lalittkumawat02_db_user:ZJMnQBHJGHbn4Tje@lms.exlpllt.mongodb.net/lms?retryWrites=true&w=majority&appName=LMS&ssl=true&tlsAllowInvalidCertificates=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  const adminId = new mongoose.Types.ObjectId();
  const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", category: "Fiction", publisher: "Scribner", year: "1925", copies: 5, available: 5, location: "A1-001", addedBy: adminId },
    { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", category: "Fiction", publisher: "J.B. Lippincott", year: "1960", copies: 3, available: 3, location: "A1-002", addedBy: adminId },
    { title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", category: "Fiction", publisher: "Secker & Warburg", year: "1949", copies: 4, available: 4, location: "A1-003", addedBy: adminId },
    { title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0-14-143951-8", category: "Fiction", publisher: "T. Egerton", year: "1813", copies: 2, available: 2, location: "A1-004", addedBy: adminId },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "978-0-316-76948-0", category: "Fiction", publisher: "Little, Brown", year: "1951", copies: 3, available: 3, location: "A1-005", addedBy: adminId },
    { title: "Lord of the Flies", author: "William Golding", isbn: "978-0-571-05686-2", category: "Fiction", publisher: "Faber & Faber", year: "1954", copies: 4, available: 4, location: "A1-006", addedBy: adminId },
    { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0-547-92822-7", category: "Fiction", publisher: "George Allen & Unwin", year: "1937", copies: 6, available: 6, location: "A1-007", addedBy: adminId },
    { title: "Fahrenheit 451", author: "Ray Bradbury", isbn: "978-1-4516-7331-9", category: "Fiction", publisher: "Ballantine Books", year: "1953", copies: 3, available: 3, location: "A1-008", addedBy: adminId },
    { title: "Brave New World", author: "Aldous Huxley", isbn: "978-0-06-085052-4", category: "Fiction", publisher: "Chatto & Windus", year: "1932", copies: 2, available: 2, location: "A1-009", addedBy: adminId },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", isbn: "978-0-544-00341-5", category: "Fiction", publisher: "George Allen & Unwin", year: "1954", copies: 5, available: 5, location: "A1-010", addedBy: adminId },
    { title: "Animal Farm", author: "George Orwell", isbn: "978-0-452-28424-1", category: "Fiction", publisher: "Secker & Warburg", year: "1945", copies: 4, available: 4, location: "A1-011", addedBy: adminId },
    { title: "Of Mice and Men", author: "John Steinbeck", isbn: "978-0-14-017739-8", category: "Fiction", publisher: "Covici Friede", year: "1937", copies: 3, available: 3, location: "A1-012", addedBy: adminId },
    { title: "The Grapes of Wrath", author: "John Steinbeck", isbn: "978-0-14-303943-3", category: "Fiction", publisher: "The Viking Press", year: "1939", copies: 2, available: 2, location: "A1-013", addedBy: adminId },
    { title: "One Flew Over the Cuckoo's Nest", author: "Ken Kesey", isbn: "978-0-14-118123-4", category: "Fiction", publisher: "Viking Press", year: "1962", copies: 3, available: 3, location: "A1-014", addedBy: adminId },
    { title: "The Scarlet Letter", author: "Nathaniel Hawthorne", isbn: "978-0-14-243726-4", category: "Fiction", publisher: "Ticknor & Fields", year: "1850", copies: 2, available: 2, location: "A1-015", addedBy: adminId },
    { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "978-0-553-38016-3", category: "Science", publisher: "Bantam Books", year: "1988", copies: 4, available: 4, location: "B1-001", addedBy: adminId },
    { title: "The Origin of Species", author: "Charles Darwin", isbn: "978-0-14-043205-1", category: "Science", publisher: "John Murray", year: "1859", copies: 2, available: 2, location: "B1-002", addedBy: adminId },
    { title: "Cosmos", author: "Carl Sagan", isbn: "978-0-345-33135-9", category: "Science", publisher: "Random House", year: "1980", copies: 3, available: 3, location: "B1-003", addedBy: adminId },
    { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "978-0-19-929114-4", category: "Science", publisher: "Oxford University Press", year: "1976", copies: 2, available: 2, location: "B1-004", addedBy: adminId },
    { title: "Silent Spring", author: "Rachel Carson", isbn: "978-0-618-24906-0", category: "Science", publisher: "Houghton Mifflin", year: "1962", copies: 3, available: 3, location: "B1-005", addedBy: adminId },
    { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", category: "Technology", publisher: "Prentice Hall", year: "2008", copies: 5, available: 5, location: "C1-001", addedBy: adminId },
    { title: "The Pragmatic Programmer", author: "David Thomas", isbn: "978-0-20-161622-4", category: "Technology", publisher: "Addison-Wesley", year: "1999", copies: 4, available: 4, location: "C1-002", addedBy: adminId },
    { title: "Design Patterns", author: "Gang of Four", isbn: "978-0-20-163361-0", category: "Technology", publisher: "Addison-Wesley", year: "1994", copies: 3, available: 3, location: "C1-003", addedBy: adminId },
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0-26-203384-8", category: "Technology", publisher: "MIT Press", year: "2009", copies: 6, available: 6, location: "C1-004", addedBy: adminId },
    { title: "Code Complete", author: "Steve McConnell", isbn: "978-0-73-561967-8", category: "Technology", publisher: "Microsoft Press", year: "2004", copies: 4, available: 4, location: "C1-005", addedBy: adminId },
    { title: "The Art of War", author: "Sun Tzu", isbn: "978-1-59-030963-7", category: "History", publisher: "Ancient Text", year: "500 BC", copies: 3, available: 3, location: "D1-001", addedBy: adminId },
    { title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0-06-231609-7", category: "History", publisher: "Harvill Secker", year: "2014", copies: 5, available: 5, location: "D1-002", addedBy: adminId },
    { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "978-0-39-331755-8", category: "History", publisher: "W. W. Norton", year: "1997", copies: 3, available: 3, location: "D1-003", addedBy: adminId },
    { title: "The Diary of a Young Girl", author: "Anne Frank", isbn: "978-0-55-329407-1", category: "Biography", publisher: "Contact Publishing", year: "1947", copies: 4, available: 4, location: "E1-001", addedBy: adminId },
    { title: "Steve Jobs", author: "Walter Isaacson", isbn: "978-1-45-165863-9", category: "Biography", publisher: "Simon & Schuster", year: "2011", copies: 3, available: 3, location: "E1-002", addedBy: adminId },
    { title: "Long Walk to Freedom", author: "Nelson Mandela", isbn: "978-0-31-610326-8", category: "Biography", publisher: "Little, Brown", year: "1994", copies: 2, available: 2, location: "E1-003", addedBy: adminId },
    { title: "The Autobiography of Malcolm X", author: "Malcolm X", isbn: "978-0-34-531271-8", category: "Biography", publisher: "Grove Press", year: "1965", copies: 3, available: 3, location: "E1-004", addedBy: adminId },
    { title: "Einstein: His Life and Universe", author: "Walter Isaacson", isbn: "978-0-74-324559-8", category: "Biography", publisher: "Simon & Schuster", year: "2007", copies: 2, available: 2, location: "E1-005", addedBy: adminId },
    { title: "Oxford English Dictionary", author: "Oxford University Press", isbn: "978-0-19-861186-8", category: "Reference", publisher: "Oxford University Press", year: "2020", copies: 2, available: 2, location: "F1-001", addedBy: adminId },
    { title: "Encyclopedia Britannica", author: "Britannica Editorial", isbn: "978-1-59-339292-5", category: "Reference", publisher: "Encyclopædia Britannica", year: "2019", copies: 1, available: 1, location: "F1-002", addedBy: adminId },
    { title: "Merriam-Webster Dictionary", author: "Merriam-Webster", isbn: "978-0-87-779829-8", category: "Reference", publisher: "Merriam-Webster", year: "2021", copies: 3, available: 3, location: "F1-003", addedBy: adminId },
    { title: "The Elements of Style", author: "William Strunk Jr.", isbn: "978-0-20-530902-3", category: "Reference", publisher: "Harcourt", year: "1959", copies: 4, available: 4, location: "F1-004", addedBy: adminId },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "978-0-37-427563-1", category: "Non-Fiction", publisher: "Farrar, Straus and Giroux", year: "2011", copies: 3, available: 3, location: "G1-001", addedBy: adminId },
    { title: "The Power of Habit", author: "Charles Duhigg", isbn: "978-1-40-006928-6", category: "Non-Fiction", publisher: "Random House", year: "2012", copies: 4, available: 4, location: "G1-002", addedBy: adminId },
    { title: "Atomic Habits", author: "James Clear", isbn: "978-0-73-521129-2", category: "Non-Fiction", publisher: "Avery", year: "2018", copies: 5, available: 5, location: "G1-003", addedBy: adminId },
    { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", isbn: "978-1-98-217740-9", category: "Non-Fiction", publisher: "Free Press", year: "1989", copies: 3, available: 3, location: "G1-004", addedBy: adminId },
    { title: "How to Win Friends and Influence People", author: "Dale Carnegie", isbn: "978-0-67-172737-2", category: "Non-Fiction", publisher: "Simon & Schuster", year: "1936", copies: 4, available: 4, location: "G1-005", addedBy: adminId },
    { title: "The Lean Startup", author: "Eric Ries", isbn: "978-0-30-788789-4", category: "Technology", publisher: "Crown Business", year: "2011", copies: 3, available: 3, location: "C1-006", addedBy: adminId },
    { title: "Zero to One", author: "Peter Thiel", isbn: "978-0-80-414195-4", category: "Technology", publisher: "Crown Business", year: "2014", copies: 2, available: 2, location: "C1-007", addedBy: adminId },
    { title: "The Innovator's Dilemma", author: "Clayton Christensen", isbn: "978-0-87-584585-2", category: "Technology", publisher: "Harvard Business Review Press", year: "1997", copies: 3, available: 3, location: "C1-008", addedBy: adminId },
    { title: "Educated", author: "Tara Westover", isbn: "978-0-39-935096-5", category: "Biography", publisher: "Random House", year: "2018", copies: 4, available: 4, location: "E1-006", addedBy: adminId },
    { title: "Becoming", author: "Michelle Obama", isbn: "978-1-52-476313-4", category: "Biography", publisher: "Crown Publishing", year: "2018", copies: 5, available: 5, location: "E1-007", addedBy: adminId },
    { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", isbn: "978-1-40-005217-2", category: "Science", publisher: "Crown Publishers", year: "2010", copies: 3, available: 3, location: "B1-006", addedBy: adminId },
    { title: "Freakonomics", author: "Steven Levitt", isbn: "978-0-06-073132-6", category: "Non-Fiction", publisher: "William Morrow", year: "2005", copies: 3, available: 3, location: "G1-006", addedBy: adminId },
    { title: "The Tipping Point", author: "Malcolm Gladwell", isbn: "978-0-31-634662-7", category: "Non-Fiction", publisher: "Little, Brown", year: "2000", copies: 4, available: 4, location: "G1-007", addedBy: adminId },
    { title: "Outliers", author: "Malcolm Gladwell", isbn: "978-0-31-601792-3", category: "Non-Fiction", publisher: "Little, Brown", year: "2008", copies: 3, available: 3, location: "G1-008", addedBy: adminId }
  ];
  
  const result = await Book.insertMany(books, { ordered: false });
  console.log(`${result.length} books inserted successfully`);
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err);
  mongoose.disconnect();
});