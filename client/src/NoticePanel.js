import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelType,
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  TextField,
  Dropdown,
  DatePicker,
  DayOfWeek,
  mergeStyles,
  FontWeights,
  Icon,
  MessageBar,
  MessageBarType,
  Separator,
  SearchBox,
  Toggle
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const NoticePanel = ({ isOpen, onDismiss, user }) => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [loading, setLoading] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    priority: 'Normal',
    category: 'General',
    expiryDate: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const priorityOptions = [
    { key: 'All', text: 'All Priorities' },
    { key: 'High', text: 'High Priority' },
    { key: 'Medium', text: 'Medium Priority' },
    { key: 'Normal', text: 'Normal Priority' }
  ];

  const categoryOptions = [
    { key: 'General', text: 'General' },
    { key: 'Events', text: 'Events' },
    { key: 'Maintenance', text: 'Maintenance' },
    { key: 'Policy', text: 'Policy Update' },
    { key: 'Emergency', text: 'Emergency' }
  ];

  // Load notices from database
  const loadNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/notices', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotices(data);
      } else {
        error('Failed to load notices');
      }
    } catch (err) {
      error('Error loading notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotices();
    }
  }, [isOpen]);

  useEffect(() => {
    let filtered = notices.filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'All' || notice.priority === filterPriority;
      const notExpired = !notice.expiryDate || new Date(notice.expiryDate) >= new Date();
      return matchesSearch && matchesPriority && notExpired;
    });
    setFilteredNotices(filtered);
  }, [notices, searchQuery, filterPriority]);

  const saveNotices = (updatedNotices) => {
    localStorage.setItem('libraryNotices', JSON.stringify(updatedNotices));
    setNotices(updatedNotices);
  };

  const addNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');
      console.log('Notice data:', newNotice);
      
      const response = await fetch('http://localhost:5000/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newNotice)
      });
      
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (response.ok) {
        await loadNotices();
        setNewNotice({ title: '', content: '', priority: 'Normal', category: 'General', expiryDate: '' });
        setShowAddForm(false);
        success('Notice added successfully');
      } else {
        error(`Failed to add notice: ${responseData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error adding notice:', err);
      error('Error adding notice');
    } finally {
      setLoading(false);
    }
  };

  const updateNotice = async () => {
    if (!editingNotice.title || !editingNotice.content) {
      error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/notices/${editingNotice._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingNotice)
      });
      
      if (response.ok) {
        await loadNotices();
        setEditingNotice(null);
        success('Notice updated successfully');
      } else {
        error('Failed to update notice');
      }
    } catch (err) {
      error('Error updating notice');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/notices/${noticeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        await loadNotices();
        success('Notice deleted');
      } else {
        error('Failed to delete notice');
      }
    } catch (err) {
      error('Error deleting notice');
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (noticeId, isPinned) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/notices/${noticeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ pinned: !isPinned })
      });
      
      if (response.ok) {
        await loadNotices();
      } else {
        error('Failed to update notice');
      }
    } catch (err) {
      error('Error updating notice');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = (noticeId) => {
    const updatedNotices = notices.map(n => 
      n.id === noticeId ? { ...n, views: (n.views || 0) + 1 } : n
    );
    saveNotices(updatedNotices);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#d13438';
      case 'Medium': return '#ff8c00';
      default: return '#0078d4';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Events': return 'Calendar';
      case 'Maintenance': return 'Settings';
      case 'Policy': return 'Shield';
      case 'Emergency': return 'Warning';
      default: return 'Info';
    }
  };

  const noticeStyle = (priority, pinned) => mergeStyles({
    padding: '16px',
    border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
    borderLeft: `4px solid ${getPriorityColor(priority)}`,
    borderRadius: '4px',
    background: pinned 
      ? (isDark ? '#2d3748' : '#fff8dc')
      : (isDark ? '#323130' : '#fafafa'),
    marginBottom: '12px',
    position: 'relative',
    ':hover': {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
  });

  const canAddNotice = user?.role === 'Admin' || user?.role === 'Librarian';
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.large}
      headerText="Library Notice Board"
      styles={{
        main: {
          background: isDark ? '#1e1e1e' : '#ffffff'
        }
      }}
    >
      <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: '16px 0' } }}>
        {/* Header with Stats */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Stack tokens={{ childrenGap: 8 }}>
            <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
              Notice Board
            </Text>
            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                Total: {notices.length}
              </Text>
              <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                Active: {filteredNotices.length}
              </Text>
              <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                Pinned: {notices.filter(n => n.pinned).length}
              </Text>
            </Stack>
          </Stack>
          {canAddNotice && (
            <PrimaryButton
              text="New Notice"
              iconProps={{ iconName: 'Add' }}
              onClick={() => setShowAddForm(!showAddForm)}
            />
          )}
        </Stack>

        {/* Search and Filter */}
        <Stack horizontal tokens={{ childrenGap: 12 }} wrap>
          <SearchBox
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(_, value) => setSearchQuery(value || '')}
            styles={{ root: { width: '300px' } }}
          />
          <Dropdown
            placeholder="Filter by priority"
            options={priorityOptions}
            selectedKey={filterPriority}
            onChange={(_, option) => setFilterPriority(option?.key || 'All')}
            styles={{ root: { width: '150px' } }}
          />
        </Stack>

        {/* Add/Edit Notice Form */}
        {(showAddForm || editingNotice) && canAddNotice && (
          <div className={noticeStyle('Normal', false)}>
            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </Text>
              <Stack horizontal tokens={{ childrenGap: 12 }}>
                <TextField
                  label="Title"
                  value={editingNotice ? editingNotice.title : newNotice.title}
                  onChange={(_, value) => editingNotice 
                    ? setEditingNotice({ ...editingNotice, title: value || '' })
                    : setNewNotice({ ...newNotice, title: value || '' })
                  }
                  required
                  styles={{ root: { flex: 1 } }}
                />
                <Dropdown
                  label="Category"
                  options={categoryOptions}
                  selectedKey={editingNotice ? editingNotice.category : newNotice.category}
                  onChange={(_, option) => editingNotice
                    ? setEditingNotice({ ...editingNotice, category: option?.key || 'General' })
                    : setNewNotice({ ...newNotice, category: option?.key || 'General' })
                  }
                  styles={{ root: { width: '150px' } }}
                />
              </Stack>
              <TextField
                label="Content"
                multiline
                rows={4}
                value={editingNotice ? editingNotice.content : newNotice.content}
                onChange={(_, value) => editingNotice
                  ? setEditingNotice({ ...editingNotice, content: value || '' })
                  : setNewNotice({ ...newNotice, content: value || '' })
                }
                required
              />
              <Stack horizontal tokens={{ childrenGap: 12 }}>
                <Dropdown
                  label="Priority"
                  options={priorityOptions.slice(1)}
                  selectedKey={editingNotice ? editingNotice.priority : newNotice.priority}
                  onChange={(_, option) => editingNotice
                    ? setEditingNotice({ ...editingNotice, priority: option?.key || 'Normal' })
                    : setNewNotice({ ...newNotice, priority: option?.key || 'Normal' })
                  }
                  styles={{ root: { width: '150px' } }}
                />
                <DatePicker
                  label="Expiry Date (Optional)"
                  placeholder="Select expiry date"
                  value={editingNotice ? (editingNotice.expiryDate ? new Date(editingNotice.expiryDate) : undefined) : (newNotice.expiryDate ? new Date(newNotice.expiryDate) : undefined)}
                  onSelectDate={(date) => {
                    const dateStr = date ? date.toISOString().split('T')[0] : '';
                    editingNotice
                      ? setEditingNotice({ ...editingNotice, expiryDate: dateStr })
                      : setNewNotice({ ...newNotice, expiryDate: dateStr });
                  }}
                  firstDayOfWeek={DayOfWeek.Sunday}
                  styles={{ root: { width: '200px' } }}
                />
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 8 }}>
                <PrimaryButton 
                  text={editingNotice ? 'Update Notice' : 'Add Notice'} 
                  onClick={editingNotice ? updateNotice : addNotice} 
                />
                <DefaultButton 
                  text="Cancel" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingNotice(null);
                  }} 
                />
              </Stack>
            </Stack>
          </div>
        )}

        {/* Notices List */}
        <Stack tokens={{ childrenGap: 12 }}>
          {sortedNotices.length === 0 ? (
            <MessageBar messageBarType={MessageBarType.info}>
              {searchQuery || filterPriority !== 'All' 
                ? 'No notices match your search criteria.'
                : 'No notices available at the moment.'
              }
            </MessageBar>
          ) : (
            sortedNotices.map(notice => (
              <div key={notice._id} className={noticeStyle(notice.priority, notice.pinned)}>
                {notice.pinned && (
                  <Icon 
                    iconName="Pin" 
                    styles={{ 
                      root: { 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px', 
                        color: '#ff8c00',
                        fontSize: '14px'
                      } 
                    }} 
                  />
                )}
                <Stack tokens={{ childrenGap: 8 }}>
                  <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                      <Icon 
                        iconName={getCategoryIcon(notice.category)} 
                        styles={{ root: { color: getPriorityColor(notice.priority), fontSize: '16px' } }}
                      />
                      <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                        {notice.title}
                      </Text>
                      <div style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: getPriorityColor(notice.priority),
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {notice.priority}
                      </div>
                      <Text variant="small" styles={{ root: { 
                        color: isDark ? '#a19f9d' : '#8a8886',
                        background: isDark ? '#484644' : '#f3f2f1',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px'
                      }}}>
                        {notice.category}
                      </Text>
                    </Stack>
                  </Stack>
                  
                  <Text 
                    variant="small" 
                    styles={{ root: { 
                      color: isDark ? '#c8c6c4' : '#605e5c',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-wrap',
                      cursor: 'pointer'
                    }}}
                    onClick={() => incrementViews(notice.id)}
                  >
                    {notice.content}
                  </Text>
                  
                  {notice.expiryDate && (
                    <MessageBar messageBarType={MessageBarType.warning} styles={{
                      root: {
                        background: isDark ? '#8b4513' : '#fff4e6',
                        border: `1px solid ${isDark ? '#d2691e' : '#ff8c00'}`,
                        color: isDark ? '#ffffff' : '#323130'
                      },
                      text: {
                        color: isDark ? '#ffffff' : '#323130'
                      }
                    }}>
                      <Text variant="small" styles={{ root: { color: isDark ? '#ffffff' : '#323130' } }}>
                        Expires on: {new Date(notice.expiryDate).toLocaleDateString('en-IN')}
                      </Text>
                    </MessageBar>
                  )}
                  
                  <Separator />
                  
                  <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
                      <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
                        <Icon iconName="Calendar" styles={{ root: { fontSize: '12px', color: '#0078d4' } }} />
                        <Text variant="small">{notice.date}</Text>
                      </Stack>
                      <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
                        <Icon iconName="Contact" styles={{ root: { fontSize: '12px', color: '#0078d4' } }} />
                        <Text variant="small">{notice.createdBy}</Text>
                      </Stack>
                      <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
                        <Icon iconName="View" styles={{ root: { fontSize: '12px', color: '#0078d4' } }} />
                        <Text variant="small">{notice.views || 0} views</Text>
                      </Stack>
                    </Stack>
                    
                    {canAddNotice && (
                      <Stack horizontal tokens={{ childrenGap: 4 }}>
                        <DefaultButton
                          iconProps={{ iconName: notice.pinned ? 'Unpin' : 'Pin' }}
                          onClick={() => togglePin(notice._id, notice.pinned)}
                          styles={{ root: { minWidth: '32px' } }}
                          title={notice.pinned ? 'Unpin notice' : 'Pin notice'}
                        />
                        <DefaultButton
                          iconProps={{ iconName: 'Edit' }}
                          onClick={() => setEditingNotice(notice)}
                          styles={{ root: { minWidth: '32px' } }}
                          title="Edit notice"
                        />
                        <DefaultButton
                          iconProps={{ iconName: 'Delete' }}
                          onClick={() => deleteNotice(notice._id)}
                          styles={{ root: { minWidth: '32px' } }}
                          title="Delete notice"
                        />
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </div>
            ))
          )}
        </Stack>
      </Stack>
    </Panel>
  );
};

export default NoticePanel;