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
  FontWeights
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
      const response = await fetch('/api/users');
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
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.role.toLowerCase().includes(value.toLowerCase()) ||
      user.department.toLowerCase().includes(value.toLowerCase()) ||
      (user.memberId && user.memberId.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    const validationErrors = validateForm(newUser);
    if (validationErrors.length > 0) {
      error(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
    }
  ];

  const userColumns = [
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

      <SearchBox
        placeholder="Search users by name, email, role, department, or member ID"
        value={searchValue}
        onChange={(_, value) => handleSearch(value || '')}
        styles={{ root: { maxWidth: '400px' } }}
      />

      <DetailsList
        items={filteredUsers}
        columns={userColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />

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
    </Stack>
  );
};

export default UserManagement;