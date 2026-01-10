import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelType,
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  TextField,
  DatePicker,
  DayOfWeek,
  Dropdown,
  mergeStyles,
  FontWeights,
  Icon,
  MessageBar,
  MessageBarType,
  SearchBox,
  Separator,
  Toggle
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const CalendarPanel = ({ isOpen, onDismiss, user }) => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '',
    endTime: '',
    description: '',
    category: 'General',
    location: '',
    reminder: false
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const categoryOptions = [
    { key: 'All', text: 'All Categories' },
    { key: 'General', text: 'General' },
    { key: 'Meeting', text: 'Meeting' },
    { key: 'Workshop', text: 'Workshop' },
    { key: 'Holiday', text: 'Holiday' },
    { key: 'Maintenance', text: 'Maintenance' },
    { key: 'Event', text: 'Special Event' }
  ];

  const viewModeOptions = [
    { key: 'month', text: 'Month View' },
    { key: 'week', text: 'Week View' },
    { key: 'agenda', text: 'Agenda View' }
  ];

  // Indian holidays and events
  const indianEvents = {
    '2024-01-14': 'Makar Sankranti',
    '2024-01-15': 'Pongal',
    '2024-01-26': 'Republic Day',
    '2024-02-14': 'Vasant Panchami',
    '2024-03-08': 'Maha Shivratri',
    '2024-03-25': 'Holi',
    '2024-03-29': 'Good Friday',
    '2024-04-09': 'Ugadi',
    '2024-04-11': 'Eid ul-Fitr',
    '2024-04-14': 'Baisakhi',
    '2024-04-17': 'Ram Navami',
    '2024-05-01': 'Labour Day',
    '2024-05-23': 'Buddha Purnima',
    '2024-06-17': 'Eid ul-Adha',
    '2024-07-17': 'Muharram',
    '2024-08-15': 'Independence Day',
    '2024-08-19': 'Raksha Bandhan',
    '2024-08-26': 'Janmashtami',
    '2024-09-07': 'Ganesh Chaturthi',
    '2024-09-16': 'Milad un-Nabi',
    '2024-10-02': 'Gandhi Jayanti',
    '2024-10-12': 'Dussehra',
    '2024-10-31': 'Diwali',
    '2024-11-01': 'Govardhan Puja',
    '2024-11-02': 'Bhai Dooj',
    '2024-11-15': 'Guru Nanak Jayanti',
    '2024-12-25': 'Christmas Day',
    '2025-01-14': 'Makar Sankranti',
    '2025-01-15': 'Pongal',
    '2025-01-26': 'Republic Day',
    '2025-02-03': 'Vasant Panchami',
    '2025-02-26': 'Maha Shivratri',
    '2025-03-14': 'Holi',
    '2025-03-31': 'Eid ul-Fitr',
    '2025-04-06': 'Ram Navami',
    '2025-04-13': 'Baisakhi',
    '2025-04-18': 'Good Friday',
    '2025-05-01': 'Labour Day',
    '2025-05-12': 'Buddha Purnima',
    '2025-06-07': 'Eid ul-Adha',
    '2025-07-06': 'Muharram',
    '2025-08-09': 'Raksha Bandhan',
    '2025-08-15': 'Independence Day',
    '2025-08-16': 'Janmashtami',
    '2025-08-27': 'Ganesh Chaturthi',
    '2025-09-05': 'Milad un-Nabi',
    '2025-10-02': 'Gandhi Jayanti',
    '2025-10-20': 'Dussehra',
    '2025-11-01': 'Diwali',
    '2025-11-02': 'Govardhan Puja',
    '2025-11-04': 'Bhai Dooj',
    '2025-11-05': 'Guru Nanak Jayanti',
    '2025-12-25': 'Christmas Day'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadEvents();
    }
  }, [isOpen]);

  const loadEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  const saveEvents = async (eventData, method = 'POST', eventId = null) => {
    try {
      const url = eventId ? `http://localhost:5000/api/events/${eventId}` : 'http://localhost:5000/api/events';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData)
      });
      if (response.ok) {
        await loadEvents();
      }
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.time) {
      error('Please fill in title and time');
      return;
    }

    await saveEvents(newEvent);
    setNewEvent({ title: '', date: new Date(), time: '', endTime: '', description: '', category: 'General', location: '', reminder: false });
    setShowAddForm(false);
    success('Event added successfully');
  };

  const updateEvent = async () => {
    if (!editingEvent.title || !editingEvent.time) {
      error('Please fill in title and time');
      return;
    }

    await saveEvents(editingEvent, 'PUT', editingEvent._id);
    setEditingEvent(null);
    success('Event updated successfully');
  };

  const deleteEvent = async (eventId) => {
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await loadEvents();
      success('Event deleted');
    } catch (err) {
      error('Error deleting event');
    }
  };

  const getEventsForDate = (date) => {
    if (!date) return { userEvents: [], indianEvent: null };
    const dateStr = date.toISOString().split('T')[0];
    const userEvents = events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      const matchesDate = eventDate === dateStr;
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'All' || event.category === filterCategory;
      return matchesDate && matchesSearch && matchesCategory;
    }) || [];
    const indianEvent = indianEvents[dateStr] || null;
    return { userEvents, indianEvent };
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    const upcoming = events
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
    
    const upcomingIndian = Object.entries(indianEvents)
      .filter(([dateStr]) => new Date(dateStr) >= now)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(0, 5)
      .map(([dateStr, title]) => ({
        id: 'indian-' + dateStr,
        title,
        date: dateStr,
        time: 'All Day',
        category: 'Holiday',
        isIndianEvent: true
      }));
    
    return [...upcoming, ...upcomingIndian]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Meeting': return '#0078d4';
      case 'Workshop': return '#107c10';
      case 'Holiday': return '#d83b01';
      case 'Maintenance': return '#ff8c00';
      case 'Event': return '#5c2d91';
      default: return '#605e5c';
    }
  };

  const calendarStyle = mergeStyles({
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    background: isDark ? '#484644' : '#d2d0ce',
    border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
    borderRadius: '4px'
  });

  const dayHeaderStyle = mergeStyles({
    padding: '12px 4px',
    background: isDark ? '#323130' : '#f8f7f4',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '12px',
    color: isDark ? '#ffffff' : '#323130'
  });

  const dayCellStyle = (date, hasEvents, isIndianEvent, isSelected) => mergeStyles({
    padding: '6px',
    background: isSelected 
      ? (isDark ? '#0078d4' : '#deecf9')
      : (isDark ? '#1e1e1e' : '#ffffff'),
    minHeight: '120px',
    cursor: 'pointer',
    position: 'relative',
    border: isToday(date) ? `2px solid #0078d4` : 'none',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ':hover': {
      background: isDark ? '#323130' : '#f3f2f1'
    },
    ...(hasEvents && !isSelected && {
      background: isDark ? '#0d4f8c' : '#deecf9'
    }),
    ...(isIndianEvent && !isSelected && {
      background: isDark ? '#8b4513' : '#fff4e6'
    })
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const canAddEvent = user?.role === 'Admin' || user?.role === 'Librarian';

  const renderMonthView = () => {
    const days = getDaysInMonth(selectedDate);
    return (
      <div className={calendarStyle}>
        {weekDays.map(day => (
          <div key={day} className={dayHeaderStyle}>
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          const { userEvents, indianEvent } = getEventsForDate(date);
          const hasEvents = userEvents.length > 0;
          const isIndianEvent = !!indianEvent;
          const isSelected = date && date.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={index}
              className={dayCellStyle(date, hasEvents, isIndianEvent, isSelected)}
              onClick={() => {
                if (date) {
                  setSelectedDate(date);
                  setNewEvent({ ...newEvent, date });
                }
              }}
            >
              {date && (
                <>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <Text styles={{ root: { 
                      fontSize: '16px', 
                      fontWeight: isToday(date) ? '700' : '500',
                      color: isToday(date) ? '#0078d4' : (isDark ? '#ffffff' : '#323130')
                    }}}>
                      {date.getDate()}
                    </Text>
                    {userEvents.length > 0 && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#0078d4'
                      }} />
                    )}
                  </div>
                  
                  {indianEvent && (
                    <div style={{
                      fontSize: '10px',
                      background: '#d83b01',
                      color: '#ffffff',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      marginBottom: '3px',
                      textAlign: 'center',
                      fontWeight: '600',
                      lineHeight: '1.2'
                    }}>
                      {indianEvent.length > 10 ? indianEvent.substring(0, 10) + '...' : indianEvent}
                    </div>
                  )}
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {userEvents.slice(0, 4).map((event, i) => (
                      <div key={i} style={{
                        fontSize: '10px',
                        background: getCategoryColor(event.category),
                        color: '#ffffff',
                        padding: '3px 5px',
                        borderRadius: '3px',
                        display: 'flex',
                        flexDirection: 'column',
                        lineHeight: '1.1',
                        minHeight: '20px',
                        justifyContent: 'center'
                      }}>
                        <div style={{ 
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
                        </div>
                        <div style={{ 
                          fontSize: '9px',
                          opacity: 0.9,
                          marginTop: '1px'
                        }}>
                          {event.time} {event.location && `• ${event.location.substring(0, 8)}`}
                        </div>
                      </div>
                    ))}
                    
                    {userEvents.length > 4 && (
                      <div style={{
                        fontSize: '9px',
                        color: isDark ? '#c8c6c4' : '#605e5c',
                        fontWeight: '600',
                        textAlign: 'center',
                        marginTop: '2px',
                        background: isDark ? 'rgba(200,198,196,0.1)' : 'rgba(96,94,92,0.1)',
                        padding: '2px',
                        borderRadius: '2px'
                      }}>
                        +{userEvents.length - 4} more events
                      </div>
                    )}
                  </div>
                </>
              )}}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAgendaView = () => {
    const upcoming = getUpcomingEvents();
    return (
      <Stack tokens={{ childrenGap: 8 }}>
        {upcoming.length === 0 ? (
          <MessageBar messageBarType={MessageBarType.info}>
            No upcoming events scheduled.
          </MessageBar>
        ) : (
          upcoming.map(event => (
            <div key={event.id} style={{
              padding: '12px',
              border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
              borderLeft: `4px solid ${event.isIndianEvent ? '#d83b01' : getCategoryColor(event.category)}`,
              borderRadius: '4px',
              background: isDark ? '#323130' : '#fafafa'
            }}>
              <Stack horizontal horizontalAlign="space-between">
                <Stack tokens={{ childrenGap: 4 }}>
                  <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    {event.title}
                  </Text>
                  <Stack horizontal tokens={{ childrenGap: 12 }}>
                    <Text variant="small">{formatDate(event.date)}</Text>
                    <Text variant="small">{event.time}</Text>
                    {event.location && <Text variant="small">📍 {event.location}</Text>}
                  </Stack>
                  {event.description && (
                    <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                      {event.description}
                    </Text>
                  )}
                </Stack>
                {canAddEvent && !event.isIndianEvent && (
                  <Stack horizontal tokens={{ childrenGap: 4 }}>
                    <DefaultButton
                      iconProps={{ iconName: 'Edit' }}
                      onClick={() => setEditingEvent(event)}
                      styles={{ root: { minWidth: '32px' } }}
                    />
                    <DefaultButton
                      iconProps={{ iconName: 'Delete' }}
                      onClick={() => deleteEvent(event.id)}
                      styles={{ root: { minWidth: '32px' } }}
                    />
                  </Stack>
                )}
              </Stack>
            </div>
          ))
        )}
      </Stack>
    );
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.extraLarge}
      headerText="Library Calendar & Events"
      styles={{
        main: {
          background: isDark ? '#1e1e1e' : '#ffffff'
        }
      }}
    >
      <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: '16px 0' } }}>
        {/* Real-time Header */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Stack>
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
              {currentDate.toLocaleDateString('en-IN', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text variant="large" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
              {currentDate.toLocaleTimeString('en-IN', { 
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </Text>
          </Stack>
          {canAddEvent && (
            <PrimaryButton
              text="Add Event"
              iconProps={{ iconName: 'Add' }}
              onClick={() => setShowAddForm(!showAddForm)}
            />
          )}
        </Stack>

        {/* Controls */}
        <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="end">
          <Dropdown
            options={viewModeOptions}
            selectedKey={viewMode}
            onChange={(_, option) => setViewMode(option?.key || 'month')}
            styles={{ root: { width: '120px' } }}
          />
          <SearchBox
            placeholder="Search events..."
            value={searchQuery}
            onChange={(_, value) => setSearchQuery(value || '')}
            styles={{ root: { width: '200px' } }}
          />
          <Dropdown
            options={categoryOptions}
            selectedKey={filterCategory}
            onChange={(_, option) => setFilterCategory(option?.key || 'All')}
            styles={{ root: { width: '150px' } }}
          />
        </Stack>

        {/* Month Navigation */}
        {viewMode !== 'agenda' && (
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <DefaultButton
              iconProps={{ iconName: 'ChevronLeft' }}
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
            />
            <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              {selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </Text>
            <DefaultButton
              iconProps={{ iconName: 'ChevronRight' }}
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            />
          </Stack>
        )}

        {/* Calendar Views */}
        <div>
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'agenda' && renderAgendaView()}
        </div>

        {/* Add/Edit Event Form */}
        {(showAddForm || editingEvent) && canAddEvent && (
          <Stack tokens={{ childrenGap: 12 }} styles={{ root: { 
            padding: '16px', 
            border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
            borderRadius: '4px',
            background: isDark ? '#323130' : '#fafafa'
          }}}>
            <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </Text>
            <Stack horizontal tokens={{ childrenGap: 12 }}>
              <TextField
                label="Event Title"
                value={editingEvent ? editingEvent.title : newEvent.title}
                onChange={(_, value) => editingEvent 
                  ? setEditingEvent({ ...editingEvent, title: value || '' })
                  : setNewEvent({ ...newEvent, title: value || '' })
                }
                required
                styles={{ root: { flex: 1 } }}
              />
              <Dropdown
                label="Category"
                options={categoryOptions.slice(1)}
                selectedKey={editingEvent ? editingEvent.category : newEvent.category}
                onChange={(_, option) => editingEvent
                  ? setEditingEvent({ ...editingEvent, category: option?.key || 'General' })
                  : setNewEvent({ ...newEvent, category: option?.key || 'General' })
                }
                styles={{ root: { width: '150px' } }}
              />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 12 }}>
              <DatePicker
                label="Event Date"
                value={editingEvent ? new Date(editingEvent.date) : newEvent.date}
                onSelectDate={(date) => editingEvent
                  ? setEditingEvent({ ...editingEvent, date: date || new Date() })
                  : setNewEvent({ ...newEvent, date: date || new Date() })
                }
                firstDayOfWeek={DayOfWeek.Sunday}
                styles={{ root: { width: '150px' } }}
              />
              <TextField
                label="Start Time"
                placeholder="e.g., 2:00 PM"
                value={editingEvent ? editingEvent.time : newEvent.time}
                onChange={(_, value) => editingEvent
                  ? setEditingEvent({ ...editingEvent, time: value || '' })
                  : setNewEvent({ ...newEvent, time: value || '' })
                }
                required
                styles={{ root: { width: '120px' } }}
              />
              <TextField
                label="End Time"
                placeholder="e.g., 4:00 PM"
                value={editingEvent ? editingEvent.endTime : newEvent.endTime}
                onChange={(_, value) => editingEvent
                  ? setEditingEvent({ ...editingEvent, endTime: value || '' })
                  : setNewEvent({ ...newEvent, endTime: value || '' })
                }
                styles={{ root: { width: '120px' } }}
              />
              <TextField
                label="Location"
                placeholder="e.g., Main Hall"
                value={editingEvent ? editingEvent.location : newEvent.location}
                onChange={(_, value) => editingEvent
                  ? setEditingEvent({ ...editingEvent, location: value || '' })
                  : setNewEvent({ ...newEvent, location: value || '' })
                }
                styles={{ root: { width: '150px' } }}
              />
            </Stack>
            <TextField
              label="Description (Optional)"
              multiline
              rows={2}
              value={editingEvent ? editingEvent.description : newEvent.description}
              onChange={(_, value) => editingEvent
                ? setEditingEvent({ ...editingEvent, description: value || '' })
                : setNewEvent({ ...newEvent, description: value || '' })
              }
            />
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Toggle
                label="Set Reminder"
                checked={editingEvent ? editingEvent.reminder : newEvent.reminder}
                onChange={(_, checked) => editingEvent
                  ? setEditingEvent({ ...editingEvent, reminder: !!checked })
                  : setNewEvent({ ...newEvent, reminder: !!checked })
                }
              />
              <Stack horizontal tokens={{ childrenGap: 8 }}>
                <PrimaryButton 
                  text={editingEvent ? 'Update Event' : 'Add Event'} 
                  onClick={editingEvent ? updateEvent : addEvent} 
                />
                <DefaultButton 
                  text="Cancel" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEvent(null);
                  }} 
                />
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Panel>
  );
};

export default CalendarPanel;