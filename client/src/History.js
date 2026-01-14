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
  DefaultButton,
  Dropdown
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const History = () => {
  const { isDark } = useTheme();
  const { error } = useNotifications();
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

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

  const filteredHistory = history.filter(item => 
    filterType === 'All' || item.type === filterType.toLowerCase()
  );

  const columns = [
    { key: 'title', name: 'Title', minWidth: 200, onRender: (item) => item.bookId?.title },
    { key: 'author', name: 'Author', minWidth: 150, onRender: (item) => item.bookId?.author },
    { 
      key: 'type', 
      name: 'Type', 
      minWidth: 80, 
      onRender: (item) => (
        <Text styles={{ root: { textTransform: 'capitalize', fontWeight: FontWeights.semibold } }}>
          {item.type}
        </Text>
      )
    },
    { 
      key: 'date', 
      name: 'Date', 
      minWidth: 120, 
      onRender: (item) => new Date(item.createdAt).toLocaleDateString() 
    },
    { 
      key: 'dueDate', 
      name: 'Due Date', 
      minWidth: 120, 
      onRender: (item) => item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'
    },
    { 
      key: 'fine', 
      name: 'Fine', 
      minWidth: 80, 
      onRender: (item) => item.fine ? `₹${item.fine}` : '-'
    },
    {
      key: 'status',
      name: 'Status',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { 
          color: item.status === 'returned' ? '#107c10' : item.status === 'overdue' ? '#d13438' : '#0078d4',
          fontWeight: FontWeights.semibold,
          textTransform: 'capitalize'
        }}}>
          {item.status}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 80,
      onRender: (item) => (
        <TooltipHost content="View Details">
          <IconButton 
            iconProps={{ iconName: 'View' }} 
            onClick={() => { 
              setSelectedBook(item.bookId); 
              setShowDialog(true); 
            }} 
          />
        </TooltipHost>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          Transaction History
        </Text>
        <Dropdown
          placeholder="Filter by type"
          options={[
            { key: 'All', text: 'All' },
            { key: 'Issue', text: 'Issue' },
            { key: 'Return', text: 'Return' },
            { key: 'Renew', text: 'Renew' }
          ]}
          selectedKey={filterType}
          onChange={(_, option) => setFilterType(option.key)}
          styles={{ root: { width: 150 } }}
        />
      </Stack>

      <Text variant="medium">
        Showing {filteredHistory.length} of {history.length} transactions
      </Text>

      <DetailsList
        items={filteredHistory}
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
          </Stack>
        )}
        <DialogFooter>
          <DefaultButton onClick={() => setShowDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default History;
