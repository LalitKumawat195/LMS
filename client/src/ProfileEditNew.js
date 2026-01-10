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
  Pivot,
  PivotItem,
  PersonaSize,
  Persona
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';
import axios from 'axios';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

const ProfileEdit = ({ isOpen, onDismiss }) => {
  const { user, setUser } = useAuth();
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  
  const [loading, setLoading] = useState(false);
  const [selectedPivot, setSelectedPivot] = useState('basic');
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

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

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
      
      if (setUser) {
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      success('Profile updated successfully');
    } catch (err) {
      error('Failed to update profile');
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

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.large}
      headerText="User Profile"
      styles={{
        main: {
          background: isDark ? '#1e1e1e' : '#ffffff'
        }
      }}
    >
      {loading ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '400px' } }}>
          <Spinner size={SpinnerSize.large} />
          <Text styles={{ root: { marginTop: '16px' } }}>Loading profile...</Text>
        </Stack>
      ) : (
        <>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#404040' : '#e1e1e1'}` }}>
            <Persona
              text={profileData.name || 'User'}
              secondaryText={profileData.email}
              tertiaryText={user?.role}
              size={PersonaSize.size72}
            />
          </div>

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
                      styles={{ root: { width: '50%' } }}
                    />
                    <TextField
                      label="Email Address"
                      value={profileData.email}
                      onChange={(e, value) => handleInputChange('email', value)}
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
                    styles={{ root: { width: '50%' } }}
                  />
                  
                  <TextField
                    label="Bio"
                    multiline
                    rows={4}
                    value={profileData.bio}
                    onChange={(e, value) => handleInputChange('bio', value)}
                    maxLength={500}
                  />
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end">
                    <DefaultButton text="Cancel" onClick={onDismiss} />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save changes'}
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
                      label="State"
                      value={profileData.address.state}
                      onChange={(e, value) => handleInputChange('address.state', value)}
                      styles={{ root: { width: '50%' } }}
                    />
                  </Stack>
                  
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <TextField
                      label="ZIP Code"
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
                      text={loading ? 'Saving...' : 'Save changes'}
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
                      styles={{ root: { width: '50%' } }}
                    />
                  </Stack>
                  
                  <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end">
                    <DefaultButton text="Cancel" onClick={onDismiss} />
                    <PrimaryButton
                      text={loading ? 'Saving...' : 'Save changes'}
                      onClick={handleSave}
                      disabled={loading}
                    />
                  </Stack>
                </Stack>
              </div>
            )}
          </div>
        </>
      )}
    </Panel>
  );
};

export default ProfileEdit;