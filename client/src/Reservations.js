import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  SelectionMode,
  FontWeights,
  IconButton,
  TooltipHost,
  Dialog,
  DialogFooter,
  DefaultButton
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const Reservations = () => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [reservations, setReservations] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (err) {
      error('Failed to load reservations');
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        success('Reservation cancelled');
        fetchReservations();
      }
    } catch (err) {
      error('Failed to cancel reservation');
    }
  };

  const columns = [
    { key: 'title', name: 'Title', minWidth: 200, onRender: (item) => item.bookId?.title },
    { key: 'author', name: 'Author', minWidth: 150, onRender: (item) => item.bookId?.author },
    { key: 'category', name: 'Category', minWidth: 100, onRender: (item) => item.bookId?.category },
    { key: 'date', name: 'Reserved On', minWidth: 120, onRender: (item) => new Date(item.createdAt).toLocaleDateString() },
    {
      key: 'status',
      name: 'Status',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { 
          color: item.status === 'ready' ? '#107c10' : item.status === 'cancelled' ? '#d13438' : '#0078d4',
          fontWeight: FontWeights.semibold 
        }}}>
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
          {(item.status === 'pending' || item.status === 'ready') && (
            <TooltipHost content="Cancel Reservation">
              <IconButton iconProps={{ iconName: 'Cancel' }} onClick={() => handleCancel(item._id)} />
            </TooltipHost>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        My Reservations
      </Text>

      <DetailsList
        items={reservations}
        columns={columns}
        selectionMode={SelectionMode.none}
      />

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

export default Reservations;