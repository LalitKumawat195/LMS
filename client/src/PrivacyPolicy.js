import React from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  Separator,
  mergeStyles,
  FontWeights
} from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const containerStyle = mergeStyles({
    minHeight: '100vh',
    background: isDark ? '#1e1e1e' : '#ffffff',
    padding: '40px 20px',
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif'
  });

  const contentStyle = mergeStyles({
    maxWidth: '800px',
    margin: '0 auto',
    background: isDark ? '#252423' : '#fafafa',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)'
  });

  return (
    <div className={containerStyle}>
      <div className={contentStyle}>
        <Stack tokens={{ childrenGap: 24 }}>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold, color: isDark ? '#ffffff' : '#323130' } }}>
              Privacy Policy
            </Text>
            <DefaultButton text="Back" onClick={() => navigate(-1)} />
          </Stack>
          
          <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
            Last updated: February 2026
          </Text>

          <Separator />

          <Stack tokens={{ childrenGap: 20 }}>
            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                1. Information We Collect
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We collect personal information including name, email address, phone number, and library usage data to provide our services effectively.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                2. How We Use Your Information
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                Your information is used to:<br/>
                • Manage your library account and borrowing history<br/>
                • Send notifications about due dates and reservations<br/>
                • Improve our services and user experience<br/>
                • Comply with legal requirements
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                3. Information Sharing
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We do not sell, trade, or share your personal information with third parties except as required by law or with your explicit consent.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                4. Data Security
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                5. Cookies and Tracking
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We use cookies to enhance your browsing experience and analyze website usage. You can disable cookies in your browser settings.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                6. Your Rights
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                You have the right to:<br/>
                • Access your personal information<br/>
                • Request corrections to inaccurate data<br/>
                • Request deletion of your account<br/>
                • Opt-out of non-essential communications
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                7. Data Retention
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                8. Children's Privacy
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We do not knowingly collect personal information from children under 13. Parent or guardian consent is required for minors.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                9. Policy Changes
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We may update this privacy policy periodically. Significant changes will be communicated through email or website notifications.
              </Text>
            </Stack>
          </Stack>

          <Separator />

          <Stack tokens={{ childrenGap: 12 }} styles={{ root: { background: isDark ? '#323130' : '#f3f2f1', padding: '20px', borderRadius: '4px', border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}` } }}>
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
              About This Project
            </Text>
            <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
              This Library Automation and Book Tracking System is developed by students of <strong>SM Shetty College, Powai</strong> as a Field Project for Mumbai University.
            </Text>
            <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6', fontWeight: FontWeights.semibold } }}>
              Development Team (Second Year BSc IT):
            </Text>
            <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.8', paddingLeft: '20px' } }}>
              1. Lalit Kumawat<br/>
              2. Menka Rajak<br/>
              3. Nikhil Kunder<br/>
              4. Pratiksha Lad
            </Text>
          </Stack>

          <Separator />

          <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c', textAlign: 'center' } }}>
            For privacy-related questions, contact us at privacy@booknest.library
          </Text>
        </Stack>
      </div>
    </div>
  );
};

export default PrivacyPolicy;