import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  FontWeights,
  PrimaryButton,
  DefaultButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const BookRequestManagement = () => {
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
      const response = await fetch('http://localhost:5000/api/book-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch book requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/book-requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        success('Book request approved');
        fetchRequests();
      } else {
        error('Failed to approve request');
      }
    } catch (err) {
      error('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/book-requests/${requestId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        success('Book request rejected');
        fetchRequests();
      } else {
        error('Failed to reject request');
      }
    } catch (err) {
      error('Failed to reject request');
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
      key: 'member',
      name: 'Member',
      minWidth: 150,
      onRender: (item) => (
        <Stack tokens={{ childrenGap: 4 }}>
          <Text>{item.userId?.name || 'Unknown'}</Text>
          <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            {item.userId?.memberId || 'N/A'}
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
      minWidth: 180,
      onRender: (item) => (
        item.status === 'pending' ? (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton
              text="Approve"
              onClick={() => handleApprove(item._id)}
              styles={{ root: { minWidth: '70px' } }}
            />
            <DefaultButton
              text="Reject"
              onClick={() => handleReject(item._id)}
              styles={{ root: { minWidth: '70px' } }}
            />
          </Stack>
        ) : (
          <Text styles={{ root: { color: isDark ? '#a19f9d' : '#8a8886' } }}>
            {item.status === 'approved' ? 'Approved' : 'Rejected'}
          </Text>
        )
      )
    }
  ];

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          Book Requests
        </Text>
        <Text styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Manage member book requests
        </Text>
      </Stack>

      {pendingCount > 0 && (
        <MessageBar messageBarType={MessageBarType.info}>
          You have {pendingCount} pending book request{pendingCount > 1 ? 's' : ''} to review
        </MessageBar>
      )}

      {loading ? (
        <Stack horizontalAlign="center" styles={{ root: { padding: '40px' } }}>
          <Spinner size={SpinnerSize.large} label="Loading requests..." />
        </Stack>
      ) : requests.length === 0 ? (
        <MessageBar messageBarType={MessageBarType.info}>
          No book requests found
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

export default BookRequestManagement;
