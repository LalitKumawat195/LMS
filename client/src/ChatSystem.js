import React, { useState, useEffect, useRef } from 'react';
import {
  Panel,
  PanelType,
  Stack,
  Text,
  TextField,
  PrimaryButton,
  IconButton,
  Persona,
  PersonaSize,
  mergeStyles,
  FontWeights,
  SearchBox,
  DefaultButton,
  Dialog,
  DialogType,
  DialogFooter,
  Dropdown,
  Icon,
  MessageBar,
  MessageBarType,
  ContextualMenu,
  DirectionalHint,
  Fabric,
  initializeIcons,
  ScrollablePane,
  Sticky,
  StickyPositionType,
  List,
  FocusZone,
  FocusZoneDirection
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import './ChatSystem.css';

const ChatSystem = ({ isOpen, onDismiss }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success } = useNotifications();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [messageReactions, setMessageReactions] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [lastSeen, setLastSeen] = useState({});
  const [moreMenuTarget, setMoreMenuTarget] = useState(null);
  const messagesEndRef = useRef(null);

  const spacingTokens = {
    xs: '2px',
    s2: '4px', 
    s1: '8px',
    m: '12px',
    l1: '16px',
    l2: '24px',
    xl: '32px'
  };

  const teamsColors = {
    primary: '#6264a7',
    primaryHover: '#464775',
    accent: '#5b5fc7',
    surface: isDark ? '#292929' : '#ffffff',
    background: isDark ? '#1f1f1f' : '#f3f2f1',
    border: isDark ? '#484644' : '#e1dfdd',
    text: isDark ? '#ffffff' : '#323130',
    textSecondary: isDark ? '#c8c6c4' : '#605e5c'
  };

  useEffect(() => {
    initializeIcons();
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadChats();
      loadUsers();
      setOnlineUsers(['admin', 'librarian1', 'member1']);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      // Reset unread count in local state
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id ? { ...chat, unreadCount: 0 } : chat
      ));
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chats/users/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 403) {
        setUsers([]);
        success('No users available to chat with');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
    }
  };

  const loadChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const sortedChats = data.sort((a, b) => {
          const dateA = a.lastMessageAt ? new Date(a.lastMessageAt) : new Date(0);
          const dateB = b.lastMessageAt ? new Date(b.lastMessageAt) : new Date(0);
          return dateB - dateA;
        });
        setChats(sortedChats);
      }
    } catch (err) {
      console.error('Error loading chats:', err);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const messageContent = replyToMessage ? `@${replyToMessage.senderName}: ${message}` : message;
    const tempMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`http://localhost:5000/api/chats/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          content: messageContent,
          replyTo: replyToMessage?.id
        })
      });

      if (response.ok) {
        setReplyToMessage(null);
        loadMessages(selectedChat.id);
        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id 
            ? { ...chat, lastMessage: messageContent, lastMessageAt: new Date().toISOString() }
            : chat
        ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
      } else {
        setMessage(tempMessage);
        const errorData = await response.json();
        success(errorData.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessage(tempMessage);
      success('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const addReaction = (emoji) => {
    if (!selectedMessage) return;
    const messageId = selectedMessage.id;
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), { emoji, user: user.name }]
    }));
    success(`Reacted with ${emoji}`);
    setShowContextMenu(false);
  };

  const startCall = (type) => {
    setCallType(type);
    setShowCallDialog(true);
  };

  const endCall = () => {
    setShowCallDialog(false);
    setCallType('');
  };

  const moreMenuItems = [
    {
      key: 'search',
      text: 'Search in conversation',
      iconProps: { iconName: 'Search' },
      onClick: () => success('Search feature available')
    },
    {
      key: 'files',
      text: 'Shared files',
      iconProps: { iconName: 'Attach' },
      onClick: () => success('File sharing available')
    },
    {
      key: 'mute',
      text: 'Mute notifications',
      iconProps: { iconName: 'VolumeDisabled' },
      onClick: () => success('Notifications muted for this chat')
    },
    {
      key: 'pin',
      text: 'Pin conversation',
      iconProps: { iconName: 'Pin' },
      onClick: () => success('Conversation pinned')
    },
    {
      key: 'archive',
      text: 'Archive conversation',
      iconProps: { iconName: 'Archive' },
      onClick: () => success('Conversation archived')
    }
  ];

  const startNewChat = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ participantId: selectedUser })
      });

      if (response.ok) {
        const newChat = await response.json();
        setShowNewChatDialog(false);
        setSelectedUser(null);
        setChats(prev => [newChat, ...prev]);
        setSelectedChat(newChat);
        success('Chat started');
      } else if (response.status === 403) {
        const error = await response.json();
        success(error.message || 'Cannot start chat with this user');
      }
    } catch (err) {
      console.error('Error creating chat:', err);
      success('Failed to start chat');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u._id !== user?._id && 
    (user?.role !== 'Member' || u.role !== 'Admin') &&
    (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
     u.role.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  const userOptions = filteredUsers
    .map(u => ({
      key: u._id,
      text: `${u.name} (${u.role})`,
      data: { role: u.role, user: u },
      onRenderOption: (option) => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Persona
            text={option.data.user.name}
            size={PersonaSize.size24}
            hidePersonaDetails
            imageUrl={option.data.user.profilePicture ? `http://localhost:5000${option.data.user.profilePicture}` : undefined}
          />
          <Stack>
            <Text styles={{ root: { fontSize: '14px', fontWeight: FontWeights.semibold } }}>
              {option.data.user.name}
            </Text>
            <Text styles={{ root: { fontSize: '12px', color: teamsColors.textSecondary } }}>
              {option.data.user.role}
            </Text>
          </Stack>
        </Stack>
      )
    }));

  const contextMenuItems = [
    {
      key: 'reply',
      text: 'Reply',
      iconProps: { iconName: 'Reply' },
      onClick: () => {
        setReplyToMessage(selectedMessage);
        setShowContextMenu(false);
      }
    },
    {
      key: 'react',
      text: 'Add reaction',
      iconProps: { iconName: 'Emoji2' },
      subMenuProps: {
        items: [
          { key: 'like', text: '👍', onClick: () => addReaction('👍') },
          { key: 'love', text: '❤️', onClick: () => addReaction('❤️') },
          { key: 'laugh', text: '😂', onClick: () => addReaction('😂') }
        ]
      }
    },
    {
      key: 'copy',
      text: 'Copy text',
      iconProps: { iconName: 'Copy' },
      onClick: () => {
        navigator.clipboard.writeText(selectedMessage?.content);
        success('Message copied');
        setShowContextMenu(false);
      }
    }
  ];

  const renderMessage = (msg, index) => {
    const isOwn = msg.senderId?.toString() === user?.id?.toString() || msg.senderName === user?.name;
    const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
    const showName = !isOwn && showAvatar;
    
    return (
      <div
        key={msg.id || msg._id}
        style={{
          display: 'flex',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          padding: '2px 16px',
          marginBottom: '4px'
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setSelectedMessage(msg);
          setContextMenuTarget(e.target);
          setShowContextMenu(true);
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: isOwn ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          maxWidth: '70%',
          gap: '8px'
        }}>
          {!isOwn && (
            <div style={{ width: '28px', flexShrink: 0 }}>
              {showAvatar && (
                <Persona
                  text={msg.senderName}
                  size={PersonaSize.size24}
                  hidePersonaDetails
                  imageUrl={msg.senderProfilePicture ? `http://localhost:5000${msg.senderProfilePicture}` : undefined}
                />
              )}
            </div>
          )}
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOwn ? 'flex-end' : 'flex-start',
            gap: '2px'
          }}>
            {showName && (
              <Text variant="small" styles={{
                root: {
                  color: teamsColors.accent,
                  fontWeight: FontWeights.semibold,
                  fontSize: '11px',
                  marginBottom: '2px',
                  paddingLeft: '12px'
                }
              }}>
                {msg.senderName}
              </Text>
            )}
            
            <div style={{
              padding: '8px 12px',
              borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: isOwn ? teamsColors.accent : teamsColors.surface,
              color: isOwn ? '#ffffff' : teamsColors.text,
              border: !isOwn ? `1px solid ${teamsColors.border}` : 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              wordWrap: 'break-word',
              maxWidth: '100%'
            }}>
              <Text styles={{
                root: {
                  fontSize: '14px',
                  color: isOwn ? '#ffffff' : teamsColors.text,
                  margin: 0,
                  lineHeight: '1.4'
                }
              }}>
                {msg.content}
              </Text>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isOwn ? 'flex-end' : 'flex-start',
              gap: '4px',
              marginTop: '2px'
            }}>
              <Text variant="small" styles={{
                root: {
                  color: teamsColors.textSecondary,
                  fontSize: '10px'
                }
              }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {isOwn && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {(!msg.status || msg.status === 'sent') && (
                    <Icon iconName="CheckMark" styles={{ root: { fontSize: '10px', color: teamsColors.textSecondary } }} />
                  )}
                  {msg.status === 'delivered' && (
                    <div style={{ display: 'flex' }}>
                      <Icon iconName="CheckMark" styles={{ root: { fontSize: '10px', color: teamsColors.textSecondary, marginLeft: '-2px' } }} />
                      <Icon iconName="CheckMark" styles={{ root: { fontSize: '10px', color: teamsColors.textSecondary, marginLeft: '-4px' } }} />
                    </div>
                  )}
                  {msg.status === 'read' && (
                    <div style={{ display: 'flex' }}>
                      <Icon iconName="CheckMark" styles={{ root: { fontSize: '10px', color: '#0078d4', marginLeft: '-2px' } }} />
                      <Icon iconName="CheckMark" styles={{ root: { fontSize: '10px', color: '#0078d4', marginLeft: '-4px' } }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: teamsColors.background,
      zIndex: 1000,
      display: isOpen ? 'block' : 'none',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
          {/* Header with title and close button */}
          <div style={{
            height: '48px',
            background: teamsColors.surface,
            borderBottom: `1px solid ${teamsColors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            flexShrink: 0
          }}>
            <Text styles={{
              root: {
                fontSize: '16px',
                fontWeight: FontWeights.semibold,
                color: teamsColors.text
              }
            }}>
              Chat box
            </Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              title="Close chat"
              onClick={onDismiss}
              styles={{
                root: {
                  color: teamsColors.text,
                  width: '32px',
                  height: '32px'
                },
                rootHovered: {
                  backgroundColor: isDark ? '#3b3a39' : '#f3f2f1'
                }
              }}
            />
          </div>

          {/* Main content with top margin */}
          <div style={{ display: 'flex', height: '100%', overflow: 'hidden', flex: 1 }}>

          {/* Chat List */}
          <Stack styles={{
            root: {
              width: '240px',
              borderRight: `1px solid ${teamsColors.border}`,
              background: teamsColors.surface
            }
          }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center" 
              styles={{
                root: {
                  padding: `${spacingTokens.s1} ${spacingTokens.m}`, 
                  borderBottom: `1px solid ${teamsColors.border}`,
                  height: '32px'
                }
              }}>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold, color: teamsColors.text, fontSize: '12px' } }}>Chat</Text>
              <IconButton
                iconProps={{ iconName: 'Add' }}
                title="New Chat"
                onClick={() => setShowNewChatDialog(true)}
                styles={{
                  root: {
                    width: '28px',
                    height: '28px',
                    color: teamsColors.accent
                  },
                  rootHovered: {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                  }
                }}
              />
            </Stack>
            
            <Stack styles={{
              root: {
                padding: `${spacingTokens.s2} ${spacingTokens.s1}`,
                height: '36px'
              }
            }}>
              <SearchBox
                placeholder="Search chats"
                value={searchQuery}
                onChange={(_, value) => setSearchQuery(value || '')}
                styles={{
                  root: {
                    borderRadius: '4px',
                    border: `1px solid ${teamsColors.border}`,
                    background: teamsColors.background,
                    fontSize: '12px',
                    height: '32px',
                    width: '100%'
                  }
                }}
              />
            </Stack>
            
            <FocusZone direction={FocusZoneDirection.vertical} styles={{ root: { flex: 1, overflowY: 'auto' } }}>
              {filteredChats.length === 0 ? (
                <Stack horizontalAlign="center" styles={{ root: { padding: '20px' } }}>
                  <Text variant="small" styles={{ root: { color: teamsColors.textSecondary } }}>
                    {searchQuery ? 'No chats found' : 'No chats yet. Start a new chat!'}
                  </Text>
                </Stack>
              ) : (
                filteredChats.map(chat => {
                const isOnline = onlineUsers.includes(chat.name?.toLowerCase());
                const isSelected = selectedChat?.id === chat.id;
                
                return (
                  <Stack
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    styles={{
                      root: {
                        padding: '8px 12px',
                        margin: '1px 4px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(91, 95, 199, 0.9)' : 'transparent',
                        border: `1px solid ${isSelected ? 'rgba(91, 95, 199, 0.9)' : 'transparent'}`,
                        transition: 'background-color 0.1s ease',
                        ':hover': {
                          backgroundColor: isSelected ? 'rgba(91, 95, 199, 0.9)' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')
                        }
                      }
                    }}
                  >
                    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                      <div style={{ position: 'relative' }}>
                        <Persona
                          text={chat.name}
                          size={PersonaSize.size32}
                          hidePersonaDetails
                          imageUrl={chat.profilePicture ? `http://localhost:5000${chat.profilePicture}` : undefined}
                        />
                        {isOnline && (
                          <div style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '0px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#107c10',
                            border: '1px solid #ffffff'
                          }} />
                        )}
                      </div>
                      
                      <Stack tokens={{ childrenGap: 2 }} styles={{ root: { flex: 1, minWidth: 0 } }}>
                        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                          <Text styles={{ 
                            root: { 
                              fontWeight: FontWeights.semibold,
                              color: isSelected ? '#ffffff' : teamsColors.text,
                              fontSize: '13px'
                            } 
                          }} nowrap>
                            {chat.name}
                          </Text>
                          {chat.lastMessageAt && (
                            <Text variant="small" styles={{ 
                              root: { 
                                color: isSelected ? 'rgba(255,255,255,0.7)' : teamsColors.textSecondary,
                                fontSize: '11px'
                              } 
                            }}>
                              {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          )}
                        </Stack>
                        <Text variant="small" styles={{ 
                          root: { 
                            color: isSelected ? 'rgba(255,255,255,0.8)' : teamsColors.textSecondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '12px'
                          } 
                        }}>
                          {chat.lastMessage || 'No messages yet'}
                        </Text>
                      </Stack>
                      {chat.unreadCount > 0 && (
                        <div style={{
                          minWidth: '18px',
                          height: '18px',
                          borderRadius: '9px',
                          background: '#c4314b',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '0 5px',
                          lineHeight: '1'
                        }}>
                          {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </div>
                      )}
                    </Stack>
                  </Stack>
                );
              }))}
            </FocusZone>
          </Stack>

          {/* Message Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: teamsColors.background }}>
            {selectedChat ? (
              <>
                {/* Header */}
                <div style={{
                  height: '50px',
                  padding: `4px ${spacingTokens.m}`,
                  borderBottom: `1px solid ${teamsColors.border}`,
                  background: teamsColors.surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacingTokens.s2 }}>
                    <div style={{ position: 'relative' }}>
                      <Persona
                        text={selectedChat.name}
                        size={PersonaSize.size28}
                        hidePersonaDetails
                        imageUrl={selectedChat.profilePicture ? `http://localhost:5000${selectedChat.profilePicture}` : undefined}
                      />
                      {onlineUsers.includes(selectedChat.name?.toLowerCase()) && (
                        <div style={{
                          position: 'absolute',
                          bottom: '0px',
                          right: '0px',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#92c353',
                          border: '1px solid #ffffff'
                        }} />
                      )}
                    </div>
                    <div>
                      <Text variant="medium" styles={{ 
                        root: { 
                          fontWeight: FontWeights.semibold,
                          color: teamsColors.text,
                          fontSize: '14px',
                          display: 'block'
                        } 
                      }}>
                        {selectedChat.name}
                      </Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: onlineUsers.includes(selectedChat.name?.toLowerCase()) ? '#92c353' : '#8a8886'
                        }} />
                        <Text variant="small" styles={{ 
                          root: { 
                            color: teamsColors.textSecondary,
                            fontSize: '12px'
                          } 
                        }}>
                          {onlineUsers.includes(selectedChat.name?.toLowerCase()) ? 'Available' : 'Away'} • {selectedChat.role}
                        </Text>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: spacingTokens.s1 }}>
                    <IconButton 
                      iconProps={{ iconName: 'Video' }} 
                      title="Start video call"
                      onClick={() => startCall('video')}
                      styles={{ 
                        root: { 
                          width: '32px', 
                          height: '32px',
                          ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                        } 
                      }} 
                    />
                    <IconButton 
                      iconProps={{ iconName: 'Phone' }} 
                      title="Start voice call"
                      onClick={() => startCall('voice')}
                      styles={{ 
                        root: { 
                          width: '32px', 
                          height: '32px',
                          ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                        } 
                      }} 
                    />
                    <IconButton 
                      iconProps={{ iconName: 'Share' }} 
                      title="Share screen"
                      onClick={() => success('Screen sharing initiated')}
                      styles={{ 
                        root: { 
                          width: '32px', 
                          height: '32px',
                          ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                        } 
                      }} 
                    />
                    <IconButton 
                      iconProps={{ iconName: 'More' }} 
                      title="More options"
                      onClick={(e) => {
                        setMoreMenuTarget(e.currentTarget);
                        setShowMoreMenu(true);
                      }}
                      styles={{ 
                        root: { 
                          width: '32px', 
                          height: '32px',
                          ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                        } 
                      }} 
                    />
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  background: teamsColors.background,
                  padding: '16px 0',
                  position: 'relative'
                }}>
                  <ScrollablePane styles={{
                    root: {
                      height: '100%'
                    },
                    contentContainer: {
                      padding: 0
                    }
                  }}>
                    {messages.map((msg, index) => renderMessage(msg, index))}
                    <div ref={messagesEndRef} />
                  </ScrollablePane>
                </div>

                {/* Input */}
                <div style={{
                  height: '40px',
                  padding: `4px ${spacingTokens.m}`,
                  borderTop: `1px solid ${teamsColors.border}`,
                  background: teamsColors.surface,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacingTokens.s1
                }}>
                  <IconButton 
                    iconProps={{ iconName: 'Attach' }} 
                    title="Attach file"
                    onClick={() => success('File attachment available')}
                    styles={{ 
                      root: { 
                        width: '32px', 
                        height: '32px',
                        ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                      } 
                    }} 
                  />
                  <IconButton 
                    iconProps={{ iconName: 'Emoji2' }} 
                    title="Add emoji"
                    onClick={() => success('Emoji picker available')}
                    styles={{ 
                      root: { 
                        width: '32px', 
                        height: '32px',
                        ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                      } 
                    }} 
                  />
                  <TextField
                    placeholder="Type a message..."
                    value={message}
                    onChange={(_, value) => setMessage(value || '')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    styles={{ 
                      root: { flex: 1 },
                      field: { 
                        borderRadius: '20px',
                        padding: '0 16px',
                        border: 'none',
                        background: teamsColors.background,
                        fontSize: '14px',
                        height: '32px',
                        outline: 'none',
                        lineHeight: '32px'
                      },
                      fieldGroup: {
                        borderRadius: '20px',
                        border: 'none',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        ':after': { display: 'none' },
                        ':before': { display: 'none' }
                      }
                    }}
                  />
                  <IconButton 
                    iconProps={{ iconName: isRecording ? 'MicOff' : 'Microphone' }} 
                    title={isRecording ? 'Stop recording' : 'Voice message'}
                    onClick={() => {
                      setIsRecording(!isRecording);
                      success(isRecording ? 'Recording stopped' : 'Recording voice message');
                    }}
                    styles={{ 
                      root: { 
                        width: '32px', 
                        height: '32px',
                        color: isRecording ? '#c4314b' : teamsColors.textSecondary,
                        ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                      } 
                    }} 
                  />
                  <IconButton 
                    iconProps={{ iconName: 'Send' }} 
                    title="Send message"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    styles={{ 
                      root: { 
                        width: '32px', 
                        height: '32px',
                        background: message.trim() ? teamsColors.accent : 'transparent',
                        color: message.trim() ? '#ffffff' : teamsColors.textSecondary,
                        ':hover': {
                          backgroundColor: message.trim() ? teamsColors.primaryHover : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')
                        }
                      } 
                    }} 
                  />
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <Stack tokens={{ childrenGap: 12 }} horizontalAlign="center">
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold, color: teamsColors.text } }}>
                    Select a chat to start messaging
                  </Text>
                  <Text variant="small" styles={{ root: { color: teamsColors.textSecondary } }}>
                    Choose a conversation from the list to view messages
                  </Text>
                </Stack>
              </div>
            )}
          </div>
        </div>
        </div>

      <Dialog
        hidden={!showCallDialog}
        onDismiss={endCall}
        dialogContentProps={{
          type: DialogType.normal,
          title: `${callType === 'video' ? 'Video' : 'Voice'} Call`
        }}
        modalProps={{ isBlocking: false }}
      >
        <Stack tokens={{ childrenGap: 16 }} horizontalAlign="center" styles={{ root: { padding: '32px' } }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${teamsColors.accent} 0%, ${teamsColors.primary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <Icon 
              iconName={callType === 'video' ? 'Video' : 'Phone'} 
              styles={{ root: { fontSize: '32px', color: '#ffffff' } }} 
            />
          </div>
          <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>Calling {selectedChat?.name}</Text>
          <Text variant="medium" styles={{ root: { color: teamsColors.textSecondary } }}>Connecting...</Text>
          <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { marginTop: '16px' } }}>
            <IconButton
              iconProps={{ iconName: 'Microphone' }}
              title="Mute"
              styles={{
                root: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: teamsColors.text
                }
              }}
            />
            <IconButton
              iconProps={{ iconName: 'DeclineCall' }}
              title="End call"
              onClick={endCall}
              styles={{
                root: {
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#c4314b',
                  color: '#ffffff',
                  ':hover': {
                    backgroundColor: '#a02d42'
                  }
                }
              }}
            />
            <IconButton
              iconProps={{ iconName: callType === 'video' ? 'VideoOff' : 'Volume3' }}
              title={callType === 'video' ? 'Turn off camera' : 'Speaker'}
              styles={{
                root: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: teamsColors.text
                }
              }}
            />
          </Stack>
        </Stack>
      </Dialog>

      <ContextualMenu
        items={moreMenuItems}
        hidden={!showMoreMenu}
        target={moreMenuTarget}
        onItemClick={() => setShowMoreMenu(false)}
        onDismiss={() => setShowMoreMenu(false)}
        directionalHint={DirectionalHint.bottomRightEdge}
      />

      <Dialog
        hidden={!showNewChatDialog}
        onDismiss={() => {
          setShowNewChatDialog(false);
          setUserSearchQuery('');
          setSelectedUser(null);
        }}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Start New Chat'
        }}
        modalProps={{ isBlocking: false }}
      >
        <Stack tokens={{ childrenGap: 12 }}>
          <Text>Select a user to start chatting with:</Text>
          {users.length === 0 ? (
            <Text variant="small" styles={{ root: { color: teamsColors.textSecondary } }}>
              No users available to start new chats
            </Text>
          ) : (
            <>
              <SearchBox
                placeholder="Search users..."
                value={userSearchQuery}
                onChange={(_, value) => setUserSearchQuery(value || '')}
                styles={{
                  root: {
                    borderRadius: '4px',
                    border: `1px solid ${teamsColors.border}`,
                    background: teamsColors.background,
                    fontSize: '14px',
                    height: '32px'
                  }
                }}
              />
              {filteredUsers.length === 0 && userSearchQuery ? (
                <Text variant="small" styles={{ root: { color: teamsColors.textSecondary } }}>
                  No users found matching "{userSearchQuery}"
                </Text>
              ) : filteredUsers.length > 0 ? (
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: `1px solid ${teamsColors.border}`, borderRadius: '4px' }}>
                  {filteredUsers.map(u => (
                    <div 
                      key={u._id}
                      onClick={() => setSelectedUser(u._id)}
                      style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: selectedUser === u._id ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
                        color: teamsColors.text,
                        borderLeft: selectedUser === u._id ? `3px solid ${teamsColors.accent}` : '3px solid transparent'
                      }}
                    >
                      <Persona
                        text={u.name}
                        size={PersonaSize.size24}
                        hidePersonaDetails
                        imageUrl={u.profilePicture ? `http://localhost:5000${u.profilePicture}` : undefined}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: teamsColors.textSecondary }}>{u.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Dropdown
                  placeholder="Select user..."
                  options={userOptions}
                  selectedKey={selectedUser}
                  onChange={(_, option) => setSelectedUser(option?.key || null)}
                  onRenderOption={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
                      <Persona
                        text={option.data.user.name}
                        size={PersonaSize.size24}
                        hidePersonaDetails
                        imageUrl={option.data.user.profilePicture ? `http://localhost:5000${option.data.user.profilePicture}` : undefined}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: teamsColors.text }}>{option.data.user.name}</div>
                        <div style={{ fontSize: '12px', color: teamsColors.textSecondary }}>{option.data.user.role}</div>
                      </div>
                    </div>
                  )}
                />
              )}
            </>
          )}
        </Stack>

        <DialogFooter>
          <PrimaryButton
            text="Start Chat"
            onClick={startNewChat}
            disabled={!selectedUser || users.length === 0}
          />
          <DefaultButton
            text="Cancel"
            onClick={() => {
              setShowNewChatDialog(false);
              setSelectedUser(null);
              setUserSearchQuery('');
            }}
          />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ChatSystem;