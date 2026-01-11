import React, { useState } from 'react';
import {
  Stack,
  Nav,
  Text,
  IconButton,
  Panel,
  PanelType,
  DefaultButton
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import Dashboard from './Dashboard';
import BooksManagement from './BooksManagement';
import MembersManagement from './MembersManagement';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showUserPanel, setShowUserPanel] = useState(false);

  const navItems = [
    {
      key: 'dashboard',
      name: 'Dashboard',
      iconProps: { iconName: 'ViewDashboard' },
      onClick: () => setCurrentPage('dashboard')
    },
    {
      key: 'books',
      name: 'Books',
      iconProps: { iconName: 'BookAnswers' },
      onClick: () => setCurrentPage('books')
    },
    {
      key: 'members',
      name: 'Members',
      iconProps: { iconName: 'People' },
      onClick: () => setCurrentPage('members')
    }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BooksManagement />;
      case 'members':
        return <MembersManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Stack horizontal styles={{ root: { height: '100vh' } }}>
      {/* Sidebar */}
      <Stack
        styles={{
          root: {
            width: 250,
            backgroundColor: isDark ? '#323130' : '#f3f2f1',
            borderRight: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`
          }
        }}
      >
        {/* Header */}
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          styles={{ root: { padding: '16px 20px', borderBottom: `1px solid ${isDark ? '#484644' : '#e1dfdd'}` } }}
        >
          <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
            Library MS
          </Text>
          <IconButton
            iconProps={{ iconName: isDark ? 'Sunny' : 'ClearNight' }}
            onClick={toggleTheme}
            title="Toggle theme"
          />
        </Stack>

        {/* Navigation */}
        <Nav
          groups={[{ links: navItems }]}
          selectedKey={currentPage}
          styles={{
            root: { padding: '10px 0' },
            link: {
              height: 44,
              lineHeight: 44
            }
          }}
        />

        {/* User Section */}
        <Stack
          styles={{
            root: {
              marginTop: 'auto',
              padding: 20,
              borderTop: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`
            }
          }}
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <IconButton
              iconProps={{ iconName: 'Contact' }}
              styles={{ root: { fontSize: 20 } }}
            />
            <Stack>
              <Text variant="medium">{user?.name || 'User'}</Text>
              <Text variant="small">{user?.role || 'Librarian'}</Text>
            </Stack>
            <IconButton
              iconProps={{ iconName: 'More' }}
              onClick={() => setShowUserPanel(true)}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* Main Content */}
      <Stack styles={{ root: { flex: 1, overflow: 'auto' } }}>
        {renderCurrentPage()}
      </Stack>

      {/* User Panel */}
      <Panel
        isOpen={showUserPanel}
        onDismiss={() => setShowUserPanel(false)}
        type={PanelType.smallFixedNear}
        headerText="User Menu"
      >
        <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: 20 } }}>
          <Text>Welcome, {user?.name || 'User'}!</Text>
          <Text variant="small">Role: {user?.role || 'Librarian'}</Text>
          <Text variant="small">Email: {user?.email || 'user@library.com'}</Text>
          
          <Stack tokens={{ childrenGap: 10 }}>
            <DefaultButton
              text="Profile Settings"
              iconProps={{ iconName: 'Settings' }}
              onClick={() => {
                setShowUserPanel(false);
                alert('Profile settings coming soon!');
              }}
            />
            <DefaultButton
              text="Change Password"
              iconProps={{ iconName: 'Lock' }}
              onClick={() => {
                setShowUserPanel(false);
                alert('Change password coming soon!');
              }}
            />
            <DefaultButton
              text="Logout"
              iconProps={{ iconName: 'SignOut' }}
              onClick={() => {
                logout();
                setShowUserPanel(false);
              }}
              styles={{ root: { backgroundColor: '#d13438', color: 'white' } }}
            />
          </Stack>
        </Stack>
      </Panel>
    </Stack>
  );
};

export default MainLayout;