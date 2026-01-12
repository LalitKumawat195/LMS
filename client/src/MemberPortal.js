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
  TextField,
  Dialog,
  DialogType,
  DialogFooter,
  CommandBar
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const MemberPortal = () => {
  const { user } = useAuth();
  const { success, error } = useNotifications();
  const [memberTransactions, setMemberTransactions] = useState([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [renewalReason, setRenewalReason] = useState('');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('lms_transactions');
    if (savedTransactions) {
      const allTransactions = JSON.parse(savedTransactions);
      const userTransactions = allTransactions.filter(t => t.memberId === user?.id);
      setMemberTransactions(userTransactions);
    }
  }, [user]);

  const overdueBooks = memberTransactions.filter(t => {
    if (t.status !== 'active' || !t.dueDate) return false;
    return new Date() > new Date(t.dueDate);
  }).map(t => {
    const daysOverdue = Math.ceil((new Date() - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
    const fine = daysOverdue * 2;
    return { ...t, daysOverdue, fine };
  });

  const activeBooks = memberTransactions.filter(t => t.status === 'active');

  const payFine = () => {
    if (!paymentAmount || !selectedTransaction) {
      error('Please enter payment amount');
      return;
    }

    const updatedTransactions = memberTransactions.map(t => 
      t._id === selectedTransaction._id 
        ? { ...t, fineCollected: parseFloat(paymentAmount), fineStatus: 'paid' }
        : t
    );
    
    setMemberTransactions(updatedTransactions);
    localStorage.setItem('lms_transactions', JSON.stringify(updatedTransactions));
    setShowPaymentDialog(false);
    setPaymentAmount('');
    setSelectedTransaction(null);
    success(`Payment of $${paymentAmount} processed successfully`);
  };

  const requestRenewal = () => {
    if (!renewalReason || !selectedTransaction) {
      error('Please provide renewal reason');
      return;
    }

    const renewalCount = selectedTransaction.renewalCount || 0;
    if (renewalCount >= 2) {
      error('Maximum renewal limit reached');
      return;
    }

    const newDueDate = new Date(selectedTransaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    const updatedTransactions = memberTransactions.map(t => 
      t._id === selectedTransaction._id 
        ? { ...t, dueDate: newDueDate.toISOString(), renewalCount: renewalCount + 1, renewalReason }
        : t
    );
    
    setMemberTransactions(updatedTransactions);
    localStorage.setItem('lms_transactions', JSON.stringify(updatedTransactions));
    setShowRenewalDialog(false);
    setRenewalReason('');
    setSelectedTransaction(null);
    success('Renewal request submitted successfully');
  };

  const commandBarItems = [
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        const savedTransactions = localStorage.getItem('lms_transactions');
        if (savedTransactions) {
          const allTransactions = JSON.parse(savedTransactions);
          const userTransactions = allTransactions.filter(t => t.memberId === user?.id);
          setMemberTransactions(userTransactions);
        }
        success('Data refreshed');
      }
    }
  ];

  const overdueColumns = [
    { key: 'bookTitle', name: 'Book Title', fieldName: 'bookTitle', minWidth: 200 },
    { 
      key: 'dueDate', 
      name: 'Due Date', 
      minWidth: 100,
      onRender: (item) => new Date(item.dueDate).toLocaleDateString()
    },
    {
      key: 'daysOverdue',
      name: 'Days Overdue',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { color: '#d13438', fontWeight: FontWeights.semibold } }}>
          {item.daysOverdue}
        </Text>
      )
    },
    {
      key: 'fine',
      name: 'Fine Amount',
      minWidth: 100,
      onRender: (item) => (
        <Text styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.semibold } }}>
          ${item.fine}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 150,
      onRender: (item) => (
        <DefaultButton
          text="Pay Fine"
          onClick={() => {
            setSelectedTransaction(item);
            setPaymentAmount(item.fine.toString());
            setShowPaymentDialog(true);
          }}
        />
      )
    }
  ];

  const activeColumns = [
    { key: 'bookTitle', name: 'Book Title', fieldName: 'bookTitle', minWidth: 200 },
    { 
      key: 'issueDate', 
      name: 'Issue Date', 
      minWidth: 100,
      onRender: (item) => new Date(item.issueDate).toLocaleDateString()
    },
    { 
      key: 'dueDate', 
      name: 'Due Date', 
      minWidth: 100,
      onRender: (item) => new Date(item.dueDate).toLocaleDateString()
    },
    {
      key: 'renewalCount',
      name: 'Renewals',
      minWidth: 80,
      onRender: (item) => `${item.renewalCount || 0}/2`
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 150,
      onRender: (item) => (
        <DefaultButton
          text="Request Renewal"
          onClick={() => {
            setSelectedTransaction(item);
            setShowRenewalDialog(true);
          }}
          disabled={(item.renewalCount || 0) >= 2}
        />
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Member Portal - {user?.name || user?.id}
      </Text>

      <CommandBar items={commandBarItems} />

      {/* Summary */}
      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold } }}>
            {activeBooks.length}
          </Text>
          <Text>Active Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {overdueBooks.length}
          </Text>
          <Text>Overdue Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.bold } }}>
            ${overdueBooks.reduce((sum, book) => sum + book.fine, 0)}
          </Text>
          <Text>Total Fines</Text>
        </Stack>
      </Stack>

      {/* Overdue Books */}
      {overdueBooks.length > 0 && (
        <Stack tokens={{ childrenGap: 10 }}>
          <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: '#d13438' } }}>
            Overdue Books
          </Text>
          <DetailsList
            items={overdueBooks}
            columns={overdueColumns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        </Stack>
      )}

      {/* Active Books */}
      <Stack tokens={{ childrenGap: 10 }}>
        <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Currently Issued Books
        </Text>
        <DetailsList
          items={activeBooks}
          columns={activeColumns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </Stack>

      {/* Payment Dialog */}
      <Dialog
        hidden={!showPaymentDialog}
        onDismiss={() => setShowPaymentDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Pay Fine Online'
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Book: {selectedTransaction?.bookTitle}</Text>
          <Text>Days Overdue: {selectedTransaction?.daysOverdue}</Text>
          <TextField
            label="Payment Amount ($)"
            value={paymentAmount}
            onChange={(_, value) => setPaymentAmount(value || '')}
            type="number"
          />
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            Note: This is a simulation. In a real system, this would integrate with a payment gateway.
          </Text>
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={payFine} text="Pay Now" />
          <DefaultButton onClick={() => setShowPaymentDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Renewal Dialog */}
      <Dialog
        hidden={!showRenewalDialog}
        onDismiss={() => setShowRenewalDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Request Book Renewal'
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Book: {selectedTransaction?.bookTitle}</Text>
          <Text>Current Due Date: {selectedTransaction && new Date(selectedTransaction.dueDate).toLocaleDateString()}</Text>
          <Text>Renewals Used: {selectedTransaction?.renewalCount || 0}/2</Text>
          <TextField
            label="Reason for Renewal"
            multiline
            rows={3}
            value={renewalReason}
            onChange={(_, value) => setRenewalReason(value || '')}
            placeholder="Please provide a reason for the renewal request"
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={requestRenewal} text="Submit Request" />
          <DefaultButton onClick={() => setShowRenewalDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default MemberPortal;