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
  CommandBar,
  Dropdown,
  Dialog,
  DialogType,
  DialogFooter
} from '@fluentui/react';
import { useNotifications } from './NotificationContext';

const Dashboard = () => {
  const { success } = useNotifications();
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeIssues: 0,
    overdueBooks: 0,
    totalFines: 0
  });

  useEffect(() => {
    const savedBooks = localStorage.getItem('lms_books');
    const savedMembers = localStorage.getItem('lms_members');
    const savedTransactions = localStorage.getItem('lms_transactions');
    
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  useEffect(() => {
    const activeIssues = transactions.filter(t => t.status === 'active');
    const overdueBooks = activeIssues.filter(t => new Date() > new Date(t.dueDate));
    const totalFines = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);

    setStats({
      totalBooks: books.length,
      totalMembers: members.length,
      activeIssues: activeIssues.length,
      overdueBooks: overdueBooks.length,
      totalFines
    });
  }, [books, members, transactions]);

  const overdueTransactions = transactions.filter(t => 
    t.status === 'active' && new Date() > new Date(t.dueDate)
  );

  const popularBooks = books
    .filter(book => book.issued > 0)
    .sort((a, b) => (b.issued || 0) - (a.issued || 0))
    .slice(0, 5);

  const overdueColumns = [
    { key: 'bookTitle', name: 'Book', fieldName: 'bookTitle', minWidth: 200 },
    { key: 'memberId', name: 'Member ID', fieldName: 'memberId', minWidth: 100 },
    { key: 'memberName', name: 'Member', fieldName: 'memberName', minWidth: 150 },
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
      onRender: (item) => Math.ceil((new Date() - new Date(item.dueDate)) / (1000 * 60 * 60 * 24))
    }
  ];

  const popularColumns = [
    { key: 'title', name: 'Book Title', fieldName: 'title', minWidth: 200 },
    { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
    { key: 'issued', name: 'Times Issued', fieldName: 'issued', minWidth: 100 }
  ];

  const commandBarItems = [
    {
      key: 'refresh',
      text: 'Refresh Data',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        window.location.reload();
        success('Data refreshed');
      }
    },
    {
      key: 'export',
      text: 'Export Report',
      iconProps: { iconName: 'Download' },
      onClick: () => {
        const report = {
          date: new Date().toISOString(),
          stats,
          overdueBooks: overdueTransactions,
          popularBooks
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LMS_Report_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        success('Report exported');
      }
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Library Dashboard
      </Text>

      <CommandBar items={commandBarItems} />

      {/* Statistics Cards */}
      <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
        <Stack styles={{ root: { padding: 20, minWidth: 200, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
          <Text variant="large" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold } }}>
            {stats.totalBooks}
          </Text>
          <Text>Total Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 20, minWidth: 200, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
          <Text variant="large" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold } }}>
            {stats.totalMembers}
          </Text>
          <Text>Total Members</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 20, minWidth: 200, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
          <Text variant="large" styles={{ root: { color: '#ff8c00', fontWeight: FontWeights.bold } }}>
            {stats.activeIssues}
          </Text>
          <Text>Active Issues</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 20, minWidth: 200, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {stats.overdueBooks}
          </Text>
          <Text>Overdue Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 20, minWidth: 200, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
          <Text variant="large" styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.bold } }}>
            ${stats.totalFines}
          </Text>
          <Text>Total Fines</Text>
        </Stack>
      </Stack>

      {/* Overdue Books */}
      <Stack tokens={{ childrenGap: 10 }}>
        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Overdue Books ({overdueTransactions.length})
        </Text>
        <DetailsList
          items={overdueTransactions}
          columns={overdueColumns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </Stack>

      {/* Popular Books */}
      <Stack tokens={{ childrenGap: 10 }}>
        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Most Popular Books
        </Text>
        <DetailsList
          items={popularBooks}
          columns={popularColumns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </Stack>
    </Stack>
  );
};

export default Dashboard;