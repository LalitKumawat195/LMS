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
  ProgressIndicator,
  MessageBar,
  MessageBarType,
  mergeStyles,
  FontWeights,
  Icon,
  IconButton,
  SearchBox
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import BrowseBooks from './BrowseBooks';
import MyBooks from './MyBooks';
import Reservations from './Reservations';
import History from './History';
import MyRequests from './MyRequests';

const MemberDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, info } = useNotifications();
  const [selectedPivot, setSelectedPivot] = useState('browse');
  const [searchValue, setSearchValue] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    borrowedBooks: 0,
    maxBooks: 5,
    overdueBooks: 0,
    fines: 0
  });

  const [memberData, setMemberData] = useState({
    borrowedBooks: 3,
    maxBooks: 5,
    overdueBooks: 1,
    fines: 15.50,
    reservedBooks: 2
  });

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/my-stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchStats();
    success('Data refreshed');
  };

  const cardStyle = mergeStyles({
    background: isDark ? '#323130' : '#ffffff',
    border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
    borderRadius: '8px',
    padding: '20px',
    boxShadow: isDark 
      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 4px 16px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: isDark 
        ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
        : '0 8px 24px rgba(0, 0, 0, 0.08)'
    }
  });

  const borrowedBooks = [
    { key: '1', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', dueDate: '2024-01-15', status: 'Active' },
    { key: '2', title: 'Clean Code', author: 'Robert Martin', dueDate: '2024-01-10', status: 'Overdue' },
    { key: '3', title: 'Design Patterns', author: 'Gang of Four', dueDate: '2024-01-20', status: 'Active' }
  ];

  const availableBooks = [
    { key: '1', title: 'React in Action', author: 'Mark Thomas', category: 'Programming', available: true },
    { key: '2', title: 'Node.js Design Patterns', author: 'Mario Casciaro', category: 'Programming', available: true },
    { key: '3', title: 'Database Systems', author: 'Ramez Elmasri', category: 'Computer Science', available: false }
  ];

  const bookColumns = [
    { key: 'title', name: 'Title', fieldName: 'title', minWidth: 200 },
    { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
    { key: 'dueDate', name: 'Due Date', fieldName: 'dueDate', minWidth: 100 },
    { 
      key: 'status', 
      name: 'Status', 
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{
          root: {
            color: item.status === 'Overdue' ? '#d13438' : '#107c10',
            fontWeight: FontWeights.semibold
          }
        }}>
          {item.status}
        </Text>
      )
    }
  ];

  const browseColumns = [
    { key: 'title', name: 'Title', fieldName: 'title', minWidth: 200 },
    { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
    { key: 'category', name: 'Category', fieldName: 'category', minWidth: 120 },
    { 
      key: 'action', 
      name: 'Action', 
      minWidth: 100,
      onRender: (item) => (
        <PrimaryButton
          text={item.available ? 'Borrow' : 'Reserve'}
          disabled={!item.available && memberData.reservedBooks >= 3}
          onClick={() => success(`${item.available ? 'Borrowed' : 'Reserved'}: ${item.title}`)}
          styles={{ root: { minWidth: '80px' } }}
        />
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 24 }} styles={{ root: { padding: '24px', maxWidth: '1200px', margin: '0 auto' } }}>
      {/* Header */}
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack tokens={{ childrenGap: 8 }}>
          <Text variant="xxLarge" styles={{ 
            root: { 
              fontWeight: FontWeights.bold,
              background: 'linear-gradient(135deg, #0078d4, #106ebe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            } 
          }}>
            My Library
          </Text>
          <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Welcome back, {user?.name}! Manage your books and explore our collection.
          </Text>
        </Stack>
        <IconButton
          iconProps={{ iconName: 'Refresh' }}
          title="Refresh"
          onClick={handleRefresh}
          styles={{ root: { fontSize: '20px' } }}
        />
      </Stack>

      {/* Account Status Cards */}
      <Stack horizontal wrap tokens={{ childrenGap: 16 }}>
        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Books Borrowed
              </Text>
              <Icon iconName="BookAnswers" styles={{ root: { color: '#0078d4', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#0078d4' } }}>
              {stats.borrowedBooks}/{stats.maxBooks}
            </Text>
            <ProgressIndicator 
              percentComplete={stats.borrowedBooks / stats.maxBooks}
              styles={{ progressBar: { backgroundColor: '#0078d4' } }}
            />
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Overdue Items
              </Text>
              <Icon iconName="Warning" styles={{ root: { color: '#d13438', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ 
              root: { 
                fontWeight: FontWeights.bold, 
                color: stats.overdueBooks > 0 ? '#d13438' : '#107c10' 
              } 
            }}>
              {stats.overdueBooks}
            </Text>
            {stats.overdueBooks > 0 && (
              <Text variant="small" styles={{ root: { color: '#d13438' } }}>
                Please return immediately
              </Text>
            )}
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Outstanding Fines
              </Text>
              <Icon iconName="Money" styles={{ root: { color: '#d13438', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ 
              root: { 
                fontWeight: FontWeights.bold, 
                color: stats.fines > 0 ? '#d13438' : '#107c10' 
              } 
            }}>
              ₹{stats.fines.toFixed(2)}
            </Text>
            {stats.fines > 0 && (
              <DefaultButton 
                text="Pay Now" 
                onClick={() => info('Redirecting to payment portal...')}
                styles={{ root: { marginTop: '8px' } }}
              />
            )}
          </Stack>
        </div>
      </Stack>

      {/* Alerts */}
      {stats.overdueBooks > 0 && (
        <MessageBar messageBarType={MessageBarType.warning}>
          You have {stats.overdueBooks} overdue book(s). Please return them to avoid additional fines.
        </MessageBar>
      )}

      {/* Navigation */}
      <Pivot
        selectedKey={selectedPivot}
        onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
      >
        <PivotItem headerText="Browse Books" itemKey="browse" />
        <PivotItem headerText="My Books" itemKey="borrowed" />
        <PivotItem headerText="My Requests" itemKey="requests" />
        <PivotItem headerText="Reservations" itemKey="reservations" />
        <PivotItem headerText="History" itemKey="history" />
      </Pivot>

      {/* Content */}
      {selectedPivot === 'browse' && <BrowseBooks key={`browse-${refreshKey}`} />}

      {selectedPivot === 'borrowed' && <MyBooks key={`mybooks-${refreshKey}`} />}

      {selectedPivot === 'requests' && <MyRequests key={`requests-${refreshKey}`} />}

      {selectedPivot === 'reservations' && <Reservations key={`reservations-${refreshKey}`} />}

      {selectedPivot === 'history' && <History key={`history-${refreshKey}`} />}
    </Stack>
  );
};

export default MemberDashboard;