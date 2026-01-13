import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  FontWeights,
  PrimaryButton,
  DefaultButton,
  CommandBar
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const MemberPortal = () => {
  const { user } = useAuth();
  const { success, error } = useNotifications();
  const [activeBooks, setActiveBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [totalFines, setTotalFines] = useState(0);
  const [booksRead, setBooksRead] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [user]);

  const fetchMemberData = async () => {
    try {
      // Fetch member's transactions from backend
      const response = await fetch('http://localhost:5000/api/books/transactions/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const allTransactions = await response.json();
        const memberTransactions = allTransactions.filter(t => t.memberId === user.memberId);
        
        // Active books (currently issued)
        const active = memberTransactions.filter(t => 
          t.type === 'issue' && t.status === 'active'
        );
        setActiveBooks(active);
        
        // Overdue books (fetch from overdue endpoint)
        const overdueResponse = await fetch('http://localhost:5000/api/books/overdue', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (overdueResponse.ok) {
          const allOverdue = await overdueResponse.json();
          const memberOverdue = allOverdue.filter(t => t.memberId === user.memberId);
          setOverdueBooks(memberOverdue);
          
          // Calculate total fines
          const fines = memberOverdue.reduce((sum, book) => sum + (book.currentFine || 0), 0);
          setTotalFines(fines);
        }
        
        // Books read (returned transactions)
        const returned = memberTransactions.filter(t => 
          t.type === 'return' || t.status === 'returned'
        );
        setBooksRead(returned.length);
      }
    } catch (err) {
      console.error('Error fetching member data:', err);
      error('Failed to load member data');
    }
  };

  const requestRenewal = async (transaction) => {
    try {
      // Create a renewal request notification to librarian
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: 'LIBRARIAN', // This would be the librarian's ID in a real system
          title: 'Book Renewal Request',
          message: `Member ${user.name} (${user.memberId}) requests renewal for "${transaction.bookId?.title || 'Unknown Book'}" due on ${new Date(transaction.dueDate).toLocaleDateString()}`,
          category: 'renewal',
          type: 'info',
          priority: 'normal'
        })
      });
      
      if (response.ok) {
        success(`Renewal requested for "${transaction.bookId?.title || 'Unknown Book'}". Librarian will review your request.`);
      } else {
        error('Failed to submit renewal request');
      }
    } catch (err) {
      error('Failed to request renewal');
    }
  };

  const commandBarItems = [
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        fetchMemberData();
        success('Data refreshed');
      }
    }
  ];

  const activeColumns = [
    { 
      key: 'bookTitle', 
      name: 'Book Title', 
      minWidth: 200,
      onRender: (item) => item.bookId?.title || 'Unknown Book'
    },
    { 
      key: 'issueDate', 
      name: 'Issue Date', 
      minWidth: 100,
      onRender: (item) => new Date(item.issueDate).toLocaleDateString()
    },
    { 
      key: 'dueDate', 
      name: 'Due Date', 
      minWidth: 100,
      onRender: (item) => new Date(item.dueDate).toLocaleDateString()
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 150,
      onRender: (item) => (
        <DefaultButton
          text="Request Renewal"
          onClick={() => requestRenewal(item)}
        />
      )
    }
  ];

  const overdueColumns = [
    { 
      key: 'bookTitle', 
      name: 'Book Title', 
      minWidth: 200,
      onRender: (item) => item.bookId?.title || 'Unknown Book'
    },
    { 
      key: 'dueDate', 
      name: 'Due Date', 
      minWidth: 100,
      onRender: (item) => new Date(item.dueDate).toLocaleDateString()
    },
    {
      key: 'daysOverdue',
      name: 'Days Overdue',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { color: '#d13438', fontWeight: FontWeights.semibold } }}>
          {item.overdueDays || 0}
        </Text>
      )
    },
    {
      key: 'fine',
      name: 'Fine Amount',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.semibold } }}>
          ₹{item.currentFine || 0}
        </Text>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Member Portal - {user?.name || 'Member'}
      </Text>

      <CommandBar items={commandBarItems} />

      {/* Summary Cards */}
      <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold } }}>
            {activeBooks.length}
          </Text>
          <Text>Active Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {overdueBooks.length}
          </Text>
          <Text>Overdue Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold } }}>
            {booksRead}
          </Text>
          <Text>Books Read</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.bold } }}>
            ₹{totalFines.toFixed(2)}
          </Text>
          <Text>Total Fines</Text>
        </Stack>
      </Stack>

      {/* Overdue Books Alert */}
      {overdueBooks.length > 0 && (
        <Stack tokens={{ childrenGap: 10 }}>
          <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: '#d13438' } }}>
            ⚠️ Overdue Books - Please Return Immediately
          </Text>
          <DetailsList
            items={overdueBooks}
            columns={overdueColumns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        </Stack>
      )}

      {/* Active Books */}
      <Stack tokens={{ childrenGap: 10 }}>
        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Currently Issued Books
        </Text>
        {activeBooks.length > 0 ? (
          <DetailsList
            items={activeBooks}
            columns={activeColumns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        ) : (
          <Text styles={{ root: { fontStyle: 'italic', color: '#666', padding: 20, textAlign: 'center' } }}>
            No books currently issued
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default MemberPortal;