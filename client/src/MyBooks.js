import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  Pivot,
  PivotItem,
  DetailsList,
  SelectionMode,
  FontWeights,
  IconButton,
  TooltipHost,
  Dialog,
  DialogFooter,
  DefaultButton,
  PrimaryButton
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const MyBooks = () => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchIssuedBooks();
    fetchHistory();
    fetchWishlist();
    fetchRequests();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/my-books', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIssuedBooks(data);
      }
    } catch (err) {
      error('Failed to load issued books');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/my-history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      error('Failed to load history');
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (err) {
      error('Failed to load wishlist');
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/my-requests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      error('Failed to load requests');
    }
  };

  const handleRenew = async (transaction) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transaction._id}/renew-request`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        success('Renewal request submitted successfully');
        fetchIssuedBooks();
      } else {
        const data = await response.json();
        error(data.message || 'Failed to submit renewal request');
      }
    } catch (err) {
      error('Failed to submit renewal request');
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        success('Removed from wishlist');
        fetchWishlist();
      }
    } catch (err) {
      error('Failed to remove from wishlist');
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        success('Request cancelled');
        fetchRequests();
      }
    } catch (err) {
      error('Failed to cancel request');
    }
  };

  const issuedColumns = [
    { key: 'title', name: 'Title', minWidth: 200, onRender: (item) => item.bookId?.title },
    { key: 'author', name: 'Author', minWidth: 150, onRender: (item) => item.bookId?.author },
    { key: 'issueDate', name: 'Issue Date', minWidth: 100, onRender: (item) => new Date(item.issueDate).toLocaleDateString() },
    { key: 'dueDate', name: 'Due Date', minWidth: 100, onRender: (item) => new Date(item.dueDate).toLocaleDateString() },
    {
      key: 'status',
      name: 'Status',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { color: item.status === 'overdue' ? '#d13438' : '#107c10', fontWeight: FontWeights.semibold } }}>
          {item.status}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 120,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <TooltipHost content="View Details">
            <IconButton iconProps={{ iconName: 'View' }} onClick={() => { setSelectedBook(item.bookId); setShowDialog(true); }} />
          </TooltipHost>
          <TooltipHost content="Request Renewal">
            <IconButton iconProps={{ iconName: 'Refresh' }} onClick={() => handleRenew(item)} />
          </TooltipHost>
        </Stack>
      )
    }
  ];

  const historyColumns = [
    { key: 'title', name: 'Title', minWidth: 200, onRender: (item) => item.bookId?.title },
    { key: 'author', name: 'Author', minWidth: 150, onRender: (item) => item.bookId?.author },
    { key: 'type', name: 'Type', minWidth: 80, onRender: (item) => item.type },
    { key: 'date', name: 'Date', minWidth: 100, onRender: (item) => new Date(item.createdAt).toLocaleDateString() },
    { key: 'fine', name: 'Fine', minWidth: 80, onRender: (item) => item.fine ? `₹${item.fine}` : '-' }
  ];

  const wishlistColumns = [
    { key: 'title', name: 'Title', minWidth: 200, onRender: (item) => item.bookId?.title },
    { key: 'author', name: 'Author', minWidth: 150, onRender: (item) => item.bookId?.author },
    { key: 'category', name: 'Category', minWidth: 100, onRender: (item) => item.bookId?.category },
    {
      key: 'available',
      name: 'Available',
      minWidth: 80,
      onRender: (item) => (
        <Text styles={{ root: { color: item.bookId?.available > 0 ? '#107c10' : '#d13438', fontWeight: FontWeights.semibold } }}>
          {item.bookId?.available || 0}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 120,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <TooltipHost content="View Details">
            <IconButton iconProps={{ iconName: 'View' }} onClick={() => { setSelectedBook(item.bookId); setShowDialog(true); }} />
          </TooltipHost>
          <TooltipHost content="Remove">
            <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => handleRemoveFromWishlist(item._id)} />
          </TooltipHost>
        </Stack>
      )
    }
  ];

  const requestsColumns = [
    { key: 'title', name: 'Title', minWidth: 200, onRender: (item) => item.bookId?.title },
    { key: 'author', name: 'Author', minWidth: 150, onRender: (item) => item.bookId?.author },
    { key: 'date', name: 'Request Date', minWidth: 120, onRender: (item) => new Date(item.createdAt).toLocaleDateString() },
    {
      key: 'status',
      name: 'Status',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { 
          color: item.status === 'approved' ? '#107c10' : item.status === 'rejected' ? '#d13438' : '#0078d4',
          fontWeight: FontWeights.semibold 
        }}}>
          {item.status}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 100,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <TooltipHost content="View Details">
            <IconButton iconProps={{ iconName: 'View' }} onClick={() => { setSelectedBook(item.bookId); setShowDialog(true); }} />
          </TooltipHost>
          {item.status === 'pending' && (
            <TooltipHost content="Cancel Request">
              <IconButton iconProps={{ iconName: 'Cancel' }} onClick={() => handleCancelRequest(item._id)} />
            </TooltipHost>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        My Books
      </Text>

      <Pivot>
        <PivotItem headerText={`Issued Books (${issuedBooks.length})`}>
          <Stack tokens={{ childrenGap: 16 }} styles={{ root: { marginTop: 16 } }}>
            <DetailsList
              items={issuedBooks}
              columns={issuedColumns}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </PivotItem>

        <PivotItem headerText={`History (${history.length})`}>
          <Stack tokens={{ childrenGap: 16 }} styles={{ root: { marginTop: 16 } }}>
            <DetailsList
              items={history}
              columns={historyColumns}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </PivotItem>

        <PivotItem headerText={`Wishlist (${wishlist.length})`}>
          <Stack tokens={{ childrenGap: 16 }} styles={{ root: { marginTop: 16 } }}>
            <DetailsList
              items={wishlist}
              columns={wishlistColumns}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </PivotItem>

        <PivotItem headerText={`Requests (${requests.length})`}>
          <Stack tokens={{ childrenGap: 16 }} styles={{ root: { marginTop: 16 } }}>
            <DetailsList
              items={requests}
              columns={requestsColumns}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </PivotItem>
      </Pivot>

      <Dialog
        hidden={!showDialog}
        onDismiss={() => setShowDialog(false)}
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
          <DefaultButton onClick={() => setShowDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default MyBooks;