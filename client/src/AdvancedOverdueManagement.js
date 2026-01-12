import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  FontWeights,
  IconButton,
  CommandBar,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  TextField,
  Dropdown
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const AdvancedOverdueManagement = () => {
  const { user } = useAuth();
  const { success, error } = useNotifications();
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [showBlacklistDialog, setShowBlacklistDialog] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [blacklistedMembers, setBlacklistedMembers] = useState([]);
  const [filters, setFilters] = useState({ daysOverdue: 'all', memberType: 'all', category: 'all' });
  const [automationSettings, setAutomationSettings] = useState({ gracePeriod: 2, renewalLimit: 2 });

  useEffect(() => {
    const savedTransactions = localStorage.getItem('lms_transactions');
    const savedBooks = localStorage.getItem('lms_books');
    const savedBlacklist = localStorage.getItem('lms_blacklist');
    
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedBlacklist) setBlacklistedMembers(JSON.parse(savedBlacklist));
  }, []);

  const fineRates = {
    'Fiction': 1.5,
    'Non-Fiction': 2.0,
    'Science': 3.0,
    'Technology': 3.0,
    'Reference': 5.0,
    'default': 2.0
  };

  const calculateFine = (transaction) => {
    const book = books.find(b => b._id === transaction.bookId);
    const rate = fineRates[book?.category] || fineRates.default;
    const gracePeriodDate = new Date(new Date(transaction.dueDate).getTime() + (automationSettings.gracePeriod * 24 * 60 * 60 * 1000));
    const daysOverdue = Math.ceil((new Date() - gracePeriodDate) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysOverdue * rate);
  };

  const overdueTransactions = transactions.filter(t => {
    if (t.status !== 'active' || !t.dueDate) return false;
    const gracePeriodDate = new Date(new Date(t.dueDate).getTime() + (automationSettings.gracePeriod * 24 * 60 * 60 * 1000));
    return new Date() > gracePeriodDate;
  }).map(t => {
    const gracePeriodDate = new Date(new Date(t.dueDate).getTime() + (automationSettings.gracePeriod * 24 * 60 * 60 * 1000));
    const daysOverdue = Math.ceil((new Date() - gracePeriodDate) / (1000 * 60 * 60 * 24));
    const calculatedFine = calculateFine(t);
    const book = books.find(b => b._id === t.bookId);
    const memberType = t.memberId?.startsWith('F') ? 'Faculty' : 'Student';
    const department = t.memberId?.substring(0, 3) || 'UNK';
    return { ...t, daysOverdue, calculatedFine, bookCategory: book?.category || 'Unknown', memberType, department };
  }).filter(t => {
    if (filters.daysOverdue !== 'all' && t.daysOverdue < parseInt(filters.daysOverdue)) return false;
    if (filters.memberType !== 'all' && t.memberType !== filters.memberType) return false;
    if (filters.category !== 'all' && t.bookCategory !== filters.category) return false;
    return true;
  });

  const generateAnalytics = () => {
    const overdueByDepartment = overdueTransactions.reduce((acc, t) => {
      acc[t.department] = (acc[t.department] || 0) + 1;
      return acc;
    }, {});
    
    const mostOverdueBooks = books.map(book => {
      const overdueCount = overdueTransactions.filter(t => t.bookId === book._id).length;
      return { ...book, overdueCount };
    }).filter(b => b.overdueCount > 0).sort((a, b) => b.overdueCount - a.overdueCount).slice(0, 10);
    
    const overdueByMemberType = overdueTransactions.reduce((acc, t) => {
      acc[t.memberType] = (acc[t.memberType] || 0) + 1;
      return acc;
    }, {});
    
    return { overdueByDepartment, mostOverdueBooks, overdueByMemberType };
  };

  const checkBlacklist = (memberId) => {
    const memberOverdueCount = overdueTransactions.filter(t => t.memberId === memberId).length;
    if (memberOverdueCount >= 3 && !blacklistedMembers.includes(memberId)) {
      const updatedBlacklist = [...blacklistedMembers, memberId];
      setBlacklistedMembers(updatedBlacklist);
      localStorage.setItem('lms_blacklist', JSON.stringify(updatedBlacklist));
      error(`Member ${memberId} blacklisted due to excessive overdue books`);
    }
  };

  const removeFromBlacklist = (memberId) => {
    const updatedBlacklist = blacklistedMembers.filter(id => id !== memberId);
    setBlacklistedMembers(updatedBlacklist);
    localStorage.setItem('lms_blacklist', JSON.stringify(updatedBlacklist));
    success(`Member ${memberId} removed from blacklist`);
  };

  const commandBarItems = [
    {
      key: 'analytics',
      text: 'Analytics',
      iconProps: { iconName: 'LineChart' },
      onClick: () => setShowAnalyticsDialog(true)
    },
    {
      key: 'blacklist',
      text: 'Blacklist',
      iconProps: { iconName: 'BlockedSite' },
      onClick: () => setShowBlacklistDialog(true)
    },
    {
      key: 'filters',
      text: 'Advanced Filters',
      iconProps: { iconName: 'Filter' },
      onClick: () => setShowFiltersDialog(true)
    }
  ];

  const overdueColumns = [
    { key: 'bookTitle', name: 'Book Title', fieldName: 'bookTitle', minWidth: 200 },
    { key: 'memberId', name: 'Member ID', fieldName: 'memberId', minWidth: 100 },
    { key: 'memberType', name: 'Type', fieldName: 'memberType', minWidth: 80 },
    { key: 'department', name: 'Dept', fieldName: 'department', minWidth: 80 },
    { 
      key: 'daysOverdue',
      name: 'Days Overdue',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { color: '#d13438', fontWeight: FontWeights.semibold } }}>
          {item.daysOverdue}
        </Text>
      )
    },
    {
      key: 'fine',
      name: 'Fine Amount',
      minWidth: 120,
      onRender: (item) => (
        <Stack>
          <Text styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.semibold } }}>
            ${item.calculatedFine.toFixed(2)}
          </Text>
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            {item.bookCategory}
          </Text>
        </Stack>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 100,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: 'BlockedSite' }}
          title="Blacklist Member"
          onClick={() => checkBlacklist(item.memberId)}
          styles={{ root: { color: '#d13438' } }}
        />
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Advanced Overdue Management
      </Text>

      <CommandBar items={commandBarItems} />

      {/* Summary */}
      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {overdueTransactions.length}
          </Text>
          <Text>Overdue Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {blacklistedMembers.length}
          </Text>
          <Text>Blacklisted Members</Text>
        </Stack>
      </Stack>

      {/* Overdue Books List */}
      <DetailsList
        items={overdueTransactions}
        columns={overdueColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />

      {/* Analytics Dialog */}
      <Dialog
        hidden={!showAnalyticsDialog}
        onDismiss={() => setShowAnalyticsDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Analytics & Reports'
        }}
        styles={{ main: { minWidth: 700 } }}
      >
        <Stack tokens={{ childrenGap: 20 }}>
          {(() => {
            const analytics = generateAnalytics();
            return (
              <Stack tokens={{ childrenGap: 20 }}>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold } }}>Overdue Analytics</Text>
                
                <Stack horizontal tokens={{ childrenGap: 30 }}>
                  <Stack styles={{ root: { flex: 1 } }}>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>Department-wise Overdue</Text>
                    {Object.entries(analytics.overdueByDepartment).map(([dept, count]) => (
                      <Stack key={dept} horizontal horizontalAlign="space-between">
                        <Text>{dept}</Text>
                        <Text styles={{ root: { fontWeight: FontWeights.bold } }}>{count}</Text>
                      </Stack>
                    ))}
                  </Stack>
                  
                  <Stack styles={{ root: { flex: 1 } }}>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>Member Type Distribution</Text>
                    {Object.entries(analytics.overdueByMemberType).map(([type, count]) => (
                      <Stack key={type} horizontal horizontalAlign="space-between">
                        <Text>{type}</Text>
                        <Text styles={{ root: { fontWeight: FontWeights.bold } }}>{count}</Text>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
                
                <Stack>
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>Most Overdue Books</Text>
                  <DetailsList
                    items={analytics.mostOverdueBooks.slice(0, 5)}
                    columns={[
                      { key: 'title', name: 'Book Title', fieldName: 'title', minWidth: 200 },
                      { key: 'category', name: 'Category', fieldName: 'category', minWidth: 100 },
                      { key: 'overdueCount', name: 'Overdue Count', fieldName: 'overdueCount', minWidth: 100 }
                    ]}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none}
                  />
                </Stack>
              </Stack>
            );
          })()}
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowAnalyticsDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>

      {/* Blacklist Dialog */}
      <Dialog
        hidden={!showBlacklistDialog}
        onDismiss={() => setShowBlacklistDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Member Blacklist'
        }}
        styles={{ main: { minWidth: 600 } }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Blacklisted Members: {blacklistedMembers.length}</Text>
          <Text variant="small">Members are automatically blacklisted after 3+ overdue books</Text>
          
          {blacklistedMembers.map(memberId => (
            <Stack key={memberId} horizontal horizontalAlign="space-between" styles={{ root: { padding: 10, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
              <Text>{memberId}</Text>
              <DefaultButton
                text="Remove"
                onClick={() => removeFromBlacklist(memberId)}
                styles={{ root: { minWidth: 80 } }}
              />
            </Stack>
          ))}
          
          {blacklistedMembers.length === 0 && (
            <Text styles={{ root: { fontStyle: 'italic', color: '#666' } }}>No blacklisted members</Text>
          )}
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowBlacklistDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>

      {/* Advanced Filters Dialog */}
      <Dialog
        hidden={!showFiltersDialog}
        onDismiss={() => setShowFiltersDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Advanced Filters'
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Dropdown
            label="Days Overdue"
            options={[
              { key: 'all', text: 'All' },
              { key: '7', text: '7+ days' },
              { key: '14', text: '14+ days' },
              { key: '30', text: '30+ days' }
            ]}
            selectedKey={filters.daysOverdue}
            onChange={(_, option) => setFilters({ ...filters, daysOverdue: option?.key || 'all' })}
          />
          
          <Dropdown
            label="Member Type"
            options={[
              { key: 'all', text: 'All' },
              { key: 'Student', text: 'Students' },
              { key: 'Faculty', text: 'Faculty' }
            ]}
            selectedKey={filters.memberType}
            onChange={(_, option) => setFilters({ ...filters, memberType: option?.key || 'all' })}
          />
          
          <Dropdown
            label="Book Category"
            options={[
              { key: 'all', text: 'All Categories' },
              { key: 'Fiction', text: 'Fiction' },
              { key: 'Non-Fiction', text: 'Non-Fiction' },
              { key: 'Science', text: 'Science' },
              { key: 'Technology', text: 'Technology' },
              { key: 'Reference', text: 'Reference' }
            ]}
            selectedKey={filters.category}
            onChange={(_, option) => setFilters({ ...filters, category: option?.key || 'all' })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={() => setShowFiltersDialog(false)} text="Apply Filters" />
          <DefaultButton 
            onClick={() => {
              setFilters({ daysOverdue: 'all', memberType: 'all', category: 'all' });
              setShowFiltersDialog(false);
            }} 
            text="Clear All" 
          />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default AdvancedOverdueManagement;