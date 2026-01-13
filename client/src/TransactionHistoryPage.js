import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  DefaultButton,
  PrimaryButton,
  FontWeights,
  SearchBox,
  Dropdown,
  Icon,
  Spinner,
  SpinnerSize,
  ScrollablePane
} from '@fluentui/react';
import { useTheme } from './ThemeContext';

const TransactionHistoryPage = ({ onBack }) => {
  const { isDark } = useTheme();
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactionHistory, searchValue, statusFilter, typeFilter]);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/books/transactions/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactionHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = transactionHistory.filter(transaction => {
      const matchesSearch = !searchValue || 
        (transaction.bookId?.title || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        transaction.memberId.toLowerCase().includes(searchValue.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || transaction.status === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'All' || transaction.type === typeFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredTransactions(filtered);
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
      key: 'type',
      name: 'Type',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{
          root: {
            fontSize: '14px',
            color: item.type === 'issue' ? '#0078d4' : '#107c10',
            fontWeight: '600',
            textTransform: 'capitalize'
          }
        }}>
          {item.type}
        </Text>
      )
    },
    {
      key: 'date',
      name: 'Date',
      minWidth: 120,
      onRender: (item) => (
        <Text styles={{ root: { fontSize: '14px' } }}>
          {new Date(item.createdAt || item.issueDate).toLocaleDateString()}
        </Text>
      )
    },
    {
      key: 'dueDate',
      name: 'Due Date',
      minWidth: 120,
      onRender: (item) => (
        <Text styles={{ root: { fontSize: '14px', color: item.type === 'issue' && item.dueDate ? (new Date() > new Date(item.dueDate) ? '#d13438' : '#605e5c') : '#a19f9d' } }}>
          {item.type === 'issue' && item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
        </Text>
      )
    },
    {
      key: 'fine',
      name: 'Fine',
      minWidth: 80,
      onRender: (item) => {
        let displayFine = item.fine || 0;
        // Calculate current fine for overdue active transactions
        if (item.status === 'overdue' && item.type === 'issue' && item.dueDate) {
          const overdueDays = Math.ceil((new Date() - new Date(item.dueDate)) / (1000 * 60 * 60 * 24));
          displayFine = overdueDays * 10;
        }
        return (
          <Text styles={{ root: { fontSize: '14px', color: displayFine > 0 ? '#d13438' : '#605e5c', fontWeight: displayFine > 0 ? '600' : '400' } }}>
            ₹{displayFine}
          </Text>
        );
      }
    },
    {
      key: 'status',
      name: 'Status',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{
          root: {
            fontSize: '14px',
            color: item.status === 'active' ? '#d13438' : '#107c10',
            fontWeight: '600',
            textTransform: 'capitalize'
          }
        }}>
          {item.status}
        </Text>
      )
    },
    {
      key: 'librarian',
      name: 'Processed By',
      minWidth: 140,
      onRender: (item) => (
        <Text styles={{ root: { fontSize: '14px' } }}>
          {item.processedBy?.name || 'System'}
        </Text>
      )
    }
  ];

  const activeCount = transactionHistory.filter(t => t.status === 'active').length;
  const returnedCount = transactionHistory.filter(t => t.status === 'returned').length;
  const overdueCount = transactionHistory.filter(t => 
    t.status === 'active' && t.dueDate && new Date() > new Date(t.dueDate)
  ).length;

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20, height: '100%', overflow: 'auto' } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
            Transaction History
          </Text>
          <Text styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Complete record of all book transactions and activities
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
          <Text styles={{ root: { fontSize: '24px', fontWeight: '700', color: '#0078d4' } }}>
            {activeCount}
          </Text>
          <Text styles={{ root: { fontSize: '12px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Active Issues
          </Text>
        </Stack>
        <Stack styles={{ root: { background: isDark ? '#3b3a39' : '#ffffff', padding: '16px', borderRadius: '6px', border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`, textAlign: 'center', minWidth: '120px' } }}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '700', color: '#107c10' } }}>
            {returnedCount}
          </Text>
          <Text styles={{ root: { fontSize: '12px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Returned
          </Text>
        </Stack>
        <Stack styles={{ root: { background: isDark ? '#3b3a39' : '#ffffff', padding: '16px', borderRadius: '6px', border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`, textAlign: 'center', minWidth: '120px' } }}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '700', color: '#d13438' } }}>
            {overdueCount}
          </Text>
          <Text styles={{ root: { fontSize: '12px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Overdue
          </Text>
        </Stack>
        <Stack styles={{ root: { background: isDark ? '#3b3a39' : '#ffffff', padding: '16px', borderRadius: '6px', border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`, textAlign: 'center', minWidth: '120px' } }}>
          <Text styles={{ root: { fontSize: '24px', fontWeight: '700', color: isDark ? '#ffffff' : '#323130' } }}>
            {transactionHistory.length}
          </Text>
          <Text styles={{ root: { fontSize: '12px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Total
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
        <Dropdown
          placeholder="Filter by Status"
          options={[
            { key: 'All', text: 'All Status' },
            { key: 'Active', text: 'Active' },
            { key: 'Returned', text: 'Returned' }
          ]}
          selectedKey={statusFilter}
          onChange={(_, option) => setStatusFilter(option?.key || 'All')}
          styles={{ root: { width: '150px' } }}
        />
        <Dropdown
          placeholder="Filter by Type"
          options={[
            { key: 'All', text: 'All Types' },
            { key: 'Issue', text: 'Issue' },
            { key: 'Return', text: 'Return' }
          ]}
          selectedKey={typeFilter}
          onChange={(_, option) => setTypeFilter(option?.key || 'All')}
          styles={{ root: { width: '150px' } }}
        />
        <DefaultButton
          text="Clear Filters"
          iconProps={{ iconName: 'ClearFilter' }}
          onClick={() => {
            setSearchValue('');
            setStatusFilter('All');
            setTypeFilter('All');
          }}
        />
        <DefaultButton
          text="Export CSV"
          iconProps={{ iconName: 'Download' }}
          onClick={() => {
            const csvData = filteredTransactions.map(t => 
              `"${t.bookId?.title || 'Unknown'}","${t.memberId}","${t.type}","${new Date(t.createdAt).toLocaleDateString()}","${t.status}"`
            ).join('\n');
            const blob = new Blob([`"Book Title","Member ID","Type","Date","Status"\n${csvData}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transaction-history.csv';
            a.click();
          }}
        />
      </Stack>

      <Text styles={{ root: { marginBottom: 8 } }}>
        Showing {filteredTransactions.length} of {transactionHistory.length} transactions
      </Text>
      
      {loading ? (
        <Stack horizontalAlign="center" styles={{ root: { padding: '40px' } }}>
          <Spinner size={SpinnerSize.large} label="Loading transactions..." />
        </Stack>
      ) : (
        <Stack styles={{ root: { height: 'auto', overflow: 'visible' } }}>
          <DetailsList
            items={filteredTransactions}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            isHeaderVisible={true}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default TransactionHistoryPage;