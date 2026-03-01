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

const TermsAndConditions = () => {
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
              Terms and Conditions
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
                1. Acceptance of Terms
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                By accessing and using BookNest Digital Library services, you accept and agree to be bound by the terms and provision of this agreement.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                2. Library Membership
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                Membership is required to access library services. Members must provide accurate information and maintain current contact details.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                3. Borrowing Policies
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                • Books must be returned by the due date to avoid fines<br/>
                • Maximum borrowing limit is 5 books per member<br/>
                • Renewal is subject to availability and no outstanding fines<br/>
                • Lost or damaged items must be reported immediately
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                4. Fines and Penalties
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                Late return fines are $0.50 per day per item. Replacement costs apply for lost or severely damaged materials.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                5. Digital Services
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                Access to digital resources is restricted to registered members. Sharing login credentials is prohibited.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                6. Code of Conduct
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                Members must maintain respectful behavior, keep noise levels appropriate, and follow all library policies and procedures.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                7. Limitation of Liability
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                BookNest Digital Library is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
              </Text>
            </Stack>

            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                8. Changes to Terms
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#e1dfdd' : '#323130', lineHeight: '1.6' } }}>
                We reserve the right to modify these terms at any time. Members will be notified of significant changes.
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
            For questions about these terms, please contact our library administration.
          </Text>
        </Stack>
      </div>
    </div>
  );
};

export default TermsAndConditions;