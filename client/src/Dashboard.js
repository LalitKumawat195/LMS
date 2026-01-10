import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  CommandBar,
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Toggle,
  Panel,
  PanelType,
  IconButton,
  Pivot,
  PivotItem,
  Separator,
  ProgressIndicator,
  MessageBar,
  MessageBarType,
  Shimmer,
  ShimmerElementType,
  mergeStyles,
  FontWeights,
  getTheme,
  Icon
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { success, warning, info } = useNotifications();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPivot, setSelectedPivot] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const theme = getTheme();
  
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 2847,
    availableBooks: 2156,
    issuedBooks: 691,
    overdueBooks: 47,
    totalMembers: 1234,
    activeMembers: 987,
    newMembersThisMonth: 23,
    totalTransactions: 15678,
    transactionsToday: 34,
    revenue: 45670,
    fines: 2340
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced styling with Microsoft design tokens
  const containerStyle = mergeStyles({
    minHeight: '100vh',
    background: isDark 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d30 30%, #323130 70%, #1f1f1f 100%)'
      : 'linear-gradient(135deg, #f8f7f4 0%, #faf9f8 30%, #ffffff 70%, #f3f2f1 100%)',
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDark
        ? 'radial-gradient(circle at 20% 80%, rgba(0, 120, 212, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 110, 190, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 90, 158, 0.02) 0%, transparent 70%)'
        : 'radial-gradient(circle at 20% 80%, rgba(0, 120, 212, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 110, 190, 0.015) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 90, 158, 0.01) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: '10%',
      left: '10%',
      width: '80%',
      height: '80%',
      background: isDark
        ? 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0, 120, 212, 0.015) 90deg, transparent 180deg, rgba(16, 110, 190, 0.01) 270deg, transparent 360deg)'
        : 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0, 120, 212, 0.008) 90deg, transparent 180deg, rgba(16, 110, 190, 0.005) 270deg, transparent 360deg)',
      borderRadius: '50%',
      pointerEvents: 'none',
      animation: 'rotate 120s linear infinite',
      zIndex: 0
    },
    '@keyframes rotate': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  });

  const headerStyle = mergeStyles({
    background: isDark 
      ? '#323130'
      : '#ffffff',
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

  const contentStyle = mergeStyles({
    padding: '32px',
    maxWidth: '1600px',
    margin: '0 auto',
    '@media (max-width: 768px)': {
      padding: '16px'
    }
  });

  const premiumCardStyle = mergeStyles({
    background: isDark 
      ? 'linear-gradient(145deg, #323130 0%, #2d2d30 50%, #323130 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #fafafa 50%, #ffffff 100%)',
    border: `1px solid ${isDark ? 'rgba(72, 70, 68, 0.6)' : 'rgba(210, 208, 206, 0.6)'}`,
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: isDark 
      ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      : '0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px) saturate(180%)',
    ':hover': {
      transform: 'translateY(-2px) scale(1.005)',
      borderColor: isDark ? 'rgba(0, 120, 212, 0.3)' : 'rgba(0, 120, 212, 0.2)',
      boxShadow: isDark 
        ? '0 12px 48px rgba(0, 0, 0, 0.4), 0 6px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        : '0 12px 48px rgba(0, 0, 0, 0.08), 0 6px 24px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)'
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'linear-gradient(90deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
      borderRadius: '12px 12px 0 0',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    ':hover::before': {
      opacity: 1
    }
  });

  const kpiCardStyle = mergeStyles({
    background: isDark 
      ? 'linear-gradient(135deg, #323130 0%, #2d2d30 50%, #323130 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
    border: `1px solid ${isDark ? 'rgba(72, 70, 68, 0.5)' : 'rgba(210, 208, 206, 0.5)'}`,
    borderRadius: '16px',
    padding: '32px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isDark
      ? '0 12px 48px rgba(0, 0, 0, 0.3), 0 6px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      : '0 12px 48px rgba(0, 0, 0, 0.06), 0 6px 24px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px) saturate(180%)',
    ':hover': {
      transform: 'translateY(-6px) scale(1.02)',
      borderColor: isDark ? 'rgba(0, 120, 212, 0.4)' : 'rgba(0, 120, 212, 0.3)',
      boxShadow: isDark
        ? '0 20px 80px rgba(0, 0, 0, 0.4), 0 12px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        : '0 20px 80px rgba(0, 0, 0, 0.08), 0 12px 40px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)'
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
      borderRadius: '16px 16px 0 0',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    ':hover::before': {
      opacity: 1
    }
  });

  const gradientTextStyle = mergeStyles({
    background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: FontWeights.bold
  });

  // Business Logic: Calculate KPIs
  const kpis = {
    utilizationRate: ((dashboardData.issuedBooks / dashboardData.totalBooks) * 100).toFixed(1),
    memberEngagement: ((dashboardData.activeMembers / dashboardData.totalMembers) * 100).toFixed(1),
    overdueRate: ((dashboardData.overdueBooks / dashboardData.issuedBooks) * 100).toFixed(1),
    dailyTransactionRate: (dashboardData.transactionsToday / dashboardData.totalTransactions * 100).toFixed(2)
  };

  // Enhanced alert system
  useEffect(() => {
    if (kpis.overdueRate > 5) {
      warning(`Critical: ${kpis.overdueRate}% overdue rate requires immediate attention`);
    }
    if (kpis.utilizationRate < 20) {
      info(`Opportunity: ${kpis.utilizationRate}% utilization - Consider promotional campaigns`);
    }
  }, [kpis.overdueRate, kpis.utilizationRate, warning, info]);

  const handleLogout = () => {
    success('Session terminated successfully');
    setTimeout(() => logout(), 1000);
  };

  const commandBarItems = [
    {
      key: 'logo',
      onRender: () => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #0078d4, #106ebe)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: FontWeights.bold
          }}>
            LMS
          </div>
          <Text variant="large" styles={{
            root: {
              fontWeight: FontWeights.bold,
              color: isDark ? '#ffffff' : '#323130',
              fontSize: '18px',
              letterSpacing: '-0.2px'
            }
          }}>
            Library Management System
          </Text>
        </Stack>
      )
    }
  ];

  const commandBarFarItems = [
    {
      key: 'search',
      onRender: () => (
        <SearchBox 
          placeholder="Search resources, members..."
          styles={{
            root: { 
              width: '300px', 
              marginRight: '24px'
            },
            field: {
              fontSize: '14px',
              borderRadius: '20px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
              background: isDark 
                ? 'rgba(255, 255, 255, 0.06)' 
                : 'rgba(0, 0, 0, 0.02)',
              height: '36px',
              paddingLeft: '16px',
              transition: 'all 0.3s ease',
              ':focus': {
                borderColor: '#0078d4',
                boxShadow: '0 0 0 2px rgba(0, 120, 212, 0.2)',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff'
              },
              ':hover': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)'
              }
            },
            iconContainer: {
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
            }
          }}
          onSearch={(value) => info(`Searching: ${value}`)}
        />
      )
    },
    {
      key: 'notifications',
      onRender: () => (
        <div style={{ position: 'relative', marginRight: '16px' }}>
          <IconButton
            iconProps={{ iconName: 'Ringer' }}
            onClick={() => info(`${dashboardData.overdueBooks} items require attention`)}
            styles={{
              root: {
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                color: dashboardData.overdueBooks > 0 ? '#d13438' : (isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'),
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease',
                ':hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  color: dashboardData.overdueBooks > 0 ? '#d13438' : '#0078d4'
                }
              }
            }}
          />
          {dashboardData.overdueBooks > 0 && (
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#d13438',
              color: 'white',
              fontSize: '10px',
              fontWeight: FontWeights.bold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${isDark ? '#2a2a2a' : '#ffffff'}`
            }}>
              {dashboardData.overdueBooks}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'settings',
      onRender: () => (
        <IconButton
          iconProps={{ iconName: 'Settings' }}
          onClick={() => setIsSettingsOpen(true)}
          styles={{
            root: {
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
              backgroundColor: 'transparent',
              marginRight: '8px',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                color: '#0078d4',
                transform: 'rotate(90deg)'
              }
            }
          }}
        />
      )
    },
    {
      key: 'theme',
      onRender: () => (
        <div style={{ marginRight: '20px' }}>
          <Toggle
            checked={isDark}
            onChange={toggleTheme}
            styles={{ 
              root: { 
                marginBottom: 0
              },
              pill: {
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: isDark ? '#0078d4' : 'rgba(0, 0, 0, 0.16)',
                border: 'none',
                transition: 'all 0.3s ease',
                ':hover': {
                  background: isDark ? '#106ebe' : 'rgba(0, 0, 0, 0.24)'
                }
              },
              thumb: {
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }
            }}
            ariaLabel="Toggle dark mode"
          />
        </div>
      )
    },
    {
      key: 'user',
      onRender: () => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }} style={{ marginRight: '20px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0078d4, #106ebe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: FontWeights.semibold
          }}>
            {(user?.name || 'Admin').charAt(0).toUpperCase()}
          </div>
          <Stack tokens={{ childrenGap: 2 }}>
            <Text variant="medium" styles={{
              root: {
                fontWeight: FontWeights.semibold,
                color: isDark ? '#ffffff' : '#323130',
                fontSize: '14px'
              }
            }}>
              {user?.name || 'Administrator'}
            </Text>
            <Text variant="small" styles={{
              root: {
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: '12px'
              }
            }}>
              System Admin
            </Text>
          </Stack>
        </Stack>
      )
    },
    {
      key: 'logout',
      onRender: () => (
        <IconButton
          iconProps={{ iconName: 'SignOut' }}
          onClick={handleLogout}
          title="Sign out"
          styles={{
            root: {
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              color: '#d13438',
              backgroundColor: 'transparent',
              marginRight: '8px',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: 'rgba(209, 52, 56, 0.1)',
                color: '#d13438'
              }
            }
          }}
        />
      )
    }
  ];

  // Enhanced transaction data with better formatting
  const recentTransactions = [
    { 
      key: '1', 
      type: 'Issue', 
      book: 'Advanced Database Systems', 
      member: 'Dr. John Smith (Faculty ID: F1001)', 
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString(),
      status: 'Active',
      fine: '$0.00',
      priority: 'Normal'
    },
    { 
      key: '2', 
      type: 'Return', 
      book: 'Software Engineering Principles', 
      member: 'Sarah Johnson (Student ID: S1002)', 
      date: new Date(Date.now() - 24*60*60*1000).toLocaleDateString(),
      dueDate: new Date(Date.now() - 24*60*60*1000).toLocaleDateString(),
      status: 'Completed',
      fine: '$0.00',
      priority: 'Normal'
    },
    { 
      key: '3', 
      type: 'Overdue', 
      book: 'Network Security Fundamentals', 
      member: 'Prof. Mike Davis (Faculty ID: F1003)', 
      date: new Date(Date.now() - 20*24*60*60*1000).toLocaleDateString(),
      dueDate: new Date(Date.now() - 6*24*60*60*1000).toLocaleDateString(),
      status: 'Critical',
      fine: '$15.00',
      priority: 'High'
    },
    { 
      key: '4', 
      type: 'Renewal', 
      book: 'Machine Learning Applications', 
      member: 'Lisa Wilson (Graduate ID: G1004)', 
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString(),
      status: 'Active',
      fine: '$0.00',
      priority: 'Normal'
    }
  ];

  const transactionColumns = [
    { 
      key: 'type', 
      name: 'Transaction', 
      fieldName: 'type', 
      minWidth: 100, 
      maxWidth: 120,
      onRender: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 
              item.type === 'Overdue' ? '#d13438' : 
              item.type === 'Return' ? '#107c10' : 
              item.type === 'Issue' ? '#0078d4' : '#ff8c00'
          }} />
          <Text styles={{ 
            root: { 
              fontWeight: FontWeights.semibold,
              color: 
                item.type === 'Overdue' ? '#d13438' : 
                item.type === 'Return' ? '#107c10' : 
                isDark ? '#ffffff' : '#323130'
            } 
          }}>
            {item.type}
          </Text>
        </div>
      )
    },
    { 
      key: 'book', 
      name: 'Resource', 
      fieldName: 'book', 
      minWidth: 220, 
      maxWidth: 300,
      onRender: (item) => (
        <Text styles={{ 
          root: { 
            fontWeight: FontWeights.regular,
            color: isDark ? '#e1dfdd' : '#323130'
          } 
        }}>
          {item.book}
        </Text>
      )
    },
    { 
      key: 'member', 
      name: 'Member Details', 
      fieldName: 'member', 
      minWidth: 200, 
      maxWidth: 250,
      onRender: (item) => (
        <Text styles={{ 
          root: { 
            fontSize: '13px',
            color: isDark ? '#c8c6c4' : '#605e5c'
          } 
        }}>
          {item.member}
        </Text>
      )
    },
    { 
      key: 'status', 
      name: 'Status', 
      fieldName: 'status', 
      minWidth: 100, 
      maxWidth: 120,
      onRender: (item) => (
        <div style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: FontWeights.semibold,
          textAlign: 'center',
          backgroundColor: 
            item.status === 'Critical' ? 'rgba(209, 52, 56, 0.1)' :
            item.status === 'Completed' ? 'rgba(16, 124, 16, 0.1)' :
            'rgba(0, 120, 212, 0.1)',
          color: 
            item.status === 'Critical' ? '#d13438' :
            item.status === 'Completed' ? '#107c10' :
            '#0078d4',
          border: `1px solid ${
            item.status === 'Critical' ? 'rgba(209, 52, 56, 0.2)' :
            item.status === 'Completed' ? 'rgba(16, 124, 16, 0.2)' :
            'rgba(0, 120, 212, 0.2)'
          }`
        }}>
          {item.status}
        </div>
      )
    },
    { 
      key: 'fine', 
      name: 'Amount Due', 
      fieldName: 'fine', 
      minWidth: 100, 
      maxWidth: 120,
      onRender: (item) => (
        <Text styles={{ 
          root: { 
            fontWeight: item.fine !== '$0.00' ? FontWeights.bold : FontWeights.regular,
            color: item.fine !== '$0.00' ? '#d13438' : (isDark ? '#c8c6c4' : '#605e5c'),
            fontSize: '14px'
          } 
        }}>
          {item.fine}
        </Text>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className={containerStyle}>
        <div className={headerStyle}>
          <div style={{ padding: '12px 32px' }}>
            <Shimmer 
              shimmerElements={[
                { type: ShimmerElementType.line, width: '200px', height: 24 }
              ]}
            />
          </div>
        </div>
        <div className={contentStyle}>
          <Stack tokens={{ childrenGap: 24 }}>
            {[1, 2, 3].map(i => (
              <Shimmer 
                key={i}
                shimmerElements={[
                  { type: ShimmerElementType.line, width: '100%', height: 120 }
                ]}
              />
            ))}
          </Stack>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <div className={headerStyle} style={{ position: 'relative', zIndex: 10 }}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={{ root: { width: '100%', height: '48px' } }}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: '#0078d4',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              LMS
            </div>
            <Text styles={{
              root: {
                fontWeight: '600',
                color: isDark ? '#ffffff' : '#323130',
                fontSize: '14px'
              }
            }}>
              Library Management System
            </Text>
          </Stack>

          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <TextField
              placeholder="Search"
              value={searchValue}
              onChange={(e, newValue) => setSearchValue(newValue || '')}
              styles={{
                root: {
                  width: '240px'
                },
                fieldGroup: {
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  borderRadius: '2px',
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px',
                  ':after': {
                    display: 'none'
                  },
                  ':hover': {
                    borderColor: isDark ? '#605e5c' : '#323130'
                  }
                },
                field: {
                  fontSize: '14px',
                  color: isDark ? '#ffffff' : '#323130',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  height: '30px',
                  paddingLeft: '8px',
                  paddingRight: searchValue ? '60px' : '32px',
                  ':focus': {
                    outline: 'none'
                  }
                },
                suffix: {
                  background: 'transparent',
                  border: 'none',
                  padding: '0 8px 0 0'
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
                          color: isDark ? '#a19f9d' : '#605e5c',
                          ':hover': {
                            backgroundColor: isDark ? '#484644' : '#f3f2f1',
                            color: isDark ? '#ffffff' : '#323130'
                          }
                        },
                        icon: {
                          fontSize: '12px'
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
              onFocus={(e) => {
                e.target.parentElement.style.borderColor = '#0078d4';
              }}
              onBlur={(e) => {
                e.target.parentElement.style.borderColor = isDark ? '#484644' : '#d2d0ce';
              }}
            />

            <div style={{ position: 'relative' }}>
              <IconButton
                iconProps={{ iconName: 'Ringer' }}
                onClick={() => info(`${dashboardData.overdueBooks} notifications`)}
                styles={{
                  root: {
                    width: '32px',
                    height: '32px',
                    color: dashboardData.overdueBooks > 0 ? '#d13438' : (isDark ? '#ffffff' : '#323130'),
                    ':hover': {
                      backgroundColor: isDark ? '#484644' : '#f3f2f1'
                    }
                  }
                }}
              />
              {dashboardData.overdueBooks > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#d13438',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: `2px solid ${isDark ? '#323130' : '#ffffff'}`
                }}>
                  {dashboardData.overdueBooks > 99 ? '99+' : dashboardData.overdueBooks}
                </div>
              )}
            </div>

            <IconButton
              iconProps={{ iconName: 'Settings' }}
              onClick={() => setIsSettingsOpen(true)}
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

            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#0078d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <Text styles={{
                root: {
                  fontWeight: '400',
                  color: isDark ? '#ffffff' : '#323130',
                  fontSize: '14px'
                }
              }}>
                {user?.name || 'Administrator'}
              </Text>
            </Stack>

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

      <div className={contentStyle}>
        <Stack tokens={{ childrenGap: 32 }}>
          {/* Enhanced Business Header */}
          <Stack tokens={{ childrenGap: 12 }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="xxLarge" className={gradientTextStyle} styles={{ 
                  root: { 
                    fontSize: '32px',
                    letterSpacing: '-0.5px'
                  } 
                }}>
                  Operations Command Center
                </Text>
                <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
                  <Text variant="medium" styles={{ 
                    root: { 
                      color: isDark ? '#c8c6c4' : '#605e5c',
                      fontSize: '14px'
                    } 
                  }}>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? '#c8c6c4' : '#605e5c'
                  }} />
                  <Text variant="medium" styles={{ 
                    root: { 
                      color: '#0078d4',
                      fontWeight: FontWeights.semibold
                    } 
                  }}>
                    {dashboardData.transactionsToday} transactions today
                  </Text>
                </Stack>
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 16 }}>
                <PrimaryButton 
                  text="Issue Resource" 
                  iconProps={{ iconName: 'Add' }}
                  onClick={() => success('Opening resource issue workflow...')}
                  styles={{
                    root: {
                      borderRadius: '6px',
                      fontWeight: FontWeights.semibold,
                      boxShadow: '0 2px 8px rgba(0, 120, 212, 0.3)'
                    }
                  }}
                />
                <DefaultButton 
                  text="Analytics Report" 
                  iconProps={{ iconName: 'BarChart4' }}
                  onClick={() => info('Generating comprehensive analytics...')}
                  styles={{
                    root: {
                      borderRadius: '6px',
                      fontWeight: FontWeights.semibold
                    }
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Enhanced Business Alerts */}
          {kpis.overdueRate > 5 && (
            <MessageBar
              messageBarType={MessageBarType.severeWarning}
              styles={{ 
                root: { 
                  borderRadius: '8px',
                  border: '1px solid rgba(209, 52, 56, 0.2)',
                  boxShadow: '0 4px 12px rgba(209, 52, 56, 0.1)'
                } 
              }}
            >
              <strong>Critical Alert:</strong> Overdue rate at {kpis.overdueRate}% exceeds acceptable threshold. 
              Immediate intervention required for collection management.
            </MessageBar>
          )}

          {/* Enhanced Navigation */}
          <Pivot
            selectedKey={selectedPivot}
            onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
            styles={{
              root: {
                borderBottom: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`
              },
              link: {
                fontSize: '16px',
                fontWeight: FontWeights.semibold,
                padding: '12px 24px',
                margin: '0 8px',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.3s ease'
              },
              linkIsSelected: {
                backgroundColor: isDark ? 'rgba(79, 195, 247, 0.1)' : 'rgba(0, 120, 212, 0.05)',
                color: '#0078d4'
              }
            }}
          >
            <PivotItem headerText="Executive Overview" itemKey="overview" />
            <PivotItem headerText="Resource Management" itemKey="inventory" />
            <PivotItem headerText="Member Services" itemKey="members" />
            <PivotItem headerText="Financial Analytics" itemKey="reports" />
            <PivotItem headerText="System Intelligence" itemKey="analytics" />
          </Pivot>

          {selectedPivot === 'overview' && (
            <Stack tokens={{ childrenGap: 32 }}>
              {/* Enhanced KPI Section */}
              <Stack tokens={{ childrenGap: 20 }}>
                <Text variant="xLarge" styles={{ 
                  root: { 
                    fontWeight: FontWeights.bold,
                    color: isDark ? '#ffffff' : '#323130',
                    fontSize: '20px'
                  } 
                }}>
                  Performance Metrics
                </Text>
                <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
                  <div className={kpiCardStyle} style={{ flex: '1 1 320px', minWidth: '300px' }}>
                    <Stack tokens={{ childrenGap: 16 }}>
                      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                          Collection Utilization
                        </Text>
                        <IconButton 
                          iconProps={{ iconName: 'BookAnswers' }} 
                          styles={{
                            root: {
                              color: '#0078d4',
                              fontSize: '20px'
                            }
                          }}
                        />
                      </Stack>
                      <Text variant="mega" styles={{ 
                        root: { 
                          fontWeight: FontWeights.bold,
                          fontSize: '42px',
                          lineHeight: '48px',
                          background: 'linear-gradient(135deg, #0078d4, #106ebe)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        } 
                      }}>
                        {kpis.utilizationRate}%
                      </Text>
                      <ProgressIndicator 
                        percentComplete={parseFloat(kpis.utilizationRate) / 100} 
                        styles={{
                          progressBar: {
                            backgroundColor: parseFloat(kpis.utilizationRate) > 50 ? '#107c10' : '#ff8c00',
                            height: '6px',
                            borderRadius: '3px'
                          },
                          progressTrack: {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            height: '6px',
                            borderRadius: '3px'
                          }
                        }}
                      />
                      <Stack horizontal horizontalAlign="space-between">
                        <Text variant="small" styles={{ 
                          root: { 
                            color: isDark ? '#c8c6c4' : '#605e5c',
                            fontWeight: FontWeights.regular
                          } 
                        }}>
                          {dashboardData.issuedBooks.toLocaleString()} active
                        </Text>
                        <Text variant="small" styles={{ 
                          root: { 
                            color: isDark ? '#c8c6c4' : '#605e5c',
                            fontWeight: FontWeights.regular
                          } 
                        }}>
                          {dashboardData.totalBooks.toLocaleString()} total
                        </Text>
                      </Stack>
                    </Stack>
                  </div>

                  <div className={kpiCardStyle} style={{ flex: '1 1 320px', minWidth: '300px' }}>
                    <Stack tokens={{ childrenGap: 16 }}>
                      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                          Member Engagement
                        </Text>
                        <IconButton 
                          iconProps={{ iconName: 'People' }} 
                          styles={{
                            root: {
                              color: '#107c10',
                              fontSize: '20px'
                            }
                          }}
                        />
                      </Stack>
                      <Text variant="mega" styles={{ 
                        root: { 
                          fontWeight: FontWeights.bold,
                          fontSize: '42px',
                          lineHeight: '48px',
                          background: 'linear-gradient(135deg, #107c10, #0b5394)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        } 
                      }}>
                        {kpis.memberEngagement}%
                      </Text>
                      <ProgressIndicator 
                        percentComplete={parseFloat(kpis.memberEngagement) / 100}
                        styles={{
                          progressBar: {
                            backgroundColor: '#107c10',
                            height: '6px',
                            borderRadius: '3px'
                          },
                          progressTrack: {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            height: '6px',
                            borderRadius: '3px'
                          }
                        }}
                      />
                      <Stack horizontal horizontalAlign="space-between">
                        <Text variant="small" styles={{ 
                          root: { 
                            color: isDark ? '#c8c6c4' : '#605e5c',
                            fontWeight: FontWeights.regular
                          } 
                        }}>
                          {dashboardData.activeMembers.toLocaleString()} active
                        </Text>
                        <Text variant="small" styles={{ 
                          root: { 
                            color: isDark ? '#c8c6c4' : '#605e5c',
                            fontWeight: FontWeights.regular
                          } 
                        }}>
                          {dashboardData.totalMembers.toLocaleString()} total
                        </Text>
                      </Stack>
                    </Stack>
                  </div>

                  <div className={kpiCardStyle} style={{ flex: '1 1 320px', minWidth: '300px' }}>
                    <Stack tokens={{ childrenGap: 16 }}>
                      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                          Collection Health
                        </Text>
                        <IconButton 
                          iconProps={{ iconName: 'Warning' }} 
                          styles={{
                            root: {
                              color: parseFloat(kpis.overdueRate) > 5 ? '#d13438' : '#107c10',
                              fontSize: '20px'
                            }
                          }}
                        />
                      </Stack>
                      <Text variant="mega" styles={{ 
                        root: { 
                          fontWeight: FontWeights.bold,
                          fontSize: '42px',
                          lineHeight: '48px',
                          background: parseFloat(kpis.overdueRate) > 5 
                            ? 'linear-gradient(135deg, #d13438, #a4262c)'
                            : 'linear-gradient(135deg, #107c10, #0b5394)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        } 
                      }}>
                        {kpis.overdueRate}%
                      </Text>
                      <ProgressIndicator 
                        percentComplete={Math.min(parseFloat(kpis.overdueRate) / 10, 1)}
                        styles={{
                          progressBar: {
                            backgroundColor: parseFloat(kpis.overdueRate) > 5 ? '#d13438' : '#107c10',
                            height: '6px',
                            borderRadius: '3px'
                          },
                          progressTrack: {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            height: '6px',
                            borderRadius: '3px'
                          }
                        }}
                      />
                      <Stack horizontal horizontalAlign="space-between">
                        <Text variant="small" styles={{ 
                          root: { 
                            color: parseFloat(kpis.overdueRate) > 5 ? '#d13438' : (isDark ? '#c8c6c4' : '#605e5c'),
                            fontWeight: FontWeights.semibold
                          } 
                        }}>
                          {dashboardData.overdueBooks} overdue
                        </Text>
                        <Text variant="small" styles={{ 
                          root: { 
                            color: isDark ? '#c8c6c4' : '#605e5c',
                            fontWeight: FontWeights.regular
                          } 
                        }}>
                          Action required
                        </Text>
                      </Stack>
                    </Stack>
                  </div>
                </Stack>
              </Stack>

              <Separator styles={{ 
                root: { 
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                  height: '2px'
                } 
              }} />

              {/* Enhanced Financial Overview */}
              <Stack tokens={{ childrenGap: 20 }}>
                <Text variant="xLarge" styles={{ 
                  root: { 
                    fontWeight: FontWeights.bold,
                    color: isDark ? '#ffffff' : '#323130',
                    fontSize: '20px'
                  } 
                }}>
                  Financial Performance
                </Text>
                <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
                  <div className={premiumCardStyle} style={{ flex: '1 1 280px', minWidth: '260px' }}>
                    <Stack tokens={{ childrenGap: 12 }}>
                      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                          Total Revenue
                        </Text>
                        <IconButton 
                          iconProps={{ iconName: 'Money' }} 
                          styles={{ root: { color: '#107c10', fontSize: '18px' } }}
                        />
                      </Stack>
                      <Text variant="xxLarge" styles={{ 
                        root: { 
                          fontWeight: FontWeights.bold,
                          color: '#107c10',
                          fontSize: '36px'
                        } 
                      }}>
                        ${dashboardData.revenue.toLocaleString()}
                      </Text>
                      <Text variant="small" styles={{ 
                        root: { 
                          color: isDark ? '#c8c6c4' : '#605e5c',
                          fontSize: '13px'
                        } 
                      }}>
                        Membership fees, services & penalties
                      </Text>
                    </Stack>
                  </div>

                  <div className={premiumCardStyle} style={{ flex: '1 1 280px', minWidth: '260px' }}>
                    <Stack tokens={{ childrenGap: 12 }}>
                      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                          Outstanding Fines
                        </Text>
                        <IconButton 
                          iconProps={{ iconName: 'PaymentCard' }} 
                          styles={{ root: { color: '#d13438', fontSize: '18px' } }}
                        />
                      </Stack>
                      <Text variant="xxLarge" styles={{ 
                        root: { 
                          fontWeight: FontWeights.bold,
                          color: '#d13438',
                          fontSize: '36px'
                        } 
                      }}>
                        ${dashboardData.fines.toLocaleString()}
                      </Text>
                      <Text variant="small" styles={{ 
                        root: { 
                          color: isDark ? '#c8c6c4' : '#605e5c',
                          fontSize: '13px'
                        } 
                      }}>
                        Overdue penalties & damage fees
                      </Text>
                    </Stack>
                  </div>
                </Stack>
              </Stack>

              <Separator styles={{ 
                root: { 
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                  height: '2px'
                } 
              }} />

              {/* Enhanced Transaction History */}
              <Stack tokens={{ childrenGap: 20 }}>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                  <Text variant="xLarge" styles={{ 
                    root: { 
                      fontWeight: FontWeights.bold,
                      color: isDark ? '#ffffff' : '#323130',
                      fontSize: '20px'
                    } 
                  }}>
                    Recent Transaction Activity
                  </Text>
                  <DefaultButton 
                    text="View Complete History" 
                    iconProps={{ iconName: 'ChevronRight' }}
                    onClick={() => info('Loading comprehensive transaction history...')}
                    styles={{
                      root: {
                        borderRadius: '6px',
                        fontWeight: FontWeights.semibold
                      }
                    }}
                  />
                </Stack>
                <div className={premiumCardStyle}>
                  <DetailsList
                    items={recentTransactions}
                    columns={transactionColumns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none}
                    styles={{
                      root: {
                        '.ms-DetailsHeader': {
                          paddingTop: 0,
                          borderBottom: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                          fontWeight: FontWeights.semibold
                        },
                        '.ms-DetailsRow': {
                          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}`,
                          ':hover': {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Stack>
            </Stack>
          )}

          {/* Enhanced placeholder content for other pivots */}
          {selectedPivot !== 'overview' && (
            <div className={premiumCardStyle}>
              <Stack tokens={{ childrenGap: 20 }}>
                <Text variant="xLarge" className={gradientTextStyle}>
                  {selectedPivot === 'inventory' && 'Advanced Resource Management'}
                  {selectedPivot === 'members' && 'Comprehensive Member Services'}
                  {selectedPivot === 'reports' && 'Executive Financial Analytics'}
                  {selectedPivot === 'analytics' && 'Business Intelligence Platform'}
                </Text>
                <Text variant="medium" styles={{ 
                  root: { 
                    color: isDark ? '#c8c6c4' : '#605e5c',
                    lineHeight: '1.6'
                  } 
                }}>
                  {selectedPivot === 'inventory' && 'Comprehensive catalog management with AI-powered recommendations, automated acquisition workflows, and predictive inventory optimization.'}
                  {selectedPivot === 'members' && 'Advanced member lifecycle management with personalized services, automated communications, and engagement analytics.'}
                  {selectedPivot === 'reports' && 'Executive-level financial insights with predictive analytics, cost optimization recommendations, and ROI analysis.'}
                  {selectedPivot === 'analytics' && 'Advanced business intelligence with machine learning insights, predictive modeling, and operational optimization.'}
                </Text>
                <PrimaryButton 
                  text={`Launch ${selectedPivot === 'inventory' ? 'Resource Manager' : selectedPivot === 'members' ? 'Member Portal' : selectedPivot === 'reports' ? 'Analytics Suite' : 'Intelligence Platform'}`}
                  onClick={() => success(`Initializing ${selectedPivot} module...`)}
                  styles={{
                    root: {
                      borderRadius: '6px',
                      fontWeight: FontWeights.semibold,
                      boxShadow: '0 2px 8px rgba(0, 120, 212, 0.3)'
                    }
                  }}
                />
              </Stack>
            </div>
          )}
        </Stack>
      </div>

      {/* Enhanced Settings Panel */}
      <Panel
        isOpen={isSettingsOpen}
        onDismiss={() => setIsSettingsOpen(false)}
        type={PanelType.medium}
        headerText="System Configuration"
        styles={{
          main: {
            background: isDark 
              ? 'linear-gradient(180deg, #2a2a2a 0%, #323130 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)'
          },
          header: {
            borderBottom: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            fontWeight: FontWeights.bold
          }
        }}
      >
        <Stack tokens={{ childrenGap: 32 }} styles={{ root: { padding: '24px 0' } }}>
          <Stack tokens={{ childrenGap: 16 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Interface Preferences
            </Text>
            <Toggle
              label="Dark theme interface"
              checked={isDark}
              onChange={toggleTheme}
              styles={{
                pill: {
                  background: isDark ? '#0078d4' : '#c8c6c4'
                }
              }}
            />
          </Stack>
          <Separator />
          <Stack tokens={{ childrenGap: 16 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Business Rules Engine
            </Text>
            <Toggle label="Automated overdue processing" defaultChecked />
            <Toggle label="Dynamic fine calculations" defaultChecked />
            <Toggle label="Multi-resource restrictions" />
            <Toggle label="Priority member services" defaultChecked />
          </Stack>
          <Separator />
          <Stack tokens={{ childrenGap: 16 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Alert & Notification System
            </Text>
            <Toggle label="Critical system alerts" defaultChecked />
            <Toggle label="Daily operational summaries" defaultChecked />
            <Toggle label="Financial performance reports" />
            <Toggle label="Member engagement insights" defaultChecked />
          </Stack>
        </Stack>
      </Panel>
    </div>
  );
};

export default Dashboard;