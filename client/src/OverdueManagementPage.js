import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  DefaultButton,
  FontWeights,
  SearchBox,
  Spinner,
  SpinnerSize,
  IconButton,
  ScrollablePane
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const OverdueManagementPage = ({ onBack }) => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [overdueBooks, searchValue]);

  const fetchOverdueBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/books/overdue', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOverdueBooks(data);
      } else {
        error('Failed to fetch overdue books');
      }
    } catch (err) {
      error('Failed to fetch overdue books');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = overdueBooks.filter(book => {
      const matchesSearch = !searchValue || 
        (book.bookId?.title || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        book.memberId.toLowerCase().includes(searchValue.toLowerCase());
      return matchesSearch;
    });
    setFilteredBooks(filtered);
  };

  const returnBook = async (bookId, memberId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ memberId })
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchOverdueBooks();
        const fineMessage = data.fine > 0 ? ` Fine: ₹${data.fine}` : '';
        success(`Book returned from member ${memberId}${fineMessage}`);
      } else {
        error(data.message || 'Failed to return book');
      }
    } catch (err) {
      error('Failed to return book');
    }
  };

  const columns = [
    {
      key: 'book',
      name: 'Book Information',
      minWidth: 250,
      onRender: (item) => (
        <Stack tokens={{ childrenGap: 4 }}>
          <Text styles={{ root: { fontSize: '14px', fontWeight: '600' } }}>
            {item.bookId?.title || 'Unknown Book'}
          </Text>
          <Text styles={{ root: { fontSize: '12px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            by {item.bookId?.author || 'Unknown Author'}
          </Text>
        </Stack>
      )
    },
    {
      key: 'member',
      name: 'Member ID',
      minWidth: 120,
      onRender: (item) => (
        <Text styles={{ root: { fontSize: '14px', fontFamily: 'monospace', fontWeight: '600' } }}>
          {item.memberId}
        </Text>
      )
    },
    {
      key: 'dueDate',
      name: 'Due Date',
      minWidth: 120,
      onRender: (item) => (
        <Text styles={{ root: { fontSize: '14px', color: '#d13438' } }}>
          {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      )
    },
    {
      key: 'overdueDays',
      name: 'Days Overdue',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { fontSize: '14px', color: '#d13438', fontWeight: '600' } }}>
          {item.overdueDays} days
        </Text>
      )
    },
    {
      key: 'fine',
      name: 'Current Fine',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { fontSize: '14px', color: '#d13438', fontWeight: '600' } }}>
          ₹{item.currentFine}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 100,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: 'ReturnToSession' }}
          title="Return Book"
          onClick={() => returnBook(item.bookId._id, item.memberId)}
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
      )
    }
  ];

  const totalFine = filteredBooks.reduce((sum, book) => sum + (book.currentFine || 0), 0);

  return (
    <ScrollablePane styles={{ root: { height: '100vh' } }}>
      <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
            Overdue Books Management
          </Text>
          <Text styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Manage and track overdue books with fine calculations
          </Text>
        </Stack>
        <DefaultButton
          text="Back to Books"
          iconProps={{ iconName: 'Back' }}
          onClick={onBack}
        />
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 24 }} wrap>
        <Stack styles={{ root: { background: isDark ? '#3b3a39' : '#ffffff', padding: '16px', borderRadius: '6px', border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`, textAlign: 'center', minWidth: '120px' } }}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '700', color: '#d13438' } }}>
            {filteredBooks.length}
          </Text>
          <Text styles={{ root: { fontSize: '12px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Overdue Books
          </Text>
        </Stack>
        <Stack styles={{ root: { background: isDark ? '#3b3a39' : '#ffffff', padding: '16px', borderRadius: '6px', border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`, textAlign: 'center', minWidth: '120px' } }}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '700', color: '#d13438' } }}>
            ₹{totalFine}
          </Text>
          <Text styles={{ root: { fontSize: '12px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Total Fines
          </Text>
        </Stack>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { marginBottom: 16 } }}>
        <SearchBox
          placeholder="Search by book title or member ID"
          value={searchValue}
          onChange={(_, value) => setSearchValue(value || '')}
          styles={{ root: { width: '300px' } }}
        />
        <DefaultButton
          text="Refresh"
          iconProps={{ iconName: 'Refresh' }}
          onClick={fetchOverdueBooks}
        />
      </Stack>

      <Text styles={{ root: { marginBottom: 8 } }}>
        Showing {filteredBooks.length} of {overdueBooks.length} overdue books
      </Text>
      
      {loading ? (
        <Stack horizontalAlign="center" styles={{ root: { padding: '40px' } }}>
          <Spinner size={SpinnerSize.large} label="Loading overdue books..." />
        </Stack>
      ) : (
        <DetailsList
          items={filteredBooks}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
      )}
    </Stack>
    </ScrollablePane>
  );
};

export default OverdueManagementPage;