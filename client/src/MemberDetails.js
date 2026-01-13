import React from 'react';
import {
  Stack,
  Text,
  Persona,
  PersonaSize,
  Icon,
  mergeStyles
} from '@fluentui/react';
import { useTheme } from './ThemeContext';

const MemberDetails = ({ member }) => {
  const { isDark } = useTheme();

  const cardStyle = mergeStyles({
    padding: '24px',
    background: isDark ? '#323130' : '#ffffff',
    border: `1px solid ${isDark ? '#484644' : '#e1dfdd'}`,
    borderRadius: '8px',
    maxWidth: '400px'
  });

  const detailRowStyle = mergeStyles({
    padding: '12px 0',
    borderBottom: `1px solid ${isDark ? '#484644' : '#f3f2f1'}`,
    ':last-child': {
      borderBottom: 'none'
    }
  });

  const statusStyle = mergeStyles({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    background: member?.status === 'Active' ? '#dff6dd' : '#fde7e9',
    color: member?.status === 'Active' ? '#107c10' : '#d13438'
  });

  if (!member) return null;

  return (
    <div className={cardStyle}>
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
          <Persona
            text={member.name}
            size={PersonaSize.size72}
            imageUrl={member.profilePicture ? `http://localhost:5000${member.profilePicture}` : undefined}
          />
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontSize: '20px', fontWeight: '600', color: isDark ? '#ffffff' : '#323130' } }}>
              {member.name}
            </Text>
            <Text styles={{ root: { fontSize: '14px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
              {member.email}
            </Text>
          </Stack>
        </Stack>

        <Stack tokens={{ childrenGap: 0 }}>
          <div className={detailRowStyle}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon iconName="ContactCard" styles={{ root: { color: isDark ? '#a19f9d' : '#605e5c' } }} />
                <Text styles={{ root: { fontSize: '14px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                  Member ID
                </Text>
              </Stack>
              <Text styles={{ root: { fontSize: '14px', fontWeight: '600', color: isDark ? '#ffffff' : '#323130' } }}>
                {member.memberId}
              </Text>
            </Stack>
          </div>

          <div className={detailRowStyle}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon iconName="OfficeLogo" styles={{ root: { color: isDark ? '#a19f9d' : '#605e5c' } }} />
                <Text styles={{ root: { fontSize: '14px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                  Department
                </Text>
              </Stack>
              <Text styles={{ root: { fontSize: '14px', fontWeight: '600', color: isDark ? '#ffffff' : '#323130' } }}>
                {member.department || 'Not specified'}
              </Text>
            </Stack>
          </div>

          <div className={detailRowStyle}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon iconName="Phone" styles={{ root: { color: isDark ? '#a19f9d' : '#605e5c' } }} />
                <Text styles={{ root: { fontSize: '14px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                  Phone
                </Text>
              </Stack>
              <Text styles={{ root: { fontSize: '14px', fontWeight: '600', color: isDark ? '#ffffff' : '#323130' } }}>
                {member.phone || 'Not provided'}
              </Text>
            </Stack>
          </div>

          <div className={detailRowStyle}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon iconName="StatusCircleCheckmark" styles={{ root: { color: isDark ? '#a19f9d' : '#605e5c' } }} />
                <Text styles={{ root: { fontSize: '14px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                  Status
                </Text>
              </Stack>
              <div className={statusStyle}>
                <Icon 
                  iconName={member.status === 'Active' ? 'CheckMark' : 'StatusErrorFull'} 
                  styles={{ root: { fontSize: '10px', marginRight: '4px' } }}
                />
                {member.status}
              </div>
            </Stack>
          </div>

          <div className={detailRowStyle}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon iconName="Calendar" styles={{ root: { color: isDark ? '#a19f9d' : '#605e5c' } }} />
                <Text styles={{ root: { fontSize: '14px', color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                  Created
                </Text>
              </Stack>
              <Text styles={{ root: { fontSize: '14px', fontWeight: '600', color: isDark ? '#ffffff' : '#323130' } }}>
                {new Date(member.createdAt).toLocaleDateString()}
              </Text>
            </Stack>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default MemberDetails;