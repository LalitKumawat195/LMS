import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  TextField,
  DetailsList,
  SelectionMode,
  MessageBar,
  MessageBarType,
  mergeStyles,
  FontWeights,
  Icon,
  Pivot,
  PivotItem,
  SearchBox,
  CommandBar,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  DatePicker
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

const CirculationManagement = () => {
  const { isDark } = useTheme();
  const { success, error, warning } = useNotifications();
  const { user } = useAuth();
  const [selectedPivot, setSelectedPivot] = useState('issue');
  const [searchValue, setSearchValue] = useState('');
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  
  // Data states
  const [activeTransactions, setActiveTransactions] = useState([]);
  const [overdueTransactions, setOverdueTransactions] = useState([]);
  const [todayTransactions, setTodayTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  
  // Form states
  const [issueForm, setIssueForm] = useState({
    memberId: '',
    bookId: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  const [returnForm, setReturnForm] = useState({
    transactionId: '',
    fine: 0
  });
  const [renewalForm, setRenewalForm] = useState({
    transactionId: '',
    newDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  const cardStyle = mergeStyles({
    background: isDark ? '#323130' : '#ffffff',
    border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
    borderRadius: '8px',
    padding: '20px',
    boxShadow: isDark 
      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 4px 16px rgba(0, 0, 0, 0.05)'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsRes, booksRes, membersRes] = await Promise.all([
        fetch('http://localhost:5000/api/transactions', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/books', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (transactionsRes.ok) {
        const transactions = await transactionsRes.json();
        console.log('Fetched transactions:', transactions);
        
        const active = transactions.filter(t => t.type === 'issue' && t.status === 'active');
        const overdue = transactions.filter(t => t.type === 'issue' && t.status === 'overdue');
        const today = transactions.filter(t => 
          new Date(t.createdAt).toDateString() === new Date().toDateString()
        );
        
        setActiveTransactions(active);
        setOverdueTransactions(overdue);
        setTodayTransactions(today);
        
        console.log('Active:', active.length, 'Overdue:', overdue.length, 'Today:', today.length);
      }

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.filter(m => m.role === 'Member'));
      }
    } catch (err) {
      error('Failed to load data');
      console.error('Load data error:', err);
    }
  };

  const handleIssueBook = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...issueForm,
          type: 'issue',
          processedBy: user._id
        })
      });

      if (response.ok) {
        success('Book issued successfully');
        setIsIssueDialogOpen(false);
        setIssueForm({ memberId: '', bookId: '', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        loadData();
      } else {
        throw new Error('Failed to issue book');
      }
    } catch (err) {
      error('Failed to issue book');
    }
  };

  const handleReturnBook = async () => {
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
        setReturnForm({ transactionId: '', fine: 0 });
        loadData();
      } else {
        throw new Error('Failed to return book');
      }
    } catch (err) {
      error('Failed to return book');
    }
  };

  const handleRenewalBook = async () => {
    if (!renewalForm.transactionId || !renewalForm.newDueDate) {
      error('Transaction ID and new due date are required');
      return;
    }

    try {
      console.log('Renewing transaction:', renewalForm);
      const response = await fetch(`http://localhost:5000/api/transactions/${renewalForm.transactionId}/renew`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dueDate: renewalForm.newDueDate
        })
      });

      const data = await response.json();
      console.log('Renew response:', data);
      
      if (response.ok) {
        success('Book renewed successfully');
        setIsRenewalDialogOpen(false);
        setRenewalForm({ transactionId: '', newDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        loadData();
      } else {
        error(data.message || 'Failed to renew book');
      }
    } catch (err) {
      console.error('Renew error:', err);
      error('Failed to renew book: ' + err.message);
    }
  };

  const commandBarItems = [
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Sync' },
      onClick: () => {
        loadData();
        success('Data refreshed successfully');
      }
    }
  ];

  const transactionColumns = [
    { key: 'bookTitle', name: 'Book', minWidth: 200, onRender: (item) => item.bookId?.title || 'N/A' },
    { key: 'memberId', name: 'Member ID', minWidth: 100, onRender: (item) => item.memberId?.memberId || item.memberId || 'N/A' },
    { key: 'memberName', name: 'Member Name', minWidth: 150, onRender: (item) => item.memberId?.name || 'N/A' },
    { key: 'issueDate', name: 'Issue Date', minWidth: 100, onRender: (item) => new Date(item.issueDate).toLocaleDateString() },
    { key: 'dueDate', name: 'Due Date', minWidth: 100, onRender: (item) => new Date(item.dueDate).toLocaleDateString() },
    { 
      key: 'status', 
      name: 'Status', 
      minWidth: 80,
      onRender: (item) => (
        <Text styles={{
          root: {
            color: item.status === 'overdue' ? '#d13438' : item.status === 'active' ? '#107c10' : '#605e5c',
            fontWeight: FontWeights.semibold,
            textTransform: 'capitalize'
          }
        }}>
          {item.status}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 150,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton
            text="Return"
            onClick={async () => {
              if (!item.bookId?._id || !item.memberId?._id) {
                error('Invalid transaction data');
                return;
              }
              try {
                const response = await fetch(`http://localhost:5000/api/books/${item.bookId._id}/return`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({ memberId: item.memberId._id })
                });
                const data = await response.json();
                if (response.ok) {
                  success(`Book returned successfully${data.fine > 0 ? `. Fine: ₹${data.fine}` : ''}`);
                  loadData();
                } else {
                  error(data.message || 'Failed to return book');
                }
              } catch (err) {
                error('Failed to return book');
              }
            }}
            styles={{ root: { minWidth: '60px' } }}
          />
          <DefaultButton
            text="Renew"
            onClick={() => {
              setRenewalForm({ transactionId: item._id, newDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
              setIsRenewalDialogOpen(true);
            }}
            styles={{ root: { minWidth: '60px' } }}
          />
        </Stack>
      )
    }
  ];

  const todayColumns = [
    { key: 'bookTitle', name: 'Book', minWidth: 200, onRender: (item) => item.bookId?.title || 'N/A' },
    { key: 'memberId', name: 'Member ID', minWidth: 100, onRender: (item) => item.memberId?.memberId || item.memberId || 'N/A' },
    { key: 'memberName', name: 'Member Name', minWidth: 150, onRender: (item) => item.memberId?.name || 'N/A' },
    { key: 'type', name: 'Type', minWidth: 80, onRender: (item) => item.type.toUpperCase() },
    { key: 'time', name: 'Time', minWidth: 100, onRender: (item) => new Date(item.createdAt).toLocaleTimeString() },
    { key: 'processedBy', name: 'Processed By', minWidth: 120, onRender: (item) => item.processedBy?.name || 'N/A' }
  ];

  return (
    <Stack tokens={{ childrenGap: 24 }}>
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xxLarge" styles={{ 
          root: { 
            fontWeight: FontWeights.bold,
            color: isDark ? '#ffffff' : '#323130'
          } 
        }}>
          Circulation Management
        </Text>
        <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Manage book issues, returns, and renewals efficiently.
        </Text>
      </Stack>



      {/* Statistics Cards */}
      <Stack horizontal wrap tokens={{ childrenGap: 16 }}>
        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Active Issues
              </Text>
              <Icon iconName="BookAnswers" styles={{ root: { color: '#107c10', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#107c10' } }}>
              {activeTransactions.length}
            </Text>
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Overdue Books
              </Text>
              <Icon iconName="Warning" styles={{ root: { color: '#d13438', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#d13438' } }}>
              {overdueTransactions.length}
            </Text>
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Today's Transactions
              </Text>
              <Icon iconName="Calendar" styles={{ root: { color: '#0078d4', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#0078d4' } }}>
              {todayTransactions.length}
            </Text>
          </Stack>
        </div>
      </Stack>

      <CommandBar items={commandBarItems} />

      {overdueTransactions.length > 0 && (
        <MessageBar messageBarType={MessageBarType.warning}>
          {overdueTransactions.length} book(s) are overdue. Please follow up with members.
        </MessageBar>
      )}

      <Pivot selectedKey={selectedPivot} onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}>
        <PivotItem headerText="Active Issues" itemKey="issue" />
        <PivotItem headerText="Overdue Books" itemKey="overdue" />
        <PivotItem headerText="Today's Activity" itemKey="today" />
      </Pivot>

      <div className={cardStyle}>
        <Stack tokens={{ childrenGap: 16 }}>
          <SearchBox
            placeholder="Search transactions..."
            value={searchValue}
            onChange={(e, value) => setSearchValue(value || '')}
            styles={{ root: { maxWidth: '400px' } }}
          />

          {selectedPivot === 'issue' && (
            <DetailsList
              items={activeTransactions.filter(t => 
                !searchValue || 
                t.bookId?.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
                t.memberId?.memberId?.toLowerCase().includes(searchValue.toLowerCase()) ||
                t.memberId?.name?.toLowerCase().includes(searchValue.toLowerCase())
              )}
              columns={transactionColumns}
              selectionMode={SelectionMode.none}
            />
          )}

          {selectedPivot === 'overdue' && (
            <DetailsList
              items={overdueTransactions.filter(t => 
                !searchValue || 
                t.bookId?.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
                t.memberId?.memberId?.toLowerCase().includes(searchValue.toLowerCase()) ||
                t.memberId?.name?.toLowerCase().includes(searchValue.toLowerCase())
              )}
              columns={transactionColumns}
              selectionMode={SelectionMode.none}
            />
          )}

          {selectedPivot === 'today' && (
            <DetailsList
              items={todayTransactions.filter(t => 
                !searchValue || 
                t.bookId?.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
                t.memberId?.memberId?.toLowerCase().includes(searchValue.toLowerCase()) ||
                t.memberId?.name?.toLowerCase().includes(searchValue.toLowerCase())
              )}
              columns={todayColumns}
              selectionMode={SelectionMode.none}
            />
          )}
        </Stack>
      </div>

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
          <Dropdown
            label="Select Member"
            options={members.map(m => ({ key: m._id, text: `${m.name} (${m.email})` }))}
            selectedKey={issueForm.memberId}
            onChange={(e, option) => setIssueForm({...issueForm, memberId: option.key})}
          />
          <Dropdown
            label="Select Book"
            options={books.map(b => ({ key: b._id, text: `${b.title} - ${b.author} (${b.availableCopies} available)` }))}
            selectedKey={issueForm.bookId}
            onChange={(e, option) => setIssueForm({...issueForm, bookId: option.key})}
          />
          <DatePicker
            label="Due Date"
            value={issueForm.dueDate}
            onSelectDate={(date) => setIssueForm({...issueForm, dueDate: date})}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={handleIssueBook} text="Issue Book" />
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
            label="Fine Amount (₹)"
            value={returnForm.fine.toString()}
            onChange={(e, value) => setReturnForm({...returnForm, fine: parseFloat(value) || 0})}
            type="number"
            readOnly
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={handleReturnBook} text="Return Book" />
          <DefaultButton onClick={() => setIsReturnDialogOpen(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Renewal Dialog */}
      <Dialog
        hidden={!isRenewalDialogOpen}
        onDismiss={() => setIsRenewalDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Renew Book',
          subText: 'Extend due date'
        }}
        minWidth={400}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <DatePicker
            label="New Due Date"
            value={renewalForm.newDueDate}
            onSelectDate={(date) => setRenewalForm({...renewalForm, newDueDate: date})}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={handleRenewalBook} text="Renew Book" />
          <DefaultButton onClick={() => setIsRenewalDialogOpen(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default CirculationManagement;