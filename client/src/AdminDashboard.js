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
  Separator
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import UserManagement from './UserManagement';
import BooksManagement from './BooksManagement';
import BookRequestManagement from './BookRequestManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, warning, info, error } = useNotifications();
  const [selectedPivot, setSelectedPivot] = useState('overview');
  const [searchValue, setSearchValue] = useState('');
  const [isBooksManagementOpen, setIsBooksManagementOpen] = useState(false);

  const [adminData, setAdminData] = useState({
    totalBooks: 2847,
    totalMembers: 1234,
    totalLibrarians: 8,
    systemHealth: 98.5,
    dailyTransactions: 156,
    monthlyRevenue: 12450,
    storageUsed: 75,
    activeUsers: 342
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

  const systemAlerts = [
    { key: '1', type: 'Warning', message: 'Database backup overdue by 2 days', severity: 'High', time: '2 hours ago' },
    { key: '2', type: 'Info', message: 'Monthly report generated successfully', severity: 'Low', time: '1 day ago' },
    { key: '3', type: 'Error', message: 'Failed login attempts from IP 192.168.1.100', severity: 'Critical', time: '3 hours ago' }
  ];

  const userManagement = [
    { key: '1', name: 'John Smith', role: 'Librarian', status: 'Active', lastLogin: '2024-01-15 10:30', department: 'Main Library' },
    { key: '2', name: 'Sarah Johnson', role: 'Member', status: 'Active', lastLogin: '2024-01-15 14:20', department: 'Computer Science' },
    { key: '3', name: 'Mike Davis', role: 'Librarian', status: 'Inactive', lastLogin: '2024-01-10 09:15', department: 'Reference' }
  ];

  const alertColumns = [
    { 
      key: 'type', 
      name: 'Type', 
      minWidth: 80,
      onRender: (item) => (
        <Icon 
          iconName={item.type === 'Error' ? 'Error' : item.type === 'Warning' ? 'Warning' : 'Info'}
          styles={{ 
            root: { 
              color: item.type === 'Error' ? '#d13438' : item.type === 'Warning' ? '#ff8c00' : '#0078d4',
              fontSize: '16px'
            } 
          }}
        />
      )
    },
    { key: 'message', name: 'Message', fieldName: 'message', minWidth: 300 },
    { key: 'severity', name: 'Severity', fieldName: 'severity', minWidth: 100 },
    { key: 'time', name: 'Time', fieldName: 'time', minWidth: 120 },
    { 
      key: 'action', 
      name: 'Action', 
      minWidth: 100,
      onRender: (item) => (
        <DefaultButton
          text="Resolve"
          onClick={() => success(`Resolved: ${item.message}`)}
          styles={{ root: { minWidth: '70px' } }}
        />
      )
    }
  ];

  const userColumns = [
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 150 },
    { key: 'role', name: 'Role', fieldName: 'role', minWidth: 100 },
    { 
      key: 'status', 
      name: 'Status', 
      minWidth: 80,
      onRender: (item) => (
        <Text styles={{
          root: {
            color: item.status === 'Active' ? '#107c10' : '#d13438',
            fontWeight: FontWeights.semibold
          }
        }}>
          {item.status}
        </Text>
      )
    },
    { key: 'lastLogin', name: 'Last Login', fieldName: 'lastLogin', minWidth: 150 },
    { key: 'department', name: 'Department', fieldName: 'department', minWidth: 120 },
    { 
      key: 'action', 
      name: 'Actions', 
      minWidth: 120,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            onClick={() => info(`Editing user: ${item.name}`)}
            title="Edit User"
          />
          <IconButton
            iconProps={{ iconName: item.status === 'Active' ? 'BlockContact' : 'AddFriend' }}
            onClick={() => warning(`${item.status === 'Active' ? 'Deactivated' : 'Activated'} user: ${item.name}`)}
            title={item.status === 'Active' ? 'Deactivate' : 'Activate'}
          />
        </Stack>
      )
    }
  ];

  const commandBarItems = [
    {
      key: 'backup',
      text: 'Backup System',
      iconProps: { iconName: 'CloudUpload' },
      onClick: () => success('System backup initiated...')
    },
    {
      key: 'maintenance',
      text: 'Maintenance Mode',
      iconProps: { iconName: 'Settings' },
      onClick: () => warning('Maintenance mode activated')
    },
    {
      key: 'reports',
      text: 'Generate Reports',
      iconProps: { iconName: 'BarChart4' },
      onClick: () => success('Generating comprehensive reports...')
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 24 }} styles={{ root: { padding: '24px', maxWidth: '1600px', margin: '0 auto' } }}>
      {/* Header */}
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xxLarge" styles={{ 
          root: { 
            fontWeight: FontWeights.bold,
            background: 'linear-gradient(135deg, #d13438, #a4262c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          } 
        }}>
          System Administration
        </Text>
        <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Monitor system health, manage users, and oversee library operations.
        </Text>
      </Stack>

      {/* Quick Actions */}
      <CommandBar items={commandBarItems} />

      {/* System Health Cards */}
      <Stack horizontal wrap tokens={{ childrenGap: 16 }}>
        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                System Health
              </Text>
              <Icon iconName="Health" styles={{ root: { color: '#107c10', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#107c10' } }}>
              {adminData.systemHealth}%
            </Text>
            <ProgressIndicator 
              percentComplete={adminData.systemHealth / 100}
              styles={{ progressBar: { backgroundColor: '#107c10' } }}
            />
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Total Users
              </Text>
              <Icon iconName="People" styles={{ root: { color: '#0078d4', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#0078d4' } }}>
              {adminData.totalMembers + adminData.totalLibrarians}
            </Text>
            <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
              {adminData.activeUsers} currently active
            </Text>
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Daily Transactions
              </Text>
              <Icon iconName="ActivityFeed" styles={{ root: { color: '#ff8c00', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#ff8c00' } }}>
              {adminData.dailyTransactions}
            </Text>
            <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
              Books issued/returned today
            </Text>
          </Stack>
        </div>

        <div className={cardStyle} style={{ flex: '1 1 200px' }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Storage Usage
              </Text>
              <Icon iconName="Database" styles={{ root: { color: '#d13438', fontSize: '20px' } }} />
            </Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#d13438' } }}>
              {adminData.storageUsed}%
            </Text>
            <ProgressIndicator 
              percentComplete={adminData.storageUsed / 100}
              styles={{ progressBar: { backgroundColor: adminData.storageUsed > 80 ? '#d13438' : '#0078d4' } }}
            />
          </Stack>
        </div>
      </Stack>

      {/* System Alerts */}
      {systemAlerts.some(alert => alert.severity === 'Critical') && (
        <MessageBar messageBarType={MessageBarType.error}>
          Critical system alerts require immediate attention. Check the System Monitoring section.
        </MessageBar>
      )}

      {adminData.storageUsed > 80 && (
        <MessageBar messageBarType={MessageBarType.warning}>
          Storage usage is at {adminData.storageUsed}%. Consider archiving old data or expanding storage.
        </MessageBar>
      )}

      {/* Navigation */}
      <Pivot
        selectedKey={selectedPivot}
        onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
      >
        <PivotItem headerText="System Overview" itemKey="overview" />
        <PivotItem headerText="User Management" itemKey="users" />
        <PivotItem headerText="Books Management" itemKey="books" />
        <PivotItem headerText="Book Requests" itemKey="requests" />
      </Pivot>

      {/* Content */}
      {selectedPivot === 'overview' && (
        <Stack tokens={{ childrenGap: 24 }}>
          <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
            <div className={cardStyle} style={{ flex: '1 1 300px' }}>
              <Stack tokens={{ childrenGap: 16 }}>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                  Library Statistics
                </Text>
                <Stack tokens={{ childrenGap: 12 }}>
                  <Stack horizontal horizontalAlign="space-between">
                    <Text>Total Books</Text>
                    <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      {adminData.totalBooks.toLocaleString()}
                    </Text>
                  </Stack>
                  <Stack horizontal horizontalAlign="space-between">
                    <Text>Total Members</Text>
                    <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      {adminData.totalMembers.toLocaleString()}
                    </Text>
                  </Stack>
                  <Stack horizontal horizontalAlign="space-between">
                    <Text>Staff Members</Text>
                    <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      {adminData.totalLibrarians}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            </div>

            <div className={cardStyle} style={{ flex: '1 1 300px' }}>
              <Stack tokens={{ childrenGap: 16 }}>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                  Financial Overview
                </Text>
                <Stack tokens={{ childrenGap: 12 }}>
                  <Stack horizontal horizontalAlign="space-between">
                    <Text>Monthly Revenue</Text>
                    <Text styles={{ root: { fontWeight: FontWeights.semibold, color: '#107c10' } }}>
                      ${adminData.monthlyRevenue.toLocaleString()}
                    </Text>
                  </Stack>
                  <Stack horizontal horizontalAlign="space-between">
                    <Text>Outstanding Fines</Text>
                    <Text styles={{ root: { fontWeight: FontWeights.semibold, color: '#d13438' } }}>
                      $2,340
                    </Text>
                  </Stack>
                  <Stack horizontal horizontalAlign="space-between">
                    <Text>Collection Rate</Text>
                    <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      84.2%
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            </div>
          </Stack>
        </Stack>
      )}

      {selectedPivot === 'users' && (
        <UserManagement />
      )}

      {selectedPivot === 'books' && (
        <BooksManagement />
      )}

      {selectedPivot === 'requests' && (
        <BookRequestManagement />
      )}
    </Stack>
  );
};

export default AdminDashboard;