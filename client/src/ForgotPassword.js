import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  DefaultButton,
  Checkbox
} from '@fluentui/react';
import { useTheme } from './ThemeContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Generate simple math captcha
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaAnswer(num1 + num2);
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
  }, []);

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

  const handleSubmit = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!captcha || parseInt(captcha) !== captchaAnswer) {
      setError('Please solve the captcha correctly');
      return;
    }

    if (!consent) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to password reset with email
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.message || 'Email not found');
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
              Verify your email and complete captcha to reset your password.
            </Text>
          </Stack>

          {error && (
            <MessageBar messageBarType={MessageBarType.error}>
              {error}
            </MessageBar>
          )}

          {message && (
            <MessageBar messageBarType={MessageBarType.success}>
              {message}
            </MessageBar>
          )}

          <Stack tokens={{ childrenGap: 16 }}>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(_, value) => setEmail(value || '')}
              required
              iconProps={{ iconName: 'Mail' }}
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

            <Stack tokens={{ childrenGap: 8 }}>
              <Text variant="medium" styles={{ root: { fontWeight: '600' } }}>
                Solve this captcha: {captchaQuestion}
              </Text>
              <TextField
                placeholder="Enter answer"
                value={captcha}
                onChange={(_, value) => setCaptcha(value || '')}
                required
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
            </Stack>

            <Checkbox
              label="I agree that I am the rightful owner of this account and consent to reset my password"
              checked={consent}
              onChange={(_, checked) => setConsent(checked || false)}
              required
              styles={{
                text: { 
                  fontSize: '14px', 
                  color: isDark ? '#c8c6c4' : '#605e5c' 
                }
              }}
            />
          </Stack>

          <Stack tokens={{ childrenGap: 12 }}>
            <PrimaryButton
              text={loading ? undefined : "Verify Email"}
              onClick={handleSubmit}
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
                  <Text>Verifying...</Text>
                </Stack>
              )}
            </PrimaryButton>

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
        </Stack>
      </div>
    </div>
  );
};

export default ForgotPassword;