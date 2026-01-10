import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  IconButton,
  TextField,
  Icon,
  Toggle,
  Panel,
  PanelType,
  Separator,
  Nav,
  Pivot,
  PivotItem,
  mergeStyles,
  FontWeights
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import ProfileEdit from './ProfileEditComplete';
import MemberDashboard from './MemberDashboard';
import LibrarianDashboard from './LibrarianDashboard';
import AdminDashboard from './AdminDashboard';
import ProfessionalSettings from './ProfessionalSettings';
import CalendarPanel from './CalendarPanel';
import NoticePanel from './NoticePanel';
import NotificationPanel from './NotificationPanel';
import HelpDeskPanel from './HelpDeskPanel';
import Footer from './Footer';

const RoleDashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { success } = useNotifications();
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load notifications and update when changed
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error('Error loading notifications:', err);
      }
    };
    
    loadNotifications();
    
    // Poll for changes every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    success('Goodbye! See you next time.');
    setTimeout(() => logout(), 1000);
  };

  const headerStyle = mergeStyles({
    background: isDark ? '#323130' : '#ffffff',
    borderBottom: `1px solid ${isDark ? '#484644' : '#edebe9'}`,
    boxShadow: '0 0.5px 1px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px'
  });

  const containerStyle = mergeStyles({
    minHeight: '100vh',
    background: isDark 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d30 30%, #323130 70%, #1f1f1f 100%)'
      : 'linear-gradient(135deg, #f8f7f4 0%, #faf9f8 30%, #ffffff 70%, #f3f2f1 100%)',
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif'
  });

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Librarian':
        return <LibrarianDashboard />;
      case 'Member':
      default:
        return <MemberDashboard />;
    }
  };

  return (
    <div className={containerStyle}>
      {/* Header */}
      <div className={headerStyle}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={{ root: { width: '100%', height: '48px' } }}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#ffffff',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <img 
                src="http://localhost:5000/uploads/profiles/BookNest Digital Library-logo.png"
                alt="BookNest Digital Library"
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <Stack tokens={{ childrenGap: 1 }}>
              <Text styles={{
                root: {
                  fontWeight: '600',
                  color: isDark ? '#ffffff' : '#323130',
                  fontSize: '15px',
                  lineHeight: '1.2',
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif'
                }
              }}>
                BookNest Digital Library
              </Text>
              <Text styles={{
                root: {
                  fontWeight: '400',
                  color: isDark ? '#c8c6c4' : '#605e5c',
                  fontSize: '11px',
                  lineHeight: '1'
                }
              }}>
                Library Management System
              </Text>
            </Stack>
          </Stack>

          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <TextField
              placeholder="Search"
              value={searchValue}
              onChange={(e, newValue) => setSearchValue(newValue || '')}
              styles={{
                root: { width: '240px' },
                fieldGroup: {
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  borderRadius: '2px',
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px',
                  ':after': { display: 'none' },
                  ':hover': { borderColor: isDark ? '#605e5c' : '#323130' }
                },
                field: {
                  fontSize: '14px',
                  color: isDark ? '#ffffff' : '#323130',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  height: '30px',
                  paddingLeft: '8px',
                  paddingRight: searchValue ? '60px' : '32px'
                }
              }}
              suffix={
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  {searchValue && (
                    <IconButton
                      iconProps={{ iconName: 'Cancel' }}
                      onClick={() => setSearchValue('')}
                      styles={{
                        root: {
                          width: '20px',
                          height: '20px',
                          color: isDark ? '#a19f9d' : '#605e5c'
                        }
                      }}
                    />
                  )}
                  <Icon 
                    iconName="Search" 
                    styles={{
                      root: {
                        color: isDark ? '#a19f9d' : '#605e5c',
                        fontSize: '14px'
                      }
                    }}
                  />
                </Stack>
              }
            />

            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <div 
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: user?.profilePicture 
                    ? `url(http://localhost:5000${user.profilePicture}) center/cover` 
                    : (user?.role === 'Admin' ? '#d13438' : user?.role === 'Librarian' ? '#107c10' : '#0078d4'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={() => setIsProfileEditOpen(true)}
                title="Click to edit profile"
              >
                {!user?.profilePicture && (user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <Stack tokens={{ childrenGap: 2 }} onClick={() => setIsProfileEditOpen(true)} style={{ cursor: 'pointer' }}>
                <Text styles={{
                  root: {
                    fontWeight: '400',
                    color: isDark ? '#ffffff' : '#323130',
                    fontSize: '14px'
                  }
                }}>
                  {user?.name || 'User'}
                </Text>
                <Text styles={{
                  root: {
                    color: user?.role === 'Admin' ? '#d13438' : user?.role === 'Librarian' ? '#107c10' : '#0078d4',
                    fontSize: '12px',
                    fontWeight: '600'
                  }
                }}>
                  {user?.role || 'Member'}
                </Text>
              </Stack>
            </Stack>

            <div style={{ position: 'relative' }}>
              <IconButton
                iconProps={{ iconName: 'Ringer' }}
                onClick={() => setIsNotificationOpen(true)}
                title="Notifications"
                styles={{
                  root: {
                    width: '32px',
                    height: '32px',
                    color: isDark ? '#ffffff' : '#323130',
                    ':hover': {
                      backgroundColor: isDark ? '#484644' : '#f3f2f1'
                    }
                  }
                }}
              />
              {notifications.filter(n => !n.read).length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: '#d13438',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '1px 4px',
                  fontSize: '9px',
                  fontWeight: '600',
                  minWidth: '14px',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  pointerEvents: 'none'
                }}>
                  {notifications.filter(n => !n.read).length}
                </div>
              )}
            </div>

            <IconButton
              iconProps={{ iconName: 'Megaphone' }}
              onClick={() => setIsNoticeOpen(true)}
              title="Library Notices"
              styles={{
                root: {
                  width: '32px',
                  height: '32px',
                  color: isDark ? '#ffffff' : '#323130',
                  ':hover': {
                    backgroundColor: isDark ? '#484644' : '#f3f2f1'
                  }
                }
              }}
            />

            <IconButton
              iconProps={{ iconName: 'Calendar' }}
              onClick={() => setIsCalendarOpen(true)}
              title="Events Calendar"
              styles={{
                root: {
                  width: '32px',
                  height: '32px',
                  color: isDark ? '#ffffff' : '#323130',
                  ':hover': {
                    backgroundColor: isDark ? '#484644' : '#f3f2f1'
                  }
                }
              }}
            />

            <IconButton
              iconProps={{ iconName: 'Help' }}
              onClick={() => setIsHelpDeskOpen(true)}
              title="Help Desk"
              styles={{
                root: {
                  width: '32px',
                  height: '32px',
                  color: isDark ? '#ffffff' : '#323130',
                  ':hover': {
                    backgroundColor: isDark ? '#484644' : '#f3f2f1'
                  }
                }
              }}
            />

            <IconButton
              iconProps={{ iconName: 'Settings' }}
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              styles={{
                root: {
                  width: '32px',
                  height: '32px',
                  color: isDark ? '#ffffff' : '#323130',
                  ':hover': {
                    backgroundColor: isDark ? '#484644' : '#f3f2f1'
                  }
                }
              }}
            />

            <IconButton
              iconProps={{ iconName: 'SignOut' }}
              onClick={handleLogout}
              title="Sign out"
              styles={{
                root: {
                  width: '32px',
                  height: '32px',
                  color: '#d13438',
                  ':hover': {
                    backgroundColor: 'rgba(209, 52, 56, 0.1)'
                  }
                }
              }}
            />
          </Stack>
        </Stack>
      </div>

      {/* Running Ticker */}
      <div style={{
        height: '30px',
        background: isDark ? '#323130' : '#f8f7f4',
        borderBottom: `1px solid ${isDark ? '#484644' : '#edebe9'}`,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute',
          whiteSpace: 'nowrap',
          animation: 'scroll-right-to-left 30s linear infinite',
          fontSize: '14px',
          fontWeight: '500',
          color: isDark ? '#ffffff' : '#323130'
        }}>
          Welcome to BookNest Digital Library • Today: {currentTime.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • Current Time: {currentTime.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
          })} • Your Premier Digital Library Experience
        </div>
      </div>

      <style>
        {`
          @keyframes scroll-right-to-left {
            0% {
              transform: translateX(100vw);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>

      {/* Dashboard Content */}
      {renderDashboard()}

      {/* Footer */}
      <Footer />

      {/* Profile Edit Panel */}
      <ProfileEdit 
        isOpen={isProfileEditOpen} 
        onDismiss={() => setIsProfileEditOpen(false)} 
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onDismiss={() => setIsNotificationOpen(false)}
        user={user}
      />

      {/* Notice Panel */}
      <NoticePanel
        isOpen={isNoticeOpen}
        onDismiss={() => setIsNoticeOpen(false)}
        user={user}
      />

      {/* Calendar Panel */}
      <CalendarPanel
        isOpen={isCalendarOpen}
        onDismiss={() => setIsCalendarOpen(false)}
        user={user}
      />

      {/* Help Desk Panel */}
      <HelpDeskPanel
        isOpen={isHelpDeskOpen}
        onDismiss={() => setIsHelpDeskOpen(false)}
        user={user}
      />

      {/* Settings Panel */}
      <ProfessionalSettings
        isOpen={isSettingsOpen}
        onDismiss={() => setIsSettingsOpen(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        user={user}
      />
    </div>
  );
};

export default RoleDashboard;