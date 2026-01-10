import React, { useState, useEffect } from 'react';
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
  DatePicker,
  mergeStyles,
  FontWeights,
  Icon,
  Separator,
  Pivot,
  PivotItem,
  PersonaSize,
  Persona
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import ProfilePicturePreview from './ProfilePicturePreview';
import axios from 'axios';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

const ProfileEdit = ({ isOpen, onDismiss }) => {
  const { user, setUser } = useAuth();
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPivot, setSelectedPivot] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchUserProfile();
    }
  }, [isOpen, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile...');
      const response = await axios.get('/api/user/profile');
      console.log('Profile response:', response.data);
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
      console.error('Fetch error:', err);
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
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = async (croppedBlob) => {
    console.log('Upload called with blob:', croppedBlob);
    
    // Temporarily disabled - just show success message
    success('Profile picture upload temporarily disabled');
    setShowPreview(false);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleDeleteProfilePicture = async () => {
    try {
      await axios.delete('/api/user/profile/picture');
      setProfilePicture('');
      success('Profile picture deleted successfully');
    } catch (err) {
      error('Failed to delete profile picture');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Saving profile data:', profileData);
      
      const response = await axios.put('/api/user/profile', profileData);
      console.log('Save response:', response.data);
      
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      success('Profile updated successfully');
    } catch (err) {
      console.error('Save error:', err);
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = mergeStyles({
    padding: '24px',
    background: isDark ? '#2b2b2b' : '#ffffff',
    border: `1px solid ${isDark ? '#404040' : '#e1e1e1'}`,
    borderRadius: '2px',
    marginBottom: '16px'
  });

  const headerStyle = mergeStyles({
    padding: '20px 24px',
    borderBottom: `1px solid ${isDark ? '#404040' : '#e1e1e1'}`,
    background: isDark ? '#323130' : '#f8f8f8'
  });

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.large}
      headerText="User Profile"
      styles={{
        main: {
          background: isDark ? '#1e1e1e' : '#ffffff'
        },
        header: {
          borderBottom: `1px solid ${isDark ? '#404040' : '#e1e1e1'}`,
          background: isDark ? '#323130' : '#f8f8f8'
        },
        content: {
          padding: 0
        }
      }}
    >
      {loading ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '400px' } }}>
          <Spinner size={SpinnerSize.large} />
          <Text styles={{ root: { marginTop: '16px', color: isDark ? '#ffffff' : '#323130' } }}>Loading profile...</Text>
        </Stack>
      ) : (
        <>
          <div className={headerStyle}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
                <Persona
                  imageUrl={previewUrl || (profilePicture ? `http://localhost:5000${profilePicture}` : undefined)}
                  text={profileData.name || user?.name || 'User'}
                  secondaryText={profileData.email || user?.email}
                  tertiaryText={user?.role}
                  size={PersonaSize.size72}
                  styles={{
                    root: {
                      '.ms-Persona-primaryText': {
                        color: isDark ? '#ffffff' : '#323130',
                        fontWeight: FontWeights.semibold
                      },
                      '.ms-Persona-secondaryText': {
                        color: isDark ? '#c8c6c4' : '#605e5c'
                      },
                      '.ms-Persona-tertiaryText': {
                        color: '#0078d4',
                        fontWeight: FontWeights.semibold
                      }
                    }
                  }}
                />
                <Stack tokens={{ childrenGap: 4 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="profile-picture-input"
                  />
                  <DefaultButton
                    text="Change photo"
                    iconProps={{ iconName: 'Camera' }}
                    onClick={() => document.getElementById('profile-picture-input').click()}
                    styles={{ root: { minWidth: '120px' } }}
                  />
                  {profilePicture && (
                    <DefaultButton
                      text="Remove"
                      iconProps={{ iconName: 'Delete' }}
                      onClick={handleDeleteProfilePicture}
                      styles={{ root: { minWidth: '120px', color: '#a4262c' } }}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
          </div>

          <Pivot
            selectedKey={selectedPivot}
            onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
            styles={{
              root: {
                padding: '0 24px',
                background: isDark ? '#2b2b2b' : '#fafafa',
                borderBottom: `1px solid ${isDark ? '#404040' : '#e1e1e1'}`
              }
            }}
          >
            <PivotItem headerText="Basic Information" itemKey="basic" />
            <PivotItem headerText="Contact Details" itemKey="contact" />
            <PivotItem headerText="Emergency Contact" itemKey="emergency" />
          </Pivot>

          <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
            {selectedPivot === 'basic' && (
              <div className={sectionStyle}>
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
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
                    formatDate={(date) => date ? date.toLocaleDateString() : ''}
                    styles={{ root: { width: '50%' } }}
                  />
                  
                  <TextField
                    label="Bio"
                    multiline
                    rows={4}
                    value={profileData.bio}
                    onChange={(e, value) => handleInputChange('bio', value)}
                    description="Brief description about yourself (maximum 500 characters)"
                    maxLength={500}
                  />
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end" styles={{ root: { marginTop: '24px' } }}>
                    <DefaultButton 
                      text="Cancel" 
                      onClick={onDismiss}
                      styles={{ root: { minWidth: '100px' } }}
                    />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save changes'}
                      onClick={handleSave}
                      disabled={loading || !profileData.name || !profileData.email}
                      styles={{ root: { minWidth: '120px' } }}
                    />
                  </Stack>
                </Stack>
              </div>
            )}

            {selectedPivot === 'contact' && (
              <div className={sectionStyle}>
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
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
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end" styles={{ root: { marginTop: '24px' } }}>
                    <DefaultButton 
                      text="Cancel" 
                      onClick={onDismiss}
                      styles={{ root: { minWidth: '100px' } }}
                    />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save changes'}
                      onClick={handleSave}
                      disabled={loading || !profileData.name || !profileData.email}
                      styles={{ root: { minWidth: '120px' } }}
                    />
                  </Stack>
                </Stack>
              </div>
            )}

            {selectedPivot === 'emergency' && (
              <div className={sectionStyle}>
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
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
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end" styles={{ root: { marginTop: '24px' } }}>
                    <DefaultButton 
                      text="Cancel" 
                      onClick={onDismiss}
                      styles={{ root: { minWidth: '100px' } }}
                    />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save changes'}
                      onClick={handleSave}
                      disabled={loading || !profileData.name || !profileData.email}
                      styles={{ root: { minWidth: '120px' } }}
                    />
                  </Stack>
                </Stack>
              </div>
            )}
          </div>

          <ProfilePicturePreview
            isOpen={showPreview}
            onDismiss={() => setShowPreview(false)}
            imageUrl={previewUrl}
            onSave={handleProfilePictureUpload}
          />

          <Separator />
          
          <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end" styles={{ root: { padding: '16px 24px' } }}>
            <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c', marginRight: 'auto' } }}>
              Changes are saved automatically when you click Save changes in each section
            </Text>
          </Stack>
        </>
      )}
    </Panel>
  );
};

export default ProfileEdit;