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
  Pivot,
  PivotItem,
  MessageBar,
  MessageBarType,
  mergeStyles,
  FontWeights,
  Icon,
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

const BooksManagement = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [selectedPivot, setSelectedPivot] = useState('catalog');
  const [searchValue, setSearchValue] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
    loadBooks();
  }, []);

  const loadBooks = async () => {
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
      }
    } catch (err) {
      error('Error loading books');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBook)
      });

      if (response.ok) {
        await loadBooks();
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
      }
    } catch (err) {
      error('Error adding book');
    }
  };

  const updateBook = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${selectedBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(selectedBook)
      });

      if (response.ok) {
        await loadBooks();
        setShowEditDialog(false);
        setSelectedBook(null);
        success('Book updated successfully');
      }
    } catch (err) {
      error('Error updating book');
    }
  };

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          await loadBooks();
          success('Book deleted successfully');
        }
      } catch (err) {
        error('Error deleting book');
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchValue.toLowerCase()) ||
    book.isbn?.includes(searchValue)
  );

  const bookColumns = [
    { key: 'title', name: 'Title', fieldName: 'title', minWidth: 200 },
    { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
    { key: 'isbn', name: 'ISBN', fieldName: 'isbn', minWidth: 120 },
    { key: 'category', name: 'Category', fieldName: 'category', minWidth: 100 },
    { key: 'copies', name: 'Copies', fieldName: 'copies', minWidth: 80 },
    {
      key: 'status',
      name: 'Status',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { color: item.available > 0 ? '#107c10' : '#d13438' } }}>
          {item.available > 0 ? 'Available' : 'Out of Stock'}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 120,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            onClick={() => {
              setSelectedBook(item);
              setShowEditDialog(true);
            }}
          />
          {user?.role === 'Admin' && (
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              onClick={() => deleteBook(item._id)}
              styles={{ root: { color: '#d13438' } }}
            />
          )}
        </Stack>
      )
    }
  ];

  const commandBarItems = [
    {
      key: 'addBook',
      text: 'Add Book',
      iconProps: { iconName: 'Add' },
      onClick: () => setShowAddDialog(true)
    },
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: loadBooks
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: '24px' } }}>
      <CommandBar items={commandBarItems} />

      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Library Catalog ({filteredBooks.length} books)
        </Text>
        <SearchBox
          placeholder="Search books..."
          value={searchValue}
          onChange={(_, value) => setSearchValue(value || '')}
          styles={{ root: { width: '300px' } }}
        />
      </Stack>

      {loading ? (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
          <Spinner size={SpinnerSize.large} />
          <Text>Loading books...</Text>
        </Stack>
      ) : (
        <DetailsList
          items={filteredBooks}
          columns={bookColumns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          styles={{
            root: {
              background: isDark ? '#323130' : '#ffffff',
              border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`
            }
          }}
        />
      )}

      {/* Add Book Dialog */}
      <Dialog
        hidden={!showAddDialog}
        onDismiss={() => setShowAddDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Add New Book'
        }}
        modalProps={{ isBlocking: false }}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <TextField
            label="Title *"
            value={newBook.title}
            onChange={(_, value) => setNewBook({ ...newBook, title: value || '' })}
            required
          />
          <TextField
            label="Author *"
            value={newBook.author}
            onChange={(_, value) => setNewBook({ ...newBook, author: value || '' })}
            required
          />
          <TextField
            label="ISBN *"
            value={newBook.isbn}
            onChange={(_, value) => setNewBook({ ...newBook, isbn: value || '' })}
            required
          />
          <Dropdown
            label="Category"
            options={categoryOptions}
            selectedKey={newBook.category}
            onChange={(_, option) => setNewBook({ ...newBook, category: option?.key || 'Fiction' })}
          />
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <TextField
              label="Publisher"
              value={newBook.publisher}
              onChange={(_, value) => setNewBook({ ...newBook, publisher: value || '' })}
              styles={{ root: { flex: 1 } }}
            />
            <TextField
              label="Year"
              value={newBook.year}
              onChange={(_, value) => setNewBook({ ...newBook, year: value || '' })}
              styles={{ root: { width: '100px' } }}
            />
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <TextField
              label="Copies"
              type="number"
              value={newBook.copies.toString()}
              onChange={(_, value) => setNewBook({ ...newBook, copies: parseInt(value || '1') })}
              styles={{ root: { width: '100px' } }}
            />
            <TextField
              label="Location"
              value={newBook.location}
              onChange={(_, value) => setNewBook({ ...newBook, location: value || '' })}
              styles={{ root: { flex: 1 } }}
            />
          </Stack>
        </Stack>

        <DialogFooter>
          <PrimaryButton text="Add Book" onClick={addBook} />
          <DefaultButton text="Cancel" onClick={() => setShowAddDialog(false)} />
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
        modalProps={{ isBlocking: false }}
      >
        {selectedBook && (
          <Stack tokens={{ childrenGap: 16 }}>
            <TextField
              label="Title *"
              value={selectedBook.title}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, title: value || '' })}
              required
            />
            <TextField
              label="Author *"
              value={selectedBook.author}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, author: value || '' })}
              required
            />
            <TextField
              label="ISBN *"
              value={selectedBook.isbn}
              onChange={(_, value) => setSelectedBook({ ...selectedBook, isbn: value || '' })}
              required
            />
            <Dropdown
              label="Category"
              options={categoryOptions}
              selectedKey={selectedBook.category}
              onChange={(_, option) => setSelectedBook({ ...selectedBook, category: option?.key || 'Fiction' })}
            />
            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <TextField
                label="Publisher"
                value={selectedBook.publisher || ''}
                onChange={(_, value) => setSelectedBook({ ...selectedBook, publisher: value || '' })}
                styles={{ root: { flex: 1 } }}
              />
              <TextField
                label="Year"
                value={selectedBook.year || ''}
                onChange={(_, value) => setSelectedBook({ ...selectedBook, year: value || '' })}
                styles={{ root: { width: '100px' } }}
              />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <TextField
                label="Copies"
                type="number"
                value={selectedBook.copies?.toString() || '1'}
                onChange={(_, value) => setSelectedBook({ ...selectedBook, copies: parseInt(value || '1') })}
                styles={{ root: { width: '100px' } }}
              />
              <TextField
                label="Location"
                value={selectedBook.location || ''}
                onChange={(_, value) => setSelectedBook({ ...selectedBook, location: value || '' })}
                styles={{ root: { flex: 1 } }}
              />
            </Stack>
          </Stack>
        )}

        <DialogFooter>
          <PrimaryButton text="Update Book" onClick={updateBook} />
          <DefaultButton text="Cancel" onClick={() => setShowEditDialog(false)} />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default BooksManagement;