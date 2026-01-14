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
  Dropdown,
  Panel,
  PanelType,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  SearchBox
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const AdvancedOverdueManagement = () => {
  const { user } = useAuth();
  const { success, error } = useNotifications();
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [showBlacklistPanel, setShowBlacklistPanel] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false);
  const [blacklistedMembers, setBlacklistedMembers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [filters, setFilters] = useState({ 
    daysOverdue: 'all', 
    memberType: 'all', 
    category: 'all',
    department: 'all',
    fineRange: 'all'
  });
  const [automationSettings, setAutomationSettings] = useState({ 
    gracePeriod: 2, 
    renewalLimit: 2,
    autoBlacklistThreshold: 3,
    autoReminderDays: [7, 14, 30]
  });

  useEffect(() => {
    fetchOverdueBooks();
    loadPaymentHistory();
    loadBlacklist();
  }, []);

  const fetchOverdueBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/overdue', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        
        if (data.length > 0) {
          const memberIds = [...new Set(data.map(t => t.memberId))];
          fetchMemberDetails(memberIds);
        }
      }
    } catch (err) {
      console.error('Error fetching overdue books:', err);
    }
  };

  const fetchMemberDetails = async (memberIds) => {
    try {
      const memberPromises = memberIds.map(id => 
        fetch(`http://localhost:5000/api/users/search/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.ok ? res.json() : [])
      );
      const memberDataArrays = await Promise.all(memberPromises);
      const memberData = memberDataArrays.flat().filter(m => m);
      setMembers(memberData);
    } catch (err) {
      console.error('Failed to fetch member details:', err);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Error loading payment history:', err);
    }
  };

  const loadBlacklist = async () => {
    try {
      const saved = localStorage.getItem('lms_blacklist');
      if (saved) setBlacklistedMembers(JSON.parse(saved));
    } catch (err) {
      console.error('Error loading blacklist:', err);
    }
  };

  const fineRates = {
    'Fiction': 10,
    'Non-Fiction': 10,
    'Science': 10,
    'Technology': 10,
    'Reference': 10,
    'History': 10,
    'Biography': 10,
    'default': 10
  };

  const overdueTransactions = transactions.map(t => {
    const overdueDays = t.overdueDays || Math.ceil((new Date() - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
    const calculatedFine = t.currentFine || (overdueDays * 10);
    const memberDetails = members.find(m => m.memberId === t.memberId);
    const memberType = memberDetails?.role === 'Faculty' ? 'Faculty' : 'Student';
    const department = memberDetails?.department || 'Unknown';
    
    return { 
      ...t, 
      daysOverdue: overdueDays,
      calculatedFine: calculatedFine,
      bookTitle: t.bookId?.title || 'Unknown Book',
      bookCategory: t.bookId?.category || 'Unknown',
      memberName: memberDetails?.name || 'Unknown Member',
      memberEmail: memberDetails?.email || '',
      memberType,
      department,
      isBlacklisted: blacklistedMembers.includes(t.memberId)
    };
  }).filter(t => {
    // Apply filters
    if (filters.daysOverdue !== 'all' && t.daysOverdue < parseInt(filters.daysOverdue)) return false;
    if (filters.memberType !== 'all' && t.memberType !== filters.memberType) return false;
    if (filters.category !== 'all' && t.bookCategory !== filters.category) return false;
    if (filters.department !== 'all' && t.department !== filters.department) return false;
    if (filters.fineRange !== 'all') {
      const [min, max] = filters.fineRange.split('-').map(Number);
      if (max && (t.calculatedFine < min || t.calculatedFine > max)) return false;
      if (!max && t.calculatedFine < min) return false;
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!t.bookTitle.toLowerCase().includes(query) && 
          !t.memberId.toLowerCase().includes(query) &&
          !t.memberName.toLowerCase().includes(query)) return false;
    }
    
    // Apply tab filter
    if (selectedTab === 'critical' && t.daysOverdue < 30) return false;
    if (selectedTab === 'blacklisted' && !t.isBlacklisted) return false;
    
    return true;
  });

  const generateAnalytics = () => {
    const overdueByDepartment = overdueTransactions.reduce((acc, t) => {
      acc[t.department] = (acc[t.department] || 0) + 1;
      return acc;
    }, {});
    
    const overdueByCategory = overdueTransactions.reduce((acc, t) => {
      acc[t.bookCategory] = (acc[t.bookCategory] || 0) + 1;
      return acc;
    }, {});
    
    const overdueByMemberType = overdueTransactions.reduce((acc, t) => {
      acc[t.memberType] = (acc[t.memberType] || 0) + 1;
      return acc;
    }, {});
    
    const totalFines = overdueTransactions.reduce((sum, t) => sum + t.calculatedFine, 0);
    const averageDaysOverdue = overdueTransactions.length > 0 ? 
      overdueTransactions.reduce((sum, t) => sum + t.daysOverdue, 0) / overdueTransactions.length : 0;
    
    const criticalOverdue = overdueTransactions.filter(t => t.daysOverdue >= 30).length;
    const collectedFines = payments.reduce((sum, p) => sum + p.amount, 0);
    
    return { 
      overdueByDepartment, 
      overdueByCategory,
      overdueByMemberType, 
      totalFines,
      averageDaysOverdue,
      criticalOverdue,
      collectedFines
    };
  };

  const autoBlacklist = (memberId) => {
    const memberOverdueCount = overdueTransactions.filter(t => t.memberId === memberId).length;
    if (memberOverdueCount >= automationSettings.autoBlacklistThreshold && !blacklistedMembers.includes(memberId)) {
      const updatedBlacklist = [...blacklistedMembers, memberId];
      setBlacklistedMembers(updatedBlacklist);
      localStorage.setItem('lms_blacklist', JSON.stringify(updatedBlacklist));
      error(`Member ${memberId} auto-blacklisted (${memberOverdueCount} overdue books)`);
    }
  };

  const removeFromBlacklist = (memberId) => {
    const updatedBlacklist = blacklistedMembers.filter(id => id !== memberId);
    setBlacklistedMembers(updatedBlacklist);
    localStorage.setItem('lms_blacklist', JSON.stringify(updatedBlacklist));
    success(`Member ${memberId} removed from blacklist`);
  };

  const sendBulkReminders = async () => {
    let sentCount = 0;
    for (const transaction of selectedItems) {
      try {
        const userResponse = await fetch(`http://localhost:5000/api/users/search/${transaction.memberId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (userResponse.ok) {
          const users = await userResponse.json();
          const user = users.find(u => u.memberId === transaction.memberId);
          
          if (user) {
            const message = `URGENT: Your book "${transaction.bookTitle}" is ${transaction.daysOverdue} days overdue. Fine: ₹${transaction.calculatedFine}. Return immediately.`;
            
            const response = await fetch('http://localhost:5000/api/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                userId: user._id,
                title: 'URGENT: Overdue Book',
                message: message,
                category: 'overdue',
                type: 'warning',
                priority: 'high'
              })
            });
            
            if (response.ok) sentCount++;
          }
        }
      } catch (err) {
        console.error('Error sending reminder:', err);
      }
    }
    
    success(`Bulk reminders sent to ${sentCount} members`);
    setShowBulkActionsDialog(false);
    setSelectedItems([]);
  };

  const commandBarItems = [
    {
      key: 'analytics',
      text: 'Analytics Dashboard',
      iconProps: { iconName: 'BarChart4' },
      onClick: () => setShowAnalyticsPanel(true)
    },
    {
      key: 'blacklist',
      text: 'Blacklist Management',
      iconProps: { iconName: 'BlockedSite' },
      onClick: () => setShowBlacklistPanel(true)
    },
    {
      key: 'filters',
      text: 'Advanced Filters',
      iconProps: { iconName: 'Filter' },
      onClick: () => setShowFiltersDialog(true)
    },
    {
      key: 'bulkActions',
      text: `Bulk Actions (${selectedItems.length})`,
      iconProps: { iconName: 'BulkUpload' },
      disabled: selectedItems.length === 0,
      onClick: () => setShowBulkActionsDialog(true)
    },
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        fetchOverdueBooks();
        loadPaymentHistory();
        success('Data refreshed');
      }
    }
  ];

  const overdueColumns = [
    { 
      key: 'bookTitle', 
      name: 'Book Details', 
      minWidth: 250,
      onRender: (item) => (
        <Stack tokens={{ childrenGap: 2 }}>
          <Text styles={{ root: { fontWeight: '600' } }}>{item.bookTitle}</Text>
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            {item.bookCategory}
          </Text>
        </Stack>
      )
    },
    {
      key: 'member',
      name: 'Member Details',
      minWidth: 200,
      onRender: (item) => (
        <Stack tokens={{ childrenGap: 2 }}>
          <Text styles={{ root: { fontWeight: '600' } }}>
            {item.memberName}
          </Text>
          <Text variant="small" styles={{ root: { fontFamily: 'monospace' } }}>
            {item.memberId?.memberId || item.memberId} • {item.memberType}
          </Text>
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            {item.department}
          </Text>
          {item.isBlacklisted && (
            <Text variant="small" styles={{ root: { color: '#d13438', fontWeight: '600' } }}>
              BLACKLISTED
            </Text>
          )}
        </Stack>
      )
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
        <Text styles={{ 
          root: { 
            color: item.daysOverdue >= 30 ? '#d13438' : item.daysOverdue >= 14 ? '#ff8c00' : '#605e5c',
            fontWeight: FontWeights.semibold 
          } 
        }}>
          {item.daysOverdue}
        </Text>
      )
    },
    {
      key: 'fine',
      name: 'Fine Amount',
      minWidth: 120,
      onRender: (item) => (
        <Text styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.semibold } }}>
          ₹{item.calculatedFine}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 120,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: 'Ringer' }}
            title="Send Reminder"
            onClick={async () => {
              try {
                const userResponse = await fetch(`http://localhost:5000/api/users/search/${item.memberId}`, {
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                
                if (userResponse.ok) {
                  const users = await userResponse.json();
                  const user = users.find(u => u.memberId === item.memberId);
                  
                  if (user) {
                    const message = `Dear ${user.name}, your book "${item.bookTitle}" is ${item.daysOverdue} days overdue. Fine: ₹${item.calculatedFine}. Please return immediately.`;
                    
                    const response = await fetch('http://localhost:5000/api/notifications', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify({
                        userId: user._id,
                        title: 'Overdue Book Reminder',
                        message: message,
                        category: 'overdue',
                        type: 'warning',
                        priority: 'high'
                      })
                    });
                    
                    if (response.ok) {
                      success(`Reminder sent to ${item.memberId}`);
                    } else {
                      error('Failed to send reminder');
                    }
                  }
                }
              } catch (err) {
                error('Error sending reminder');
              }
            }}
            styles={{ root: { color: '#0078d4' } }}
          />
          <IconButton
            iconProps={{ iconName: 'Money' }}
            title="Collect Fine"
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/api/payments', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({
                    transactionId: item._id,
                    memberId: item.memberId,
                    bookTitle: item.bookTitle,
                    amount: item.calculatedFine,
                    paymentMethod: 'Cash'
                  })
                });

                if (response.ok) {
                  // Remove from current list
                  const updatedTransactions = transactions.filter(t => t._id !== item._id);
                  setTransactions(updatedTransactions);
                  await loadPaymentHistory();
                  success(`Fine of ₹${item.calculatedFine} collected from ${item.memberId}`);
                } else {
                  error('Failed to collect fine');
                }
              } catch (err) {
                error('Error collecting fine');
              }
            }}
            styles={{ root: { color: '#107c10' } }}
          />
          <IconButton
            iconProps={{ iconName: 'BlockedSite' }}
            title="Blacklist Member"
            onClick={() => autoBlacklist(item.memberId)}
            styles={{ root: { color: '#d13438' } }}
          />
        </Stack>
      )
    }
  ];

  const analytics = generateAnalytics();

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Advanced Overdue Management
      </Text>

      <CommandBar items={commandBarItems} />

      {/* Enhanced Summary Cards */}
      <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {overdueTransactions.length}
          </Text>
          <Text>Total Overdue</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#ff8c00', fontWeight: FontWeights.bold } }}>
            {analytics.criticalOverdue}
          </Text>
          <Text>Critical (30+ days)</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.bold } }}>
            ₹{analytics.totalFines.toFixed(0)}
          </Text>
          <Text>Total Fines</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold } }}>
            ₹{analytics.collectedFines.toFixed(0)}
          </Text>
          <Text>Collected</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {blacklistedMembers.length}
          </Text>
          <Text>Blacklisted</Text>
        </Stack>
      </Stack>

      {/* Search and Tabs */}
      <Stack horizontal tokens={{ childrenGap: 20 }} verticalAlign="end">
        <SearchBox
          placeholder="Search by book title, member ID, or name..."
          value={searchQuery}
          onChange={(_, value) => setSearchQuery(value || '')}
          styles={{ root: { width: 300 } }}
        />
        
        <Pivot
          selectedKey={selectedTab}
          onLinkClick={(item) => setSelectedTab(item?.props?.itemKey || 'all')}
        >
          <PivotItem headerText={`All (${overdueTransactions.length})`} itemKey="all" />
          <PivotItem headerText={`Critical (${analytics.criticalOverdue})`} itemKey="critical" />
          <PivotItem headerText={`Blacklisted (${overdueTransactions.filter(t => t.isBlacklisted).length})`} itemKey="blacklisted" />
        </Pivot>
      </Stack>

      {/* Overdue Books List */}
      <DetailsList
        items={overdueTransactions}
        columns={overdueColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.multiple}
        onSelectionChanged={(selection) => {
          setSelectedItems(selection.getSelection());
        }}
      />

      {/* Analytics Panel */}
      <Panel
        isOpen={showAnalyticsPanel}
        onDismiss={() => setShowAnalyticsPanel(false)}
        headerText="Analytics Dashboard"
        type={PanelType.extraLarge}
      >
        <Stack tokens={{ childrenGap: 30 }}>
          <Stack horizontal tokens={{ childrenGap: 30 }}>
            <Stack styles={{ root: { flex: 1 } }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold, marginBottom: 15 } }}>Department Analysis</Text>
              {Object.entries(analytics.overdueByDepartment).map(([dept, count]) => (
                <Stack key={dept} horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 8 } }}>
                  <Text>{dept}</Text>
                  <Text styles={{ root: { fontWeight: FontWeights.bold, color: '#d13438' } }}>{count}</Text>
                </Stack>
              ))}
            </Stack>
            
            <Stack styles={{ root: { flex: 1 } }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold, marginBottom: 15 } }}>Category Analysis</Text>
              {Object.entries(analytics.overdueByCategory).map(([category, count]) => (
                <Stack key={category} horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 8 } }}>
                  <Text>{category}</Text>
                  <Text styles={{ root: { fontWeight: FontWeights.bold, color: '#5c2d91' } }}>{count}</Text>
                </Stack>
              ))}
            </Stack>
            
            <Stack styles={{ root: { flex: 1 } }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold, marginBottom: 15 } }}>Member Type</Text>
              {Object.entries(analytics.overdueByMemberType).map(([type, count]) => (
                <Stack key={type} horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 8 } }}>
                  <Text>{type}</Text>
                  <Text styles={{ root: { fontWeight: FontWeights.bold, color: '#107c10' } }}>{count}</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
          
          <Stack>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold, marginBottom: 15 } }}>Key Metrics</Text>
            <Stack horizontal tokens={{ childrenGap: 30 }}>
              <Stack styles={{ root: { padding: 20, border: '1px solid #e1dfdd', borderRadius: 4, textAlign: 'center' } }}>
                <Text variant="xxLarge" styles={{ root: { color: '#ff8c00', fontWeight: FontWeights.bold } }}>
                  {analytics.averageDaysOverdue.toFixed(1)}
                </Text>
                <Text>Avg Days Overdue</Text>
              </Stack>
              
              <Stack styles={{ root: { padding: 20, border: '1px solid #e1dfdd', borderRadius: 4, textAlign: 'center' } }}>
                <Text variant="xxLarge" styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.bold } }}>
                  {((analytics.collectedFines / analytics.totalFines) * 100 || 0).toFixed(1)}%
                </Text>
                <Text>Collection Rate</Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Panel>

      {/* Blacklist Panel */}
      <Panel
        isOpen={showBlacklistPanel}
        onDismiss={() => setShowBlacklistPanel(false)}
        headerText="Blacklist Management"
        type={PanelType.medium}
      >
        <Stack tokens={{ childrenGap: 20 }}>
          <MessageBar messageBarType={MessageBarType.info}>
            Members are auto-blacklisted after {automationSettings.autoBlacklistThreshold}+ overdue books
          </MessageBar>
          
          <Text variant="large">Blacklisted Members ({blacklistedMembers.length})</Text>
          
          {blacklistedMembers.map(memberId => {
            const memberTransactions = overdueTransactions.filter(t => t.memberId === memberId);
            const memberDetails = members.find(m => m.memberId === memberId);
            
            return (
              <Stack key={memberId} styles={{ root: { padding: 15, border: '1px solid #d13438', borderRadius: 4, backgroundColor: '#fef7f7' } }}>
                <Stack horizontal horizontalAlign="space-between">
                  <Stack>
                    <Text styles={{ root: { fontWeight: FontWeights.bold } }}>
                      {memberDetails?.name || memberId}
                    </Text>
                    <Text variant="small">{memberId} • {memberDetails?.department}</Text>
                    <Text variant="small" styles={{ root: { color: '#d13438' } }}>
                      {memberTransactions.length} overdue books
                    </Text>
                  </Stack>
                  <DefaultButton
                    text="Remove"
                    onClick={() => removeFromBlacklist(memberId)}
                  />
                </Stack>
              </Stack>
            );
          })}
          
          {blacklistedMembers.length === 0 && (
            <Text styles={{ root: { fontStyle: 'italic', color: '#666', textAlign: 'center', padding: 20 } }}>
              No blacklisted members
            </Text>
          )}
        </Stack>
      </Panel>

      {/* Advanced Filters Dialog */}
      <Dialog
        hidden={!showFiltersDialog}
        onDismiss={() => setShowFiltersDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Advanced Filters'
        }}
        styles={{ main: { minWidth: 500 } }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Dropdown
            label="Days Overdue"
            options={[
              { key: 'all', text: 'All' },
              { key: '7', text: '7+ days' },
              { key: '14', text: '14+ days' },
              { key: '30', text: '30+ days (Critical)' },
              { key: '60', text: '60+ days (Severe)' }
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
              { key: 'Reference', text: 'Reference' },
              { key: 'History', text: 'History' },
              { key: 'Biography', text: 'Biography' }
            ]}
            selectedKey={filters.category}
            onChange={(_, option) => setFilters({ ...filters, category: option?.key || 'all' })}
          />
          
          <Dropdown
            label="Fine Range"
            options={[
              { key: 'all', text: 'All Amounts' },
              { key: '0-100', text: '₹0 - ₹100' },
              { key: '100-500', text: '₹100 - ₹500' },
              { key: '500-1000', text: '₹500 - ₹1000' },
              { key: '1000', text: '₹1000+' }
            ]}
            selectedKey={filters.fineRange}
            onChange={(_, option) => setFilters({ ...filters, fineRange: option?.key || 'all' })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={() => setShowFiltersDialog(false)} text="Apply Filters" />
          <DefaultButton 
            onClick={() => {
              setFilters({ daysOverdue: 'all', memberType: 'all', category: 'all', department: 'all', fineRange: 'all' });
              setShowFiltersDialog(false);
            }} 
            text="Clear All" 
          />
        </DialogFooter>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog
        hidden={!showBulkActionsDialog}
        onDismiss={() => setShowBulkActionsDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: `Bulk Actions (${selectedItems.length} items)`
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Selected {selectedItems.length} overdue transactions</Text>
          
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <PrimaryButton
              text="Send Bulk Reminders"
              iconProps={{ iconName: 'Mail' }}
              onClick={sendBulkReminders}
            />
            <DefaultButton
              text="Blacklist All Members"
              iconProps={{ iconName: 'BlockedSite' }}
              onClick={() => {
                selectedItems.forEach(item => autoBlacklist(item.memberId));
                setShowBulkActionsDialog(false);
                setSelectedItems([]);
              }}
            />
          </Stack>
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowBulkActionsDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default AdvancedOverdueManagement;