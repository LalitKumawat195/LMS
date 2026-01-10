import React, { useState } from 'react';
import {
  Panel,
  PanelType,
  Stack,
  Text,
  Toggle,
  Separator,
  Icon,
  mergeStyles,
  FontWeights,
  getTheme
} from '@fluentui/react';

const ProfessionalSettings = ({ isOpen, onDismiss, isDark, toggleTheme, user }) => {
  const theme = getTheme();
  
  const settingsContainerStyle = mergeStyles({
    background: isDark ? '#1e1e1e' : '#ffffff',
    height: '100%',
    fontFamily: 'Segoe UI, system-ui, sans-serif'
  });

  const settingsHeaderStyle = mergeStyles({
    padding: '24px 32px 16px 32px',
    borderBottom: `1px solid ${isDark ? '#323130' : '#e1dfdd'}`,
    background: isDark ? '#252423' : '#faf9f8'
  });

  const settingsGroupStyle = mergeStyles({
    padding: '24px 32px',
    borderBottom: `1px solid ${isDark ? '#323130' : '#f3f2f1'}`,
    ':last-child': {
      borderBottom: 'none'
    }
  });

  const settingsItemStyle = mergeStyles({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    minHeight: '48px'
  });

  const getSettingsGroups = () => {
    const baseGroups = [
      {
        title: 'Personalization',
        icon: 'Color',
        items: [
          {
            title: 'Choose your mode',
            description: 'Dark mode uses darker colors to help reduce eye strain',
            control: (
              <Toggle
                checked={isDark}
                onChange={toggleTheme}
                onText="Dark"
                offText="Light"
                styles={{
                  pill: {
                    width: '40px',
                    height: '20px',
                    borderRadius: '10px',
                    background: isDark ? '#0078d4' : '#d2d0ce'
                  },
                  thumb: {
                    width: '16px',
                    height: '16px',
                    borderRadius: '8px'
                  }
                }}
              />
            )
          },
          {
            title: 'Language',
            description: 'Choose your preferred language for the interface',
            control: <Toggle defaultChecked />
          },
          {
            title: 'Time format',
            description: 'Display time in 12-hour or 24-hour format',
            control: <Toggle />
          }
        ]
      },
      {
        title: 'Privacy',
        icon: 'Shield',
        items: [
          {
            title: 'Activity tracking',
            description: 'Allow the system to track your activity for analytics',
            control: <Toggle defaultChecked />
          },
          {
            title: 'Data sharing',
            description: 'Share anonymous usage data to improve the service',
            control: <Toggle />
          }
        ]
      }
    ];

    if (user?.role === 'Member') {
      baseGroups.push({
        title: 'Notifications',
        icon: 'Ringer',
        items: [
          { title: 'Due date reminders', description: 'Get notified before books are due', control: <Toggle defaultChecked /> },
          { title: 'New arrivals', description: 'Notifications about new books in your interests', control: <Toggle defaultChecked /> },
          { title: 'Reservation alerts', description: 'When reserved books become available', control: <Toggle defaultChecked /> },
          { title: 'Fine notifications', description: 'Get notified about outstanding fines', control: <Toggle defaultChecked /> },
          { title: 'Event announcements', description: 'Library events and program notifications', control: <Toggle /> }
        ]
      });
      
      baseGroups.push({
        title: 'Reading Preferences',
        icon: 'BookAnswers',
        items: [
          { title: 'Reading history', description: 'Keep track of books you\'ve read', control: <Toggle defaultChecked /> },
          { title: 'Book recommendations', description: 'Get personalized book suggestions', control: <Toggle defaultChecked /> },
          { title: 'Reading goals', description: 'Set and track annual reading goals', control: <Toggle /> },
          { title: 'Review reminders', description: 'Remind me to review books I\'ve read', control: <Toggle /> }
        ]
      });
    }

    if (user?.role === 'Librarian') {
      baseGroups.push({
        title: 'Circulation',
        icon: 'BookAnswers',
        items: [
          { title: 'Auto-send overdue notices', description: 'Automatically send notices to members with overdue items', control: <Toggle defaultChecked /> },
          { title: 'Quick checkout', description: 'Enable streamlined checkout process', control: <Toggle /> },
          { title: 'Member photos', description: 'Show member photos during transactions', control: <Toggle defaultChecked /> },
          { title: 'Print receipts', description: 'Automatically print transaction receipts', control: <Toggle /> },
          { title: 'Barcode scanning', description: 'Enable barcode scanner for quick processing', control: <Toggle defaultChecked /> }
        ]
      });
      
      baseGroups.push({
        title: 'Workflow',
        icon: 'Flow',
        items: [
          { title: 'Daily reports', description: 'Generate daily circulation reports', control: <Toggle defaultChecked /> },
          { title: 'Inventory alerts', description: 'Get notified about low stock items', control: <Toggle defaultChecked /> },
          { title: 'Member registration', description: 'Allow walk-in member registration', control: <Toggle /> },
          { title: 'Fine collection', description: 'Enable fine collection during checkout', control: <Toggle defaultChecked /> }
        ]
      });
    }

    if (user?.role === 'Admin') {
      baseGroups.push({
        title: 'System',
        icon: 'ServerEnviroment',
        items: [
          { title: 'Automatic backups', description: 'Schedule regular database backups', control: <Toggle defaultChecked /> },
          { title: 'Security monitoring', description: 'Monitor system for security threats', control: <Toggle defaultChecked /> },
          { title: 'Performance alerts', description: 'Get notified about system performance issues', control: <Toggle defaultChecked /> },
          { title: 'Maintenance mode', description: 'Enable scheduled maintenance windows', control: <Toggle /> },
          { title: 'Error logging', description: 'Log system errors for debugging', control: <Toggle defaultChecked /> }
        ]
      });
      
      baseGroups.push({
        title: 'User Management',
        icon: 'People',
        items: [
          { title: 'Auto-approve registrations', description: 'Automatically approve new member registrations', control: <Toggle /> },
          { title: 'Password policies', description: 'Enforce strong password requirements', control: <Toggle defaultChecked /> },
          { title: 'Session timeouts', description: 'Automatically log out inactive users', control: <Toggle defaultChecked /> },
          { title: 'Role permissions', description: 'Enable granular role-based permissions', control: <Toggle defaultChecked /> }
        ]
      });
      
      baseGroups.push({
        title: 'Reports & Analytics',
        icon: 'BarChart4',
        items: [
          { title: 'Usage analytics', description: 'Track system usage and generate reports', control: <Toggle defaultChecked /> },
          { title: 'Financial reports', description: 'Generate automated financial summaries', control: <Toggle defaultChecked /> },
          { title: 'Member analytics', description: 'Analyze member behavior and preferences', control: <Toggle /> },
          { title: 'Export data', description: 'Allow data export for external analysis', control: <Toggle defaultChecked /> }
        ]
      });
    }

    return baseGroups;
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.medium}
      headerText=""
      hasCloseButton={true}
      styles={{
        main: {
          background: isDark ? '#1e1e1e' : '#ffffff'
        },
        header: {
          display: 'none'
        },
        content: {
          padding: 0
        },
        scrollableContent: {
          height: '100%'
        }
      }}
    >
      <div className={settingsContainerStyle}>
        <div className={settingsHeaderStyle}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
            <Icon 
              iconName="Settings" 
              styles={{ 
                root: { 
                  fontSize: '20px', 
                  color: isDark ? '#ffffff' : '#323130' 
                } 
              }} 
            />
            <Text 
              variant="xLarge" 
              styles={{ 
                root: { 
                  fontWeight: FontWeights.semibold,
                  color: isDark ? '#ffffff' : '#323130'
                } 
              }}
            >
              Settings
            </Text>
          </Stack>
        </div>

        {getSettingsGroups().map((group, groupIndex) => (
          <div key={groupIndex} className={settingsGroupStyle}>
            <Stack tokens={{ childrenGap: 16 }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon 
                  iconName={group.icon} 
                  styles={{ 
                    root: { 
                      fontSize: '16px', 
                      color: '#0078d4' 
                    } 
                  }} 
                />
                <Text 
                  variant="large" 
                  styles={{ 
                    root: { 
                      fontWeight: FontWeights.semibold,
                      color: isDark ? '#ffffff' : '#323130'
                    } 
                  }}
                >
                  {group.title}
                </Text>
              </Stack>
              
              <Stack tokens={{ childrenGap: 8 }}>
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={settingsItemStyle}>
                    <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1 } }}>
                      <Text 
                        variant="medium" 
                        styles={{ 
                          root: { 
                            fontWeight: FontWeights.regular,
                            color: isDark ? '#ffffff' : '#323130'
                          } 
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text 
                        variant="small" 
                        styles={{ 
                          root: { 
                            color: isDark ? '#c8c6c4' : '#605e5c',
                            lineHeight: '16px'
                          } 
                        }}
                      >
                        {item.description}
                      </Text>
                    </Stack>
                    {item.control}
                  </div>
                ))}
              </Stack>
            </Stack>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default ProfessionalSettings;