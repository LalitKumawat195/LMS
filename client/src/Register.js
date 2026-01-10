import React, { useState } from 'react';
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
  ProgressIndicator,
  mergeStyles,
  Icon,
  DefaultButton,
  Separator,
  Checkbox,
  Dropdown
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'Member',
    department: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const containerStyle = mergeStyles({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDark 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d30 30%, #323130 70%, #1f1f1f 100%)'
      : 'linear-gradient(135deg, #f8f7f4 0%, #faf9f8 30%, #ffffff 70%, #f3f2f1 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDark
        ? 'radial-gradient(circle at 30% 70%, rgba(0, 120, 212, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(16, 110, 190, 0.04) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(0, 90, 158, 0.03) 0%, transparent 70%)'
        : 'radial-gradient(circle at 30% 70%, rgba(0, 120, 212, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(16, 110, 190, 0.02) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(0, 90, 158, 0.02) 0%, transparent 70%)',
      pointerEvents: 'none'
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: '15%',
      left: '15%',
      width: '70%',
      height: '70%',
      background: isDark
        ? 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0, 120, 212, 0.02) 90deg, transparent 180deg, rgba(16, 110, 190, 0.02) 270deg, transparent 360deg)'
        : 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0, 120, 212, 0.01) 90deg, transparent 180deg, rgba(16, 110, 190, 0.01) 270deg, transparent 360deg)',
      borderRadius: '50%',
      pointerEvents: 'none',
      animation: 'rotate 80s linear infinite'
    },
    '@keyframes rotate': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  });

  const cardStyle = mergeStyles({
    background: isDark 
      ? 'linear-gradient(145deg, #323130 0%, #2d2d30 50%, #323130 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #fafafa 50%, #ffffff 100%)',
    border: `1px solid ${isDark ? 'rgba(72, 70, 68, 0.8)' : 'rgba(210, 208, 206, 0.8)'}`,
    borderRadius: '12px',
    padding: '48px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: isDark 
      ? '0 16px 64px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
      : '0 16px 64px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(20px) saturate(180%)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      transform: 'translateY(-4px) scale(1.01)',
      boxShadow: isDark 
        ? '0 20px 80px rgba(0, 0, 0, 0.5), 0 12px 40px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.15)'
        : '0 20px 80px rgba(0, 0, 0, 0.12), 0 12px 40px rgba(0, 0, 0, 0.06), 0 6px 20px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(0, 0, 0, 0.08)'
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
      borderRadius: '12px 12px 0 0'
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: '4px',
      left: '1px',
      right: '1px',
      height: '1px',
      background: isDark 
        ? 'linear-gradient(90deg, rgba(0, 120, 212, 0.3) 0%, rgba(16, 110, 190, 0.3) 50%, rgba(0, 90, 158, 0.3) 100%)'
        : 'linear-gradient(90deg, rgba(0, 120, 212, 0.2) 0%, rgba(16, 110, 190, 0.2) 50%, rgba(0, 90, 158, 0.2) 100%)',
      borderRadius: '0 0 1px 1px'
    }
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    const result = await register(formData.name, formData.email, formData.password, formData.role, formData.department, formData.phone);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.message });
    }
    setLoading(false);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '', percentage: 0 };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^\w\s]/.test(password)) strength++;
    
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const percentage = (strength / 5) * 100;
    return { strength, text: strengthText, percentage };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className={containerStyle}>
      <div className={cardStyle}>
        <Stack tokens={{ childrenGap: 24 }}>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              boxShadow: '0 8px 24px rgba(0, 120, 212, 0.25), 0 4px 12px rgba(0, 120, 212, 0.15)',
              position: 'relative',
              transition: 'all 0.3s ease',
              '::before': {
                content: '""',
                position: 'absolute',
                top: '-3px',
                left: '-3px',
                right: '-3px',
                bottom: '-3px',
                background: 'linear-gradient(135deg, rgba(0, 120, 212, 0.2), rgba(16, 110, 190, 0.15), rgba(0, 90, 158, 0.1))',
                borderRadius: '19px',
                zIndex: -1,
                filter: 'blur(6px)'
              },
              '::after': {
                content: '""',
                position: 'absolute',
                top: '2px',
                left: '2px',
                right: '2px',
                bottom: '2px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)',
                borderRadius: '14px',
                pointerEvents: 'none'
              }
            }}>
              <Icon iconName="AddFriend" styles={{ root: { color: 'white', fontSize: '36px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' } }} />
            </div>
            <Stack tokens={{ childrenGap: 4 }} horizontalAlign="center">
              <Text styles={{ 
                root: { 
                  fontWeight: '700', 
                  fontSize: '26px',
                  background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 70%, #005a9e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.8px',
                  textAlign: 'center',
                  filter: 'drop-shadow(0 1px 2px rgba(0,120,212,0.1))'
                } 
              }}>
                Join Our Community
              </Text>
              <Text styles={{ 
                root: { 
                  fontWeight: '600', 
                  fontSize: '18px',
                  color: isDark ? '#e1dfdd' : '#484644',
                  letterSpacing: '-0.2px',
                  textAlign: 'center'
                } 
              }}>
                Library Management System
              </Text>
            </Stack>
            <Text styles={{ 
              root: { 
                color: isDark ? '#c8c6c4' : '#605e5c',
                fontSize: '15px',
                textAlign: 'center',
                fontWeight: '400',
                lineHeight: '1.4',
                maxWidth: '300px'
              } 
            }}>
              Create your account to start managing library resources and accessing our comprehensive digital catalog.
            </Text>
          </Stack>

          {errors.submit && (
            <MessageBar messageBarType={MessageBarType.error}>
              {errors.submit}
            </MessageBar>
          )}

          <Stack tokens={{ childrenGap: 16 }}>
            <TextField
              label="Full name"
              value={formData.name}
              onChange={(_, value) => setFormData({ ...formData, name: value || '' })}
              errorMessage={errors.name}
              required
              iconProps={{ iconName: 'Contact' }}
              styles={{
                fieldGroup: { 
                  borderRadius: '2px',
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px',
                  ':focus-within': {
                    borderColor: '#0078d4'
                  }
                },
                field: {
                  fontSize: '14px',
                  color: isDark ? '#ffffff' : '#323130'
                },
                icon: {
                  color: isDark ? '#a19f9d' : '#605e5c'
                }
              }}
            />
            
            <TextField
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(_, value) => setFormData({ ...formData, email: value || '' })}
              errorMessage={errors.email}
              required
              iconProps={{ iconName: 'Mail' }}
              styles={{
                fieldGroup: { 
                  borderRadius: '2px',
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px',
                  ':focus-within': {
                    borderColor: '#0078d4'
                  }
                },
                field: {
                  fontSize: '14px',
                  color: isDark ? '#ffffff' : '#323130'
                },
                icon: {
                  color: isDark ? '#a19f9d' : '#605e5c'
                }
              }}
            />

            <Dropdown
              label="Role"
              selectedKey={formData.role}
              onChange={(_, option) => setFormData({ ...formData, role: option?.key || 'Member' })}
              options={[
                { key: 'Member', text: 'Library Member' },
                { key: 'Librarian', text: 'Librarian' },
                { key: 'Admin', text: 'Administrator' }
              ]}
              styles={{
                dropdown: {
                  borderRadius: '2px',
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px'
                }
              }}
            />

            {formData.role === 'Member' && (
              <TextField
                label="Department (Optional)"
                value={formData.department}
                onChange={(_, value) => setFormData({ ...formData, department: value || '' })}
                iconProps={{ iconName: 'BuildingClassic' }}
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
                  },
                  icon: {
                    color: isDark ? '#a19f9d' : '#605e5c'
                  }
                }}
              />
            )}

            <TextField
              label="Phone (Optional)"
              value={formData.phone}
              onChange={(_, value) => setFormData({ ...formData, phone: value || '' })}
              iconProps={{ iconName: 'Phone' }}
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
                },
                icon: {
                  color: isDark ? '#a19f9d' : '#605e5c'
                }
              }}
            />
            
            <Stack tokens={{ childrenGap: 8 }}>
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(_, value) => setFormData({ ...formData, password: value || '' })}
                errorMessage={errors.password}
                required
                canRevealPassword
                iconProps={{ iconName: 'Lock' }}
                styles={{
                  fieldGroup: { 
                    borderRadius: '2px',
                    border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                    background: isDark ? '#3b3a39' : '#ffffff',
                    height: '32px',
                    ':focus-within': {
                      borderColor: '#0078d4'
                    }
                  },
                  field: {
                    fontSize: '14px',
                    color: isDark ? '#ffffff' : '#323130'
                  },
                  icon: {
                    color: isDark ? '#a19f9d' : '#605e5c'
                  }
                }}
              />
              
              {formData.password && (
                <Stack tokens={{ childrenGap: 4 }}>
                  <ProgressIndicator 
                    percentComplete={passwordStrength.percentage / 100}
                    styles={{
                      root: {
                        marginTop: '4px'
                      },
                      progressBar: {
                        background: passwordStrength.strength <= 2 
                          ? 'linear-gradient(90deg, #d13438, #a4262c)' 
                          : passwordStrength.strength <= 3 
                          ? 'linear-gradient(90deg, #ff8c00, #e67700)' 
                          : 'linear-gradient(90deg, #107c10, #0b5394)',
                        height: '4px',
                        borderRadius: '2px'
                      },
                      progressTrack: {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        height: '4px',
                        borderRadius: '2px'
                      }
                    }}
                  />
                  <Text styles={{ 
                    root: { 
                      color: isDark ? '#a19f9d' : '#605e5c', 
                      fontSize: '12px' 
                    } 
                  }}>
                    Password strength: {passwordStrength.text}
                  </Text>
                </Stack>
              )}
            </Stack>
            
            <TextField
              label="Confirm password"
              type="password"
              value={formData.confirmPassword}
              onChange={(_, value) => setFormData({ ...formData, confirmPassword: value || '' })}
              errorMessage={errors.confirmPassword}
              required
              canRevealPassword
              iconProps={{ iconName: 'Lock' }}
              styles={{
                fieldGroup: { 
                  borderRadius: '2px',
                  border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
                  background: isDark ? '#3b3a39' : '#ffffff',
                  height: '32px',
                  ':focus-within': {
                    borderColor: '#0078d4'
                  }
                },
                field: {
                  fontSize: '14px',
                  color: isDark ? '#ffffff' : '#323130'
                },
                icon: {
                  color: isDark ? '#a19f9d' : '#605e5c'
                }
              }}
            />

            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy"
              checked={acceptTerms}
              onChange={(_, checked) => setAcceptTerms(checked || false)}
              styles={{
                text: { 
                  fontSize: '14px', 
                  color: isDark ? '#c8c6c4' : '#605e5c' 
                }
              }}
            />
            {errors.terms && (
              <Text styles={{ root: { color: '#d13438', fontSize: '12px' } }}>
                {errors.terms}
              </Text>
            )}
          </Stack>

          <Stack tokens={{ childrenGap: 12 }}>
            <PrimaryButton
              text={loading ? undefined : "Create account"}
              onClick={handleSubmit}
              disabled={loading || !acceptTerms}
              styles={{
                root: {
                  height: '44px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.25), 0 2px 6px rgba(0, 120, 212, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  ':hover': {
                    background: 'linear-gradient(135deg, #106ebe 0%, #005a9e 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(0, 120, 212, 0.2), 0 3px 8px rgba(0, 120, 212, 0.1)'
                  },
                  ':active': {
                    transform: 'translateY(0)'
                  },
                  ':disabled': {
                    background: isDark ? '#484644' : '#d2d0ce',
                    transform: 'none',
                    boxShadow: 'none'
                  },
                  '::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    transition: 'left 0.5s ease'
                  },
                  ':hover::before': {
                    left: '100%'
                  }
                }
              }}
            >
              {loading && (
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  <Spinner size={SpinnerSize.small} />
                  <Text>Creating account...</Text>
                </Stack>
              )}
            </PrimaryButton>

            <Separator styles={{ root: { margin: '8px 0' } }}>or</Separator>

            <DefaultButton
              text="Sign in to existing account"
              onClick={() => navigate('/login')}
              iconProps={{ iconName: 'Signin' }}
              styles={{
                root: {
                  height: '44px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  border: `1px solid ${isDark ? 'rgba(72, 70, 68, 0.6)' : 'rgba(210, 208, 206, 0.6)'}`,
                  background: isDark 
                    ? 'linear-gradient(145deg, rgba(50, 49, 48, 0.3), rgba(45, 45, 48, 0.3))' 
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(250, 249, 248, 0.8))',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    borderColor: 'rgba(0, 120, 212, 0.4)',
                    background: isDark 
                      ? 'linear-gradient(145deg, rgba(0, 120, 212, 0.08), rgba(16, 110, 190, 0.05))' 
                      : 'linear-gradient(145deg, rgba(0, 120, 212, 0.03), rgba(16, 110, 190, 0.02))',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 120, 212, 0.1)'
                  }
                }
              }}
            />
          </Stack>

          <Stack horizontalAlign="center" tokens={{ childrenGap: 8 }}>
            <Text styles={{ 
              root: { 
                color: isDark ? '#a19f9d' : '#605e5c',
                fontSize: '12px',
                textAlign: 'center'
              } 
            }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default Register;