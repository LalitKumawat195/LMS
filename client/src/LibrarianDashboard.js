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
  CommandBar,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  DatePicker,
  ComboBox
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import BooksManagement from './BooksManagement';
import OverdueManagement from './OverdueManagement';
import AdvancedOverdueManagement from './AdvancedOverdueManagement';
import MemberPortal from './MemberPortal';

import ComprehensiveMemberServices from './ComprehensiveMemberServices';
import LibrarianUserManagement from './LibrarianUserManagement';
import CirculationManagement from './CirculationManagement';
import ComprehensiveReports from './ComprehensiveReports';

const LibrarianDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, warning, info } = useNotifications();
  const [selectedPivot, setSelectedPivot] = useState('circulation');
  const [searchValue, setSearchValue] = useState('');
  const [isBooksManagementOpen, setIsBooksManagementOpen] = useState(false);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issueForm, setIssueForm] = useState({
    memberId: '',
    bookId: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  const [returnForm, setReturnForm] = useState({
    transactionId: ''
  });

  const [librarianData, setLibrarianData] = useState({
    todayIssues: 12,
    todayReturns: 8,
    overdueItems: 23,
    pendingReservations: 15,
    totalMembers: 456,
    activeMembers: 342
  });

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        fetch('http://localhost:5000/api/books', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.filter(m => m.role === 'Member'));
      }
    } catch (err) {
      console.error('Failed to load library data:', err);
    }
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
      onClick: () => setIsIssueDialogOpen(true)
    },
    {
      key: 'returnBook',
      text: 'Return Book',
      iconProps: { iconName: 'Undo' },
      onClick: () => setIsReturnDialogOpen(true)
    },
    {
      key: 'addMember',
      text: 'Add Member',
      iconProps: { iconName: 'AddFriend' },
      onClick: () => info('Member registration feature coming soon')
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
        <PivotItem headerText="Member Management" itemKey="memberManagement" />
        <PivotItem headerText="Overdue Management" itemKey="overdue" />
        <PivotItem headerText="Advanced Analytics" itemKey="analytics" />
        <PivotItem headerText="Reports" itemKey="reports" />
      </Pivot>

      {/* Content */}
      {selectedPivot === 'circulation' && (
        <CirculationManagement />
      )}

      {selectedPivot === 'books' && (
        <BooksManagement />
      )}

      {selectedPivot === 'memberManagement' && (
        <LibrarianUserManagement />
      )}

      {selectedPivot === 'overdue' && (
        <OverdueManagement />
      )}

      {selectedPivot === 'analytics' && (
        <AdvancedOverdueManagement />
      )}

      {selectedPivot === 'reports' && (
        <ComprehensiveReports />
      )}

      {/* Issue Book Dialog */}
      <Dialog
        hidden={!isIssueDialogOpen}
        onDismiss={() => setIsIssueDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Issue Book',
          subText: 'Select member and book to issue'
        }}
        minWidth={400}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <ComboBox
            label="Select Member"
            options={members.map(m => ({ key: m._id, text: `${m.name} (${m.email})` }))}
            selectedKey={issueForm.memberId}
            onChange={(e, option) => setIssueForm({...issueForm, memberId: option.key})}
            placeholder="Search and select a member"
            allowFreeform={false}
            autoComplete="on"
            useComboBoxAsMenuWidth
            dropdownMaxWidth={400}
          />
          <ComboBox
            label="Select Book"
            options={books.map(b => ({ key: b._id, text: `${b.title} - ${b.author} (${b.availableCopies || 0} available)` }))}
            selectedKey={issueForm.bookId}
            onChange={(e, option) => setIssueForm({...issueForm, bookId: option.key})}
            placeholder="Search and select a book"
            allowFreeform={false}
            autoComplete="on"
            useComboBoxAsMenuWidth
            dropdownMaxWidth={400}
          />
          <DatePicker
            label="Due Date"
            value={issueForm.dueDate}
            onSelectDate={(date) => setIssueForm({...issueForm, dueDate: date})}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton 
            onClick={async () => {
              if (!issueForm.memberId || !issueForm.bookId) {
                warning('Please select both member and book');
                return;
              }
              
              try {
                console.log('Issue form data:', issueForm);
                const response = await fetch('http://localhost:5000/api/transactions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({
                    bookId: issueForm.bookId,
                    memberId: issueForm.memberId,
                    type: 'issue',
                    dueDate: issueForm.dueDate,
                    processedBy: user._id
                  })
                });
                console.log('Response status:', response.status);
                const responseData = await response.json();
                console.log('Response data:', responseData);
                
                if (response.ok) {
                  success('Book issued successfully');
                  setIsIssueDialogOpen(false);
                  setIssueForm({ memberId: '', bookId: '', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
                } else {
                  warning(`Failed to issue book: ${responseData.message || 'Unknown error'}`);
                }
              } catch (err) {
                console.error('Issue book error:', err);
                warning(`Failed to issue book: ${err.message}`);
              }
            }} 
            text="Issue Book" 
          />
          <DefaultButton onClick={() => setIsIssueDialogOpen(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Return Book Dialog */}
      <Dialog
        hidden={!isReturnDialogOpen}
        onDismiss={() => setIsReturnDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Return Book',
          subText: 'Process book return'
        }}
        minWidth={400}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <TextField 
            label="Transaction ID" 
            placeholder="Enter transaction ID" 
            value={returnForm.transactionId}
            onChange={(e, value) => setReturnForm({...returnForm, transactionId: value || ''})}
          />
          <TextField label="Fine Amount (₹)" value="0" type="number" readOnly />
        </Stack>
        <DialogFooter>
          <PrimaryButton 
            onClick={async () => {
              try {
                const response = await fetch(`http://localhost:5000/api/transactions/${returnForm.transactionId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({
                    type: 'return',
                    processedBy: user._id
                  })
                });
                if (response.ok) {
                  success('Book returned successfully');
                  setIsReturnDialogOpen(false);
                  setReturnForm({ transactionId: '' });
                } else {
                  warning('Failed to return book');
                }
              } catch (err) {
                warning('Failed to return book');
              }
            }} 
            text="Return Book" 
          />
          <DefaultButton onClick={() => setIsReturnDialogOpen(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default LibrarianDashboard;