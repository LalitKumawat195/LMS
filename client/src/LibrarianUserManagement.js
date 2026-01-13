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
import MemberDetails from './MemberDetails';

const LibrarianUserManagement = () => {
  const { isDark } = useTheme();
  const { success, warning, error } = useNotifications();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditUserPanelOpen, setIsEditUserPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    status: 'Active'
  });
  const [showUserDetailsPanel, setShowUserDetailsPanel] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters(searchValue, filterStatus);
  }, [users]);

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
        // Filter to only show Members
        const membersOnly = data.filter(user => user.role === 'Member');
        setUsers(membersOnly);
        setFilteredUsers(membersOnly);
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
    applyFilters(value, filterStatus);
  };

  const applyFilters = (search, status) => {
    let filtered = users.filter(user => 
      ((user.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.memberId || '').toLowerCase().includes(search.toLowerCase())) &&
      (status === 'All' || user.status === status)
    );

    setFilteredUsers(filtered);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    applyFilters(searchValue, status);
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...newUser, role: 'Member' })
      });
      
      const data = await response.json();
      if (response.ok) {
        fetchUsers();
        setNewUser({ name: '', email: '', department: '', phone: '', status: 'Active' });
        setIsAddUserDialogOpen(false);
        success(`Member ${newUser.name} added successfully`);
      } else {
        error(data.message || 'Failed to add member');
      }
    } catch (err) {
      error('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
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
        success(`Member ${selectedUser.name} updated successfully`);
      } else {
        error(data.message || 'Failed to update member');
      }
    } catch (err) {
      error('Failed to update member');
    } finally {
      setLoading(false);
    }
  };

  const commandBarItems = [
    {
      key: 'addMember',
      text: 'Add Member',
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
      text: 'Export Members',
      iconProps: { iconName: 'Download' },
      onClick: () => {
        const csvData = users.map(u => `${u.memberId},${u.name},${u.email},${u.department},${u.status}`).join('\n');
        const blob = new Blob([`Member ID,Name,Email,Department,Status\n${csvData}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'members.csv';
        a.click();
        success('Members exported successfully');
      }
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
      minWidth: 150,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            title="Edit Member"
            onClick={() => {
              setSelectedUser(item);
              setIsEditUserPanelOpen(true);
            }}
            styles={{ root: { minWidth: 24, width: 24, height: 24 } }}
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
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          Member Management
        </Text>
        <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Manage library members and their information
        </Text>
      </Stack>

      <CommandBar items={commandBarItems} />

      <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { marginBottom: 16 } }}>
        <SearchBox
          placeholder="Search members by name, email, department, or member ID"
          value={searchValue}
          onChange={(_, value) => handleSearch(value || '')}
          styles={{ root: { width: '300px' } }}
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
            setFilterStatus('All');
            applyFilters('', 'All');
          }}
        />
      </Stack>

      <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 8 } }}>
        <Text variant="medium">
          Showing {filteredUsers.length} of {users.length} members
        </Text>
      </Stack>

      <DetailsList
        items={filteredUsers}
        columns={userColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />

      {/* Edit User Panel */}
      <Panel
        isOpen={isEditUserPanelOpen}
        onDismiss={() => setIsEditUserPanelOpen(false)}
        type={PanelType.medium}
        headerText="Edit Member"
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
              label="Department"
              options={[
                { key: 'Computer Science', text: 'Computer Science' },
                { key: 'Mathematics', text: 'Mathematics' },
                { key: 'English Literature', text: 'English Literature' },
                { key: 'Engineering', text: 'Engineering' },
                { key: 'Business Administration', text: 'Business Administration' }
              ]}
              selectedKey={selectedUser.department}
              onChange={(_, option) => setSelectedUser({ ...selectedUser, department: option?.key || '' })}
              placeholder="Select department"
            />
            <TextField
              label="Phone"
              value={selectedUser.phone}
              onChange={(_, value) => setSelectedUser({ ...selectedUser, phone: value || '' })}
            />
            <Dropdown
              label="Status"
              options={[
                { key: 'Active', text: 'Active' },
                { key: 'Inactive', text: 'Inactive' }
              ]}
              selectedKey={selectedUser.status}
              onChange={(_, option) => setSelectedUser({ ...selectedUser, status: option.key })}
            />
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <PrimaryButton text="Update Member" onClick={handleEditUser} disabled={loading} />
              <DefaultButton text="Cancel" onClick={() => setIsEditUserPanelOpen(false)} />
            </Stack>
          </Stack>
        )}
      </Panel>

      {/* User Details Panel */}
      <Panel
        isOpen={showUserDetailsPanel}
        onDismiss={() => setShowUserDetailsPanel(false)}
        type={PanelType.medium}
        headerText="Member Details"
      >
        {selectedUser && (
          <Stack tokens={{ childrenGap: 24 }} styles={{ root: { padding: '8px 0' } }}>
            <MemberDetails member={selectedUser} />
            <Stack horizontal tokens={{ childrenGap: 12 }}>
              <PrimaryButton
                text="Edit Member"
                iconProps={{ iconName: 'Edit' }}
                onClick={() => {
                  setShowUserDetailsPanel(false);
                  setIsEditUserPanelOpen(true);
                }}
              />
              <DefaultButton
                text="Close"
                onClick={() => setShowUserDetailsPanel(false)}
              />
            </Stack>
          </Stack>
        )}
      </Panel>

      {/* Add Member Dialog */}
      <Dialog
        hidden={!isAddUserDialogOpen}
        onDismiss={() => setIsAddUserDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Add New Member'
        }}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <TextField
            label="Name"
            required
            value={newUser.name}
            onChange={(_, value) => setNewUser({ ...newUser, name: value || '' })}
          />
          <TextField
            label="Email"
            required
            type="email"
            value={newUser.email}
            onChange={(_, value) => setNewUser({ ...newUser, email: value || '' })}
          />
          <Dropdown
            label="Department"
            options={[
              { key: 'Computer Science', text: 'Computer Science' },
              { key: 'Mathematics', text: 'Mathematics' },
              { key: 'English Literature', text: 'English Literature' },
              { key: 'Engineering', text: 'Engineering' },
              { key: 'Business Administration', text: 'Business Administration' }
            ]}
            selectedKey={newUser.department}
            onChange={(_, option) => setNewUser({ ...newUser, department: option?.key || '' })}
            placeholder="Select department"
          />
          <TextField
            label="Phone"
            value={newUser.phone}
            onChange={(_, value) => setNewUser({ ...newUser, phone: value || '' })}
          />
          <Dropdown
            label="Status"
            options={[
              { key: 'Active', text: 'Active' },
              { key: 'Inactive', text: 'Inactive' }
            ]}
            selectedKey={newUser.status}
            onChange={(_, option) => setNewUser({ ...newUser, status: option.key })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton text="Add Member" onClick={handleAddUser} disabled={loading} />
          <DefaultButton text="Cancel" onClick={() => setIsAddUserDialogOpen(false)} />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default LibrarianUserManagement;