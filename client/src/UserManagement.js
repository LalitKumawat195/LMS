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
  SearchBox,
  CommandBar,
  Panel,
  PanelType,
  Dropdown,
  Dialog,
  DialogType,
  DialogFooter,
  IconButton,
  Icon,
  FontWeights,
  Card,
  ICardTokens,
  ICardSectionStyles,
  ICardSectionTokens,
  ProgressIndicator,
  Shimmer,
  ShimmerElementType,
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardActivity,
  DocumentCardType,
  Pivot,
  PivotItem
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const UserManagement = () => {
  const { isDark } = useTheme();
  const { success, warning, error } = useNotifications();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserPanelOpen, setIsEditUserPanelOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDetailsPanel, setShowUserDetailsPanel] = useState(false);
  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);
  const [userForPasswordReset, setUserForPasswordReset] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearchFilters, setAdvancedSearchFilters] = useState({
    name: '',
    email: '',
    department: '',
    createdAfter: '',
    createdBefore: ''
  });
  const [showUserHistory, setShowUserHistory] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Member',
    department: '',
    phone: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters(searchValue, filterRole, filterStatus);
  }, [users, sortField, sortDirection]);

  const getDepartmentOptions = (role) => {
    switch (role) {
      case 'Member':
        return [
          { key: 'Computer Science', text: 'Computer Science' },
          { key: 'Mathematics', text: 'Mathematics' },
          { key: 'English Literature', text: 'English Literature' },
          { key: 'Engineering', text: 'Engineering' },
          { key: 'Business Administration', text: 'Business Administration' }
        ];
      case 'Librarian':
        return [
          { key: 'Main Library', text: 'Main Library' },
          { key: 'Reference Section', text: 'Reference Section' },
          { key: 'Digital Resources', text: 'Digital Resources' },
          { key: 'Circulation Desk', text: 'Circulation Desk' }
        ];
      case 'Admin':
        return [
          { key: 'Administration', text: 'Administration' },
          { key: 'IT Department', text: 'IT Department' },
          { key: 'Management', text: 'Management' }
        ];
      default:
        return [];
    }
  };

  const validateForm = (userData) => {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (userData.phone && userData.phone.trim()) {
      const cleanPhone = userData.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^[\d]{10}$/.test(cleanPhone)) {
        errors.push('Phone number must be exactly 10 digits');
      }
    }
    
    if (!userData.role || !['Admin', 'Librarian', 'Member'].includes(userData.role)) {
      errors.push('Please select a valid role');
    }
    
    if (!userData.department || userData.department.trim().length === 0) {
      errors.push('Department is required');
    }
    
    return errors;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        error(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    applyFilters(value, filterRole, filterStatus);
  };

  const applyFilters = (search, role, status) => {
    let filtered = users.filter(user => 
      ((user.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.memberId || '').toLowerCase().includes(search.toLowerCase())) &&
      (role === 'All' || user.role === role) &&
      (status === 'All' || user.status === status)
    );

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      
      // Convert to string for comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });

    setFilteredUsers(filtered);
  };

  const handleRoleFilter = (role) => {
    setFilterRole(role);
    applyFilters(searchValue, role, filterStatus);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    applyFilters(searchValue, filterRole, status);
  };

  const applyAdvancedSearch = () => {
    let filtered = users.filter(user => {
      const nameMatch = !advancedSearchFilters.name || (user.name || '').toLowerCase().includes(advancedSearchFilters.name.toLowerCase());
      const emailMatch = !advancedSearchFilters.email || (user.email || '').toLowerCase().includes(advancedSearchFilters.email.toLowerCase());
      const deptMatch = !advancedSearchFilters.department || user.department === advancedSearchFilters.department;
      
      let dateMatch = true;
      if (advancedSearchFilters.createdAfter || advancedSearchFilters.createdBefore) {
        const userDate = new Date(user.createdAt);
        if (advancedSearchFilters.createdAfter) {
          dateMatch = dateMatch && userDate >= new Date(advancedSearchFilters.createdAfter);
        }
        if (advancedSearchFilters.createdBefore) {
          dateMatch = dateMatch && userDate <= new Date(advancedSearchFilters.createdBefore);
        }
      }
      
      return nameMatch && emailMatch && deptMatch && dateMatch;
    });
    
    // Apply existing filters
    filtered = filtered.filter(user => 
      (filterRole === 'All' || user.role === filterRole) &&
      (filterStatus === 'All' || user.status === filterStatus)
    );
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
    
    setFilteredUsers(filtered);
    setShowAdvancedSearch(false);
    success(`Found ${filtered.length} users matching your criteria`);
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    applyFilters(searchValue, filterRole, filterStatus);
  };

  const handleAddUser = async () => {
    const validationErrors = validateForm(newUser);
    if (validationErrors.length > 0) {
      error(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchUsers();
        setNewUser({ name: '', email: '', role: 'Member', department: '', phone: '', status: 'Active' });
        setIsAddUserDialogOpen(false);
        success(`User ${newUser.name} added successfully`);
      } else {
        error(data.message || 'Failed to add user');
      }
    } catch (err) {
      error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    const validationErrors = validateForm(selectedUser);
    if (validationErrors.length > 0) {
      error(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(selectedUser)
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchUsers();
        setIsEditUserPanelOpen(false);
        setSelectedUser(null);
        success(`User ${selectedUser.name} updated successfully`);
      } else {
        error(data.message || 'Failed to update user');
      }
    } catch (err) {
      error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchUsers();
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        success(`User ${userToDelete.name} deleted successfully`);
      } else {
        error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (userId) => {
    if (!newPassword || newPassword.length < 6) {
      error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newPassword })
      });
      
      const data = await response.json();
      if (response.ok) {
        success(data.message);
        setNewPassword('');
      } else {
        error(data.message || 'Failed to reset password');
      }
    } catch (err) {
      error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async () => {
    if (selectedUsers.length === 0) {
      error('Please select users first');
      return;
    }

    setLoading(true);
    try {
      let successCount = 0;
      for (const userId of selectedUsers) {
        let response;
        if (bulkAction === 'activate') {
          response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: 'Active' })
          });
        } else if (bulkAction === 'deactivate') {
          response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: 'Inactive' })
          });
        } else if (bulkAction === 'resetPassword') {
          response = await fetch(`http://localhost:5000/api/users/${userId}/reset-password`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        }
        
        if (response && response.ok) {
          successCount++;
        }
      }
      
      fetchUsers();
      setSelectedUsers([]);
      setShowBulkActionsDialog(false);
      success(`Bulk action completed on ${successCount} users`);
    } catch (err) {
      error('Bulk action failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  const fetchUserHistory = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/history`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserHistory(data);
      }
    } catch (err) {
      setUserHistory([{ action: 'Created', date: new Date().toISOString(), details: 'User account created' }]);
    }
  };

  const exportAdvanced = (format) => {
    const data = filteredUsers.map(u => ({
      memberId: u.memberId,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      status: u.status,
      phone: u.phone || '',
      created: new Date(u.createdAt).toLocaleDateString()
    }));
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.json';
      a.click();
    } else {
      const csvData = data.map(u => Object.values(u).join(',')).join('\n');
      const blob = new Blob([`${Object.keys(data[0]).join(',')}\n${csvData}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
    }
    success(`Users exported as ${format.toUpperCase()}`);
  };

  const getPaginatedUsers = () => {
    const start = (pagination.page - 1) * pagination.size;
    const end = start + pagination.size;
    return filteredUsers.slice(start, end);
  };

  const totalPages = Math.ceil(filteredUsers.length / pagination.size);

  const roleOptions = [
    { key: 'Admin', text: 'Admin' },
    { key: 'Librarian', text: 'Librarian' },
    { key: 'Member', text: 'Member' }
  ];

  const statusOptions = [
    { key: 'Active', text: 'Active' },
    { key: 'Inactive', text: 'Inactive' }
  ];

  const commandBarItems = [
    {
      key: 'addUser',
      text: 'Add User',
      iconProps: { iconName: 'AddFriend' },
      onClick: () => setIsAddUserDialogOpen(true)
    },
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: fetchUsers
    },
    {
      key: 'export',
      text: 'Export Users',
      iconProps: { iconName: 'Download' },
      onClick: () => {
        const csvData = users.map(u => `${u.memberId},${u.name},${u.email},${u.role},${u.department},${u.status}`).join('\n');
        const blob = new Blob([`Member ID,Name,Email,Role,Department,Status\n${csvData}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        success('Users exported successfully');
      }
    },
    {
      key: 'import',
      text: 'Import Users',
      iconProps: { iconName: 'Upload' },
      onClick: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const csv = event.target.result;
              const lines = csv.split('\n');
              success(`CSV file loaded with ${lines.length - 1} rows. Import functionality coming soon.`);
            };
            reader.readAsText(file);
          }
        };
        input.click();
      }
    },
    {
      key: 'stats',
      text: 'User Statistics',
      iconProps: { iconName: 'BarChart4' },
      onClick: () => setShowStatsPanel(true)
    },
    {
      key: 'advancedSearch',
      text: 'Advanced Search',
      iconProps: { iconName: 'Search' },
      onClick: () => setShowAdvancedSearch(true)
    },
    {
      key: 'exportOptions',
      text: 'Export Options',
      iconProps: { iconName: 'CloudDownload' },
      onClick: () => setShowExportOptions(true)
    },
    {
      key: 'userActivity',
      text: 'User Activity',
      iconProps: { iconName: 'ActivityFeed' },
      onClick: () => {
        const recentUsers = users.filter(u => {
          const created = new Date(u.createdAt);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return created > weekAgo;
        });
        success(`${recentUsers.length} users created in the last 7 days`);
      }
    },
    {
      key: 'bulkActions',
      text: 'Bulk Actions',
      iconProps: { iconName: 'BulkUpload' },
      subMenuProps: {
        items: [
          {
            key: 'activateAll',
            text: 'Activate Selected',
            iconProps: { iconName: 'CheckMark' },
            onClick: () => {
              setBulkAction('activate');
              setShowBulkActionsDialog(true);
            }
          },
          {
            key: 'deactivateAll',
            text: 'Deactivate Selected',
            iconProps: { iconName: 'Cancel' },
            onClick: () => {
              setBulkAction('deactivate');
              setShowBulkActionsDialog(true);
            }
          },
          {
            key: 'resetPasswords',
            text: 'Reset Passwords',
            iconProps: { iconName: 'Refresh' },
            onClick: () => {
              setBulkAction('resetPassword');
              setShowBulkActionsDialog(true);
            }
          }
        ]
      }
    }
  ];

  const userColumns = [
    {
      key: 'select',
      name: '',
      minWidth: 30,
      maxWidth: 30,
      onRender: (item) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(item._id)}
          onChange={() => toggleUserSelection(item._id)}
        />
      ),
      onRenderHeader: () => (
        <input
          type="checkbox"
          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
          onChange={selectAllUsers}
        />
      )
    },
    { 
      key: 'memberId', 
      name: 'Member ID', 
      fieldName: 'memberId', 
      minWidth: 90,
      maxWidth: 90,
      onRender: (item) => (
        <Text styles={{
          root: {
            fontFamily: 'monospace',
            fontWeight: FontWeights.semibold,
            color: '#0078d4'
          }
        }}>
          {item.memberId}
        </Text>
      )
    },
    { 
      key: 'name', 
      name: 'Name', 
      fieldName: 'name', 
      minWidth: 150,
      onRender: (item) => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Icon iconName="Contact" />
          <Text>{item.name}</Text>
        </Stack>
      )
    },
    { key: 'email', name: 'Email', fieldName: 'email', minWidth: 200 },
    { 
      key: 'role', 
      name: 'Role', 
      fieldName: 'role', 
      minWidth: 90,
      onRender: (item) => (
        <Text styles={{
          root: {
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: item.role === 'Admin' ? '#d13438' : item.role === 'Librarian' ? '#0078d4' : '#107c10',
            color: 'white',
            fontSize: '12px',
            fontWeight: FontWeights.semibold
          }
        }}>
          {item.role}
        </Text>
      )
    },
    { key: 'department', name: 'Department', fieldName: 'department', minWidth: 140 },
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
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 200,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            title="Edit User"
            onClick={() => {
              setSelectedUser(item);
              setIsEditUserPanelOpen(true);
            }}
            styles={{ root: { minWidth: 24, width: 24, height: 24 } }}
          />
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            title="Delete User"
            onClick={() => {
              setUserToDelete(item);
              setIsDeleteDialogOpen(true);
            }}
            styles={{ root: { color: '#d13438', minWidth: 24, width: 24, height: 24 } }}
          />
          <IconButton
            iconProps={{ iconName: 'View' }}
            title="View Details"
            onClick={() => {
              setSelectedUser(item);
              setShowUserDetailsPanel(true);
            }}
            styles={{ root: { minWidth: 24, width: 24, height: 24 } }}
          />
          <IconButton
            iconProps={{ iconName: 'Refresh' }}
            title="Reset Password"
            onClick={() => {
              setUserForPasswordReset(item);
              setShowPasswordResetDialog(true);
            }}
            styles={{ root: { minWidth: 24, width: 24, height: 24 } }}
          />
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          User Management
        </Text>
        <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Manage users, roles, and permissions
        </Text>
      </Stack>

      <CommandBar items={commandBarItems} />

      <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { marginBottom: 16 } }}>
        <SearchBox
          placeholder="Search users by name, email, role, department, or member ID"
          value={searchValue}
          onChange={(_, value) => handleSearch(value || '')}
          styles={{ root: { width: '300px' } }}
        />
        <Dropdown
          placeholder="Filter by Role"
          options={[
            { key: 'All', text: 'All Roles' },
            { key: 'Admin', text: 'Admin' },
            { key: 'Librarian', text: 'Librarian' },
            { key: 'Member', text: 'Member' }
          ]}
          selectedKey={filterRole}
          onChange={(_, option) => handleRoleFilter(option?.key || 'All')}
          styles={{ root: { width: '150px' } }}
        />
        <Dropdown
          placeholder="Filter by Status"
          options={[
            { key: 'All', text: 'All Status' },
            { key: 'Active', text: 'Active' },
            { key: 'Inactive', text: 'Inactive' }
          ]}
          selectedKey={filterStatus}
          onChange={(_, option) => handleStatusFilter(option?.key || 'All')}
          styles={{ root: { width: '150px' } }}
        />
        <DefaultButton
          text="Clear Filters"
          iconProps={{ iconName: 'ClearFilter' }}
          onClick={() => {
            setSearchValue('');
            setFilterRole('All');
            setFilterStatus('All');
            applyFilters('', 'All', 'All');
          }}
        />
        {selectedUsers.length > 0 && (
          <DefaultButton
            text={`${selectedUsers.length} Selected`}
            iconProps={{ iconName: 'CheckboxComposite' }}
            onClick={() => setSelectedUsers([])}
          />
        )}
      </Stack>

      <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 8 } }}>
        <Text variant="medium">
          Showing {filteredUsers.length} of {users.length} users
        </Text>
        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
          <Text variant="small">Sort by:</Text>
          <DefaultButton
            text={`Name ${sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`}
            onClick={() => handleSort('name')}
            styles={{ root: { minWidth: 'auto', padding: '4px 8px' } }}
          />
          <DefaultButton
            text={`Role ${sortField === 'role' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`}
            onClick={() => handleSort('role')}
            styles={{ root: { minWidth: 'auto', padding: '4px 8px' } }}
          />
          <DefaultButton
            text={`Status ${sortField === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`}
            onClick={() => handleSort('status')}
            styles={{ root: { minWidth: 'auto', padding: '4px 8px' } }}
          />
        </Stack>
      </Stack>

      <DetailsList
        items={getPaginatedUsers()}
        columns={userColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />

      {/* Pagination */}
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={{ root: { marginTop: 16 } }}>
        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
          <Text variant="small">Show:</Text>
          <Dropdown
            options={[
              { key: 10, text: '10' },
              { key: 25, text: '25' },
              { key: 50, text: '50' },
              { key: 100, text: '100' }
            ]}
            selectedKey={pagination.size}
            onChange={(_, option) => setPagination({ ...pagination, size: option.key, page: 1 })}
            styles={{ root: { width: 80 } }}
          />
          <Text variant="small">per page</Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
          <DefaultButton
            text="Previous"
            disabled={pagination.page === 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          />
          <Text variant="small">{pagination.page} of {totalPages}</Text>
          <DefaultButton
            text="Next"
            disabled={pagination.page === totalPages}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          />
        </Stack>
      </Stack>

      <Dialog
        hidden={!isAddUserDialogOpen}
        onDismiss={() => setIsAddUserDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Add New User'
        }}
        modalProps={{
          isBlocking: false,
          styles: { main: { maxWidth: '500px', minWidth: '400px' } }
        }}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <TextField
            label="Name"
            required
            value={newUser.name}
            onChange={(_, value) => setNewUser({ ...newUser, name: value || '' })}
            errorMessage={newUser.name && newUser.name.trim().length < 2 ? 'Name must be at least 2 characters' : ''}
          />
          <TextField
            label="Email"
            required
            type="email"
            value={newUser.email}
            onChange={(_, value) => setNewUser({ ...newUser, email: value || '' })}
            errorMessage={newUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email) ? 'Please enter a valid email' : ''}
          />
          <Dropdown
            label="Role"
            options={roleOptions}
            selectedKey={newUser.role}
            onChange={(_, option) => {
              setNewUser({ ...newUser, role: option.key, department: '' });
            }}
          />
          <Dropdown
            label="Department"
            required
            options={getDepartmentOptions(newUser.role)}
            selectedKey={newUser.department}
            onChange={(_, option) => setNewUser({ ...newUser, department: option?.key || '' })}
            placeholder="Select department"
            errorMessage={!newUser.department ? 'Department is required' : ''}
          />
          <TextField
            label="Phone"
            value={newUser.phone}
            onChange={(_, value) => setNewUser({ ...newUser, phone: value || '' })}
            errorMessage={newUser.phone && (!/^[\d\s\-\(\)]{10,14}$/.test(newUser.phone) || newUser.phone.replace(/[\s\-\(\)]/g, '').length !== 10) ? 'Phone number must be exactly 10 digits' : ''}
            placeholder="e.g., 1234567890 or 123-456-7890"
            styles={{
              field: { textAlign: 'center' },
              fieldGroup: { textAlign: 'center' }
            }}
          />
          <Dropdown
            label="Status"
            options={statusOptions}
            selectedKey={newUser.status}
            onChange={(_, option) => setNewUser({ ...newUser, status: option.key })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton text="Add User" onClick={handleAddUser} disabled={loading} />
          <DefaultButton text="Cancel" onClick={() => setIsAddUserDialogOpen(false)} />
        </DialogFooter>
      </Dialog>

      {/* Edit User Panel */}
      <Panel
        isOpen={isEditUserPanelOpen}
        onDismiss={() => setIsEditUserPanelOpen(false)}
        type={PanelType.medium}
        headerText="Edit User"
      >
        {selectedUser && (
          <Stack tokens={{ childrenGap: 16 }}>
            <TextField
              label="Name"
              required
              value={selectedUser.name}
              onChange={(_, value) => setSelectedUser({ ...selectedUser, name: value || '' })}
            />
            <TextField
              label="Email"
              required
              type="email"
              value={selectedUser.email}
              onChange={(_, value) => setSelectedUser({ ...selectedUser, email: value || '' })}
            />
            <Dropdown
              label="Role"
              options={roleOptions}
              selectedKey={selectedUser.role}
              onChange={(_, option) => {
                setSelectedUser({ ...selectedUser, role: option.key, department: '' });
              }}
            />
            <Dropdown
              label="Department"
              required
              options={getDepartmentOptions(selectedUser.role)}
              selectedKey={selectedUser.department}
              onChange={(_, option) => setSelectedUser({ ...selectedUser, department: option?.key || '' })}
            />
            <TextField
              label="Phone"
              value={selectedUser.phone}
              onChange={(_, value) => setSelectedUser({ ...selectedUser, phone: value || '' })}
            />
            <Dropdown
              label="Status"
              options={statusOptions}
              selectedKey={selectedUser.status}
              onChange={(_, option) => setSelectedUser({ ...selectedUser, status: option.key })}
            />
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <PrimaryButton text="Update User" onClick={handleEditUser} disabled={loading} />
              <DefaultButton text="Cancel" onClick={() => setIsEditUserPanelOpen(false)} />
            </Stack>
          </Stack>
        )}
      </Panel>

      {/* Delete User Dialog */}
      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Delete User',
          subText: `Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`
        }}
      >
        <DialogFooter>
          <PrimaryButton text="Delete" onClick={handleDeleteUser} disabled={loading} />
          <DefaultButton text="Cancel" onClick={() => setIsDeleteDialogOpen(false)} />
        </DialogFooter>
      </Dialog>

      {/* User Details Panel */}
      <Panel
        isOpen={showUserDetailsPanel}
        onDismiss={() => setShowUserDetailsPanel(false)}
        type={PanelType.medium}
        headerText={`User Profile`}
        styles={{ content: { backgroundColor: isDark ? '#1f1f1f' : '#ffffff' } }}
      >
        {selectedUser && (
          <Stack tokens={{ childrenGap: 32 }} styles={{ root: { padding: 24 } }}>
            {/* Profile Header */}
            <Stack horizontal tokens={{ childrenGap: 20 }} verticalAlign="center" styles={{ root: { padding: 20, backgroundColor: isDark ? '#2d2d2d' : '#f8f9fa', borderRadius: 12 } }}>
              <div style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: selectedUser.role === 'Admin' ? 'linear-gradient(135deg, #d13438, #a02d30)' : selectedUser.role === 'Librarian' ? 'linear-gradient(135deg, #0078d4, #106ebe)' : 'linear-gradient(135deg, #107c10, #0e6b0e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 40,
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '4px solid white'
              }}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: isDark ? '#ffffff' : '#323130' } }}>{selectedUser.name}</Text>
                <Text variant="large" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>{selectedUser.email}</Text>
                <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
                  <div style={{
                    padding: '6px 16px',
                    borderRadius: 20,
                    background: selectedUser.role === 'Admin' ? 'linear-gradient(135deg, #d13438, #a02d30)' : selectedUser.role === 'Librarian' ? 'linear-gradient(135deg, #0078d4, #106ebe)' : 'linear-gradient(135deg, #107c10, #0e6b0e)',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    {selectedUser.role}
                  </div>
                  <div style={{
                    padding: '6px 16px',
                    borderRadius: 20,
                    background: selectedUser.status === 'Active' ? 'linear-gradient(135deg, #107c10, #0e6b0e)' : 'linear-gradient(135deg, #d13438, #a02d30)',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    ● {selectedUser.status}
                  </div>
                </Stack>
              </Stack>
            </Stack>

            {/* Information Cards */}
            <Stack tokens={{ childrenGap: 24 }}>
              {/* Contact Information Card */}
              <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20, backgroundColor: isDark ? '#2d2d2d' : '#f8f9fa', borderRadius: 12, border: `1px solid ${isDark ? '#404040' : '#e1dfdd'}` } }}>
                <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                  <Icon iconName="Contact" styles={{ root: { fontSize: 20, color: '#0078d4' } }} />
                  <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold, color: isDark ? '#ffffff' : '#323130' } }}>Contact Information</Text>
                </Stack>
                <Stack tokens={{ childrenGap: 16 }}>
                  <Stack horizontal tokens={{ childrenGap: 32 }}>
                    <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flex: 1 } }}>
                      <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold, letterSpacing: 1 } }}>MEMBER ID</Text>
                      <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                        <Text variant="large" styles={{ root: { fontFamily: 'Consolas, monospace', color: isDark ? '#ffffff' : '#323130', fontWeight: FontWeights.bold, backgroundColor: isDark ? '#404040' : '#e1dfdd', padding: '4px 8px', borderRadius: 4 } }}>{selectedUser.memberId}</Text>
                        <IconButton 
                          iconProps={{ iconName: 'Copy' }} 
                          title="Copy Member ID" 
                          styles={{ root: { color: '#0078d4' } }} 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedUser.memberId);
                            success('Member ID copied to clipboard');
                          }}
                        />
                      </Stack>
                    </Stack>
                    <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flex: 1 } }}>
                      <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold, letterSpacing: 1 } }}>DEPARTMENT</Text>
                      <Text variant="large" styles={{ root: { color: isDark ? '#ffffff' : '#323130', fontWeight: FontWeights.semibold } }}>{selectedUser.department || 'Not specified'}</Text>
                    </Stack>
                  </Stack>
                  <Stack horizontal tokens={{ childrenGap: 32 }}>
                    <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flex: 1 } }}>
                      <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold, letterSpacing: 1 } }}>PHONE</Text>
                      <Text variant="large" styles={{ root: { color: isDark ? '#ffffff' : '#323130', fontWeight: FontWeights.semibold } }}>{selectedUser.phone || 'Not provided'}</Text>
                    </Stack>
                    <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flex: 1 } }}>
                      <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold, letterSpacing: 1 } }}>EMAIL</Text>
                      <Text variant="large" styles={{ root: { color: isDark ? '#ffffff' : '#323130', fontWeight: FontWeights.semibold } }}>{selectedUser.email}</Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              {/* Account Details Card */}
              <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20, backgroundColor: isDark ? '#2d2d2d' : '#f8f9fa', borderRadius: 12, border: `1px solid ${isDark ? '#404040' : '#e1dfdd'}` } }}>
                <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                  <Icon iconName="DateTime" styles={{ root: { fontSize: 20, color: '#107c10' } }} />
                  <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold, color: isDark ? '#ffffff' : '#323130' } }}>Account Details</Text>
                </Stack>
                <Stack horizontal tokens={{ childrenGap: 32 }}>
                  <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flex: 1 } }}>
                    <Text variant="small" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold, letterSpacing: 1 } }}>CREATED</Text>
                    <Text variant="large" styles={{ root: { color: isDark ? '#ffffff' : '#323130', fontWeight: FontWeights.semibold } }}>{new Date(selectedUser.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>{new Date(selectedUser.createdAt).toLocaleTimeString()}</Text>
                  </Stack>
                  <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flex: 1 } }}>
                    <Text variant="small" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold, letterSpacing: 1 } }}>LAST UPDATED</Text>
                    <Text variant="large" styles={{ root: { color: isDark ? '#ffffff' : '#323130', fontWeight: FontWeights.semibold } }}>{new Date(selectedUser.updatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>{new Date(selectedUser.updatedAt).toLocaleTimeString()}</Text>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            {/* Action Buttons */}
            <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="center">
              <PrimaryButton
                text="Edit Profile"
                iconProps={{ iconName: 'Edit' }}
                onClick={() => {
                  setShowUserDetailsPanel(false);
                  setIsEditUserPanelOpen(true);
                }}
                styles={{ root: { minWidth: 140 } }}
              />
              <DefaultButton
                text="Reset Password"
                iconProps={{ iconName: 'Refresh' }}
                onClick={() => {
                  setUserForPasswordReset(selectedUser);
                  setShowPasswordResetDialog(true);
                }}
                styles={{ root: { minWidth: 140 } }}
              />
              <DefaultButton
                text="View History"
                iconProps={{ iconName: 'History' }}
                onClick={() => {
                  setShowUserDetailsPanel(false);
                  fetchUserHistory(selectedUser._id);
                  setShowUserHistory(true);
                }}
                styles={{ root: { minWidth: 140 } }}
              />
            </Stack>
          </Stack>
        )}
      </Panel>

      {/* Bulk Actions Dialog */}
      <Dialog
        hidden={!showBulkActionsDialog}
        onDismiss={() => setShowBulkActionsDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Bulk Action Confirmation',
          subText: `Are you sure you want to ${bulkAction} ${selectedUsers.length} selected users?`
        }}
      >
        <DialogFooter>
          <PrimaryButton text="Confirm" onClick={handleBulkAction} disabled={loading} />
          <DefaultButton text="Cancel" onClick={() => setShowBulkActionsDialog(false)} />
        </DialogFooter>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog
        hidden={!showPasswordResetDialog}
        onDismiss={() => {
          setShowPasswordResetDialog(false);
          setNewPassword('');
        }}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Reset Password',
          subText: `Enter new password for ${userForPasswordReset?.name}`
        }}
      >
        <TextField
          label="New Password"
          type="password"
          required
          value={newPassword}
          onChange={(_, value) => setNewPassword(value || '')}
          placeholder="Enter new password (min 6 characters)"
          errorMessage={newPassword && newPassword.length < 6 ? 'Password must be at least 6 characters' : ''}
        />
        <DialogFooter>
          <PrimaryButton
            text="Reset Password"
            onClick={() => {
              resetUserPassword(userForPasswordReset._id);
              setShowPasswordResetDialog(false);
              setUserForPasswordReset(null);
            }}
            disabled={loading || !newPassword || newPassword.length < 6}
          />
          <DefaultButton text="Cancel" onClick={() => {
            setShowPasswordResetDialog(false);
            setNewPassword('');
          }} />
        </DialogFooter>
      </Dialog>

      {/* Advanced Search Panel */}
      <Panel
        isOpen={showAdvancedSearch}
        onDismiss={() => setShowAdvancedSearch(false)}
        type={PanelType.medium}
        headerText="Advanced Search"
      >
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20 } }}>
          <TextField 
            label="Name Contains" 
            placeholder="Search by name" 
            value={advancedSearchFilters.name}
            onChange={(_, value) => setAdvancedSearchFilters({ ...advancedSearchFilters, name: value || '' })}
          />
          <TextField 
            label="Email Contains" 
            placeholder="Search by email" 
            value={advancedSearchFilters.email}
            onChange={(_, value) => setAdvancedSearchFilters({ ...advancedSearchFilters, email: value || '' })}
          />
          <Dropdown 
            label="Department" 
            placeholder="Select department"
            options={[
              { key: '', text: 'All Departments' },
              ...getDepartmentOptions('Member')
            ]}
            selectedKey={advancedSearchFilters.department}
            onChange={(_, option) => setAdvancedSearchFilters({ ...advancedSearchFilters, department: option?.key || '' })}
          />
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <TextField 
              label="Created After" 
              type="date" 
              value={advancedSearchFilters.createdAfter}
              onChange={(_, value) => setAdvancedSearchFilters({ ...advancedSearchFilters, createdAfter: value || '' })}
              styles={{ root: { flex: 1 } }} 
            />
            <TextField 
              label="Created Before" 
              type="date" 
              value={advancedSearchFilters.createdBefore}
              onChange={(_, value) => setAdvancedSearchFilters({ ...advancedSearchFilters, createdBefore: value || '' })}
              styles={{ root: { flex: 1 } }} 
            />
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { marginTop: 20 } }}>
            <PrimaryButton text="Apply Search" onClick={applyAdvancedSearch} />
            <DefaultButton 
              text="Clear All" 
              onClick={() => {
                setAdvancedSearchFilters({ name: '', email: '', department: '', createdAfter: '', createdBefore: '' });
                setFilteredUsers(users);
              }} 
            />
          </Stack>
        </Stack>
      </Panel>

      {/* Export Options Dialog */}
      <Dialog
        hidden={!showExportOptions}
        onDismiss={() => setShowExportOptions(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Export Options' }}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <Text>Choose export format:</Text>
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton text="Export CSV" onClick={() => { exportAdvanced('csv'); setShowExportOptions(false); }} />
            <DefaultButton text="Export JSON" onClick={() => { exportAdvanced('json'); setShowExportOptions(false); }} />
          </Stack>
        </Stack>
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={() => setShowExportOptions(false)} />
        </DialogFooter>
      </Dialog>

      {/* User History Panel */}
      <Panel
        isOpen={showUserHistory}
        onDismiss={() => setShowUserHistory(false)}
        type={PanelType.medium}
        headerText={`User History - ${selectedUser?.name}`}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          {userHistory.map((entry, index) => (
            <Stack key={index} styles={{ root: { padding: 8, border: '1px solid #e1dfdd' } }}>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>{entry.action}</Text>
              <Text variant="small">{new Date(entry.date).toLocaleString()}</Text>
              <Text variant="small">{entry.details}</Text>
            </Stack>
          ))}
        </Stack>
      </Panel>

      {/* User Profile Panel */}
      <Panel
        isOpen={showUserProfile}
        onDismiss={() => setShowUserProfile(false)}
        type={PanelType.large}
        headerText={`User Profile - ${selectedUser?.name}`}
      >
        {selectedUser && (
          <Stack tokens={{ childrenGap: 20 }}>
            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <Stack styles={{ root: { width: '50%' } }} tokens={{ childrenGap: 8 }}>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold } }}>Personal Information</Text>
                <TextField label="Full Name" value={selectedUser.name} readOnly />
                <TextField label="Email" value={selectedUser.email} readOnly />
                <TextField label="Phone" value={selectedUser.phone || 'Not provided'} readOnly />
                <TextField label="Department" value={selectedUser.department} readOnly />
              </Stack>
              <Stack styles={{ root: { width: '50%' } }} tokens={{ childrenGap: 8 }}>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold } }}>Account Details</Text>
                <TextField label="Member ID" value={selectedUser.memberId} readOnly />
                <TextField label="Role" value={selectedUser.role} readOnly />
                <TextField label="Status" value={selectedUser.status} readOnly />
                <TextField label="Created" value={new Date(selectedUser.createdAt).toLocaleDateString()} readOnly />
              </Stack>
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <PrimaryButton text="Edit Profile" onClick={() => { setShowUserProfile(false); setIsEditUserPanelOpen(true); }} />
              <DefaultButton text="View History" onClick={() => { setShowUserProfile(false); fetchUserHistory(selectedUser._id); setShowUserHistory(true); }} />
            </Stack>
          </Stack>
        )}
      </Panel>

      {/* User Statistics Panel */}
      <Panel
        isOpen={showStatsPanel}
        onDismiss={() => setShowStatsPanel(false)}
        type={PanelType.extraLarge}
        headerText="User Analytics"
      >
        <Stack tokens={{ childrenGap: 40 }} styles={{ root: { padding: 32 } }}>
          {/* Key Metrics */}
          <Stack horizontal tokens={{ childrenGap: 60 }} horizontalAlign="center">
            <Stack horizontalAlign="center">
              <Text variant="mega" styles={{ root: { fontSize: 64, fontWeight: FontWeights.bold, color: '#0078d4' } }}>{users.length}</Text>
              <Text variant="large">Total Users</Text>
            </Stack>
            <Stack horizontalAlign="center">
              <Text variant="mega" styles={{ root: { fontSize: 64, fontWeight: FontWeights.bold, color: '#107c10' } }}>{users.filter(u => u.status === 'Active').length}</Text>
              <Text variant="large">Active Users</Text>
            </Stack>
            <Stack horizontalAlign="center">
              <Text variant="mega" styles={{ root: { fontSize: 64, fontWeight: FontWeights.bold, color: '#d13438' } }}>{users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</Text>
              <Text variant="large">New This Week</Text>
            </Stack>
          </Stack>

          {/* Role Distribution Pie Chart */}
          <Stack horizontalAlign="center" tokens={{ childrenGap: 24 }}>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>Role Distribution</Text>
            <svg width="300" height="300" viewBox="0 0 300 300">
              {(() => {
                const adminCount = users.filter(u => u.role === 'Admin').length;
                const librarianCount = users.filter(u => u.role === 'Librarian').length;
                const memberCount = users.filter(u => u.role === 'Member').length;
                const total = users.length;
                
                if (total === 0) return null;
                
                const adminAngle = (adminCount / total) * 360;
                const librarianAngle = (librarianCount / total) * 360;
                
                const createSlice = (startAngle, endAngle, color) => {
                  const centerX = 150;
                  const centerY = 150;
                  const radius = 100;
                  
                  const startAngleRad = (startAngle - 90) * Math.PI / 180;
                  const endAngleRad = (endAngle - 90) * Math.PI / 180;
                  
                  const x1 = centerX + radius * Math.cos(startAngleRad);
                  const y1 = centerY + radius * Math.sin(startAngleRad);
                  const x2 = centerX + radius * Math.cos(endAngleRad);
                  const y2 = centerY + radius * Math.sin(endAngleRad);
                  
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                  
                  return (
                    <path
                      d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={color}
                      stroke="white"
                      strokeWidth="3"
                    />
                  );
                };
                
                return (
                  <>
                    {adminCount > 0 && createSlice(0, adminAngle, '#0078d4')}
                    {librarianCount > 0 && createSlice(adminAngle, adminAngle + librarianAngle, '#107c10')}
                    {memberCount > 0 && createSlice(adminAngle + librarianAngle, 360, '#d13438')}
                  </>
                );
              })()}
            </svg>
            <Stack horizontal tokens={{ childrenGap: 32 }}>
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <div style={{ width: 20, height: 20, backgroundColor: '#0078d4', borderRadius: 4 }}></div>
                <Text variant="medium">Admins ({users.filter(u => u.role === 'Admin').length})</Text>
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <div style={{ width: 20, height: 20, backgroundColor: '#107c10', borderRadius: 4 }}></div>
                <Text variant="medium">Librarians ({users.filter(u => u.role === 'Librarian').length})</Text>
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                <div style={{ width: 20, height: 20, backgroundColor: '#d13438', borderRadius: 4 }}></div>
                <Text variant="medium">Members ({users.filter(u => u.role === 'Member').length})</Text>
              </Stack>
            </Stack>
          </Stack>

          {/* Department Bar Chart */}
          <Stack tokens={{ childrenGap: 24 }}>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>Department Distribution</Text>
            <Stack horizontal tokens={{ childrenGap: 40 }} horizontalAlign="center" styles={{ root: { height: 300, alignItems: 'flex-end' } }}>
              {(() => {
                const deptCounts = users.reduce((acc, user) => {
                  acc[user.department] = (acc[user.department] || 0) + 1;
                  return acc;
                }, {});
                const maxCount = Math.max(...Object.values(deptCounts));
                const colors = ['#0078d4', '#107c10', '#d13438', '#8764b8', '#00bcf2'];
                
                return Object.entries(deptCounts)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([dept, count], index) => (
                    <Stack key={dept} horizontalAlign="center" tokens={{ childrenGap: 8 }}>
                      <div style={{
                        width: 60,
                        height: Math.max((count / maxCount) * 250, 20),
                        backgroundColor: colors[index % colors.length],
                        borderRadius: '4px 4px 0 0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingTop: 8,
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {count}
                      </div>
                      <Text variant="small" styles={{ root: { textAlign: 'center', maxWidth: 80, wordWrap: 'break-word' } }}>
                        {dept.length > 12 ? dept.substring(0, 12) + '...' : dept}
                      </Text>
                    </Stack>
                  ));
              })()}
            </Stack>
          </Stack>
        </Stack>
      </Panel>
    </Stack>
  );
};

export default UserManagement;