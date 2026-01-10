import React, { useState, useEffect, useRef } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  TextField,
  Panel,
  PanelType,
  Spinner,
  SpinnerSize,
  mergeStyles,
  FontWeights,
  Pivot,
  PivotItem,
  PersonaSize,
  Persona,
  DatePicker,
  DayOfWeek
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import ImagePreview from './ImagePreview';
import axios from 'axios';

const ProfileEdit = ({ isOpen, onDismiss }) => {
  const { user, setUser } = useAuth();
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPivot, setSelectedPivot] = useState('basic');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    bio: '',
    dateOfBirth: null,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchUserProfile();
    }
  }, [isOpen, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/profile');
      const userData = response.data;
      
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        department: userData.department || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        emergencyContact: userData.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        }
      });
      
      setProfilePicture(userData.profilePicture || '');
    } catch (err) {
      error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put('/api/user/profile', profileData);
      
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      success('Profile updated successfully');
      onDismiss();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        error('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setShowImagePreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      
      const response = await axios.post('/api/user/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfilePicture(response.data.profilePicture);
      setSelectedFile(null);
      setPreviewUrl('');
      setShowImagePreview(false);
      
      const updatedUser = { ...user, profilePicture: response.data.profilePicture };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      success('Profile picture updated successfully');
    } catch (err) {
      error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePicture = async () => {
    try {
      await axios.delete('/api/user/profile/picture');
      setProfilePicture('');
      
      const updatedUser = { ...user, profilePicture: '' };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      success('Profile picture deleted successfully');
    } catch (err) {
      error('Failed to delete profile picture');
    }
  };

  const sectionStyle = mergeStyles({
    padding: '24px',
    background: isDark ? '#2b2b2b' : '#ffffff',
    border: `1px solid ${isDark ? '#404040' : '#e1e1e1'}`,
    borderRadius: '2px',
    marginBottom: '16px'
  });

  const imagePreviewStyle = mergeStyles({
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `3px solid ${isDark ? '#605e5c' : '#d2d0ce'}`,
    margin: '0 auto'
  });

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.large}
      headerText="User Profile"
      styles={{
        main: { background: isDark ? '#1e1e1e' : '#ffffff' }
      }}
    >
      {loading ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '400px' } }}>
          <Spinner size={SpinnerSize.large} />
          <Text styles={{ root: { marginTop: '16px' } }}>Loading profile...</Text>
        </Stack>
      ) : (
        <>
          {/* Header with Profile Picture */}
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#404040' : '#e1e1e1'}` }}>
            <Stack horizontal tokens={{ childrenGap: 20 }} verticalAlign="center">
              <Persona
                imageUrl={profilePicture ? `http://localhost:5000${profilePicture}` : undefined}
                text={profileData.name || 'User'}
                secondaryText={profileData.email}
                tertiaryText={user?.role}
                size={PersonaSize.size72}
              />
              <Stack tokens={{ childrenGap: 8 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <DefaultButton
                  text="Change Photo"
                  iconProps={{ iconName: 'Camera' }}
                  onClick={() => fileInputRef.current?.click()}
                />
                {profilePicture && (
                  <DefaultButton
                    text="Remove Photo"
                    iconProps={{ iconName: 'Delete' }}
                    onClick={handleDeletePicture}
                    styles={{ root: { color: '#d13438' } }}
                  />
                )}
              </Stack>
            </Stack>
          </div>

          {/* Navigation Tabs */}
          <Pivot
            selectedKey={selectedPivot}
            onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
            styles={{
              root: {
                padding: '0 24px',
                background: isDark ? '#2b2b2b' : '#fafafa'
              }
            }}
          >
            <PivotItem headerText="Basic Information" itemKey="basic" />
            <PivotItem headerText="Contact Details" itemKey="contact" />
            <PivotItem headerText="Emergency Contact" itemKey="emergency" />
          </Pivot>

          {/* Content Sections */}
          <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
            {selectedPivot === 'basic' && (
              <div className={sectionStyle}>
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Personal Information
                  </Text>
                  
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <TextField
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e, value) => handleInputChange('name', value)}
                      required
                      styles={{ root: { width: '50%' } }}
                    />
                    <TextField
                      label="Email Address"
                      value={profileData.email}
                      onChange={(e, value) => handleInputChange('email', value)}
                      required
                      styles={{ root: { width: '50%' } }}
                    />
                  </Stack>
                  
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <TextField
                      label="Department"
                      value={profileData.department}
                      onChange={(e, value) => handleInputChange('department', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                    <TextField
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e, value) => handleInputChange('phone', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                  </Stack>
                  
                  <DatePicker
                    label="Date of Birth"
                    value={profileData.dateOfBirth}
                    onSelectDate={(date) => handleInputChange('dateOfBirth', date)}
                    placeholder="Select your date of birth"
                    ariaLabel="Date of birth"
                    firstDayOfWeek={DayOfWeek.Sunday}
                    maxDate={new Date()}
                    minDate={new Date(1920, 0, 1)}
                    showMonthPickerAsOverlay
                    styles={{
                      root: { width: '50%' },
                      textField: {
                        fieldGroup: {
                          border: `1px solid ${isDark ? '#605e5c' : '#d2d0ce'}`,
                          borderRadius: '2px',
                          ':hover': {
                            borderColor: isDark ? '#a19f9d' : '#323130'
                          },
                          ':focus-within': {
                            borderColor: '#0078d4',
                            borderWidth: '2px'
                          }
                        }
                      }
                    }}
                  />
                  
                  <TextField
                    label="Bio"
                    multiline
                    rows={4}
                    value={profileData.bio}
                    onChange={(e, value) => handleInputChange('bio', value)}
                    description="Brief description about yourself (max 500 characters)"
                    maxLength={500}
                  />
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end">
                    <DefaultButton text="Cancel" onClick={onDismiss} />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save Changes'}
                      onClick={handleSave}
                      disabled={loading}
                    />
                  </Stack>
                </Stack>
              </div>
            )}

            {selectedPivot === 'contact' && (
              <div className={sectionStyle}>
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Address Information
                  </Text>
                  
                  <TextField
                    label="Street Address"
                    value={profileData.address.street}
                    onChange={(e, value) => handleInputChange('address.street', value)}
                  />
                  
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <TextField
                      label="City"
                      value={profileData.address.city}
                      onChange={(e, value) => handleInputChange('address.city', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                    <TextField
                      label="State/Province"
                      value={profileData.address.state}
                      onChange={(e, value) => handleInputChange('address.state', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                  </Stack>
                  
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <TextField
                      label="ZIP/Postal Code"
                      value={profileData.address.zipCode}
                      onChange={(e, value) => handleInputChange('address.zipCode', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                    <TextField
                      label="Country"
                      value={profileData.address.country}
                      onChange={(e, value) => handleInputChange('address.country', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                  </Stack>
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end">
                    <DefaultButton text="Cancel" onClick={onDismiss} />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save Changes'}
                      onClick={handleSave}
                      disabled={loading}
                    />
                  </Stack>
                </Stack>
              </div>
            )}

            {selectedPivot === 'emergency' && (
              <div className={sectionStyle}>
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Emergency Contact
                  </Text>
                  
                  <TextField
                    label="Contact Name"
                    value={profileData.emergencyContact.name}
                    onChange={(e, value) => handleInputChange('emergencyContact.name', value)}
                  />
                  
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <TextField
                      label="Phone Number"
                      value={profileData.emergencyContact.phone}
                      onChange={(e, value) => handleInputChange('emergencyContact.phone', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                    <TextField
                      label="Relationship"
                      value={profileData.emergencyContact.relationship}
                      onChange={(e, value) => handleInputChange('emergencyContact.relationship', value)}
                      placeholder="e.g., Parent, Spouse, Sibling"
                      styles={{ root: { width: '50%' } }}
                    />
                  </Stack>
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end">
                    <DefaultButton text="Cancel" onClick={onDismiss} />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save Changes'}
                      onClick={handleSave}
                      disabled={loading}
                    />
                  </Stack>
                </Stack>
              </div>
            )}
          </div>

          {/* Image Preview Modal */}
          <ImagePreview
            isOpen={showImagePreview}
            onDismiss={() => setShowImagePreview(false)}
            imageUrl={previewUrl}
            onSave={handleImageUpload}
          />
        </>
      )}
    </Panel>
  );
};

export default ProfileEdit;