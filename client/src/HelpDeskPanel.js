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
  mergeStyles,
  FontWeights,
  Icon,
  MessageBar,
  MessageBarType,
  SearchBox,
  Pivot,
  PivotItem,
  CommandBar,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  ProgressIndicator,
  Persona,
  PersonaSize,
  Dialog,
  DialogType,
  DialogFooter,
  Shimmer,
  ShimmerElementType,
  ActivityItem,
  Link,
  Rating,
  RatingSize
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const HelpDeskPanel = ({ isOpen, onDismiss, user }) => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTab, setSelectedTab] = useState('my-tickets');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketRating, setTicketRating] = useState(0);
  const [viewMode, setViewMode] = useState('cards');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium'
  });

  const categoryOptions = [
    { key: 'Technical', text: 'Technical Issue' },
    { key: 'Account', text: 'Account Problem' },
    { key: 'Books', text: 'Book Related' },
    { key: 'General', text: 'General Inquiry' },
    { key: 'Bug Report', text: 'Bug Report' }
  ];

  const priorityOptions = [
    { key: 'Low', text: 'Low Priority' },
    { key: 'Medium', text: 'Medium Priority' },
    { key: 'High', text: 'High Priority' },
    { key: 'Critical', text: 'Critical' }
  ];

  const statusOptions = [
    { key: 'All', text: 'All Status', data: { icon: 'BulletedList' } },
    { key: 'Open', text: 'Open', data: { icon: 'CircleRing' } },
    { key: 'In Progress', text: 'In Progress', data: { icon: 'ProgressLoopOuter' } },
    { key: 'Resolved', text: 'Resolved', data: { icon: 'CompletedSolid' } },
    { key: 'Closed', text: 'Closed', data: { icon: 'StatusCircleCheckmark' } }
  ];

  const isStaff = user?.role === 'Admin' || user?.role === 'Librarian';

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen]);

  useEffect(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
      const matchesTab = selectedTab === 'all-tickets' || 
                        (selectedTab === 'my-tickets' && ticket.userId.toString() === user?._id);
      return matchesSearch && matchesStatus && matchesTab;
    });
    setFilteredTickets(filtered);
  }, [tickets, searchQuery, filterStatus, selectedTab, user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (err) {
      error('Error loading tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newTicket)
      });
      
      if (response.ok) {
        await loadTickets();
        setNewTicket({ title: '', description: '', category: 'General', priority: 'Medium' });
        setShowCreateForm(false);
        success('Ticket created successfully');
      }
    } catch (err) {
      error('Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await loadTickets();
        success('Ticket status updated');
      }
    } catch (err) {
      error('Error updating ticket');
    }
  };

  const addResponse = async (ticketId) => {
    if (!responseText.trim()) {
      error('Please enter a response');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: responseText })
      });
      
      if (response.ok) {
        await loadTickets();
        setResponseText('');
        success('Response added');
      }
    } catch (err) {
      error('Error adding response');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#d13438';
      case 'High': return '#ff8c00';
      case 'Medium': return '#0078d4';
      default: return '#107c10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#d13438';
      case 'In Progress': return '#ff8c00';
      case 'Resolved': return '#107c10';
      case 'Closed': return '#605e5c';
      default: return '#0078d4';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return 'Warning';
      case 'High': return 'Important';
      case 'Medium': return 'Info';
      default: return 'CircleRing';
    }
  };



  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.extraLarge}
      headerText="Help Desk & Support Center"
      styles={{
        main: {
          background: isDark ? '#1e1e1e' : '#faf9f8'
        },
        header: {
          background: isDark ? '#323130' : '#ffffff',
          borderBottom: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
          paddingLeft: '32px',
          paddingRight: '32px'
        },
        headerText: {
          fontSize: '20px',
          fontWeight: FontWeights.semibold
        },
        content: {
          padding: 0
        }
      }}
    >
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: isDark ? '#323130' : '#ffffff',
          borderBottom: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
          padding: '12px 24px'
        }}>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Stack horizontal tokens={{ childrenGap: 12 }}>
              <PrimaryButton
                text="New Ticket"
                iconProps={{ iconName: 'Add' }}
                onClick={() => setShowCreateForm(true)}
                styles={{ root: { height: '32px' } }}
              />
              <DefaultButton
                text="Refresh"
                iconProps={{ iconName: 'Refresh' }}
                onClick={loadTickets}
                styles={{ root: { height: '32px' } }}
              />
            </Stack>
            <DefaultButton
              text={viewMode === 'list' ? 'List View' : 'Card View'}
              iconProps={{ iconName: viewMode === 'list' ? 'List' : 'GridViewMedium' }}
              onClick={() => setViewMode(viewMode === 'list' ? 'cards' : 'list')}
              styles={{ root: { height: '32px' } }}
            />
          </Stack>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Stack tokens={{ childrenGap: 24 }}>
            {/* Stats Dashboard */}
            <Stack tokens={{ childrenGap: 16 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Support Overview
              </Text>
              <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                <div style={{
                  padding: '16px',
                  background: isDark ? '#323130' : '#ffffff',
                  border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                  borderRadius: '4px',
                  minWidth: '140px',
                  textAlign: 'center'
                }}>
                  <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
                    <Icon iconName="CircleRing" styles={{ root: { fontSize: '20px', color: '#d13438' } }} />
                    <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#d13438' } }}>
                      {tickets.filter(t => t.status === 'Open').length}
                    </Text>
                    <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>Open</Text>
                  </Stack>
                </div>
                <div style={{
                  padding: '16px',
                  background: isDark ? '#323130' : '#ffffff',
                  border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                  borderRadius: '4px',
                  minWidth: '140px',
                  textAlign: 'center'
                }}>
                  <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
                    <Icon iconName="ProgressLoopOuter" styles={{ root: { fontSize: '20px', color: '#ff8c00' } }} />
                    <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#ff8c00' } }}>
                      {tickets.filter(t => t.status === 'In Progress').length}
                    </Text>
                    <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>In Progress</Text>
                  </Stack>
                </div>
                <div style={{
                  padding: '16px',
                  background: isDark ? '#323130' : '#ffffff',
                  border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                  borderRadius: '4px',
                  minWidth: '140px',
                  textAlign: 'center'
                }}>
                  <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
                    <Icon iconName="CompletedSolid" styles={{ root: { fontSize: '20px', color: '#107c10' } }} />
                    <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#107c10' } }}>
                      {tickets.filter(t => t.status === 'Resolved').length}
                    </Text>
                    <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>Resolved</Text>
                  </Stack>
                </div>
              </Stack>
            </Stack>

            {/* Tabs and Filters */}
            <Stack tokens={{ childrenGap: 16 }}>
              <Pivot
                selectedKey={selectedTab}
                onLinkClick={(item) => setSelectedTab(item?.props?.itemKey || 'my-tickets')}
                styles={{
                  link: {
                    fontSize: '14px',
                    fontWeight: FontWeights.regular,
                    padding: '8px 16px'
                  },
                  linkIsSelected: {
                    fontSize: '14px',
                    fontWeight: FontWeights.semibold
                  }
                }}
              >
                <PivotItem headerText={`My Tickets (${tickets.filter(t => t.userId && t.userId.toString() === user?._id).length})`} itemKey="my-tickets" />
                {isStaff && <PivotItem headerText={`All Tickets (${tickets.length})`} itemKey="all-tickets" />}
              </Pivot>

              <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="end">
                <SearchBox
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(_, value) => setSearchQuery(value || '')}
                  styles={{ root: { width: '300px' } }}
                />
                <Dropdown
                  placeholder="Filter by status"
                  options={statusOptions}
                  selectedKey={filterStatus}
                  onChange={(_, option) => setFilterStatus(option?.key || 'All')}
                  styles={{ root: { width: '150px' } }}
                />
              </Stack>
            </Stack>

            {/* Create Ticket Form */}
            {showCreateForm && (
              <div style={{
                padding: '20px',
                background: isDark ? '#323130' : '#ffffff',
                border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                borderRadius: '4px'
              }}>
                <Stack tokens={{ childrenGap: 16 }}>
                  <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Create New Support Ticket
                    </Text>
                    <Icon 
                      iconName="Cancel" 
                      onClick={() => setShowCreateForm(false)}
                      styles={{ root: { fontSize: '14px', cursor: 'pointer' } }}
                    />
                  </Stack>
                  
                  <Stack tokens={{ childrenGap: 12 }}>
                    <TextField
                      label="Title"
                      value={newTicket.title}
                      onChange={(_, value) => setNewTicket({ ...newTicket, title: value || '' })}
                      required
                    />
                    
                    <TextField
                      label="Description"
                      multiline
                      rows={4}
                      value={newTicket.description}
                      onChange={(_, value) => setNewTicket({ ...newTicket, description: value || '' })}
                      required
                    />
                    
                    <Stack horizontal tokens={{ childrenGap: 12 }}>
                      <Dropdown
                        label="Category"
                        options={categoryOptions}
                        selectedKey={newTicket.category}
                        onChange={(_, option) => setNewTicket({ ...newTicket, category: option?.key || 'General' })}
                        styles={{ root: { width: '200px' } }}
                      />
                      <Dropdown
                        label="Priority"
                        options={priorityOptions}
                        selectedKey={newTicket.priority}
                        onChange={(_, option) => setNewTicket({ ...newTicket, priority: option?.key || 'Medium' })}
                        styles={{ root: { width: '150px' } }}
                      />
                    </Stack>
                  </Stack>
                  
                  <Stack horizontal tokens={{ childrenGap: 8 }} horizontalAlign="end">
                    <PrimaryButton 
                      text="Create Ticket" 
                      onClick={createTicket}
                      disabled={loading}
                    />
                    <DefaultButton 
                      text="Cancel" 
                      onClick={() => setShowCreateForm(false)}
                    />
                  </Stack>
                </Stack>
              </div>
            )}

            {/* Tickets Display */}
            <Stack tokens={{ childrenGap: 12 }}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                  {selectedTab === 'my-tickets' ? 'My Support Tickets' : 'All Support Tickets'}
                </Text>
                <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                  {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
                </Text>
              </Stack>

              {loading ? (
                <Stack tokens={{ childrenGap: 8 }}>
                  {[1, 2, 3].map(i => (
                    <Shimmer
                      key={i}
                      shimmerElements={[
                        { type: ShimmerElementType.line, width: '30%', height: 16 },
                        { type: ShimmerElementType.gap, width: 16 },
                        { type: ShimmerElementType.line, width: '20%', height: 12 },
                        { type: ShimmerElementType.gap, width: '100%' },
                        { type: ShimmerElementType.line, width: '60%', height: 12 }
                      ]}
                      styles={{
                        root: {
                          padding: '16px',
                          background: isDark ? '#323130' : '#ffffff',
                          border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                          marginBottom: '8px'
                        }
                      }}
                    />
                  ))}
                </Stack>
              ) : filteredTickets.length === 0 ? (
                <div style={{
                  padding: '48px 32px',
                  background: isDark ? '#323130' : '#ffffff',
                  border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <Stack tokens={{ childrenGap: 16 }} horizontalAlign="center">
                    <Icon iconName="Help" styles={{ root: { fontSize: '48px', color: isDark ? '#605e5c' : '#a19f9d' } }} />
                    <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                      No tickets found
                    </Text>
                    <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c', maxWidth: '400px' } }}>
                      Create your first support ticket to get help with library services.
                    </Text>
                    <PrimaryButton
                      text="Create Your First Ticket"
                      iconProps={{ iconName: 'Add' }}
                      onClick={() => setShowCreateForm(true)}
                      styles={{
                        root: {
                          height: '40px',
                          fontSize: '14px',
                          fontWeight: FontWeights.semibold,
                          marginTop: '8px'
                        }
                      }}
                    />
                  </Stack>
                </div>
              ) : (
                <Stack tokens={{ childrenGap: 12 }}>
                  {viewMode === 'cards' ? (
                    filteredTickets.map(ticket => (
                      <div 
                        key={ticket._id} 
                        style={{
                          padding: '16px',
                          background: isDark ? '#323130' : '#ffffff',
                          border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => { setSelectedTicket(ticket); setShowTicketDialog(true); }}
                      >
                        <Stack tokens={{ childrenGap: 12 }}>
                          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                              <Icon iconName={getPriorityIcon(ticket.priority)} styles={{ root: { fontSize: '16px', color: getPriorityColor(ticket.priority) } }} />
                              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                                {ticket.title}
                              </Text>
                            </Stack>
                            <Stack horizontal tokens={{ childrenGap: 8 }}>
                              <div style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: getPriorityColor(ticket.priority),
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: '600'
                              }}>
                                {ticket.priority}
                              </div>
                              <div style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: getStatusColor(ticket.status),
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: '600'
                              }}>
                                {ticket.status}
                              </div>
                            </Stack>
                          </Stack>
                          
                          <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                            {ticket.description.length > 100 ? ticket.description.substring(0, 100) + '...' : ticket.description}
                          </Text>
                          
                          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                            <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
                              <Text variant="small">{ticket.category}</Text>
                              <Text variant="small">{ticket.createdBy}</Text>
                              <Text variant="small">{new Date(ticket.createdAt).toLocaleDateString()}</Text>
                            </Stack>
                            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                              {ticket.responses && ticket.responses.length > 0 && (
                                <Text variant="small" styles={{ root: { color: '#0078d4' } }}>
                                  {ticket.responses.length} response{ticket.responses.length !== 1 ? 's' : ''}
                                </Text>
                              )}
                              {isStaff && (
                                <Dropdown
                                  options={statusOptions.slice(1)}
                                  selectedKey={ticket.status}
                                  onChange={(_, option) => updateTicketStatus(ticket._id, option?.key)}
                                  styles={{ root: { width: '120px' } }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                            </Stack>
                          </Stack>
                        </Stack>
                      </div>
                    ))
                  ) : (
                    <DetailsList
                      items={filteredTickets}
                      columns={[
                        { 
                          key: 'title', 
                          name: 'Title', 
                          fieldName: 'title', 
                          minWidth: 200,
                          onRender: (item) => (
                            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" styles={{ root: { height: '32px' } }}>
                              <Icon iconName={getPriorityIcon(item.priority)} styles={{ root: { fontSize: '14px', color: getPriorityColor(item.priority) } }} />
                              <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>{item.title}</Text>
                            </Stack>
                          )
                        },
                        { 
                          key: 'status', 
                          name: 'Status', 
                          fieldName: 'status', 
                          minWidth: 180,
                          onRender: (item) => (
                            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" styles={{ root: { height: '32px' } }}>
                              <div style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: getStatusColor(item.status),
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: '600'
                              }}>
                                {item.status}
                              </div>
                              {isStaff && (
                                <Dropdown
                                  options={statusOptions.slice(1)}
                                  selectedKey={item.status}
                                  onChange={(_, option) => updateTicketStatus(item._id, option?.key)}
                                  styles={{ root: { width: '100px' } }}
                                />
                              )}
                            </Stack>
                          )
                        },
                        { 
                          key: 'priority', 
                          name: 'Priority', 
                          fieldName: 'priority', 
                          minWidth: 100,
                          onRender: (item) => (
                            <div style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background: getPriorityColor(item.priority),
                              color: '#ffffff',
                              fontSize: '10px',
                              fontWeight: '600',
                              display: 'inline-block',
                              marginTop: '8px'
                            }}>
                              {item.priority}
                            </div>
                          )
                        },
                        { 
                          key: 'category', 
                          name: 'Category', 
                          fieldName: 'category', 
                          minWidth: 120,
                          onRender: (item) => (
                            <div style={{ paddingTop: '8px' }}>
                              <Text>{item.category}</Text>
                            </div>
                          )
                        },
                        { 
                          key: 'createdBy', 
                          name: 'Created By', 
                          fieldName: 'createdBy', 
                          minWidth: 120,
                          onRender: (item) => (
                            <div style={{ paddingTop: '8px' }}>
                              <Text>{item.createdBy}</Text>
                            </div>
                          )
                        },
                        { 
                          key: 'createdAt', 
                          name: 'Created', 
                          fieldName: 'createdAt', 
                          minWidth: 100,
                          onRender: (item) => (
                            <div style={{ paddingTop: '8px' }}>
                              <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            </div>
                          )
                        },
                        {
                          key: 'responses',
                          name: 'Responses',
                          minWidth: 80,
                          onRender: (item) => (
                            <div style={{ paddingTop: '8px', cursor: 'pointer' }} onClick={() => { setSelectedTicket(item); setShowTicketDialog(true); }}>
                              <Text styles={{ root: { color: '#0078d4' } }}>
                                {item.responses?.length || 0}
                              </Text>
                            </div>
                          )
                        }
                      ]}
                      layoutMode={DetailsListLayoutMode.justified}
                      selectionMode={SelectionMode.none}
                      onItemInvoked={(item) => { setSelectedTicket(item); setShowTicketDialog(true); }}
                      styles={{
                        root: {
                          background: isDark ? '#323130' : '#ffffff',
                          border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
                          borderRadius: '4px'
                        }
                      }}
                    />
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        </div>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog
        hidden={!showTicketDialog}
        onDismiss={() => setShowTicketDialog(false)}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: selectedTicket?.title,
          subText: `${selectedTicket?.category} • ${selectedTicket?.priority} Priority • ${selectedTicket?.status}`
        }}
        modalProps={{
          isBlocking: false,
          styles: { main: { maxWidth: 600 } }
        }}
      >
        {selectedTicket && (
          <Stack tokens={{ childrenGap: 16 }}>
            <Text>{selectedTicket.description}</Text>
            
            <ProgressIndicator
              percentComplete={
                selectedTicket.status === 'Open' ? 0.25 :
                selectedTicket.status === 'In Progress' ? 0.5 :
                selectedTicket.status === 'Resolved' ? 0.75 : 1
              }
              description={`Status: ${selectedTicket.status}`}
            />

            {selectedTicket.responses && selectedTicket.responses.length > 0 && (
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="small" styles={{ root: { fontWeight: FontWeights.semibold } }}>Activity</Text>
                {selectedTicket.responses.map((response, index) => (
                  <ActivityItem
                    key={index}
                    activityDescription={
                      <Stack tokens={{ childrenGap: 4 }}>
                        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                          <Text variant="small" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                            {response.respondedBy}
                          </Text>
                          <Text variant="small" styles={{ root: { color: response.isStaff ? '#107c10' : '#0078d4', fontWeight: '600' } }}>
                            ({response.isStaff ? 'Staff' : 'Member'})
                          </Text>
                        </Stack>
                        <Text variant="small">{response.message}</Text>
                        <Text variant="small" styles={{ root: { color: isDark ? '#a19f9d' : '#8a8886' } }}>
                          {new Date(response.respondedAt).toLocaleString()}
                        </Text>
                      </Stack>
                    }
                    isCompact
                  />
                ))}
              </Stack>
            )}

            <TextField
              placeholder="Add a response..."
              multiline
              rows={3}
              value={responseText}
              onChange={(_, value) => setResponseText(value || '')}
            />

            {selectedTicket.status === 'Resolved' && (
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="small" styles={{ root: { fontWeight: FontWeights.semibold } }}>Rate this support</Text>
                <Rating
                  rating={ticketRating}
                  onChange={(_, rating) => setTicketRating(rating || 0)}
                  size={RatingSize.Large}
                />
              </Stack>
            )}
          </Stack>
        )}
        
        <div style={{ 
          borderTop: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <PrimaryButton
            text="Add Response"
            onClick={() => addResponse(selectedTicket?._id)}
            disabled={!responseText.trim()}
          />
          {isStaff && selectedTicket && (
            <Dropdown
              options={statusOptions.slice(1)}
              selectedKey={selectedTicket.status}
              onChange={(_, option) => updateTicketStatus(selectedTicket._id, option?.key)}
              styles={{ root: { width: '120px' } }}
            />
          )}
          <DefaultButton text="Close" onClick={() => setShowTicketDialog(false)} />
        </div>
      </Dialog>
    </Panel>
  );
};

export default HelpDeskPanel;