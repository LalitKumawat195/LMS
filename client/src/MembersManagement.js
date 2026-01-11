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
  FontWeights,
  IconButton,
  SearchBox,
  CommandBar,
  Dropdown,
  Dialog,
  DialogType,
  DialogFooter
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const MembersManagement = () => {
  const { user } = useAuth();
  const { success, error } = useNotifications();
  const [searchValue, setSearchValue] = useState('');
  const [members, setMembers] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    memberId: '',
    name: '',
    email: '',
    phone: '',
    type: 'Student',
    department: ''
  });

  const memberTypes = [
    { key: 'Student', text: 'Student' },
    { key: 'Faculty', text: 'Faculty' },
    { key: 'Staff', text: 'Staff' }
  ];

  useEffect(() => {
    const savedMembers = localStorage.getItem('lms_members');
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else {
      const sampleMembers = [
        {
          _id: '1',
          memberId: 'M001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          type: 'Student',
          department: 'Computer Science',
          joinDate: new Date().toISOString()
        }
      ];
      setMembers(sampleMembers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lms_members', JSON.stringify(members));
  }, [members]);

  const addMember = () => {
    if (!newMember.memberId || !newMember.name || !newMember.email) {
      error('Please fill required fields');
      return;
    }

    const memberWithId = {
      ...newMember,
      _id: Date.now().toString(),
      joinDate: new Date().toISOString()
    };
    
    setMembers([...members, memberWithId]);
    setNewMember({ memberId: '', name: '', email: '', phone: '', type: 'Student', department: '' });
    setShowAddDialog(false);
    success('Member added successfully');
  };

  const updateMember = () => {
    setMembers(members.map(member => member._id === selectedMember._id ? selectedMember : member));
    setShowEditDialog(false);
    setSelectedMember(null);
    success('Member updated successfully');
  };

  const deleteMember = (memberId) => {
    if (window.confirm('Are you sure?')) {
      setMembers(members.filter(member => member._id !== memberId));
      success('Member deleted successfully');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
    member.memberId?.toLowerCase().includes(searchValue.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const memberColumns = [
    { key: 'memberId', name: 'Member ID', fieldName: 'memberId', minWidth: 100 },
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 150 },
    { key: 'email', name: 'Email', fieldName: 'email', minWidth: 200 },
    { key: 'phone', name: 'Phone', fieldName: 'phone', minWidth: 120 },
    { key: 'type', name: 'Type', fieldName: 'type', minWidth: 80 },
    { key: 'department', name: 'Department', fieldName: 'department', minWidth: 120 },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 120,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            onClick={() => {
              setSelectedMember(item);
              setShowEditDialog(true);
            }}
          />
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            onClick={() => deleteMember(item._id)}
          />
        </Stack>
      )
    }
  ];

  const commandBarItems = [
    {
      key: 'add',
      text: 'Add Member',
      iconProps: { iconName: 'Add' },
      onClick: () => setShowAddDialog(true)
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Members Management
      </Text>
      
      <CommandBar items={commandBarItems} />
      
      <SearchBox
        placeholder="Search members..."
        value={searchValue}
        onChange={(_, newValue) => setSearchValue(newValue || '')}
        styles={{ root: { maxWidth: 400 } }}
      />
      
      <DetailsList
        items={filteredMembers}
        columns={memberColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />

      {/* Add Member Dialog */}
      <Dialog
        hidden={!showAddDialog}
        onDismiss={() => setShowAddDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Add New Member' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Member ID *"
            value={newMember.memberId}
            onChange={(_, value) => setNewMember({ ...newMember, memberId: value || '' })}
          />
          <TextField
            label="Name *"
            value={newMember.name}
            onChange={(_, value) => setNewMember({ ...newMember, name: value || '' })}
          />
          <TextField
            label="Email *"
            value={newMember.email}
            onChange={(_, value) => setNewMember({ ...newMember, email: value || '' })}
          />
          <TextField
            label="Phone"
            value={newMember.phone}
            onChange={(_, value) => setNewMember({ ...newMember, phone: value || '' })}
          />
          <Dropdown
            label="Type"
            options={memberTypes}
            selectedKey={newMember.type}
            onChange={(_, option) => setNewMember({ ...newMember, type: option?.key || 'Student' })}
          />
          <TextField
            label="Department"
            value={newMember.department}
            onChange={(_, value) => setNewMember({ ...newMember, department: value || '' })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={addMember} text="Add Member" />
          <DefaultButton onClick={() => setShowAddDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog
        hidden={!showEditDialog}
        onDismiss={() => setShowEditDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Edit Member' }}
      >
        {selectedMember && (
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Member ID"
              value={selectedMember.memberId}
              onChange={(_, value) => setSelectedMember({ ...selectedMember, memberId: value || '' })}
            />
            <TextField
              label="Name"
              value={selectedMember.name}
              onChange={(_, value) => setSelectedMember({ ...selectedMember, name: value || '' })}
            />
            <TextField
              label="Email"
              value={selectedMember.email}
              onChange={(_, value) => setSelectedMember({ ...selectedMember, email: value || '' })}
            />
            <TextField
              label="Phone"
              value={selectedMember.phone}
              onChange={(_, value) => setSelectedMember({ ...selectedMember, phone: value || '' })}
            />
            <Dropdown
              label="Type"
              options={memberTypes}
              selectedKey={selectedMember.type}
              onChange={(_, option) => setSelectedMember({ ...selectedMember, type: option?.key || 'Student' })}
            />
            <TextField
              label="Department"
              value={selectedMember.department}
              onChange={(_, value) => setSelectedMember({ ...selectedMember, department: value || '' })}
            />
          </Stack>
        )}
        <DialogFooter>
          <PrimaryButton onClick={updateMember} text="Update" />
          <DefaultButton onClick={() => setShowEditDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default MembersManagement;