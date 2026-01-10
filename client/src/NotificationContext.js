import React, { createContext, useContext, useState, useCallback } from 'react';
import { MessageBar, MessageBarType, Stack } from '@fluentui/react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = MessageBarType.info, duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message) => addNotification(message, MessageBarType.success), [addNotification]);
  const error = useCallback((message) => addNotification(message, MessageBarType.error), [addNotification]);
  const warning = useCallback((message) => addNotification(message, MessageBarType.warning), [addNotification]);
  const info = useCallback((message) => addNotification(message, MessageBarType.info), [addNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, success, error, warning, info }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        maxWidth: '400px'
      }}>
        <Stack tokens={{ childrenGap: 8 }}>
          {notifications.map(notification => (
            <MessageBar
              key={notification.id}
              messageBarType={notification.type}
              onDismiss={() => removeNotification(notification.id)}
              dismissButtonAriaLabel="Close"
              styles={{
                root: {
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  animation: 'slideInRight 0.3s ease-out'
                }
              }}
            >
              {notification.message}
            </MessageBar>
          ))}
        </Stack>
      </div>
    </NotificationContext.Provider>
  );
};