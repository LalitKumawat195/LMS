import React from 'react';
import {
  Stack,
  Text,
  Link as FluentLink,
  Separator,
  mergeStyles
} from '@fluentui/react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  const footerStyle = mergeStyles({
    background: isDark ? '#252423' : '#f8f9fa',
    borderTop: `1px solid ${isDark ? '#323130' : '#edebe9'}`,
    padding: '24px 32px',
    marginTop: 'auto'
  });

  return (
    <div className={footerStyle}>
      <Stack tokens={{ childrenGap: 16 }}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" wrap>
          <Stack horizontal tokens={{ childrenGap: 24 }} wrap>
            <Link to="/terms" style={{ color: '#0078d4', textDecoration: 'none', fontSize: '14px' }}>
              Terms of Service
            </Link>
            <Link to="/privacy" style={{ color: '#0078d4', textDecoration: 'none', fontSize: '14px' }}>
              Privacy Policy
            </Link>
            <FluentLink href="mailto:support@booknest.library" styles={{ root: { color: '#0078d4', fontSize: '14px' } }}>
              Contact Support
            </FluentLink>
          </Stack>
          <Text styles={{
            root: {
              color: isDark ? '#a19f9d' : '#605e5c',
              fontSize: '14px'
            }
          }}>
            © 2026 BookNest Digital Library. All rights reserved.
          </Text>
        </Stack>
      </Stack>
    </div>
  );
};

export default Footer;