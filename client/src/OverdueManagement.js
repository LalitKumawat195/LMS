import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  FontWeights,
  IconButton,
  CommandBar,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  TextField,
  Dropdown
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const OverdueManagement = () => {
  const { user } = useAuth();
  const { success, error } = useNotifications();
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [showFineDialog, setShowFineDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [fineAmount, setFineAmount] = useState('');
  const [showAddOverdueDialog, setShowAddOverdueDialog] = useState(false);
  const [newOverdueData, setNewOverdueData] = useState({ memberId: '', bookId: '', daysOverdue: 1 });
  const [showOverdueListDialog, setShowOverdueListDialog] = useState(false);
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [messageTemplate, setMessageTemplate] = useState('reminder1');
  const [customMessage, setCustomMessage] = useState('');
  const [showWaiverDialog, setShowWaiverDialog] = useState(false);
  const [waiverReason, setWaiverReason] = useState('');
  const [showPaymentHistoryDialog, setShowPaymentHistoryDialog] = useState(false);
  const [showFineReportsDialog, setShowFineReportsDialog] = useState(false);
  const [finePayments, setFinePayments] = useState([]);
  const [reportPeriod, setReportPeriod] = useState('monthly');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('lms_transactions');
    const savedBooks = localStorage.getItem('lms_books');
    const savedPayments = localStorage.getItem('lms_fine_payments');
    
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedPayments) setFinePayments(JSON.parse(savedPayments));
  }, []);

  // Fine calculation rates by book type
  const fineRates = {
    'Fiction': 1.5,
    'Non-Fiction': 2.0,
    'Science': 3.0,
    'Technology': 3.0,
    'Reference': 5.0,
    'History': 2.0,
    'Biography': 2.0,
    'default': 2.0
  };

  const calculateFine = (transaction) => {
    const book = books.find(b => b._id === transaction.bookId);
    const rate = fineRates[book?.category] || fineRates.default;
    const daysOverdue = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysOverdue * rate);
  };

  const overdueTransactions = transactions.filter(t => {
    if (t.status !== 'active' || !t.dueDate) return false;
    return new Date() > new Date(t.dueDate);
  }).map(t => {
    const daysOverdue = Math.ceil((new Date() - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
    const calculatedFine = calculateFine(t);
    const book = books.find(b => b._id === t.bookId);
    return { ...t, daysOverdue, calculatedFine, bookCategory: book?.category || 'Unknown' };
  });

  const sendReminder = (transaction) => {
    success(`Reminder sent to member ${transaction.memberId} for book "${transaction.bookTitle}"`);
  };

  const messageTemplates = {
    reminder1: 'Dear [MEMBER_NAME], your book "[BOOK_TITLE]" is [DAYS_OVERDUE] days overdue. Please return it to avoid additional fines. Current fine: $[FINE_AMOUNT].',
    reminder2: 'URGENT: Your book "[BOOK_TITLE]" is significantly overdue ([DAYS_OVERDUE] days). Please return immediately. Fine: $[FINE_AMOUNT].',
    reminder3: 'FINAL NOTICE: Book "[BOOK_TITLE]" must be returned within 3 days or your library privileges will be suspended. Fine: $[FINE_AMOUNT].',
    sms: 'Library Alert: "[BOOK_TITLE]" overdue [DAYS_OVERDUE] days. Fine: $[FINE_AMOUNT]. Return ASAP.',
    custom: customMessage
  };

  const sendCommunication = (type, members = selectedMembers) => {
    const template = messageTemplates[messageTemplate];
    let sentCount = 0;
    
    members.forEach(member => {
      const message = template
        .replace('[MEMBER_NAME]', member.memberName || member.memberId)
        .replace('[BOOK_TITLE]', member.bookTitle)
        .replace('[DAYS_OVERDUE]', member.daysOverdue)
        .replace('[FINE_AMOUNT]', member.calculatedFine);
      
      console.log(`${type} sent to ${member.memberId}:`, message);
      sentCount++;
    });
    
    success(`${type} sent to ${sentCount} member(s)`);
    setShowCommunicationDialog(false);
    setSelectedMembers([]);
  };

  const collectFine = () => {
    if (!fineAmount || !selectedTransaction) {
      error('Please enter fine amount');
      return;
    }

    const payment = {
      id: Date.now().toString(),
      transactionId: selectedTransaction._id,
      memberId: selectedTransaction.memberId,
      bookTitle: selectedTransaction.bookTitle,
      amount: parseFloat(fineAmount),
      paymentDate: new Date().toISOString(),
      paymentMethod: 'Cash',
      processedBy: user?.name || 'Librarian'
    };

    const updatedTransactions = transactions.map(t => 
      t._id === selectedTransaction._id 
        ? { ...t, fineCollected: parseFloat(fineAmount), fineStatus: 'paid' }
        : t
    );
    
    const updatedPayments = [...finePayments, payment];
    
    setTransactions(updatedTransactions);
    setFinePayments(updatedPayments);
    localStorage.setItem('lms_transactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('lms_fine_payments', JSON.stringify(updatedPayments));
    setShowFineDialog(false);
    setFineAmount('');
    setSelectedTransaction(null);
    success(`Fine of $${fineAmount} collected from member ${selectedTransaction.memberId}`);
  };

  const waiveFine = () => {
    if (!waiverReason || !selectedTransaction) {
      error('Please provide waiver reason');
      return;
    }

    const waiver = {
      id: Date.now().toString(),
      transactionId: selectedTransaction._id,
      memberId: selectedTransaction.memberId,
      bookTitle: selectedTransaction.bookTitle,
      originalAmount: selectedTransaction.calculatedFine,
      reason: waiverReason,
      waivedDate: new Date().toISOString(),
      processedBy: user?.name || 'Librarian'
    };

    const updatedTransactions = transactions.map(t => 
      t._id === selectedTransaction._id 
        ? { ...t, fineWaived: true, fineStatus: 'waived', waiverReason }
        : t
    );
    
    setTransactions(updatedTransactions);
    localStorage.setItem('lms_transactions', JSON.stringify(updatedTransactions));
    setShowWaiverDialog(false);
    setWaiverReason('');
    setSelectedTransaction(null);
    success(`Fine of $${selectedTransaction.calculatedFine} waived for member ${selectedTransaction.memberId}`);
  };

  const generateFineReport = () => {
    const now = new Date();
    let startDate, endDate;
    
    if (reportPeriod === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }
    
    const periodPayments = finePayments.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
    
    const totalCollected = periodPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalWaived = transactions.filter(t => 
      t.fineWaived && new Date(t.waivedDate || t.returnDate) >= startDate
    ).reduce((sum, t) => sum + (t.originalAmount || t.calculatedFine || 0), 0);
    
    return {
      period: reportPeriod,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      totalCollected,
      totalWaived,
      paymentsCount: periodPayments.length,
      payments: periodPayments
    };
  };

  const addOverdueBook = () => {
    if (!newOverdueData.memberId || !newOverdueData.bookId || !newOverdueData.daysOverdue) {
      error('Please fill all required fields');
      return;
    }

    // Check if member already has this book issued
    const existingIssue = transactions.find(t => 
      t.memberId === newOverdueData.memberId && 
      (t.bookId === newOverdueData.bookId || t.bookTitle?.toLowerCase().includes(newOverdueData.bookId.toLowerCase())) &&
      t.status === 'active'
    );
    
    if (existingIssue) {
      error('This member already has this book issued');
      return;
    }

    const book = books.find(b => 
      b._id === newOverdueData.bookId || 
      b.isbn === newOverdueData.bookId ||
      b.title?.toLowerCase().includes(newOverdueData.bookId.toLowerCase())
    );
    
    if (!book) {
      error('Book not found. Try using book title, ID, or ISBN');
      return;
    }

    if (book.available <= 0) {
      error('No copies available for this book');
      return;
    }

    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() - (newOverdueData.daysOverdue * 24 * 60 * 60 * 1000));
    const issueDate = new Date(dueDate.getTime() - (14 * 24 * 60 * 60 * 1000)); // 14 days before due date
    
    const overdueTransaction = {
      _id: Date.now().toString(),
      bookId: book._id,
      bookTitle: book.title,
      memberId: newOverdueData.memberId,
      memberName: `Member-${newOverdueData.memberId}`,
      type: 'issue',
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'active',
      processedBy: user?.name || 'Librarian',
      manualEntry: true
    };

    const updatedTransactions = [...transactions, overdueTransaction];
    const updatedBooks = books.map(b => 
      b._id === book._id 
        ? { ...b, available: b.available - 1, issued: (b.issued || 0) + 1 }
        : b
    );
    
    setTransactions(updatedTransactions);
    setBooks(updatedBooks);
    localStorage.setItem('lms_transactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('lms_books', JSON.stringify(updatedBooks));
    
    setShowAddOverdueDialog(false);
    setNewOverdueData({ memberId: '', bookId: '', daysOverdue: 1 });
    success(`Overdue book "${book.title}" added for member ${newOverdueData.memberId} (${newOverdueData.daysOverdue} days overdue)`);
  };

  const forceReturn = (transaction) => {
    if (!window.confirm('Force return this book? This will mark it as returned with applicable fines.')) return;

    const returnDate = new Date();
    const fine = transaction.calculatedFine;

    const updatedTransactions = transactions.map(t => 
      t._id === transaction._id 
        ? { ...t, status: 'returned', returnDate: returnDate.toISOString(), fine, forceReturned: true }
        : t
    );

    const updatedBooks = books.map(book => 
      book._id === transaction.bookId 
        ? { ...book, available: book.available + 1, issued: Math.max((book.issued || 0) - 1, 0) }
        : book
    );
    
    setTransactions(updatedTransactions);
    setBooks(updatedBooks);
    localStorage.setItem('lms_transactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('lms_books', JSON.stringify(updatedBooks));
    success(`Book force returned with $${fine} fine`);
  };

  const overdueColumns = [
    { key: 'bookTitle', name: 'Book Title', fieldName: 'bookTitle', minWidth: 200 },
    { key: 'memberId', name: 'Member ID', fieldName: 'memberId', minWidth: 100 },
    { key: 'memberName', name: 'Member Name', fieldName: 'memberName', minWidth: 150 },
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
      minWidth: 120,
      onRender: (item) => (
        <Stack>
          <Text styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.semibold } }}>
            ${item.calculatedFine.toFixed(2)}
          </Text>
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            {item.bookCategory} (${fineRates[item.bookCategory] || fineRates.default}/day)
          </Text>
        </Stack>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 200,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: 'Mail' }}
            title="Send Reminder"
            onClick={() => sendReminder(item)}
            styles={{ root: { color: '#0078d4' } }}
          />
          <IconButton
            iconProps={{ iconName: 'Money' }}
            title="Collect Fine"
            onClick={() => {
              setSelectedTransaction(item);
              setFineAmount(item.calculatedFine.toFixed(2));
              setShowFineDialog(true);
            }}
            styles={{ root: { color: '#107c10' } }}
          />
          <IconButton
            iconProps={{ iconName: 'WavingHand' }}
            title="Waive Fine"
            onClick={() => {
              setSelectedTransaction(item);
              setShowWaiverDialog(true);
            }}
            styles={{ root: { color: '#ff8c00' } }}
          />
          <IconButton
            iconProps={{ iconName: 'ReturnToSession' }}
            title="Force Return"
            onClick={() => forceReturn(item)}
            styles={{ root: { color: '#d13438' } }}
          />
        </Stack>
      )
    }
  ];

  const commandBarItems = [
    {
      key: 'addOverdue',
      text: 'Add Overdue',
      iconProps: { iconName: 'Add' },
      onClick: () => setShowAddOverdueDialog(true)
    },
    {
      key: 'communication',
      text: 'Send Messages',
      iconProps: { iconName: 'Mail' },
      onClick: () => {
        setSelectedMembers(overdueTransactions);
        setShowCommunicationDialog(true);
      }
    },
    {
      key: 'viewOverdueBooks',
      text: 'View Overdue Books',
      iconProps: { iconName: 'View' },
      onClick: () => setShowOverdueListDialog(true)
    },
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        const savedTransactions = localStorage.getItem('lms_transactions');
        const savedBooks = localStorage.getItem('lms_books');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedBooks) setBooks(JSON.parse(savedBooks));
        success('Data refreshed');
      }
    },
    {
      key: 'sendAllReminders',
      text: 'Send All Reminders',
      iconProps: { iconName: 'BulkUpload' },
      onClick: () => {
        overdueTransactions.forEach(t => sendReminder(t));
        success(`Reminders sent to ${overdueTransactions.length} members`);
      }
    },
    {
      key: 'paymentHistory',
      text: 'Payment History',
      iconProps: { iconName: 'PaymentCard' },
      onClick: () => setShowPaymentHistoryDialog(true)
    },
    {
      key: 'fineReports',
      text: 'Fine Reports',
      iconProps: { iconName: 'BarChart4' },
      onClick: () => setShowFineReportsDialog(true)
    }
  ];

  const totalOverdueFines = overdueTransactions.reduce((sum, t) => sum + t.calculatedFine, 0);

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
        Overdue Management
      </Text>

      <CommandBar items={commandBarItems} />

      {/* Summary */}
      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
            {overdueTransactions.length}
          </Text>
          <Text>Overdue Books</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.bold } }}>
            ${totalOverdueFines.toFixed(2)}
          </Text>
          <Text>Total Fines</Text>
        </Stack>
        
        <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
          <Text variant="large" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold } }}>
            ${finePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
          </Text>
          <Text>Collected This Month</Text>
        </Stack>
      </Stack>

      {/* Overdue Books List */}
      <DetailsList
        items={overdueTransactions}
        columns={overdueColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />

      {/* Fine Collection Dialog */}
      <Dialog
        hidden={!showFineDialog}
        onDismiss={() => setShowFineDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Collect Fine'
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Book: {selectedTransaction?.bookTitle}</Text>
          <Text>Member: {selectedTransaction?.memberId}</Text>
          <Text>Category: {selectedTransaction?.bookCategory}</Text>
          <Text>Days Overdue: {selectedTransaction?.daysOverdue}</Text>
          <Text>Rate: ${fineRates[selectedTransaction?.bookCategory] || fineRates.default}/day</Text>
          <TextField
            label="Fine Amount ($)"
            value={fineAmount}
            onChange={(_, value) => setFineAmount(value || '')}
            type="number"
            step="0.01"
          />
          <Dropdown
            label="Payment Method"
            options={[
              { key: 'Cash', text: 'Cash' },
              { key: 'Card', text: 'Card' },
              { key: 'Online', text: 'Online' },
              { key: 'Check', text: 'Check' }
            ]}
            defaultSelectedKey="Cash"
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={collectFine} text="Collect Fine" />
          <DefaultButton onClick={() => setShowFineDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Add Overdue Dialog */}
      <Dialog
        hidden={!showAddOverdueDialog}
        onDismiss={() => setShowAddOverdueDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Add Overdue Book'
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Member ID *"
            value={newOverdueData.memberId}
            onChange={(_, value) => setNewOverdueData({ ...newOverdueData, memberId: value || '' })}
            placeholder="Enter member ID"
          />
          <TextField
            label="Book ID/ISBN/Title *"
            value={newOverdueData.bookId}
            onChange={(_, value) => setNewOverdueData({ ...newOverdueData, bookId: value || '' })}
            placeholder="Enter book ID, ISBN, or title"
          />
          <TextField
            label="Days Overdue"
            type="number"
            value={newOverdueData.daysOverdue.toString()}
            onChange={(_, value) => setNewOverdueData({ ...newOverdueData, daysOverdue: parseInt(value || '1') })}
            min={1}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={addOverdueBook} text="Add Overdue" />
          <DefaultButton onClick={() => setShowAddOverdueDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
      {/* View Overdue Books Dialog */}
      <Dialog
        hidden={!showOverdueListDialog}
        onDismiss={() => setShowOverdueListDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'All Overdue Books'
        }}
        styles={{ main: { minWidth: 800 } }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text variant="medium">Total Overdue Books: {overdueTransactions.length}</Text>
          <DetailsList
            items={overdueTransactions}
            columns={[
              { key: 'bookTitle', name: 'Book Title', fieldName: 'bookTitle', minWidth: 200 },
              { key: 'memberId', name: 'Member ID', fieldName: 'memberId', minWidth: 100 },
              { 
                key: 'daysOverdue', 
                name: 'Days Overdue', 
                minWidth: 100,
                onRender: (item) => (
                  <Text styles={{ root: { color: '#d13438', fontWeight: 'bold' } }}>
                    {item.daysOverdue}
                  </Text>
                )
              },
              {
                key: 'fine',
                name: 'Fine',
                minWidth: 80,
                onRender: (item) => (
                  <Text styles={{ root: { color: '#5c2d91', fontWeight: 'bold' } }}>
                    ${item.calculatedFine}
                  </Text>
                )
              }
            ]}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowOverdueListDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>

      {/* Communication Dialog */}
      <Dialog
        hidden={!showCommunicationDialog}
        onDismiss={() => setShowCommunicationDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Send Communication'
        }}
        styles={{ main: { minWidth: 600 } }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Recipients: {selectedMembers.length} member(s)</Text>
          
          <Dropdown
            label="Message Template"
            options={[
              { key: 'reminder1', text: '1st Reminder (Polite)' },
              { key: 'reminder2', text: '2nd Reminder (Urgent)' },
              { key: 'reminder3', text: '3rd Reminder (Final Notice)' },
              { key: 'sms', text: 'SMS Template (Short)' },
              { key: 'custom', text: 'Custom Message' }
            ]}
            selectedKey={messageTemplate}
            onChange={(_, option) => setMessageTemplate(option?.key || 'reminder1')}
          />
          
          {messageTemplate === 'custom' ? (
            <TextField
              label="Custom Message"
              multiline
              rows={4}
              value={customMessage}
              onChange={(_, value) => setCustomMessage(value || '')}
              placeholder="Use [MEMBER_NAME], [BOOK_TITLE], [DAYS_OVERDUE], [FINE_AMOUNT] as placeholders"
            />
          ) : (
            <TextField
              label="Preview"
              multiline
              rows={3}
              value={messageTemplates[messageTemplate]}
              readOnly
            />
          )}
          
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <PrimaryButton
              text="Send Email"
              iconProps={{ iconName: 'Mail' }}
              onClick={() => sendCommunication('Email')}
            />
            <DefaultButton
              text="Send SMS"
              iconProps={{ iconName: 'CellPhone' }}
              onClick={() => sendCommunication('SMS')}
            />
            <DefaultButton
              text="Send Both"
              iconProps={{ iconName: 'BulkUpload' }}
              onClick={() => {
                sendCommunication('Email');
                setTimeout(() => sendCommunication('SMS'), 500);
              }}
            />
          </Stack>
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowCommunicationDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Fine Waiver Dialog */}
      <Dialog
        hidden={!showWaiverDialog}
        onDismiss={() => setShowWaiverDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Waive Fine'
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Book: {selectedTransaction?.bookTitle}</Text>
          <Text>Member: {selectedTransaction?.memberId}</Text>
          <Text>Fine Amount: ${selectedTransaction?.calculatedFine?.toFixed(2)}</Text>
          <TextField
            label="Waiver Reason *"
            multiline
            rows={3}
            value={waiverReason}
            onChange={(_, value) => setWaiverReason(value || '')}
            placeholder="Enter reason for waiving the fine (e.g., first-time offender, system error, etc.)"
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={waiveFine} text="Waive Fine" />
          <DefaultButton onClick={() => setShowWaiverDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog
        hidden={!showPaymentHistoryDialog}
        onDismiss={() => setShowPaymentHistoryDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Fine Payment History'
        }}
        styles={{ main: { minWidth: 900 } }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text variant="medium">Total Payments: {finePayments.length}</Text>
          <Text variant="medium">Total Amount: ${finePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</Text>
          
          <DetailsList
            items={finePayments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))}
            columns={[
              { 
                key: 'paymentDate', 
                name: 'Date', 
                minWidth: 100,
                onRender: (item) => new Date(item.paymentDate).toLocaleDateString()
              },
              { key: 'memberId', name: 'Member ID', fieldName: 'memberId', minWidth: 100 },
              { key: 'bookTitle', name: 'Book Title', fieldName: 'bookTitle', minWidth: 200 },
              { 
                key: 'amount', 
                name: 'Amount', 
                minWidth: 80,
                onRender: (item) => `$${item.amount.toFixed(2)}`
              },
              { key: 'paymentMethod', name: 'Method', fieldName: 'paymentMethod', minWidth: 80 },
              { key: 'processedBy', name: 'Processed By', fieldName: 'processedBy', minWidth: 120 }
            ]}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowPaymentHistoryDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>

      {/* Fine Reports Dialog */}
      <Dialog
        hidden={!showFineReportsDialog}
        onDismiss={() => setShowFineReportsDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Fine Collection Reports'
        }}
        styles={{ main: { minWidth: 700 } }}
      >
        <Stack tokens={{ childrenGap: 20 }}>
          <Dropdown
            label="Report Period"
            options={[
              { key: 'monthly', text: 'Current Month' },
              { key: 'yearly', text: 'Current Year' }
            ]}
            selectedKey={reportPeriod}
            onChange={(_, option) => setReportPeriod(option?.key || 'monthly')}
          />
          
          {(() => {
            const report = generateFineReport();
            return (
              <Stack tokens={{ childrenGap: 15 }}>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold } }}>
                  {report.period === 'monthly' ? 'Monthly' : 'Yearly'} Fine Report
                </Text>
                <Text>Period: {report.startDate} - {report.endDate}</Text>
                
                <Stack horizontal tokens={{ childrenGap: 30 }}>
                  <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                    <Text variant="large" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold } }}>
                      ${report.totalCollected.toFixed(2)}
                    </Text>
                    <Text>Total Collected</Text>
                    <Text variant="small">{report.paymentsCount} payments</Text>
                  </Stack>
                  
                  <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                    <Text variant="large" styles={{ root: { color: '#ff8c00', fontWeight: FontWeights.bold } }}>
                      ${report.totalWaived.toFixed(2)}
                    </Text>
                    <Text>Total Waived</Text>
                  </Stack>
                  
                  <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                    <Text variant="large" styles={{ root: { color: '#0078d4', fontWeight: FontWeights.bold } }}>
                      ${(report.totalCollected + report.totalWaived).toFixed(2)}
                    </Text>
                    <Text>Total Fines</Text>
                  </Stack>
                </Stack>
                
                {report.payments.length > 0 && (
                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold, marginBottom: 10 } }}>
                      Recent Payments
                    </Text>
                    <DetailsList
                      items={report.payments.slice(0, 10)}
                      columns={[
                        { 
                          key: 'paymentDate', 
                          name: 'Date', 
                          minWidth: 100,
                          onRender: (item) => new Date(item.paymentDate).toLocaleDateString()
                        },
                        { key: 'memberId', name: 'Member', fieldName: 'memberId', minWidth: 80 },
                        { 
                          key: 'amount', 
                          name: 'Amount', 
                          minWidth: 80,
                          onRender: (item) => `$${item.amount.toFixed(2)}`
                        },
                        { key: 'paymentMethod', name: 'Method', fieldName: 'paymentMethod', minWidth: 80 }
                      ]}
                      layoutMode={DetailsListLayoutMode.justified}
                      selectionMode={SelectionMode.none}
                    />
                  </Stack>
                )}
              </Stack>
            );
          })()}
        </Stack>
        <DialogFooter>
          <DefaultButton onClick={() => setShowFineReportsDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default OverdueManagement;