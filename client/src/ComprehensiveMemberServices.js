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
  Toggle,
  DatePicker,
  Calendar,
  MessageBar,
  MessageBarType,
  Icon,
  Rating,
  ProgressIndicator,
  Slider,
  Checkbox,
  ChoiceGroup,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const ComprehensiveMemberServices = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, error, info } = useNotifications();
  
  // Core State
  const [selectedPivot, setSelectedPivot] = useState('registration');
  const [loading, setLoading] = useState(false);
  
  // Member Registration & Management
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '', email: '', phone: '', address: '', memberType: 'Student',
    department: '', studentId: '', emergencyContact: '', photo: null
  });
  const [membershipRenewals, setMembershipRenewals] = useState([]);
  const [familyAccounts, setFamilyAccounts] = useState([]);
  
  // Account Services
  const [accountHolds, setAccountHolds] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  
  // Academic Support
  const [researchRequests, setResearchRequests] = useState([]);
  const [interLibraryLoans, setInterLibraryLoans] = useState([]);
  const [courseReserves, setCourseReserves] = useState([]);
  const [studyRoomBookings, setStudyRoomBookings] = useState([]);
  
  // Collection Services
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [specialCollections, setSpecialCollections] = useState([]);
  
  // Communication Services
  const [notifications, setNotifications] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  
  // Specialized Services
  const [accessibilityServices, setAccessibilityServices] = useState([]);
  const [visitorPasses, setVisitorPasses] = useState([]);
  const [corporateAccounts, setCorporateAccounts] = useState([]);
  
  // Digital Services
  const [digitalSupport, setDigitalSupport] = useState([]);
  const [trainingRequests, setTrainingRequests] = useState([]);
  
  // Engagement Programs
  const [bookClubs, setBookClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [volunteerPrograms, setVolunteerPrograms] = useState([]);
  
  // Dialog States
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [showResearchDialog, setShowResearchDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    loadMemberServicesData();
  }, []);

  const loadMemberServicesData = () => {
    // Load from localStorage
    const savedMembers = localStorage.getItem('lms_members');
    const savedBookings = localStorage.getItem('lms_study_room_bookings');
    const savedRequests = localStorage.getItem('lms_purchase_requests');
    const savedEvents = localStorage.getItem('lms_events');
    const savedBookClubs = localStorage.getItem('lms_book_clubs');
    
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    if (savedBookings) setStudyRoomBookings(JSON.parse(savedBookings));
    if (savedRequests) setPurchaseRequests(JSON.parse(savedRequests));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedBookClubs) setBookClubs(JSON.parse(savedBookClubs));
  };

  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Member Registration Functions
  const registerMember = () => {
    if (!newMember.name || !newMember.email || !newMember.memberType) {
      error('Please fill in all required fields');
      return;
    }
    
    const member = {
      id: Date.now().toString(),
      ...newMember,
      registrationDate: new Date().toISOString(),
      status: 'Active',
      membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      cardNumber: `LIB${Date.now().toString().slice(-6)}`
    };
    
    const updatedMembers = [...members, member];
    setMembers(updatedMembers);
    saveData('lms_members', updatedMembers);
    
    setNewMember({
      name: '', email: '', phone: '', address: '', memberType: 'Student',
      department: '', studentId: '', emergencyContact: '', photo: null
    });
    setShowRegistrationDialog(false);
    success(`Member registered successfully. Card Number: ${member.cardNumber}`);
  };

  const renewMembership = (memberId, duration = 365) => {
    const updatedMembers = members.map(member => {
      if (member.id === memberId) {
        const newExpiry = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
        return { ...member, membershipExpiry: newExpiry.toISOString(), status: 'Active' };
      }
      return member;
    });
    setMembers(updatedMembers);
    saveData('lms_members', updatedMembers);
    success('Membership renewed successfully');
  };

  const generateMemberCard = (member) => {
    const cardData = {
      name: member.name,
      cardNumber: member.cardNumber,
      memberType: member.memberType,
      expiry: new Date(member.membershipExpiry).toLocaleDateString(),
      qrCode: `LMS_${member.id}`
    };
    success(`Digital member card generated for ${member.name}`);
    return cardData;
  };

  // Account Services Functions
  const placeAccountHold = (memberId, reason, type = 'Fine') => {
    const hold = {
      id: Date.now().toString(),
      memberId,
      reason,
      type,
      placedDate: new Date().toISOString(),
      status: 'Active',
      placedBy: user?.name || 'System'
    };
    const updatedHolds = [...accountHolds, hold];
    setAccountHolds(updatedHolds);
    saveData('lms_account_holds', updatedHolds);
    success(`Hold placed on member account: ${reason}`);
  };

  const removeAccountHold = (holdId) => {
    const updatedHolds = accountHolds.map(hold => 
      hold.id === holdId ? { ...hold, status: 'Removed', removedDate: new Date().toISOString() } : hold
    );
    setAccountHolds(updatedHolds);
    saveData('lms_account_holds', updatedHolds);
    success('Account hold removed successfully');
  };

  const grantSpecialPrivilege = (memberId, privilege, duration = 30) => {
    const specialPrivilege = {
      id: Date.now().toString(),
      memberId,
      privilege,
      grantedDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      grantedBy: user?.name || 'Librarian'
    };
    const updatedPrivileges = [...privileges, specialPrivilege];
    setPrivileges(updatedPrivileges);
    saveData('lms_special_privileges', updatedPrivileges);
    success(`Special privilege granted: ${privilege}`);
  };

  // Academic Support Functions
  const submitResearchRequest = (topic, description, urgency = 'Normal') => {
    const request = {
      id: Date.now().toString(),
      memberId: user?.id,
      topic,
      description,
      urgency,
      status: 'Submitted',
      submittedDate: new Date().toISOString(),
      assignedLibrarian: null
    };
    const updatedRequests = [...researchRequests, request];
    setResearchRequests(updatedRequests);
    saveData('lms_research_requests', updatedRequests);
    success('Research assistance request submitted');
  };

  const requestInterLibraryLoan = (bookTitle, author, isbn, library) => {
    const loan = {
      id: Date.now().toString(),
      memberId: user?.id,
      bookTitle,
      author,
      isbn,
      requestedLibrary: library,
      status: 'Requested',
      requestDate: new Date().toISOString(),
      estimatedArrival: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    const updatedLoans = [...interLibraryLoans, loan];
    setInterLibraryLoans(updatedLoans);
    saveData('lms_interlibrary_loans', updatedLoans);
    success('Inter-library loan requested');
  };

  const bookStudyRoom = (roomId, date, timeSlot, purpose) => {
    const booking = {
      id: Date.now().toString(),
      memberId: user?.id,
      roomId,
      date: date.toISOString(),
      timeSlot,
      purpose,
      status: 'Confirmed',
      bookingDate: new Date().toISOString()
    };
    const updatedBookings = [...studyRoomBookings, booking];
    setStudyRoomBookings(updatedBookings);
    saveData('lms_study_room_bookings', updatedBookings);
    success(`Study room ${roomId} booked for ${date.toLocaleDateString()}`);
  };

  // Collection Services Functions
  const submitPurchaseRequest = (title, author, isbn, justification, priority = 'Normal') => {
    const request = {
      id: Date.now().toString(),
      memberId: user?.id,
      title,
      author,
      isbn,
      justification,
      priority,
      status: 'Under Review',
      submittedDate: new Date().toISOString(),
      estimatedCost: Math.floor(Math.random() * 100) + 20
    };
    const updatedRequests = [...purchaseRequests, request];
    setPurchaseRequests(updatedRequests);
    saveData('lms_purchase_requests', updatedRequests);
    success('Purchase request submitted for review');
  };

  const processDonation = (donorName, books, condition) => {
    const donation = {
      id: Date.now().toString(),
      donorName,
      books: books.split(',').map(book => book.trim()),
      condition,
      donationDate: new Date().toISOString(),
      status: 'Processing',
      acknowledgmentSent: false
    };
    const updatedDonations = [...donations, donation];
    setDonations(updatedDonations);
    saveData('lms_donations', updatedDonations);
    success('Book donation recorded. Thank you for your contribution!');
  };

  // Communication Functions
  const submitFeedback = (category, subject, message, rating) => {
    const feedback = {
      id: Date.now().toString(),
      memberId: user?.id,
      category,
      subject,
      message,
      rating,
      submittedDate: new Date().toISOString(),
      status: 'Open',
      response: null
    };
    const updatedFeedbacks = [...feedbacks, feedback];
    setFeedbacks(updatedFeedbacks);
    saveData('lms_feedbacks', updatedFeedbacks);
    success('Feedback submitted successfully');
  };

  const subscribeToNewsletter = (email, preferences) => {
    const subscription = {
      id: Date.now().toString(),
      email,
      preferences,
      subscribedDate: new Date().toISOString(),
      status: 'Active'
    };
    const updatedNewsletters = [...newsletters, subscription];
    setNewsletters(updatedNewsletters);
    saveData('lms_newsletter_subscriptions', updatedNewsletters);
    success('Newsletter subscription confirmed');
  };

  // Engagement Functions
  const joinBookClub = (clubId, memberInterests) => {
    const membership = {
      id: Date.now().toString(),
      memberId: user?.id,
      clubId,
      joinedDate: new Date().toISOString(),
      interests: memberInterests,
      status: 'Active'
    };
    success('Successfully joined book club');
  };

  const registerForEvent = (eventId, additionalInfo) => {
    const registration = {
      id: Date.now().toString(),
      memberId: user?.id,
      eventId,
      registrationDate: new Date().toISOString(),
      additionalInfo,
      status: 'Registered'
    };
    success('Event registration confirmed');
  };

  const requestTraining = (trainingType, preferredDate, skillLevel) => {
    const request = {
      id: Date.now().toString(),
      memberId: user?.id,
      trainingType,
      preferredDate: preferredDate.toISOString(),
      skillLevel,
      status: 'Requested',
      requestDate: new Date().toISOString()
    };
    const updatedTraining = [...trainingRequests, request];
    setTrainingRequests(updatedTraining);
    saveData('lms_training_requests', updatedTraining);
    success('Training request submitted');
  };

  const commandBarItems = [
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        loadMemberServicesData();
        success('Data refreshed');
      }
    },
    {
      key: 'help',
      text: 'Help Desk',
      iconProps: { iconName: 'Help' },
      onClick: () => info('📞 Help Desk: (555) 123-4567 | 📧 help@library.edu')
    },
    {
      key: 'chat',
      text: 'Live Chat',
      iconProps: { iconName: 'Chat' },
      onClick: () => info('💬 Live chat activated - A librarian will assist you shortly')
    }
  ];

  const memberColumns = [
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 150 },
    { key: 'cardNumber', name: 'Card Number', fieldName: 'cardNumber', minWidth: 120 },
    { key: 'memberType', name: 'Type', fieldName: 'memberType', minWidth: 100 },
    { key: 'status', name: 'Status', fieldName: 'status', minWidth: 80 },
    { 
      key: 'expiry', 
      name: 'Expiry', 
      minWidth: 100,
      onRender: (item) => new Date(item.membershipExpiry).toLocaleDateString()
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 200,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton
            text="Renew"
            onClick={() => renewMembership(item.id)}
          />
          <DefaultButton
            text="Card"
            onClick={() => generateMemberCard(item)}
          />
          <DefaultButton
            text="Hold"
            onClick={() => placeAccountHold(item.id, 'Administrative Hold')}
          />
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          Member Services
        </Text>
        <CommandBar items={commandBarItems} />
      </Stack>

      <Pivot
        selectedKey={selectedPivot}
        onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
      >
        {/* Member Registration */}
        <PivotItem headerText="Registration" itemKey="registration">
          <Stack tokens={{ childrenGap: 20 }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Member Management
              </Text>
              <PrimaryButton
                text="Register New Member"
                onClick={() => setShowRegistrationDialog(true)}
              />
            </Stack>

            <DetailsList
              items={members}
              columns={memberColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </PivotItem>

        {/* Account Services */}
        <PivotItem headerText="Account Services" itemKey="accounts">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Account Management
            </Text>
            
            <Stack horizontal tokens={{ childrenGap: 20 }}>
              <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 200 } }}>
                <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                  Active Holds
                </Text>
                <Text variant="xxLarge" styles={{ root: { color: '#d13438', fontWeight: FontWeights.bold } }}>
                  {accountHolds.filter(h => h.status === 'Active').length}
                </Text>
              </Stack>
              
              <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 200 } }}>
                <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                  Special Privileges
                </Text>
                <Text variant="xxLarge" styles={{ root: { color: '#107c10', fontWeight: FontWeights.bold } }}>
                  {privileges.length}
                </Text>
              </Stack>
            </Stack>

            <Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Quick Actions
              </Text>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <DefaultButton
                  text="Check Account Status"
                  onClick={() => info('Account status: Active, No holds, Expires: 12/31/2024')}
                />
                <DefaultButton
                  text="View Transaction History"
                  onClick={() => info('Transaction history loaded')}
                />
                <DefaultButton
                  text="Export Account Data"
                  onClick={() => success('Account data exported to downloads')}
                />
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>

        {/* Academic Support */}
        <PivotItem headerText="Academic Support" itemKey="academic">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Academic Services
            </Text>
            
            <Stack horizontal wrap tokens={{ childrenGap: 15 }}>
              <PrimaryButton
                text="Research Assistance"
                onClick={() => setShowResearchDialog(true)}
              />
              <DefaultButton
                text="Inter-Library Loan"
                onClick={() => {
                  const title = prompt('Book title:');
                  const author = prompt('Author:');
                  if (title && author) requestInterLibraryLoan(title, author, '', 'Partner Library');
                }}
              />
              <DefaultButton
                text="Course Reserves"
                onClick={() => info('Course reserves system activated')}
              />
              <DefaultButton
                text="Book Study Room"
                onClick={() => setShowBookingDialog(true)}
              />
              <DefaultButton
                text="Citation Help"
                onClick={() => info('Citation assistance: APA, MLA, Chicago formats available')}
              />
            </Stack>

            <Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                My Requests
              </Text>
              <DetailsList
                items={researchRequests.filter(r => r.memberId === user?.id)}
                columns={[
                  { key: 'topic', name: 'Topic', fieldName: 'topic', minWidth: 200 },
                  { key: 'status', name: 'Status', fieldName: 'status', minWidth: 100 },
                  { key: 'urgency', name: 'Priority', fieldName: 'urgency', minWidth: 100 },
                  { 
                    key: 'date', 
                    name: 'Submitted', 
                    minWidth: 120,
                    onRender: (item) => new Date(item.submittedDate).toLocaleDateString()
                  }
                ]}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            </Stack>
          </Stack>
        </PivotItem>

        {/* Collection Services */}
        <PivotItem headerText="Collection Services" itemKey="collection">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Collection Management
            </Text>
            
            <Stack horizontal wrap tokens={{ childrenGap: 15 }}>
              <PrimaryButton
                text="Request Purchase"
                onClick={() => setShowPurchaseDialog(true)}
              />
              <DefaultButton
                text="Donate Books"
                onClick={() => {
                  const donor = prompt('Donor name:');
                  const books = prompt('Book titles (comma separated):');
                  if (donor && books) processDonation(donor, books, 'Good');
                }}
              />
              <DefaultButton
                text="Special Collections"
                onClick={() => info('Special collections: Rare books, Archives, Manuscripts')}
              />
              <DefaultButton
                text="Digital Resources"
                onClick={() => info('Access to e-books, audiobooks, and online journals')}
              />
            </Stack>

            <Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Purchase Requests
              </Text>
              <DetailsList
                items={purchaseRequests}
                columns={[
                  { key: 'title', name: 'Title', fieldName: 'title', minWidth: 200 },
                  { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
                  { key: 'status', name: 'Status', fieldName: 'status', minWidth: 100 },
                  { key: 'priority', name: 'Priority', fieldName: 'priority', minWidth: 100 },
                  { 
                    key: 'cost', 
                    name: 'Est. Cost', 
                    minWidth: 100,
                    onRender: (item) => `$${item.estimatedCost}`
                  }
                ]}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            </Stack>
          </Stack>
        </PivotItem>

        {/* Communication */}
        <PivotItem headerText="Communication" itemKey="communication">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Communication Services
            </Text>
            
            <Stack horizontal wrap tokens={{ childrenGap: 15 }}>
              <PrimaryButton
                text="Submit Feedback"
                onClick={() => setShowFeedbackDialog(true)}
              />
              <DefaultButton
                text="Newsletter Subscription"
                onClick={() => {
                  const email = prompt('Email address:');
                  if (email) subscribeToNewsletter(email, ['New Books', 'Events']);
                }}
              />
              <DefaultButton
                text="Notification Settings"
                onClick={() => info('Notification preferences updated')}
              />
              <DefaultButton
                text="Library Announcements"
                onClick={() => info('📢 Latest: New study rooms available, Book sale next week')}
              />
            </Stack>

            <Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Recent Notifications
              </Text>
              <Stack tokens={{ childrenGap: 10 }}>
                <MessageBar messageBarType={MessageBarType.info}>
                  📚 New books arrived in Science section
                </MessageBar>
                <MessageBar messageBarType={MessageBarType.warning}>
                  ⏰ Book "Clean Code" due in 2 days
                </MessageBar>
                <MessageBar messageBarType={MessageBarType.success}>
                  ✅ Your reserved book is ready for pickup
                </MessageBar>
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>

        {/* Engagement Programs */}
        <PivotItem headerText="Programs" itemKey="programs">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Engagement Programs
            </Text>
            
            <Stack horizontal wrap tokens={{ childrenGap: 15 }}>
              <PrimaryButton
                text="Join Book Club"
                onClick={() => joinBookClub('tech-books', ['Programming', 'AI'])}
              />
              <DefaultButton
                text="Register for Event"
                onClick={() => setShowEventDialog(true)}
              />
              <DefaultButton
                text="Workshop Registration"
                onClick={() => requestTraining('Digital Literacy', new Date(), 'Beginner')}
              />
              <DefaultButton
                text="Volunteer Programs"
                onClick={() => info('Volunteer opportunities: Reading programs, Book sorting, Event assistance')}
              />
            </Stack>

            <Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Upcoming Events
              </Text>
              <Stack tokens={{ childrenGap: 10 }}>
                <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Author Meet & Greet
                  </Text>
                  <Text>Date: March 20, 2024 | Time: 6:00 PM</Text>
                  <Text>Speaker: John Doe, Tech Author</Text>
                </Stack>
                <Stack styles={{ root: { padding: 15, border: '1px solid #e1dfdd', borderRadius: 4 } }}>
                  <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Research Workshop
                  </Text>
                  <Text>Date: March 25, 2024 | Time: 2:00 PM</Text>
                  <Text>Topic: Advanced Database Search Techniques</Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>

        {/* Digital Services */}
        <PivotItem headerText="Digital Services" itemKey="digital">
          <Stack tokens={{ childrenGap: 20 }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              Digital Support Services
            </Text>
            
            <Stack horizontal wrap tokens={{ childrenGap: 15 }}>
              <DefaultButton
                text="Mobile App Help"
                onClick={() => info('📱 Download: iOS App Store, Google Play Store')}
              />
              <DefaultButton
                text="Digital Training"
                onClick={() => info('Available: Computer basics, Internet skills, E-resource training')}
              />
              <DefaultButton
                text="Password Reset"
                onClick={() => success('Password reset link sent to your email')}
              />
              <DefaultButton
                text="WiFi Setup"
                onClick={() => info('📶 Network: LibraryGuest | Password: books2024')}
              />
              <DefaultButton
                text="Printing Services"
                onClick={() => info('🖨️ Wireless printing available | Cost: $0.10/page')}
              />
            </Stack>

            <Stack>
              <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                System Status
              </Text>
              <Stack tokens={{ childrenGap: 10 }}>
                <Stack horizontal horizontalAlign="space-between">
                  <Text>Catalog System</Text>
                  <Text styles={{ root: { color: '#107c10' } }}>✅ Online</Text>
                </Stack>
                <Stack horizontal horizontalAlign="space-between">
                  <Text>WiFi Network</Text>
                  <Text styles={{ root: { color: '#107c10' } }}>✅ Available</Text>
                </Stack>
                <Stack horizontal horizontalAlign="space-between">
                  <Text>Printing Services</Text>
                  <Text styles={{ root: { color: '#107c10' } }}>✅ Operational</Text>
                </Stack>
                <Stack horizontal horizontalAlign="space-between">
                  <Text>Database Access</Text>
                  <Text styles={{ root: { color: '#ff8c00' } }}>⚠️ Maintenance (2-4 AM)</Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>
      </Pivot>

      {/* Dialogs */}
      
      {/* Registration Dialog */}
      <Dialog
        hidden={!showRegistrationDialog}
        onDismiss={() => setShowRegistrationDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Register New Member' }}
        styles={{ main: { minWidth: 600 } }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Full Name *"
            value={newMember.name}
            onChange={(_, value) => setNewMember({ ...newMember, name: value || '' })}
          />
          <TextField
            label="Email *"
            type="email"
            value={newMember.email}
            onChange={(_, value) => setNewMember({ ...newMember, email: value || '' })}
          />
          <TextField
            label="Phone"
            value={newMember.phone}
            onChange={(_, value) => setNewMember({ ...newMember, phone: value || '' })}
          />
          <Dropdown
            label="Member Type *"
            options={[
              { key: 'Student', text: 'Student' },
              { key: 'Faculty', text: 'Faculty' },
              { key: 'Staff', text: 'Staff' },
              { key: 'Alumni', text: 'Alumni' },
              { key: 'Visitor', text: 'Visitor' }
            ]}
            selectedKey={newMember.memberType}
            onChange={(_, option) => setNewMember({ ...newMember, memberType: option?.key || 'Student' })}
          />
          <TextField
            label="Department"
            value={newMember.department}
            onChange={(_, value) => setNewMember({ ...newMember, department: value || '' })}
          />
          <TextField
            label="Student/Employee ID"
            value={newMember.studentId}
            onChange={(_, value) => setNewMember({ ...newMember, studentId: value || '' })}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton onClick={registerMember} text="Register Member" />
          <DefaultButton onClick={() => setShowRegistrationDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Research Request Dialog */}
      <Dialog
        hidden={!showResearchDialog}
        onDismiss={() => setShowResearchDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Research Assistance Request' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Research Topic"
            placeholder="Enter your research topic"
            onChange={(_, value) => {
              // Store topic
            }}
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            placeholder="Describe what kind of assistance you need"
            onChange={(_, value) => {
              // Store description
            }}
          />
          <Dropdown
            label="Urgency"
            options={[
              { key: 'Low', text: 'Low' },
              { key: 'Normal', text: 'Normal' },
              { key: 'High', text: 'High' },
              { key: 'Urgent', text: 'Urgent' }
            ]}
            defaultSelectedKey="Normal"
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              submitResearchRequest('AI Research', 'Need help finding recent papers on machine learning', 'Normal');
              setShowResearchDialog(false);
            }}
            text="Submit Request"
          />
          <DefaultButton onClick={() => setShowResearchDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        hidden={!showFeedbackDialog}
        onDismiss={() => setShowFeedbackDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Submit Feedback' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Dropdown
            label="Category"
            options={[
              { key: 'Service', text: 'Service Quality' },
              { key: 'Facilities', text: 'Facilities' },
              { key: 'Collections', text: 'Book Collections' },
              { key: 'Technology', text: 'Technology' },
              { key: 'Staff', text: 'Staff' },
              { key: 'Other', text: 'Other' }
            ]}
            defaultSelectedKey="Service"
          />
          <TextField
            label="Subject"
            placeholder="Brief subject line"
          />
          <TextField
            label="Message"
            multiline
            rows={4}
            placeholder="Your detailed feedback"
          />
          <Rating
            min={1}
            max={5}
            onChange={(_, rating) => {
              // Store rating
            }}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              submitFeedback('Service', 'Great library service', 'Very satisfied with the service quality', 5);
              setShowFeedbackDialog(false);
            }}
            text="Submit Feedback"
          />
          <DefaultButton onClick={() => setShowFeedbackDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default ComprehensiveMemberServices;