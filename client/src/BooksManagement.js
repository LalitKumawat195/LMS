import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  FontWeights,
  IconButton,
  SearchBox,
  CommandBar,
  Dropdown,
  Dialog,
  DialogType,
  DialogFooter,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import AdvancedSearch from './AdvancedSearch';

const BooksManagement = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [searchValue, setSearchValue] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showMemberHistoryDialog, setShowMemberHistoryDialog] = useState(false);
  const [showQuickScanDialog, setShowQuickScanDialog] = useState(false);
  const [showBulkIssueDialog, setShowBulkIssueDialog] = useState(false);
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [memberInfo, setMemberInfo] = useState({ memberId: '', memberName: '' });
  const [transactions, setTransactions] = useState([]);
  const [scanMode, setScanMode] = useState('issue'); // 'issue' or 'return'
  const [scanData, setScanData] = useState({ bookId: '', memberId: '' });
  const [bulkIssueData, setBulkIssueData] = useState({ memberId: '', memberName: '', bookIds: '' });
  const [reserveInfo, setReserveInfo] = useState({ memberId: '', memberName: '' });
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Fiction',
    publisher: '',
    year: '',
    copies: 1,
    location: ''
  });

  const categoryOptions = [
    { key: 'Fiction', text: 'Fiction' },
    { key: 'Non-Fiction', text: 'Non-Fiction' },
    { key: 'Science', text: 'Science' },
    { key: 'Technology', text: 'Technology' },
    { key: 'History', text: 'History' },
    { key: 'Biography', text: 'Biography' },
    { key: 'Reference', text: 'Reference' }
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        // Fallback to sample data if API fails
        const sampleBooks = [
          {
            _id: '1',
            title: 'Sample Book 1',
            author: 'Sample Author 1',
            isbn: '123-456-789',
            category: 'Fiction',
            publisher: 'Sample Publisher',
            year: '2023',
            copies: 5,
            available: 3,
            issued: 2,
            location: 'A1-B2'
          }
        ];
        setBooks(sampleBooks);
      }
    } catch (err) {
      console.log('API not available, using sample data');
      const sampleBooks = [
        {
          _id: '1',
          title: 'Sample Book 1',
          author: 'Sample Author 1',
          isbn: '123-456-789',
          category: 'Fiction',
          publisher: 'Sample Publisher',
          year: '2023',
          copies: 5,
          available: 3,
          issued: 2,
          location: 'A1-B2'
        }
      ];
      setBooks(sampleBooks);
    }
    setLoading(false);
  };

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  // Remove localStorage effects since we're using MongoDB
  // useEffect(() => {
  //   localStorage.setItem('lms_books', JSON.stringify(books));
  // }, [books]);

  // useEffect(() => {
  //   localStorage.setItem('lms_transactions', JSON.stringify(transactions));
  // }, [transactions]);

  const handleSearch = (filtered, query) => {
    setFilteredBooks(filtered);
    setSearchValue(query);
  };



  const addBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newBook,
          available: newBook.copies,
          issued: 0
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchBooks();
        setNewBook({
          title: '',
          author: '',
          isbn: '',
          category: 'Fiction',
          publisher: '',
          year: '',
          copies: 1,
          location: ''
        });
        setShowAddDialog(false);
        success('Book added successfully');
      } else {
        error(data.message || 'Failed to add book');
      }
    } catch (err) {
      error('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/books/${selectedBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(selectedBook)
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchBooks();
        setShowEditDialog(false);
        setSelectedBook(null);
        success('Book updated successfully');
      } else {
        error(data.message || 'Failed to update book');
      }
    } catch (err) {
      error('Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        if (response.ok) {
          fetchBooks();
          success('Book deleted successfully');
        } else {
          error(data.message || 'Failed to delete book');
        }
      } catch (err) {
        error('Failed to delete book');
      } finally {
        setLoading(false);
      }
    }
  };

  const issueBook = async () => {
    if (!memberInfo.memberId) {
      error('Please enter Member ID');
      return;
    }
    if (!selectedBook) {
      error('No book selected');
      return;
    }
    if (selectedBook.available <= 0) {
      error('No copies available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/books/${selectedBook._id}/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ memberId: memberInfo.memberId })
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchBooks();
        setShowIssueDialog(false);
        setSelectedBook(null);
        setMemberInfo({ memberId: '', memberName: '' });
        success(`Book "${selectedBook.title}" issued to ${memberInfo.memberId}`);
      } else {
        error(data.message || 'Failed to issue book');
      }
    } catch (err) {
      error('Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async () => {
    if (!memberInfo.memberId || !selectedBook) {
      error('Please provide member ID and select a book');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/books/${selectedBook._id}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ memberId: memberInfo.memberId })
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchBooks();
        setShowReturnDialog(false);
        setMemberInfo({ memberId: '', memberName: '' });
        setSelectedBook(null);
        success(`Book returned from member ${memberInfo.memberId}`);
      } else {
        error(data.message || 'Failed to return book');
      }
    } catch (err) {
      error('Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  const viewMemberHistory = () => {
    if (!memberInfo.memberId) {
      error('Please enter Member ID');
      return;
    }
    setShowMemberHistoryDialog(true);
  };

  const quickScan = async () => {
    if (!scanData.bookId || !scanData.memberId) {
      error('Please enter both Book ID and Member ID');
      return;
    }

    const book = books.find(b => b._id === scanData.bookId || b.isbn === scanData.bookId);
    if (!book) {
      error('Book not found');
      return;
    }

    if (scanMode === 'issue') {
      if (book.available <= 0) {
        error('No copies available');
        return;
      }
      
      const issueDate = new Date();
      const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      const transaction = {
        _id: Date.now().toString(),
        bookId: book._id,
        bookTitle: book.title,
        memberId: scanData.memberId,
        memberName: 'Quick Scan',
        type: 'issue',
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        status: 'active',
        processedBy: user?.name || 'Librarian'
      };

      const updatedBooks = books.map(b => 
        b._id === book._id 
          ? { ...b, available: b.available - 1, issued: (b.issued || 0) + 1 }
          : b
      );
      
      setBooks(updatedBooks);
      setTransactions([...transactions, transaction]);
      success(`Book "${book.title}" issued to ${scanData.memberId}`);
    } else {
      const activeTransaction = transactions.find(t => 
        t.bookId === book._id && 
        t.memberId === scanData.memberId && 
        t.status === 'active'
      );

      if (!activeTransaction) {
        error('No active issue found');
        return;
      }

      const returnDate = new Date();
      const dueDate = new Date(activeTransaction.dueDate);
      const daysOverdue = returnDate > dueDate ? Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)) : 0;
      const fine = daysOverdue * 2;

      const updatedTransactions = transactions.map(t => 
        t._id === activeTransaction._id 
          ? { ...t, status: 'returned', returnDate: returnDate.toISOString(), fine }
          : t
      );

      const updatedBooks = books.map(b => 
        b._id === book._id 
          ? { ...b, available: b.available + 1, issued: Math.max((b.issued || 0) - 1, 0) }
          : b
      );
      
      setBooks(updatedBooks);
      setTransactions(updatedTransactions);
      success(`Book "${book.title}" returned from ${scanData.memberId}${fine > 0 ? `. Fine: $${fine}` : ''}`);
    }
    
    setScanData({ bookId: '', memberId: '' });
    setShowQuickScanDialog(false);
  };

  const bulkIssueBooks = async () => {
    if (!bulkIssueData.memberId || !bulkIssueData.bookIds) {
      error('Please enter Member ID and Book IDs');
      return;
    }

    const bookIds = bulkIssueData.bookIds.split(',').map(id => id.trim()).filter(id => id);
    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    let successCount = 0;
    let failedBooks = [];
    let newTransactions = [];
    let updatedBooks = [...books];

    for (const bookId of bookIds) {
      const book = updatedBooks.find(b => b._id === bookId || b.isbn === bookId);
      if (!book) {
        failedBooks.push(`${bookId} (not found)`);
        continue;
      }
      if (book.available <= 0) {
        failedBooks.push(`${book.title} (unavailable)`);
        continue;
      }

      const transaction = {
        _id: `${Date.now()}_${successCount}`,
        bookId: book._id,
        bookTitle: book.title,
        memberId: bulkIssueData.memberId,
        memberName: bulkIssueData.memberName || 'Bulk Issue',
        type: 'issue',
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        status: 'active',
        processedBy: user?.name || 'Librarian'
      };

      updatedBooks = updatedBooks.map(b => 
        b._id === book._id 
          ? { ...b, available: b.available - 1, issued: (b.issued || 0) + 1 }
          : b
      );
      
      newTransactions.push(transaction);
      successCount++;
    }

    setBooks(updatedBooks);
    setTransactions([...transactions, ...newTransactions]);
    setBulkIssueData({ memberId: '', memberName: '', bookIds: '' });
    setShowBulkIssueDialog(false);
    
    const message = `${successCount} books issued successfully${failedBooks.length > 0 ? `. Failed: ${failedBooks.join(', ')}` : ''}`;
    success(message);
  };

  const reserveBook = async () => {
    if (!reserveInfo.memberId || !selectedBook) {
      error('Please provide member ID and select a book');
      return;
    }

    const reservation = {
      _id: Date.now().toString(),
      bookId: selectedBook._id,
      bookTitle: selectedBook.title,
      memberId: reserveInfo.memberId,
      memberName: reserveInfo.memberName || 'Unknown',
      type: 'reservation',
      reservationDate: new Date().toISOString(),
      status: 'reserved',
      processedBy: user?.name || 'Librarian'
    };

    setTransactions([...transactions, reservation]);
    setShowReserveDialog(false);
    setReserveInfo({ memberId: '', memberName: '' });
    setSelectedBook(null);
    success(`Book "${selectedBook.title}" reserved for member ${reserveInfo.memberId}`);
  };



  const bookColumns = [
    { key: 'title', name: 'Title', fieldName: 'title', minWidth: 200 },
    { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
    { key: 'isbn', name: 'ISBN', fieldName: 'isbn', minWidth: 120 },
    { key: 'category', name: 'Category', fieldName: 'category', minWidth: 100 },
    { key: 'available', name: 'Available', fieldName: 'available', minWidth: 80 },
    { key: 'issued', name: 'Issued', fieldName: 'issued', minWidth: 80 },
    { key: 'copies', name: 'Total', fieldName: 'copies', minWidth: 80 },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 200,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            title="Edit"
            onClick={() => {
              setSelectedBook(item);
              setShowEditDialog(true);
            }}
          />
          <IconButton
            iconProps={{ iconName: 'CheckMark' }}
            title="Issue Book"
            disabled={item.available <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedBook({
                _id: item._id,
                title: item.title,
                author: item.author,
                available: item.available,
                issued: item.issued || 0
              });
              setMemberInfo({ memberId: '', memberName: '' });
              setShowIssueDialog(true);
            }}
            styles={{
              root: {
                color: '#107c10',
                backgroundColor: 'transparent',
                border: 'none'
              },
              rootHovered: {
                backgroundColor: '#f3f2f1',
                color: '#107c10'
              }
            }}
          />
          <IconButton
            iconProps={{ iconName: 'ReturnToSession' }}
            title="Return Book"
            disabled={item.issued <= 0}
            onClick={() => {
              setSelectedBook(item);
              setShowReturnDialog(true);
            }}
          />
          <IconButton
            iconProps={{ iconName: 'Bookmark' }}
            title="Reserve Book"
            onClick={() => {
              setSelectedBook(item);
              setShowReserveDialog(true);
            }}
          />
          {user?.role === 'admin' && (
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              onClick={() => deleteBook(item._id)}
            />
          )}
        </Stack>
      )
    }
  ];

  const commandBarItems = [
    {
      key: 'add',
      text: 'Add Book',
      iconProps: { iconName: 'Add' },
      onClick: () => setShowAddDialog(true)
    },
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        fetchBooks();
        success('Data refreshed from database');
      }
    },
    {
      key: 'transactions',
      text: 'View Transactions',
      iconProps: { iconName: 'Timeline' },
      onClick: () => {
        const activeIssues = transactions.filter(t => t.status === 'active').length;
        const overdueBooks = transactions.filter(t => {
          if (t.status !== 'active') return false;
          return new Date() > new Date(t.dueDate);
        }).length;
        const totalFines = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);
        
        alert(`Transaction Summary:\nActive Issues: ${activeIssues}\nOverdue Books: ${overdueBooks}\nTotal Fines Collected: $${totalFines}`);
      }
    },
    {
      key: 'quickScan',
      text: 'Quick Scan',
      iconProps: { iconName: 'QRCode' },
      onClick: () => setShowQuickScanDialog(true)
    },
    {
      key: 'bulkIssue',
      text: 'Bulk Issue',
      iconProps: { iconName: 'BulkUpload' },
      onClick: () => setShowBulkIssueDialog(true)
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Books Management
      </Text>
      
      <CommandBar items={commandBarItems} />
      
      <AdvancedSearch 
        onSearch={handleSearch}
        books={books}
      />
      
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <TextField
          placeholder="Member ID"
          value={memberInfo.memberId}
          onChange={(_, value) => setMemberInfo({ ...memberInfo, memberId: value || '' })}
          styles={{ root: { width: 120 } }}
        />
        <DefaultButton
          text="View History"
          iconProps={{ iconName: 'History' }}
          onClick={viewMemberHistory}
        />
      </Stack>
      
      {loading && <Spinner size={SpinnerSize.large} label="Loading books..." />}
      
      <DetailsList
        items={filteredBooks.length > 0 || searchValue ? filteredBooks : books}
        columns={bookColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />

      {/* Add Book Dialog */}
      <Dialog
        hidden={!showAddDialog}
        onDismiss={() => setShowAddDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Add New Book'
        }}
        modalProps={{ isBlocking: true }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Title *"
            value={newBook.title}
            onChange={(_, value) => setNewBook({ ...newBook, title: value || '' })}
          />
          <TextField
            label="Author *"
            value={newBook.author}
            onChange={(_, value) => setNewBook({ ...newBook, author: value || '' })}
          />
          <TextField
            label="ISBN *"
            value={newBook.isbn}
            onChange={(_, value) => setNewBook({ ...newBook, isbn: value || '' })}
          />
          <Dropdown
            label="Category"
            options={categoryOptions}
            selectedKey={newBook.category}
            onChange={(_, option) => setNewBook({ ...newBook, category: option?.key || 'Fiction' })}
          />
          <TextField
            label="Publisher"
            value={newBook.publisher}
            onChange={(_, value) => setNewBook({ ...newBook, publisher: value || '' })}
          />
          <TextField
            label="Year"
            value={newBook.year}
            onChange={(_, value) => setNewBook({ ...newBook, year: value || '' })}
          />
          <TextField
            label="Number of Copies"
            type="number"
            value={newBook.copies.toString()}
            onChange={(_, value) => setNewBook({ ...newBook, copies: parseInt(value || '1') })}
          />
          <TextField
            label="Location"
            value={newBook.location}
            onChange={(_, value) => setNewBook({ ...newBook, location: value || '' })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={addBook} text="Add Book" />
          <DefaultButton onClick={() => setShowAddDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog
        hidden={!showEditDialog}
        onDismiss={() => setShowEditDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Edit Book'
        }}
        modalProps={{ isBlocking: true }}
      >
        {selectedBook && (
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Title"
              value={selectedBook.title}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, title: value || '' })}
            />
            <TextField
              label="Author"
              value={selectedBook.author}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, author: value || '' })}
            />
            <TextField
              label="ISBN"
              value={selectedBook.isbn}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, isbn: value || '' })}
            />
            <Dropdown
              label="Category"
              options={categoryOptions}
              selectedKey={selectedBook.category}
              onChange={(_, option) => setSelectedBook({ ...selectedBook, category: option?.key || 'Fiction' })}
            />
            <TextField
              label="Publisher"
              value={selectedBook.publisher}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, publisher: value || '' })}
            />
            <TextField
              label="Year"
              value={selectedBook.year}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, year: value || '' })}
            />
            <TextField
              label="Total Copies"
              type="number"
              value={selectedBook.copies?.toString() || '1'}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, copies: parseInt(value || '1') })}
            />
            <TextField
              label="Location"
              value={selectedBook.location}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, location: value || '' })}
            />
          </Stack>
        )}
        <DialogFooter>
          <PrimaryButton onClick={updateBook} text="Update" />
          <DefaultButton onClick={() => setShowEditDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Issue Book Dialog */}
      <Dialog
        hidden={!showIssueDialog}
        onDismiss={() => {
          setShowIssueDialog(false);
          setMemberInfo({ memberId: '', memberName: '' });
        }}
        dialogContentProps={{
          type: DialogType.normal,
          title: `Issue Book: ${selectedBook?.title || 'Unknown'}`
        }}
        modalProps={{ isBlocking: false }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Member ID *"
            value={memberInfo.memberId}
            onChange={(_, value) => setMemberInfo({ ...memberInfo, memberId: value || '' })}
            placeholder="Enter member ID"
            required
          />
          <TextField
            label="Member Name (Optional)"
            value={memberInfo.memberName}
            onChange={(_, value) => setMemberInfo({ ...memberInfo, memberName: value || '' })}
            placeholder="Enter member name"
          />
          <Text>Book: {selectedBook?.title}</Text>
          <Text>Available: {selectedBook?.available || 0}</Text>
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={issueBook} text="Issue Book" />
          <DefaultButton onClick={() => {
            setShowIssueDialog(false);
            setMemberInfo({ memberId: '', memberName: '' });
          }} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Return Book Dialog */}
      <Dialog
        hidden={!showReturnDialog}
        onDismiss={() => {
          setShowReturnDialog(false);
          setMemberInfo({ memberId: '', memberName: '' });
        }}
        dialogContentProps={{
          type: DialogType.normal,
          title: `Return Book: ${selectedBook?.title}`
        }}
        modalProps={{ isBlocking: true }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Member ID *"
            value={memberInfo.memberId}
            onChange={(_, value) => setMemberInfo({ ...memberInfo, memberId: value || '' })}
          />
          <TextField
            label="Member Name"
            value={memberInfo.memberName}
            onChange={(_, value) => setMemberInfo({ ...memberInfo, memberName: value || '' })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={returnBook} text="Return Book" />
          <DefaultButton onClick={() => {
            setShowReturnDialog(false);
            setMemberInfo({ memberId: '', memberName: '' });
          }} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Member History Dialog */}
      <Dialog
        hidden={!showMemberHistoryDialog}
        onDismiss={() => setShowMemberHistoryDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: `Member History: ${memberInfo.memberId}`
        }}
        modalProps={{ isBlocking: false }}
        styles={{ main: { minWidth: 600 } }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          {(() => {
            const memberTransactions = transactions.filter(t => t.memberId === memberInfo.memberId);
            const activeIssues = memberTransactions.filter(t => t.status === 'active');
            const totalFines = memberTransactions.reduce((sum, t) => sum + (t.fine || 0), 0);
            
            return (
              <>
                <Text variant="medium">Active Issues: {activeIssues.length}</Text>
                <Text variant="medium">Total Fines: ${totalFines}</Text>
                <Text variant="mediumPlus" styles={{ root: { fontWeight: FontWeights.semibold } }}>Recent Transactions:</Text>
                <Stack styles={{ root: { maxHeight: 300, overflowY: 'auto' } }}>
                  {memberTransactions.slice(-10).reverse().map(t => (
                    <Stack key={t._id} horizontal horizontalAlign="space-between" styles={{ root: { padding: 8, border: '1px solid #e1dfdd' } }}>
                      <Stack>
                        <Text variant="small">{t.bookTitle}</Text>
                        <Text variant="xSmall">{t.type === 'issue' ? 'Issued' : 'Returned'}: {new Date(t.issueDate || t.returnDate).toLocaleDateString()}</Text>
                      </Stack>
                      <Stack horizontalAlign="end">
                        <Text variant="small" styles={{ root: { color: t.status === 'active' ? '#d13438' : '#107c10' } }}>{t.status}</Text>
                        {t.fine > 0 && <Text variant="xSmall">Fine: ${t.fine}</Text>}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </>
            );
          })()}
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowMemberHistoryDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>

      {/* Quick Scan Dialog */}
      <Dialog
        hidden={!showQuickScanDialog}
        onDismiss={() => setShowQuickScanDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Quick Issue/Return'
        }}
        modalProps={{ isBlocking: false }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Dropdown
            label="Action"
            options={[
              { key: 'issue', text: 'Issue Book' },
              { key: 'return', text: 'Return Book' }
            ]}
            selectedKey={scanMode}
            onChange={(_, option) => setScanMode(option?.key || 'issue')}
          />
          <TextField
            label="Book ID/ISBN *"
            value={scanData.bookId}
            onChange={(_, value) => setScanData({ ...scanData, bookId: value || '' })}
            placeholder="Enter book ID or ISBN"
          />
          <TextField
            label="Member ID *"
            value={scanData.memberId}
            onChange={(_, value) => setScanData({ ...scanData, memberId: value || '' })}
            placeholder="Enter member ID"
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={quickScan} text={scanMode === 'issue' ? 'Issue Book' : 'Return Book'} />
          <DefaultButton onClick={() => setShowQuickScanDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Bulk Issue Dialog */}
      <Dialog
        hidden={!showBulkIssueDialog}
        onDismiss={() => setShowBulkIssueDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Bulk Issue Books'
        }}
        modalProps={{ isBlocking: false }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Member ID *"
            value={bulkIssueData.memberId}
            onChange={(_, value) => setBulkIssueData({ ...bulkIssueData, memberId: value || '' })}
          />
          <TextField
            label="Member Name"
            value={bulkIssueData.memberName}
            onChange={(_, value) => setBulkIssueData({ ...bulkIssueData, memberName: value || '' })}
          />
          <TextField
            label="Book IDs/ISBNs *"
            value={bulkIssueData.bookIds}
            onChange={(_, value) => setBulkIssueData({ ...bulkIssueData, bookIds: value || '' })}
            placeholder="Enter book IDs or ISBNs separated by commas"
            multiline
            rows={3}
          />
          <Text variant="small">Enter multiple book IDs or ISBNs separated by commas (e.g., 1, 123-456-789, 2)</Text>
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={bulkIssueBooks} text="Issue Books" />
          <DefaultButton onClick={() => setShowBulkIssueDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Reserve Book Dialog */}
      <Dialog
        hidden={!showReserveDialog}
        onDismiss={() => setShowReserveDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: `Reserve Book: ${selectedBook?.title}`
        }}
        modalProps={{ isBlocking: false }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Member ID *"
            value={reserveInfo.memberId}
            onChange={(_, value) => setReserveInfo({ ...reserveInfo, memberId: value || '' })}
          />
          <TextField
            label="Member Name"
            value={reserveInfo.memberName}
            onChange={(_, value) => setReserveInfo({ ...reserveInfo, memberName: value || '' })}
          />
          {selectedBook && (
            <Text>Available copies: {selectedBook.available}</Text>
          )}
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={reserveBook} text="Reserve Book" />
          <DefaultButton onClick={() => setShowReserveDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default BooksManagement;