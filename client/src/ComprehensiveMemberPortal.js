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
  CommandBar,
  Pivot,
  PivotItem,
  SearchBox,
  Dropdown,
  Rating,
  ProgressIndicator,
  Icon,
  Slider,
  Toggle,
  MessageBar,
  MessageBarType,
  Calendar,
  DatePicker,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const ComprehensiveMemberPortal = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, error, info } = useNotifications();
  
  // Core State
  const [selectedPivot, setSelectedPivot] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Book Management
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({ category: 'all', availability: 'all' });
  const [reservations, setReservations] = useState([]);
  const [readingLists, setReadingLists] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bookReviews, setBookReviews] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  
  // Financial
  const [transactions, setTransactions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [fineAlerts, setFineAlerts] = useState([]);
  
  // Profile & Settings
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    preferences: {
      notifications: { email: true, sms: false, push: true },
      privacy: { shareReadingHistory: false, showProfile: true },
      theme: 'auto',
      language: 'en'
    }
  });
  
  // Analytics & Gamification
  const [readingStats, setReadingStats] = useState({
    booksRead: 0,
    pagesRead: 0,
    readingStreak: 0,
    favoriteGenre: 'Fiction',
    readingGoal: 12,
    achievements: []
  });
  
  // Community Features
  const [bookClubs, setBookClubs] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  
  // Dialog States
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showCitationDialog, setShowCitationDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = () => {
    // Load from localStorage
    const savedBooks = localStorage.getItem('lms_books');
    const savedTransactions = localStorage.getItem('lms_transactions');
    const savedProfile = localStorage.getItem(`lms_profile_${user?.id}`);
    const savedStats = localStorage.getItem(`lms_stats_${user?.id}`);
    const savedReservations = localStorage.getItem(`lms_reservations_${user?.id}`);
    const savedWishlist = localStorage.getItem(`lms_wishlist_${user?.id}`);
    const savedReadingLists = localStorage.getItem(`lms_reading_lists_${user?.id}`);
    
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedTransactions) {
      const allTransactions = JSON.parse(savedTransactions);
      setTransactions(allTransactions.filter(t => t.memberId === user?.id));
    }
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedStats) setReadingStats(JSON.parse(savedStats));
    if (savedReservations) setReservations(JSON.parse(savedReservations));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedReadingLists) setReadingLists(JSON.parse(savedReadingLists));
  };

  const saveUserData = (key, data) => {
    localStorage.setItem(`${key}_${user?.id}`, JSON.stringify(data));
  };

  // Book Management Functions
  const reserveBook = (book) => {
    const reservation = {
      id: Date.now().toString(),
      bookId: book._id,
      bookTitle: book.title,
      reservedDate: new Date().toISOString(),
      status: 'pending'
    };
    const updatedReservations = [...reservations, reservation];
    setReservations(updatedReservations);
    saveUserData('lms_reservations', updatedReservations);
    success(`Reserved "${book.title}"`);
  };

  const addToWishlist = (book) => {
    if (!wishlist.find(w => w.bookId === book._id)) {
      const updatedWishlist = [...wishlist, { bookId: book._id, bookTitle: book.title, addedDate: new Date().toISOString() }];
      setWishlist(updatedWishlist);
      saveUserData('lms_wishlist', updatedWishlist);
      success(`Added "${book.title}" to wishlist`);
    }
  };

  const createReadingList = (name, books = []) => {
    const newList = {
      id: Date.now().toString(),
      name,
      books,
      createdDate: new Date().toISOString(),
      isPublic: false
    };
    const updatedLists = [...readingLists, newList];
    setReadingLists(updatedLists);
    saveUserData('lms_reading_lists', updatedLists);
    success(`Created reading list "${name}"`);
  };

  const rateBook = (bookId, rating, review) => {
    const bookReview = {
      id: Date.now().toString(),
      bookId,
      rating,
      review,
      reviewDate: new Date().toISOString()
    };
    const updatedReviews = [...bookReviews, bookReview];
    setBookReviews(updatedReviews);
    saveUserData('lms_book_reviews', updatedReviews);
    success('Review submitted successfully');
  };

  // Financial Functions
  const payFine = (amount, method = 'card') => {
    const payment = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      method,
      date: new Date().toISOString(),
      status: 'completed'
    };
    const updatedPayments = [...paymentHistory, payment];
    setPaymentHistory(updatedPayments);
    saveUserData('lms_payment_history', updatedPayments);
    success(`Payment of $${amount} processed successfully`);
  };

  // Analytics Functions
  const updateReadingStats = (action, data = {}) => {
    let updatedStats = { ...readingStats };
    
    switch (action) {
      case 'book_completed':
        updatedStats.booksRead += 1;
        updatedStats.pagesRead += data.pages || 0;
        break;
      case 'update_goal':
        updatedStats.readingGoal = data.goal;
        break;
      case 'add_achievement':
        updatedStats.achievements.push(data.achievement);
        break;
    }
    
    setReadingStats(updatedStats);
    saveUserData('lms_stats', updatedStats);
  };

  // Citation Generator
  const generateCitation = (book, format = 'APA') => {
    const formats = {
      APA: `${book.author} (${book.year}). ${book.title}. ${book.publisher}.`,
      MLA: `${book.author}. "${book.title}." ${book.publisher}, ${book.year}.`,
      Chicago: `${book.author}. ${book.title}. ${book.publisher}, ${book.year}.`
    };
    return formats[format] || formats.APA;
  };

  // QR Code Scanner Simulation
  const scanQRCode = (code) => {
    const book = books.find(b => b._id === code || b.isbn === code);
    if (book) {
      setSelectedBook(book);
      info(`Scanned: ${book.title}`);
    } else {
      error('Book not found');
    }
  };

  const overdueBooks = transactions.filter(t => {
    if (t.status !== 'active' || !t.dueDate) return false;
    return new Date() > new Date(t.dueDate);
  }).map(t => {
    const daysOverdue = Math.ceil((new Date() - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
    const fine = daysOverdue * 2;
    return { ...t, daysOverdue, fine };
  });

  const activeBooks = transactions.filter(t => t.status === 'active');
  const totalFines = overdueBooks.reduce((sum, book) => sum + book.fine, 0);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = searchFilters.category === 'all' || book.category === searchFilters.category;
    const matchesAvailability = searchFilters.availability === 'all' || 
                               (searchFilters.availability === 'available' && book.available > 0) ||
                               (searchFilters.availability === 'unavailable' && book.available === 0);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const commandBarItems = [
    {
      key: 'scan',
      text: 'Scan QR',
      iconProps: { iconName: 'QRCode' },
      onClick: () => info('QR Scanner activated (simulation)')
    },
    {
      key: 'notifications',
      text: 'Notifications',
      iconProps: { iconName: 'Ringer' },
      onClick: () => info('No new notifications')
    },
    {
      key: 'help',
      text: 'Help',
      iconProps: { iconName: 'Help' },
      onClick: () => info('Help system activated')
    }
  ];

  const bookColumns = [
    { key: 'title', name: 'Title', fieldName: 'title', minWidth: 200 },
    { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
    { key: 'category', name: 'Category', fieldName: 'category', minWidth: 100 },
    { key: 'available', name: 'Available', fieldName: 'available', minWidth: 80 },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 200,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton
            text="Reserve"
            onClick={() => reserveBook(item)}
            disabled={item.available === 0}
          />
          <DefaultButton
            text="Wishlist"
            onClick={() => addToWishlist(item)}
          />
          <DefaultButton
            text="Review"
            onClick={() => {
              setSelectedBook(item);
              setShowReviewDialog(true);
            }}
          />
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          Member Portal - {profile.name}
        </Text>
        <CommandBar items={commandBarItems} />
      </Stack>

      <Pivot
        selectedKey={selectedPivot}
        onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
      >
        {/* Dashboard */}
        <PivotItem headerText="Dashboard" itemKey="dashboard">
          <Stack tokens={{ childrenGap: 20 }}>
            {/* Quick Stats */}
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
                <Text variant="large" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold } }}>
                  {readingStats.booksRead}
                </Text>
                <Text>Books Read</Text>
              </Stack>
              <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 150 } }}>
                <Text variant="large" styles={{ root: { color: '#5c2d91', fontWeight: FontWeights.bold } }}>
                  ${totalFines.toFixed(2)}
                </Text>
                <Text>Total Fines</Text>
              </Stack>
            </Stack>

            {/* Reading Goal Progress */}
            <Stack styles={{ root: { padding: 20, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Reading Goal Progress
              </Text>
              <ProgressIndicator
                percentComplete={readingStats.booksRead / readingStats.readingGoal}
                description={`${readingStats.booksRead} of ${readingStats.readingGoal} books`}
              />
            </Stack>

            {/* Recent Activity */}
            <Stack styles={{ root: { padding: 20, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Recent Activity
              </Text>
              <Stack tokens={{ childrenGap: 10 }}>
                <Text>• Reserved "JavaScript Guide" - 2 hours ago</Text>
                <Text>• Completed reading "Clean Code" - 1 day ago</Text>
                <Text>• Joined "Tech Book Club" - 3 days ago</Text>
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>

        {/* Book Catalog */}
        <PivotItem headerText="Book Catalog" itemKey="catalog">
          <Stack tokens={{ childrenGap: 15 }}>
            <Stack horizontal tokens={{ childrenGap: 15 }}>
              <SearchBox
                placeholder="Search books..."
                value={searchQuery}
                onChange={(_, value) => setSearchQuery(value || '')}
                styles={{ root: { width: 300 } }}
              />
              <Dropdown
                placeholder="Category"
                options={[
                  { key: 'all', text: 'All Categories' },
                  { key: 'Fiction', text: 'Fiction' },
                  { key: 'Science', text: 'Science' },
                  { key: 'Technology', text: 'Technology' }
                ]}
                selectedKey={searchFilters.category}
                onChange={(_, option) => setSearchFilters({ ...searchFilters, category: option?.key || 'all' })}
              />
              <Dropdown
                placeholder="Availability"
                options={[
                  { key: 'all', text: 'All' },
                  { key: 'available', text: 'Available' },
                  { key: 'unavailable', text: 'Unavailable' }
                ]}
                selectedKey={searchFilters.availability}
                onChange={(_, option) => setSearchFilters({ ...searchFilters, availability: option?.key || 'all' })}
              />
            </Stack>
            
            <DetailsList
              items={filteredBooks}
              columns={bookColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </PivotItem>

        {/* My Books */}
        <PivotItem headerText="My Books" itemKey="mybooks">
          <Stack tokens={{ childrenGap: 20 }}>
            {/* Active Books */}
            <Stack>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Currently Borrowed
              </Text>
              <DetailsList
                items={activeBooks}
                columns={[
                  { key: 'bookTitle', name: 'Book', fieldName: 'bookTitle', minWidth: 200 },
                  { key: 'issueDate', name: 'Issued', minWidth: 100, onRender: (item) => new Date(item.issueDate).toLocaleDateString() },
                  { key: 'dueDate', name: 'Due', minWidth: 100, onRender: (item) => new Date(item.dueDate).toLocaleDateString() },
                  { key: 'renewals', name: 'Renewals', minWidth: 80, onRender: (item) => `${item.renewalCount || 0}/2` },
                  {
                    key: 'actions',
                    name: 'Actions',
                    minWidth: 150,
                    onRender: (item) => (
                      <DefaultButton
                        text="Renew"
                        onClick={() => {
                          setSelectedTransaction(item);
                          setShowRenewalDialog(true);
                        }}
                        disabled={(item.renewalCount || 0) >= 2}
                      />
                    )
                  }
                ]}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            </Stack>

            {/* Overdue Books */}
            {overdueBooks.length > 0 && (
              <Stack>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: '#d13438' } }}>
                  Overdue Books
                </Text>
                <DetailsList
                  items={overdueBooks}
                  columns={[
                    { key: 'bookTitle', name: 'Book', fieldName: 'bookTitle', minWidth: 200 },
                    { key: 'daysOverdue', name: 'Days Overdue', minWidth: 100, onRender: (item) => item.daysOverdue },
                    { key: 'fine', name: 'Fine', minWidth: 80, onRender: (item) => `$${item.fine}` },
                    {
                      key: 'actions',
                      name: 'Actions',
                      minWidth: 150,
                      onRender: (item) => (
                        <DefaultButton
                          text="Pay Fine"
                          onClick={() => {
                            setSelectedTransaction(item);
                            setShowPaymentDialog(true);
                          }}
                        />
                      )
                    }
                  ]}
                  layoutMode={DetailsListLayoutMode.justified}
                  selectionMode={SelectionMode.none}
                />
              </Stack>
            )}

            {/* Reservations */}
            <Stack>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Reservations
              </Text>
              <DetailsList
                items={reservations}
                columns={[
                  { key: 'bookTitle', name: 'Book', fieldName: 'bookTitle', minWidth: 200 },
                  { key: 'reservedDate', name: 'Reserved', minWidth: 100, onRender: (item) => new Date(item.reservedDate).toLocaleDateString() },
                  { key: 'status', name: 'Status', fieldName: 'status', minWidth: 100 }
                ]}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            </Stack>
          </Stack>
        </PivotItem>

        {/* Reading Lists */}
        <PivotItem headerText="Reading Lists" itemKey="lists">
          <Stack tokens={{ childrenGap: 15 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                My Reading Lists
              </Text>
              <PrimaryButton
                text="Create List"
                onClick={() => {
                  const name = prompt('Enter list name:');
                  if (name) createReadingList(name);
                }}
              />
            </Stack>
            
            <Stack tokens={{ childrenGap: 10 }}>
              {readingLists.map(list => (
                <Stack key={list.id} styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    {list.name}
                  </Text>
                  <Text variant="small">{list.books.length} books</Text>
                </Stack>
              ))}
            </Stack>

            <Stack>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Wishlist
              </Text>
              <DetailsList
                items={wishlist}
                columns={[
                  { key: 'bookTitle', name: 'Book', fieldName: 'bookTitle', minWidth: 200 },
                  { key: 'addedDate', name: 'Added', minWidth: 100, onRender: (item) => new Date(item.addedDate).toLocaleDateString() }
                ]}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            </Stack>
          </Stack>
        </PivotItem>

        {/* Analytics */}
        <PivotItem headerText="Analytics" itemKey="analytics">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Reading Statistics
            </Text>
            
            <Stack horizontal tokens={{ childrenGap: 30 }}>
              <Stack styles={{ root: { flex: 1 } }}>
                <Text variant="medium">Books Read This Year</Text>
                <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#0078d4' } }}>
                  {readingStats.booksRead}
                </Text>
              </Stack>
              <Stack styles={{ root: { flex: 1 } }}>
                <Text variant="medium">Pages Read</Text>
                <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#107c10' } }}>
                  {readingStats.pagesRead}
                </Text>
              </Stack>
              <Stack styles={{ root: { flex: 1 } }}>
                <Text variant="medium">Reading Streak</Text>
                <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: '#d13438' } }}>
                  {readingStats.readingStreak} days
                </Text>
              </Stack>
            </Stack>

            <Stack>
              <Text variant="medium">Reading Goal</Text>
              <Slider
                min={1}
                max={50}
                value={readingStats.readingGoal}
                onChange={(value) => updateReadingStats('update_goal', { goal: value })}
                showValue
              />
            </Stack>

            <Stack>
              <Text variant="medium">Achievements</Text>
              <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
                <Stack styles={{ root: { padding: 10, border: '1px solid #107c10', borderRadius: 4, backgroundColor: '#f3f9f1' } }}>
                  <Icon iconName="Trophy" styles={{ root: { color: '#107c10' } }} />
                  <Text variant="small">First Book</Text>
                </Stack>
                <Stack styles={{ root: { padding: 10, border: '1px solid #0078d4', borderRadius: 4, backgroundColor: '#f3f8ff' } }}>
                  <Icon iconName="ReadingMode" styles={{ root: { color: '#0078d4' } }} />
                  <Text variant="small">Speed Reader</Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>

        {/* Community */}
        <PivotItem headerText="Community" itemKey="community">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Book Clubs & Discussions
            </Text>
            
            <Stack>
              <Text variant="medium">My Book Clubs</Text>
              <Stack tokens={{ childrenGap: 10 }}>
                <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Tech Book Club
                  </Text>
                  <Text variant="small">Currently reading: "Clean Architecture"</Text>
                  <Text variant="small">Next meeting: March 15, 2024</Text>
                </Stack>
              </Stack>
            </Stack>

            <Stack>
              <Text variant="medium">Reading Challenges</Text>
              <Stack tokens={{ childrenGap: 10 }}>
                <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    2024 Reading Challenge
                  </Text>
                  <ProgressIndicator
                    percentComplete={readingStats.booksRead / 12}
                    description={`${readingStats.booksRead} of 12 books`}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>

        {/* Profile */}
        <PivotItem headerText="Profile" itemKey="profile">
          <Stack tokens={{ childrenGap: 20 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Profile Settings
              </Text>
              <PrimaryButton
                text="Edit Profile"
                onClick={() => setShowProfileDialog(true)}
              />
            </Stack>

            <Stack tokens={{ childrenGap: 15 }}>
              <TextField label="Name" value={profile.name} readOnly />
              <TextField label="Email" value={profile.email} readOnly />
              <TextField label="Phone" value={profile.phone} readOnly />
              <TextField label="Address" value={profile.address} readOnly multiline rows={3} />
            </Stack>

            <Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Notification Preferences
              </Text>
              <Toggle
                label="Email Notifications"
                checked={profile.preferences.notifications.email}
                onChange={(_, checked) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    notifications: { ...profile.preferences.notifications, email: checked }
                  }
                })}
              />
              <Toggle
                label="SMS Notifications"
                checked={profile.preferences.notifications.sms}
                onChange={(_, checked) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    notifications: { ...profile.preferences.notifications, sms: checked }
                  }
                })}
              />
            </Stack>
          </Stack>
        </PivotItem>

        {/* Tools */}
        <PivotItem headerText="Tools" itemKey="tools">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Academic Tools
            </Text>
            
            <Stack horizontal tokens={{ childrenGap: 20 }}>
              <PrimaryButton
                text="Citation Generator"
                onClick={() => setShowCitationDialog(true)}
              />
              <DefaultButton
                text="Study Room Booking"
                onClick={() => info('Study room booking system activated')}
              />
              <DefaultButton
                text="Research Assistant"
                onClick={() => info('Research assistant activated')}
              />
            </Stack>

            <Stack>
              <Text variant="medium">Digital Library Card</Text>
              <Stack styles={{ root: { padding: 20, border: '2px solid #0078d4', borderRadius: 8, textAlign: 'center', maxWidth: 300 } }}>
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.bold } }}>
                  {user?.name || 'Member Name'}
                </Text>
                <Text>ID: {user?.id || 'M001'}</Text>
                <div style={{ fontSize: '48px', margin: '10px 0' }}>📱</div>
                <Text variant="small">Scan for quick access</Text>
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>
      </Pivot>

      {/* Dialogs */}
      
      {/* Payment Dialog */}
      <Dialog
        hidden={!showPaymentDialog}
        onDismiss={() => setShowPaymentDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Pay Fine' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Book: {selectedTransaction?.bookTitle}</Text>
          <Text>Fine Amount: ${selectedTransaction?.fine}</Text>
          <Dropdown
            label="Payment Method"
            options={[
              { key: 'card', text: 'Credit/Debit Card' },
              { key: 'paypal', text: 'PayPal' },
              { key: 'bank', text: 'Bank Transfer' }
            ]}
            defaultSelectedKey="card"
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              payFine(selectedTransaction?.fine, 'card');
              setShowPaymentDialog(false);
            }}
            text="Pay Now"
          />
          <DefaultButton onClick={() => setShowPaymentDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        hidden={!showReviewDialog}
        onDismiss={() => setShowReviewDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Write Review' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Text>Book: {selectedBook?.title}</Text>
          <Text>Author: {selectedBook?.author}</Text>
          <Rating
            min={1}
            max={5}
            onChange={(_, rating) => {
              const review = prompt('Write your review:');
              if (review && rating) {
                rateBook(selectedBook._id, rating, review);
                setShowReviewDialog(false);
              }
            }}
          />
          <TextField
            label="Review"
            multiline
            rows={4}
            placeholder="Share your thoughts about this book..."
            onChange={(_, value) => {
              // Store review text for submission
            }}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              const rating = 5; // Get from rating component
              const review = 'Great book!'; // Get from text field
              rateBook(selectedBook._id, rating, review);
              setShowReviewDialog(false);
            }}
            text="Submit Review"
          />
          <DefaultButton onClick={() => setShowReviewDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Citation Dialog */}
      <Dialog
        hidden={!showCitationDialog}
        onDismiss={() => setShowCitationDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Citation Generator' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Dropdown
            label="Citation Format"
            options={[
              { key: 'APA', text: 'APA' },
              { key: 'MLA', text: 'MLA' },
              { key: 'Chicago', text: 'Chicago' }
            ]}
            defaultSelectedKey="APA"
          />
          <TextField
            label="Generated Citation"
            multiline
            rows={3}
            value={selectedBook ? generateCitation(selectedBook, 'APA') : ''}
            readOnly
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              if (selectedBook) {
                const citation = generateCitation(selectedBook, 'APA');
                navigator.clipboard.writeText(citation);
                success('Citation copied to clipboard');
              }
            }}
            text="Copy Citation"
          />
          <DefaultButton onClick={() => setShowCitationDialog(false)} text="Close" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default ComprehensiveMemberPortal;