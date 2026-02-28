import React from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Dialog,
  DialogType,
  DialogFooter,
  DefaultButton
} from '@fluentui/react';
import { useTheme } from './ThemeContext';

const TransactionHistoryDialog = ({ isOpen, onDismiss, transactions }) => {
  const { isDark } = useTheme();

  const columns = [
    {
      key: 'book',
      name: 'Book Title',
      minWidth: 200,
      onRender: (item) => (
        <Text>{item.bookId?.title || 'Unknown Book'}</Text>
      )
    },
    {
      key: 'member',
      name: 'Member ID',
      minWidth: 100,
      onRender: (item) => (
        <Text>{item.memberId}</Text>
      )
    },
    {
      key: 'type',
      name: 'Type',
      minWidth: 80,
      onRender: (item) => (
        <Text>{item.type}</Text>
      )
    },
    {
      key: 'date',
      name: 'Date',
      minWidth: 100,
      onRender: (item) => (
        <Text>{new Date(item.createdAt || item.issueDate).toLocaleDateString()}</Text>
      )
    },
    {
      key: 'status',
      name: 'Status',
      minWidth: 80,
      onRender: (item) => (
        <Text>{item.status}</Text>
      )
    },
    {
      key: 'librarian',
      name: 'Librarian',
      minWidth: 120,
      onRender: (item) => (
        <Text>{item.processedBy?.name || 'System'}</Text>
      )
    }
  ];

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.normal,
        title: 'Transaction History'
      }}
      modalProps={{ isBlocking: false }}
      styles={{ main: { width: '1000px', height: '400px' } }}
    >
      <Stack tokens={{ childrenGap: 16 }}>
        <Text>Total Transactions: {transactions.length}</Text>
        <DetailsList
          items={transactions}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
          styles={{
            root: {
              height: '250px'
            }
          }}
        />
      </Stack>
      <DialogFooter>
        <DefaultButton onClick={onDismiss} text="Close" />
      </DialogFooter>
    </Dialog>
  );
};

export default TransactionHistoryDialog;