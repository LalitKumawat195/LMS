import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelType,
  Stack,
  Text,
  DefaultButton,
  PrimaryButton,
  Dropdown,
  SearchBox,
  CommandBar,
  mergeStyles,
  FontWeights,
  Icon,
  MessageBar,
  MessageBarType,
  Separator,
  Pivot,
  PivotItem,
  ActionButton,
  TooltipHost,
  DirectionalHint,
  Checkbox,
  ContextualMenu,
  ContextualMenuItemType,
  Callout,
  FocusTrapZone,
  Layer,
  Overlay,
  Shimmer,
  ShimmerElementType
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const NotificationPanel = ({ isOpen, onDismiss, user }) => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  const typeOptions = [
    { key: 'All', text: 'All notifications', data: { icon: 'BulletedList' } },
    { key: 'info', text: 'Information', data: { icon: 'Info' } },
    { key: 'success', text: 'Success', data: { icon: 'Completed' } },
    { key: 'warning', text: 'Warnings', data: { icon: 'Warning' } },
    { key: 'error', text: 'Errors', data: { icon: 'Error' } },
    { key: 'system', text: 'System', data: { icon: 'Settings' } }
  ];

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           notification.sender.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || notification.type === filterType;
      const matchesTab = selectedTab === 'all' || 
                        (selectedTab === 'unread' && !notification.read) ||
                        (selectedTab === 'priority' && notification.priority === 'high');
      return matchesSearch && matchesType && matchesTab;
    });
    
    filtered.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    setFilteredNotifications(filtered);
  }, [notifications, searchQuery, filterType, selectedTab]);

  const markAsRead = async (notificationIds) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    try {
      for (const id of ids) {
        await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      await loadNotifications();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await loadNotifications();
      success('All notifications marked as read');
    } catch (err) {
      error('Error marking all as read');
    }
  };

  const deleteNotifications = async (notificationIds) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    try {
      for (const id of ids) {
        await fetch(`http://localhost:5000/api/notifications/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      await loadNotifications();
      success(`${ids.length} notification${ids.length > 1 ? 's' : ''} deleted`);
      setSelectedNotifications(new Set());
    } catch (err) {
      error('Error deleting notifications');
    }
  };

  const handleBulkAction = (action) => {
    const selectedIds = Array.from(selectedNotifications);
    if (selectedIds.length === 0) {
      error('Please select notifications first');
      return;
    }

    switch (action) {
      case 'markRead':
        markAsRead(selectedIds);
        success(`${selectedIds.length} notifications marked as read`);
        break;
      case 'delete':
        deleteNotifications(selectedIds);
        break;
      default:
        break;
    }
    setSelectedNotifications(new Set());
  };

  const toggleNotificationSelection = (notificationId) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(notificationId)) {
      newSelection.delete(notificationId);
    } else {
      newSelection.add(notificationId);
    }
    setSelectedNotifications(newSelection);
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'CompletedSolid';
      case 'warning': return 'WarningSolid';
      case 'error': return 'ErrorBadge';
      case 'system': return 'Settings';
      default: return 'InfoSolid';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#107c10';
      case 'warning': return '#ff8c00';
      case 'error': return '#d13438';
      case 'system': return '#5c2d91';
      default: return '#0078d4';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const contextMenuItems = [
    {
      key: 'markRead',
      text: 'Mark as read',
      iconProps: { iconName: 'ReadingMode' },
      onClick: () => {
        markAsRead(selectedNotificationId);
        setShowContextMenu(false);
      }
    },
    {
      key: 'delete',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      onClick: () => {
        deleteNotifications(selectedNotificationId);
        setShowContextMenu(false);
      }
    },
    {
      key: 'divider',
      itemType: ContextualMenuItemType.Divider
    },
    {
      key: 'details',
      text: 'View details',
      iconProps: { iconName: 'View' },
      onClick: () => {
        success('Notification details opened');
        setShowContextMenu(false);
      }
    }
  ];

  const commandBarItems = [
    {
      key: 'selectAll',
      text: selectedNotifications.size === filteredNotifications.length ? 'Deselect all' : 'Select all',
      iconProps: { iconName: selectedNotifications.size === filteredNotifications.length ? 'CheckboxComposite' : 'Checkbox' },
      onClick: selectAllNotifications,
      disabled: filteredNotifications.length === 0
    },
    {
      key: 'markAllRead',
      text: 'Mark all as read',
      iconProps: { iconName: 'ReadingMode' },
      onClick: markAllAsRead,
      disabled: notifications.filter(n => !n.read).length === 0
    }
  ];

  const commandBarFarItems = [
    {
      key: 'bulkActions',
      text: `Actions (${selectedNotifications.size})`,
      iconProps: { iconName: 'More' },
      disabled: selectedNotifications.size === 0,
      subMenuProps: {
        items: [
          {
            key: 'markRead',
            text: 'Mark as read',
            iconProps: { iconName: 'ReadingMode' },
            onClick: () => handleBulkAction('markRead')
          },
          {
            key: 'delete',
            text: 'Delete selected',
            iconProps: { iconName: 'Delete' },
            onClick: () => handleBulkAction('delete')
          }
        ]
      }
    },
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
        success('Notifications refreshed');
      }
    }
  ];

  const notificationCardStyle = (read, priority, isSelected) => mergeStyles({
    padding: '20px',
    marginBottom: '1px',
    background: isSelected 
      ? (isDark ? '#0d4f8c' : '#deecf9')
      : (isDark ? '#323130' : '#ffffff'),
    border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
    borderLeft: `4px solid ${priority === 'high' ? '#d13438' : (read ? (isDark ? '#484644' : '#e1dfdd') : '#0078d4')}`,
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)',
    ':hover': {
      background: isSelected 
        ? (isDark ? '#106ebe' : '#c7e0f4')
        : (isDark ? '#3b3a39' : '#f8f7f4'),
      borderColor: isDark ? '#605e5c' : '#c8c6c4',
      transform: 'translateY(-1px)',
      boxShadow: isDark 
        ? '0 4px 8px rgba(0,0,0,0.3)'
        : '0 4px 8px rgba(0,0,0,0.1)'
    },
    ':active': {
      transform: 'translateY(0px)'
    },
    ...(read && !isSelected && {
      opacity: 0.75
    })
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const priorityCount = notifications.filter(n => !n.read && n.priority === 'high').length;

  const renderShimmer = () => (
    <Stack tokens={{ childrenGap: 8 }}>
      {[1, 2, 3, 4].map(i => (
        <Shimmer
          key={i}
          shimmerElements={[
            { type: ShimmerElementType.circle, width: 32, height: 32 },
            { type: ShimmerElementType.gap, width: 16 },
            { type: ShimmerElementType.line, width: '60%', height: 16 },
            { type: ShimmerElementType.gap, width: '100%' },
            { type: ShimmerElementType.line, width: '80%', height: 12 }
          ]}
          styles={{
            root: {
              padding: '20px',
              background: isDark ? '#323130' : '#ffffff',
              border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
              marginBottom: '1px'
            }
          }}
        />
      ))}
    </Stack>
  );

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.large}
      headerText="Notification Center"
      styles={{
        main: {
          background: isDark ? '#1e1e1e' : '#faf9f8'
        },
        header: {
          background: isDark ? '#323130' : '#ffffff',
          borderBottom: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
          paddingLeft: '24px',
          paddingRight: '24px'
        },
        headerText: {
          fontSize: '20px',
          fontWeight: FontWeights.semibold
        },
        content: {
          padding: 0
        },
        commands: {
          margin: 0
        }
      }}
    >
      {/* Command Bar */}
      <CommandBar
        items={commandBarItems}
        farItems={commandBarFarItems}
        styles={{
          root: {
            background: isDark ? '#323130' : '#ffffff',
            borderBottom: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
            padding: '0 24px',
            height: '44px'
          }
        }}
      />

      <div style={{ padding: '24px', height: 'calc(100vh - 140px)', overflowY: 'auto' }}>
        {/* Stats Header */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={{ root: { marginBottom: '24px' } }}>
          <Stack>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, marginBottom: '8px' } }}>
              Stay informed with your notifications
            </Text>
            <Stack horizontal tokens={{ childrenGap: 20 }}>
              <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
                <Icon iconName="CircleFill" styles={{ root: { color: '#0078d4', fontSize: '6px' } }} />
                <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c', fontWeight: FontWeights.regular } }}>
                  {unreadCount} unread
                </Text>
              </Stack>
              {priorityCount > 0 && (
                <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
                  <Icon iconName="Important" styles={{ root: { color: '#d13438', fontSize: '12px' } }} />
                  <Text variant="medium" styles={{ root: { color: '#d13438', fontWeight: FontWeights.semibold } }}>
                    {priorityCount} high priority
                  </Text>
                </Stack>
              )}
              {selectedNotifications.size > 0 && (
                <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
                  <Icon iconName="CheckboxComposite" styles={{ root: { color: '#0078d4', fontSize: '12px' } }} />
                  <Text variant="medium" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.semibold } }}>
                    {selectedNotifications.size} selected
                  </Text>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Tabs */}
        <Pivot
          selectedKey={selectedTab}
          onLinkClick={(item) => setSelectedTab(item?.props?.itemKey || 'all')}
          styles={{
            root: { marginBottom: '20px' },
            link: {
              fontSize: '14px',
              fontWeight: FontWeights.regular,
              padding: '8px 16px',
              margin: '0 4px'
            },
            linkIsSelected: {
              fontSize: '14px',
              fontWeight: FontWeights.semibold
            }
          }}
        >
          <PivotItem headerText={`All (${notifications.length})`} itemKey="all" />
          <PivotItem headerText={`Unread (${unreadCount})`} itemKey="unread" />
          <PivotItem headerText={`Priority (${priorityCount})`} itemKey="priority" />
        </Pivot>

        {/* Search and Filter */}
        <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { marginBottom: '24px' } }}>
          <SearchBox
            placeholder="Search notifications, senders, or content..."
            value={searchQuery}
            onChange={(_, value) => setSearchQuery(value || '')}
            styles={{ 
              root: { 
                width: '320px'
              },
              field: {
                fontSize: '14px'
              }
            }}
          />
          <Dropdown
            placeholder="Filter by type"
            options={typeOptions}
            selectedKey={filterType}
            onChange={(_, option) => setFilterType(option?.key || 'All')}
            styles={{ 
              root: { width: '200px' },
              title: { fontSize: '14px' }
            }}
            onRenderOption={(option) => (
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <Icon iconName={option?.data?.icon} styles={{ root: { fontSize: '14px' } }} />
                <Text>{option?.text}</Text>
              </Stack>
            )}
          />
        </Stack>

        {/* Notifications List */}
        {isLoading ? (
          renderShimmer()
        ) : (
          <Stack tokens={{ childrenGap: 0 }}>
            {filteredNotifications.length === 0 ? (
              <MessageBar 
                messageBarType={MessageBarType.info} 
                styles={{ 
                  root: { 
                    marginBottom: '20px',
                    padding: '16px 20px',
                    background: isDark ? '#323130' : '#f3f2f1',
                    border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                    color: isDark ? '#ffffff' : '#323130'
                  },
                  text: {
                    color: isDark ? '#ffffff' : '#323130'
                  },
                  icon: {
                    color: isDark ? '#0078d4' : '#0078d4'
                  }
                }}
              >
                <Stack tokens={{ childrenGap: 8 }}>
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                    {searchQuery || filterType !== 'All' || selectedTab !== 'all'
                      ? 'No notifications match your filters'
                      : 'You\'re all caught up!'
                    }
                  </Text>
                  <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                    {searchQuery || filterType !== 'All' || selectedTab !== 'all'
                      ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                      : 'No new notifications at this time. We\'ll notify you when something important happens.'
                    }
                  </Text>
                </Stack>
              </MessageBar>
            ) : (
              filteredNotifications.map(notification => {
                const isSelected = selectedNotifications.has(notification.id);
                return (
                  <div 
                    key={notification.id} 
                    className={notificationCardStyle(notification.read, notification.priority, isSelected)}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedNotificationId(notification.id);
                      setContextMenuTarget(e.target);
                      setShowContextMenu(true);
                    }}
                  >
                    {/* Priority Badge */}
                    {notification.priority === 'high' && !notification.read && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: '#d13438',
                        color: '#ffffff',
                        borderRadius: '2px',
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: FontWeights.bold,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        lineHeight: '12px'
                      }}>
                        High Priority
                      </div>
                    )}

                    <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="start">
                      {/* Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        styles={{
                          root: {
                            marginTop: '2px'
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Icon */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '18px',
                        background: getNotificationColor(notification.type),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <Icon 
                          iconName={getNotificationIcon(notification.type)}
                          styles={{ root: { color: '#ffffff', fontSize: '16px' } }}
                        />
                      </div>

                      {/* Content */}
                      <Stack tokens={{ childrenGap: 12 }} styles={{ root: { flex: 1, minWidth: 0 } }}>
                        {/* Header */}
                        <Stack horizontal horizontalAlign="space-between" verticalAlign="start">
                          <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1, minWidth: 0 } }}>
                            <Text 
                              variant="medium" 
                              styles={{ 
                                root: { 
                                  fontWeight: notification.read ? FontWeights.regular : FontWeights.semibold,
                                  color: isDark ? '#ffffff' : '#323130',
                                  lineHeight: '20px'
                                } 
                              }}
                            >
                              {notification.title}
                            </Text>
                            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                              <Text 
                                variant="small" 
                                styles={{ 
                                  root: { 
                                    color: isDark ? '#a19f9d' : '#8a8886',
                                    fontSize: '12px'
                                  } 
                                }}
                              >
                                {formatTime(notification.timestamp)}
                              </Text>
                              <Text 
                                variant="small" 
                                styles={{ 
                                  root: { 
                                    color: isDark ? '#a19f9d' : '#8a8886',
                                    fontSize: '12px'
                                  } 
                                }}
                              >
                                from {notification.sender}
                              </Text>
                            </Stack>
                          </Stack>
                          <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                            {!notification.read && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: '#0078d4'
                              }} />
                            )}
                            <TooltipHost content="More actions" directionalHint={DirectionalHint.topCenter}>
                              <ActionButton
                                iconProps={{ iconName: 'MoreVertical' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNotificationId(notification.id);
                                  setContextMenuTarget(e.currentTarget);
                                  setShowContextMenu(true);
                                }}
                                styles={{ 
                                  root: { 
                                    width: '28px',
                                    height: '28px',
                                    minWidth: '28px'
                                  },
                                  icon: {
                                    fontSize: '14px',
                                    color: isDark ? '#a19f9d' : '#605e5c'
                                  }
                                }}
                              />
                            </TooltipHost>
                          </Stack>
                        </Stack>

                        {/* Message */}
                        <Text 
                          variant="small" 
                          styles={{ 
                            root: { 
                              color: isDark ? '#c8c6c4' : '#605e5c',
                              lineHeight: '20px',
                              marginBottom: '8px'
                            } 
                          }}
                        >
                          {notification.message}
                        </Text>

                        {/* Actions */}
                        {notification.actions && notification.actions.length > 0 && (
                          <Stack horizontal tokens={{ childrenGap: 8 }}>
                            {notification.actions.map((action, index) => (
                              <DefaultButton
                                key={index}
                                text={action.text}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  success(`${action.text} clicked`);
                                }}
                                styles={{
                                  root: {
                                    fontSize: '12px',
                                    height: '28px',
                                    minWidth: '80px'
                                  }
                                }}
                              />
                            ))}
                          </Stack>
                        )}

                        {/* Footer */}
                        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                          <div style={{
                            background: isDark ? '#484644' : '#f3f2f1',
                            color: isDark ? '#c8c6c4' : '#605e5c',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: FontWeights.regular
                          }}>
                            {notification.category}
                          </div>
                        </Stack>
                      </Stack>
                    </Stack>
                  </div>
                );
              })
            )}
          </Stack>
        )}

        {/* Context Menu */}
        {showContextMenu && (
          <ContextualMenu
            items={contextMenuItems}
            target={contextMenuTarget}
            onDismiss={() => setShowContextMenu(false)}
            directionalHint={DirectionalHint.bottomLeftEdge}
          />
        )}

        {/* Footer */}
        <Separator styles={{ root: { margin: '32px 0 20px 0' } }} />
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Stay updated with library services, book reminders, system notifications, and security alerts
          </Text>
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Text variant="small" styles={{ root: { color: isDark ? '#a19f9d' : '#8a8886' } }}>
              Total: {notifications.length}
            </Text>
            <Text variant="small" styles={{ root: { color: isDark ? '#a19f9d' : '#8a8886' } }}>
              Filtered: {filteredNotifications.length}
            </Text>
          </Stack>
        </Stack>
      </div>
    </Panel>
  );
};

export default NotificationPanel;