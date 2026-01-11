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
  initializeIcons
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
  const [messageReactions, setMessageReactions] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
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
    accent: '#0078d4',
    surface: isDark ? '#292929' : '#ffffff',
    background: isDark ? '#1f1f1f' : '#f3f2f1',
    border: isDark ? '#484644' : '#e1dfdd',
    text: isDark ? '#ffffff' : '#323130',
    textSecondary: isDark ? '#c8c6c4' : '#605e5c'
  };

  useEffect(() => {
    initializeIcons();
    if (isOpen) {
      loadChats();
      loadUsers();
      setOnlineUsers(['admin', 'librarian1', 'member1']);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
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
        setChats(data);
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

    setIsTyping(true);
    const messageContent = replyToMessage ? `@${replyToMessage.senderName}: ${message}` : message;

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
        setMessage('');
        setReplyToMessage(null);
        loadMessages(selectedChat.id);
        loadChats();
        success('Message sent');
      }
    } catch (err) {
      console.error('Error sending message:', err);
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
        setSelectedChat(newChat);
        setShowNewChatDialog(false);
        setSelectedUser(null);
        loadChats();
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

  const startCall = (type) => {
    success(`Starting ${type} call...`);
  };

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userOptions = users
    .filter(u => u._id !== user?._id && (user?.role !== 'Member' || u.role !== 'Admin'))
    .map(u => ({
      key: u._id,
      text: `${u.name} (${u.role})`,
      data: { role: u.role, user: u }
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
    const isOwn = msg.senderId === user?._id;
    const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
    const showName = !isOwn && showAvatar;
    
    return (
      <div
        key={msg.id}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: `1px ${spacingTokens.m}`,
          marginBottom: '1px'
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setSelectedMessage(msg);
          setContextMenuTarget(e.target);
          setShowContextMenu(true);
        }}
      >
        <div style={{ 
          width: '24px', 
          marginRight: '6px',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '2px'
        }}>
          {showAvatar && !isOwn && (
            <Persona
              text={msg.senderName}
              size={PersonaSize.size24}
              hidePersonaDetails
            />
          )}
        </div>
        
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start'
        }}>
          {showName && (
            <div style={{ 
              marginBottom: '1px',
              paddingLeft: '6px'
            }}>
              <Text variant="small" styles={{
                root: {
                  color: teamsColors.accent,
                  fontWeight: FontWeights.semibold,
                  fontSize: '10px'
                }
              }}>
                {msg.senderName}
              </Text>
            </div>
          )}
          
          <div style={{
            maxWidth: isOwn ? '100%' : 'calc(100% - 30px)',
            minWidth: '60px',
            padding: '6px 8px',
            borderRadius: '4px',
            background: isOwn ? teamsColors.primary : teamsColors.surface,
            color: isOwn ? '#ffffff' : teamsColors.text,
            border: !isOwn ? `1px solid ${teamsColors.border}` : 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            wordWrap: 'break-word',
            alignSelf: isOwn ? 'flex-end' : 'flex-start'
          }}>
            <Text styles={{
              root: {
                lineHeight: '1.3',
                fontSize: '12px',
                color: isOwn ? '#ffffff' : teamsColors.text,
                margin: 0
              }
            }}>
              {msg.content}
            </Text>
            
            {messageReactions[msg.id] && (
              <div style={{ 
                marginTop: '2px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2px'
              }}>
                {Object.entries(
                  messageReactions[msg.id].reduce((acc, reaction) => {
                    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([emoji, count]) => (
                  <span
                    key={emoji}
                    style={{
                      padding: '1px 3px',
                      borderRadius: '6px',
                      background: teamsColors.background,
                      border: `1px solid ${teamsColors.border}`,
                      fontSize: '9px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '1px'
                    }}
                    onClick={() => addReaction(emoji)}
                  >
                    {emoji}{count}
                  </span>
                ))}
              </div>
            )}
            
            <div style={{
              marginTop: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isOwn ? 'flex-end' : 'flex-start',
              gap: '2px'
            }}>
              <Text variant="small" styles={{
                root: {
                  color: isOwn ? 'rgba(255,255,255,0.7)' : teamsColors.textSecondary,
                  fontSize: '9px'
                }
              }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              
              {isOwn && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon iconName="CheckMark" styles={{ root: { fontSize: '8px', color: 'rgba(255,255,255,0.7)' } }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fabric>
      <Panel
        isOpen={isOpen}
        onDismiss={onDismiss}
        type={PanelType.extraLarge}
        headerText="Chat box"
        isBlocking={false}
        hasCloseButton={true}
        styles={{
          main: {
            background: teamsColors.background,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 1000
          },
          header: {
            background: teamsColors.surface,
            borderBottom: `1px solid ${teamsColors.border}`,
            padding: '6px 12px',
            height: '40px',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          },
          headerText: {
            fontSize: '14px',
            fontWeight: FontWeights.semibold,
            color: teamsColors.text
          },
          content: {
            padding: 0,
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            bottom: 0
          }
        }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Chat List */}
          <div style={{
            width: '240px',
            borderRight: `1px solid ${teamsColors.border}`,
            background: teamsColors.surface,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: `${spacingTokens.s1} ${spacingTokens.m}`, 
              borderBottom: `1px solid ${teamsColors.border}`,
              height: '32px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center" tokens={{ childrenGap: spacingTokens.s1 }}>
                <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold, color: teamsColors.text, fontSize: '12px' } }}>Chat</Text>
                <IconButton
                  iconProps={{ iconName: 'Add' }}
                  title="New chat"
                  onClick={() => setShowNewChatDialog(true)}
                  styles={{
                    root: {
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      background: 'transparent',
                      selectors: {
                        ':hover': {
                          background: isDark ? '#3b3a39' : '#f3f2f1'
                        }
                      }
                    }
                  }}
                />
              </Stack>
            </div>
            
            <div style={{ 
              padding: `${spacingTokens.s2} ${spacingTokens.s1}`,
              height: '28px',
              display: 'flex',
              alignItems: 'center'
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
                    fontSize: '10px',
                    height: '24px',
                    width: '100%'
                  }
                }}
              />
            </div>
            
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              padding: `0 ${spacingTokens.s2}`
            }}>
              {filteredChats.map(chat => {
                const isOnline = onlineUsers.includes(chat.name?.toLowerCase());
                const isSelected = selectedChat?.id === chat.id;
                
                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    style={{
                      padding: `${spacingTokens.s2} ${spacingTokens.s1}`,
                      margin: `${spacingTokens.xs} 0`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: isSelected ? teamsColors.primary : 'transparent',
                      color: isSelected ? '#ffffff' : teamsColors.text,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Stack horizontal tokens={{ childrenGap: spacingTokens.s2 }} verticalAlign="center">
                      <div style={{ position: 'relative' }}>
                        <Persona
                          text={chat.name}
                          size={PersonaSize.size24}
                          hidePersonaDetails
                        />
                        {isOnline && (
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
                      
                      <Stack tokens={{ childrenGap: spacingTokens.xs }} styles={{ root: { flex: 1, minWidth: 0 } }}>
                        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                          <Text styles={{ 
                            root: { 
                              fontWeight: FontWeights.semibold,
                              color: isSelected ? '#ffffff' : teamsColors.text,
                              fontSize: '11px'
                            } 
                          }} nowrap>
                            {chat.name}
                          </Text>
                          <Text variant="small" styles={{ 
                            root: { 
                              color: isSelected ? 'rgba(255,255,255,0.8)' : teamsColors.textSecondary,
                              fontSize: '9px'
                            } 
                          }}>
                            {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </Text>
                        </Stack>
                        <Text variant="small" styles={{ 
                          root: { 
                            color: isSelected ? 'rgba(255,255,255,0.9)' : teamsColors.textSecondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '9px'
                          } 
                        }}>
                          {chat.lastMessage || 'Start a conversation'}
                        </Text>
                      </Stack>
                    </Stack>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: teamsColors.background }}>
            {selectedChat ? (
              <>
                {/* Header */}
                <div style={{
                  height: '60px',
                  padding: `${spacingTokens.s1} ${spacingTokens.m}`,
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
                    <IconButton iconProps={{ iconName: 'Video' }} styles={{ root: { width: '32px', height: '32px' } }} />
                    <IconButton iconProps={{ iconName: 'Phone' }} styles={{ root: { width: '32px', height: '32px' } }} />
                    <IconButton iconProps={{ iconName: 'More' }} styles={{ root: { width: '32px', height: '32px' } }} />
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  background: teamsColors.background
                }}>
                  {messages.map((msg, index) => renderMessage(msg, index))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                  height: '60px',
                  padding: `${spacingTokens.s1} ${spacingTokens.m}`,
                  borderTop: `1px solid ${teamsColors.border}`,
                  background: teamsColors.surface,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacingTokens.s1
                }}>
                  <IconButton iconProps={{ iconName: 'Attach' }} styles={{ root: { width: '32px', height: '32px' } }} />
                  <IconButton iconProps={{ iconName: 'Emoji2' }} styles={{ root: { width: '32px', height: '32px' } }} />
                  <TextField
                    placeholder="Type a message"
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
                        borderRadius: '18px',
                        padding: '6px 12px',
                        border: `1px solid ${teamsColors.border}`,
                        background: teamsColors.background,
                        fontSize: '14px',
                        height: '32px'
                      }
                    }}
                  />
                  <IconButton 
                    iconProps={{ iconName: 'Send' }} 
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    styles={{ 
                      root: { 
                        width: '32px', 
                        height: '32px',
                        background: message.trim() ? teamsColors.accent : 'transparent',
                        color: message.trim() ? '#ffffff' : teamsColors.textSecondary
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

        <ContextualMenu
          items={contextMenuItems}
          hidden={!showContextMenu}
          target={contextMenuTarget}
          onItemClick={() => setShowContextMenu(false)}
          onDismiss={() => setShowContextMenu(false)}
          directionalHint={DirectionalHint.bottomLeftEdge}
        />

        <Dialog
          hidden={!showNewChatDialog}
          onDismiss={() => setShowNewChatDialog(false)}
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
              <Dropdown
                placeholder="Select user..."
                options={userOptions}
                selectedKey={selectedUser}
                onChange={(_, option) => setSelectedUser(option?.key || null)}
              />
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
              }}
            />
          </DialogFooter>
        </Dialog>
      </Panel>
    </Fabric>
  );
};

export default ChatSystem;