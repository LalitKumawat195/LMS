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
  SearchBox,
  CommandBar
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import BooksManagement from './BooksManagement';

const LibrarianDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, warning, info } = useNotifications();
  const [selectedPivot, setSelectedPivot] = useState('circulation');
  const [searchValue, setSearchValue] = useState('');
  const [isBooksManagementOpen, setIsBooksManagementOpen] = useState(false);

  const [librarianData, setLibrarianData] = useState({
    todayIssues: 12,
    todayReturns: 8,
    overdueItems: 23,
    pendingReservations: 15,
    totalMembers: 456,
    activeMembers: 342
  });

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

  const pendingTransactions = [
    { key: '1', type: 'Issue', member: 'John Smith', book: 'React Handbook', time: '10:30 AM', priority: 'Normal' },
    { key: '2', type: 'Return', member: 'Sarah Johnson', book: 'Clean Code', time: '11:15 AM', priority: 'Overdue' },
    { key: '3', type: 'Renewal', member: 'Mike Davis', book: 'Design Patterns', time: '2:45 PM', priority: 'Normal' }
  ];

  const overdueItems = [
    { key: '1', member: 'Alice Brown', book: 'JavaScript Guide', dueDate: '2024-01-05', daysOverdue: 10, fine: 25.00 },
    { key: '2', member: 'Bob Wilson', book: 'Database Design', dueDate: '2024-01-08', daysOverdue: 7, fine: 17.50 }
  ];

  const transactionColumns = [
    { key: 'type', name: 'Type', fieldName: 'type', minWidth: 80 },
    { key: 'member', name: 'Member', fieldName: 'member', minWidth: 150 },
    { key: 'book', name: 'Book', fieldName: 'book', minWidth: 200 },
    { key: 'time', name: 'Time', fieldName: 'time', minWidth: 100 },
    { 
      key: 'action', 
      name: 'Action', 
      minWidth: 120,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton
            text="Process"
            onClick={() => success(`Processing ${item.type.toLowerCase()} for ${item.member}`)}
            styles={{ root: { minWidth: '70px' } }}
          />
          <IconButton
            iconProps={{ iconName: 'More' }}
            onClick={() => info(`More options for ${item.member}`)}
          />
        </Stack>
      )
    }
  ];

  const overdueColumns = [
    { key: 'member', name: 'Member', fieldName: 'member', minWidth: 150 },
    { key: 'book', name: 'Book', fieldName: 'book', minWidth: 200 },
    { key: 'dueDate', name: 'Due Date', fieldName: 'dueDate', minWidth: 100 },
    { key: 'daysOverdue', name: 'Days Overdue', fieldName: 'daysOverdue', minWidth: 100 },
    { 
      key: 'fine', 
      name: 'Fine', 
      minWidth: 80,
      onRender: (item) => (
        <Text styles={{ root: { color: '#d13438', fontWeight: FontWeights.semibold } }}>
          ${item.fine.toFixed(2)}
        </Text>
      )
    },
    { 
      key: 'action', 
      name: 'Action', 
      minWidth: 120,
      onRender: (item) => (
        <DefaultButton
          text="Send Notice"
          onClick={() => warning(`Overdue notice sent to ${item.member}`)}
          styles={{ root: { minWidth: '90px' } }}
        />
      )
    }
  ];

  const commandBarItems = [
    {
      key: 'issueBook',
      text: 'Issue Book',
      iconProps: { iconName: 'Add' },
      onClick: () => success('Opening book issue form...')
    },
    {
      key: 'returnBook',
      text: 'Return Book',
      iconProps: { iconName: 'Undo' },
      onClick: () => success('Opening book return form...')
    },
    {
      key: 'addMember',
      text: 'Add Member',
      iconProps: { iconName: 'AddFriend' },
      onClick: () => success('Opening member registration form...')
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 24 }} styles={{ root: { padding: '24px', maxWidth: '1400px', margin: '0 auto' } }}>
      {/* Header */}
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xxLarge" styles={{ 
          root: { 
            fontWeight: FontWeights.bold,
            background: 'linear-gradient(135deg, #107c10, #0b5394)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          } 
        }}>
          Librarian Dashboard
        </Text>
        <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Manage circulation, assist members, and maintain library operations.
        </Text>
      </Stack>

      {/* Quick Actions */}
      <CommandBar items={commandBarItems} />

      {/* Statistics Cards */}
      <Stack horizontal wrap tokens={{ childrenGap: 16 }}>
        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Today's Issues
              </Text>
              <Icon iconName="Add" styles={{ root: { color: '#107c10', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#107c10' } }}>
              {librarianData.todayIssues}
            </Text>
            <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
              Books issued today
            </Text>
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Today's Returns
              </Text>
              <Icon iconName="Undo" styles={{ root: { color: '#0078d4', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#0078d4' } }}>
              {librarianData.todayReturns}
            </Text>
            <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
              Books returned today
            </Text>
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
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#d13438' } }}>
              {librarianData.overdueItems}
            </Text>
            <Text variant="small" styles={{ root: { color: '#d13438' } }}>
              Require attention
            </Text>
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Active Members
              </Text>
              <Icon iconName="People" styles={{ root: { color: '#0078d4', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#0078d4' } }}>
              {librarianData.activeMembers}
            </Text>
            <ProgressIndicator 
              percentComplete={librarianData.activeMembers / librarianData.totalMembers}
              styles={{ progressBar: { backgroundColor: '#0078d4' } }}
            />
          </Stack>
        </div>
      </Stack>

      {/* Alerts */}
      {librarianData.overdueItems > 20 && (
        <MessageBar messageBarType={MessageBarType.severeWarning}>
          High number of overdue items ({librarianData.overdueItems}). Consider sending bulk reminders.
        </MessageBar>
      )}

      {/* Navigation */}
      <Pivot
        selectedKey={selectedPivot}
        onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
      >
        <PivotItem headerText="Circulation" itemKey="circulation" />
        <PivotItem headerText="Books Management" itemKey="books" />
        <PivotItem headerText="Overdue Management" itemKey="overdue" />
        <PivotItem headerText="Member Services" itemKey="members" />
        <PivotItem headerText="Reports" itemKey="reports" />
      </Pivot>

      {/* Content */}
      {selectedPivot === 'circulation' && (
        <Stack tokens={{ childrenGap: 16 }}>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Pending Transactions
            </Text>
            <SearchBox
              placeholder="Search transactions..."
              value={searchValue}
              onChange={(e, value) => setSearchValue(value || '')}
              styles={{ root: { width: '300px' } }}
            />
          </Stack>
          <div className={cardStyle}>
            <DetailsList
              items={pendingTransactions}
              columns={transactionColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          </div>
        </Stack>
      )}

      {selectedPivot === 'books' && (
        <BooksManagement />
      )}

      {selectedPivot === 'overdue' && (
        <div style={{
          padding: '64px 32px',
          textAlign: 'center',
          background: isDark ? '#323130' : '#ffffff',
          border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
          borderRadius: '8px'
        }}>
          <Stack tokens={{ childrenGap: 24 }} horizontalAlign="center">
            <Icon iconName="Warning" styles={{ root: { fontSize: '48px', color: isDark ? '#605e5c' : '#a19f9d' } }} />
            <Stack tokens={{ childrenGap: 8 }} horizontalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: isDark ? '#ffffff' : '#323130' } }}>
                Overdue Management
              </Text>
              <Text variant="large" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c', maxWidth: '400px' } }}>
                Coming Soon
              </Text>
            </Stack>
            <Text variant="medium" styles={{ root: { color: isDark ? '#a19f9d' : '#8a8886', maxWidth: '500px', lineHeight: '1.5' } }}>
              Comprehensive overdue items management system with automated notifications and fine tracking capabilities.
            </Text>
          </Stack>
        </div>
      )}

      {selectedPivot === 'members' && (
        <div style={{
          padding: '64px 32px',
          textAlign: 'center',
          background: isDark ? '#323130' : '#ffffff',
          border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
          borderRadius: '8px'
        }}>
          <Stack tokens={{ childrenGap: 24 }} horizontalAlign="center">
            <Icon iconName="AddFriend" styles={{ root: { fontSize: '48px', color: isDark ? '#605e5c' : '#a19f9d' } }} />
            <Stack tokens={{ childrenGap: 8 }} horizontalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: isDark ? '#ffffff' : '#323130' } }}>
                Member Services
              </Text>
              <Text variant="large" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c', maxWidth: '400px' } }}>
                Coming Soon
              </Text>
            </Stack>
            <Text variant="medium" styles={{ root: { color: isDark ? '#a19f9d' : '#8a8886', maxWidth: '500px', lineHeight: '1.5' } }}>
              Complete member management system with registration, directory, and comprehensive member service tools.
            </Text>
          </Stack>
        </div>
      )}

      {selectedPivot === 'reports' && (
        <div style={{
          padding: '64px 32px',
          textAlign: 'center',
          background: isDark ? '#323130' : '#ffffff',
          border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
          borderRadius: '8px'
        }}>
          <Stack tokens={{ childrenGap: 24 }} horizontalAlign="center">
            <Icon iconName="BarChart4" styles={{ root: { fontSize: '48px', color: isDark ? '#605e5c' : '#a19f9d' } }} />
            <Stack tokens={{ childrenGap: 8 }} horizontalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: isDark ? '#ffffff' : '#323130' } }}>
                Reports
              </Text>
              <Text variant="large" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c', maxWidth: '400px' } }}>
                Coming Soon
              </Text>
            </Stack>
            <Text variant="medium" styles={{ root: { color: isDark ? '#a19f9d' : '#8a8886', maxWidth: '500px', lineHeight: '1.5' } }}>
              Comprehensive reporting system with circulation statistics, analytics, and detailed library operation reports.
            </Text>
          </Stack>
        </div>
      )}
    </Stack>
  );
};

export default LibrarianDashboard;