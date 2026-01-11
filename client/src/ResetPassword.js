import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Stack,
  TextField,
  PrimaryButton,
  Text,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  mergeStyles,
  DefaultButton
} from '@fluentui/react';
import { useTheme } from './ThemeContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const containerStyle = mergeStyles({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDark 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d30 30%, #323130 70%, #1f1f1f 100%)'
      : 'linear-gradient(135deg, #f8f7f4 0%, #faf9f8 30%, #ffffff 70%, #f3f2f1 100%)',
    padding: '20px'
  });

  const cardStyle = mergeStyles({
    background: isDark 
      ? 'linear-gradient(145deg, #323130 0%, #2d2d30 50%, #323130 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #fafafa 50%, #ffffff 100%)',
    border: `1px solid ${isDark ? 'rgba(72, 70, 68, 0.8)' : 'rgba(210, 208, 206, 0.8)'}`,
    borderRadius: '12px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: isDark 
      ? '0 16px 64px rgba(0, 0, 0, 0.4)'
      : '0 16px 64px rgba(0, 0, 0, 0.08)',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
      borderRadius: '12px 12px 0 0'
    }
  });

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login', { 
          state: { message: 'Password reset successfully. Please login with your new password.' }
        });
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={containerStyle}>
      <div className={cardStyle} style={{ position: 'relative' }}>
        <Stack tokens={{ childrenGap: 24 }}>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
              <img 
                src="http://localhost:5000/uploads/profiles/BookNest Digital Library-logo.png"
                alt="BookNest Digital Library"
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
              <Stack tokens={{ childrenGap: 4 }}>
                <Text styles={{ 
                  root: { 
                    fontWeight: '700', 
                    fontSize: '24px',
                    background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 70%, #005a9e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  } 
                }}>
                  BookNest
                </Text>
                <Text styles={{ 
                  root: { 
                    fontWeight: '600', 
                    fontSize: '16px',
                    color: isDark ? '#e1dfdd' : '#484644'
                  } 
                }}>
                  Digital Library
                </Text>
              </Stack>
            </Stack>
            <Text styles={{ 
              root: { 
                color: isDark ? '#c8c6c4' : '#605e5c',
                fontSize: '15px',
                textAlign: 'center',
                fontWeight: '400',
                maxWidth: '280px'
              } 
            }}>
              Enter your new password to complete the reset process
            </Text>
          </Stack>

          {error && (
            <MessageBar messageBarType={MessageBarType.error}>
              {error}
            </MessageBar>
          )}

          <Stack tokens={{ childrenGap: 16 }}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(_, value) => setNewPassword(value || '')}
              required
              canRevealPassword
              styles={{
                fieldGroup: { 
                  borderRadius: '2px',
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px'
                },
                field: {
                  fontSize: '14px',
                  color: isDark ? '#ffffff' : '#323130'
                }
              }}
            />

            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(_, value) => setConfirmPassword(value || '')}
              required
              canRevealPassword
              styles={{
                fieldGroup: { 
                  borderRadius: '2px',
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px'
                },
                field: {
                  fontSize: '14px',
                  color: isDark ? '#ffffff' : '#323130'
                }
              }}
            />

            <PrimaryButton
              text={loading ? undefined : "Reset Password"}
              onClick={handleResetPassword}
              disabled={loading}
              styles={{
                root: {
                  height: '44px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)'
                }
              }}
            >
              {loading && (
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  <Spinner size={SpinnerSize.small} />
                  <Text>Resetting...</Text>
                </Stack>
              )}
            </PrimaryButton>
          </Stack>

          <DefaultButton
            text="Back to Sign In"
            onClick={() => navigate('/login')}
            iconProps={{ iconName: 'Back' }}
            styles={{
              root: {
                height: '44px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                border: `1px solid ${isDark ? 'rgba(72, 70, 68, 0.6)' : 'rgba(210, 208, 206, 0.6)'}`
              }
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default ResetPassword;