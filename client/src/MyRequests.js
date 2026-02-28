import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  FontWeights,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  DefaultButton
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const MyRequests = () => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/books/my-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        success('Request cancelled');
        fetchRequests();
      } else {
        error('Failed to cancel request');
      }
    } catch (err) {
      error('Failed to cancel request');
    }
  };

  const columns = [
    {
      key: 'book',
      name: 'Book',
      minWidth: 200,
      onRender: (item) => (
        <Stack tokens={{ childrenGap: 4 }}>
          <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>
            {item.bookId?.title || 'Unknown'}
          </Text>
          <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            by {item.bookId?.author || 'Unknown'}
          </Text>
        </Stack>
      )
    },
    {
      key: 'date',
      name: 'Request Date',
      minWidth: 120,
      onRender: (item) => (
        <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
      )
    },
    {
      key: 'status',
      name: 'Status',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{
          root: {
            color: item.status === 'approved' ? '#107c10' : item.status === 'rejected' ? '#d13438' : '#ff8c00',
            fontWeight: FontWeights.semibold,
            textTransform: 'capitalize'
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
        item.status === 'pending' ? (
          <DefaultButton
            text="Cancel"
            onClick={() => cancelRequest(item._id)}
          />
        ) : item.status === 'approved' ? (
          <Text styles={{ root: { color: '#107c10', whiteSpace: 'normal', wordWrap: 'break-word' } }}>
            Visit library to collect
          </Text>
        ) : null
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          My Book Requests
        </Text>
        <Text styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Track your book requests and their status
        </Text>
      </Stack>

      {loading ? (
        <Stack horizontalAlign="center" styles={{ root: { padding: '40px' } }}>
          <Spinner size={SpinnerSize.large} label="Loading requests..." />
        </Stack>
      ) : requests.length === 0 ? (
        <MessageBar messageBarType={MessageBarType.info}>
          You haven't made any book requests yet
        </MessageBar>
      ) : (
        <DetailsList
          items={requests}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
      )}
    </Stack>
  );
};

export default MyRequests;