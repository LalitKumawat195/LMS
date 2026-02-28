import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  SearchBox,
  DetailsList,
  SelectionMode,
  FontWeights,
  Dropdown,
  PrimaryButton,
  Dialog,
  DialogFooter,
  DefaultButton,
  IconButton,
  TooltipHost
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const BrowseBooks = () => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [books, setBooks] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (err) {
      error('Failed to load books');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchValue || 
      book.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRequestBook = async (book) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${book._id}/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        success('Book request submitted successfully');
      } else {
        const data = await response.json();
        error(data.message || 'Failed to request book');
      }
    } catch (err) {
      error('Failed to request book');
    }
  };

  const handleAddToWishlist = async (book) => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId: book._id })
      });
      if (response.ok) {
        success('Added to wishlist');
      } else {
        const data = await response.json();
        error(data.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      error('Failed to add to wishlist');
    }
  };

  const handleReserveBook = async (book) => {
    try {
      console.log('Reserving book:', book._id);
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId: book._id })
      });
      const data = await response.json();
      console.log('Response:', data);
      if (response.ok) {
        success('Book reserved successfully');
      } else {
        error(data.message || 'Failed to reserve book');
      }
    } catch (err) {
      console.error('Error:', err);
      error('Failed to reserve book');
    }
  };

  const categories = ['All', ...new Set(books.map(b => b.category).filter(Boolean))];

  const columns = [
    { key: 'title', name: 'Title', fieldName: 'title', minWidth: 200 },
    { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
    { key: 'category', name: 'Category', fieldName: 'category', minWidth: 100 },
    { key: 'year', name: 'Year', fieldName: 'year', minWidth: 80 },
    {
      key: 'available',
      name: 'Available',
      minWidth: 80,
      onRender: (item) => (
        <Text styles={{ root: { color: item.available > 0 ? '#107c10' : '#d13438', fontWeight: FontWeights.semibold } }}>
          {item.available || 0}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 250,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <TooltipHost content="View Details">
            <IconButton
              iconProps={{ iconName: 'View' }}
              onClick={() => {
                setSelectedBook(item);
                setShowDetailsDialog(true);
              }}
            />
          </TooltipHost>
          <TooltipHost content="Request Book">
            <IconButton
              iconProps={{ iconName: 'BookAnswers' }}
              onClick={() => handleRequestBook(item)}
            />
          </TooltipHost>
          <TooltipHost content={item.available > 0 ? 'Reserve (Only for unavailable books)' : 'Reserve Book'}>
            <IconButton
              iconProps={{ iconName: 'Calendar' }}
              onClick={() => handleReserveBook(item)}
              disabled={item.available > 0}
            />
          </TooltipHost>
          <TooltipHost content="Add to Wishlist">
            <IconButton
              iconProps={{ iconName: 'FavoriteStarFill' }}
              onClick={() => handleAddToWishlist(item)}
            />
          </TooltipHost>
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Browse Books
      </Text>

      <Stack horizontal tokens={{ childrenGap: 16 }}>
        <SearchBox
          placeholder="Search by title or author..."
          value={searchValue}
          onChange={(_, value) => setSearchValue(value || '')}
          styles={{ root: { width: 300 } }}
        />
        <Dropdown
          placeholder="Category"
          options={categories.map(c => ({ key: c, text: c }))}
          selectedKey={categoryFilter}
          onChange={(_, option) => setCategoryFilter(option.key)}
          styles={{ root: { width: 150 } }}
        />
      </Stack>

      <Text variant="medium">
        Showing {filteredBooks.length} of {books.length} books
      </Text>

      <DetailsList
        items={paginatedBooks}
        columns={columns}
        selectionMode={SelectionMode.none}
      />

      {totalPages > 1 && (
        <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: 'ChevronLeft' }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />
          <Text variant="medium">
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            iconProps={{ iconName: 'ChevronRight' }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Stack>
      )}

      <Dialog
        hidden={!showDetailsDialog}
        onDismiss={() => setShowDetailsDialog(false)}
        dialogContentProps={{ title: selectedBook?.title }}
        minWidth={400}
      >
        {selectedBook && (
          <Stack tokens={{ childrenGap: 12 }}>
            <Text><strong>Author:</strong> {selectedBook.author}</Text>
            <Text><strong>ISBN:</strong> {selectedBook.isbn}</Text>
            <Text><strong>Category:</strong> {selectedBook.category}</Text>
            <Text><strong>Publisher:</strong> {selectedBook.publisher}</Text>
            <Text><strong>Year:</strong> {selectedBook.year}</Text>
            <Text><strong>Location:</strong> {selectedBook.location}</Text>
            <Text><strong>Available Copies:</strong> {selectedBook.available || 0} / {selectedBook.copies}</Text>
          </Stack>
        )}
        <DialogFooter>
          <DefaultButton onClick={() => setShowDetailsDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default BrowseBooks;