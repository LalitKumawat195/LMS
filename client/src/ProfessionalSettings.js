import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelType,
  Stack,
  Text,
  Toggle,
  Icon,
  mergeStyles,
  FontWeights,
  Dropdown
} from '@fluentui/react';

const ProfessionalSettings = ({ isOpen, onDismiss, isDark, toggleTheme, user }) => {
  const [settings, setSettings] = useState({
    language: 'en',
    timeFormat: '12',
    autoOverdueNotices: true,
    quickCheckout: true,
    fineCollection: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('lms_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('lms_settings', JSON.stringify(newSettings));
  };

  const settingsContainerStyle = mergeStyles({
    background: isDark ? '#1e1e1e' : '#ffffff',
    height: '100%'
  });

  const settingsHeaderStyle = mergeStyles({
    padding: '24px 32px 16px 32px',
    borderBottom: `1px solid ${isDark ? '#323130' : '#e1dfdd'}`,
    background: isDark ? '#252423' : '#faf9f8'
  });

  const settingsGroupStyle = mergeStyles({
    padding: '24px 32px',
    borderBottom: `1px solid ${isDark ? '#323130' : '#f3f2f1'}`
  });

  const settingsItemStyle = mergeStyles({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    minHeight: '48px'
  });

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.medium}
      headerText=""
      hasCloseButton={true}
      styles={{
        main: { background: isDark ? '#1e1e1e' : '#ffffff' },
        header: { display: 'none' },
        content: { padding: 0 }
      }}
    >
      <div className={settingsContainerStyle}>
        <div className={settingsHeaderStyle}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
            <Icon iconName="Settings" styles={{ root: { fontSize: '20px', color: isDark ? '#ffffff' : '#323130' } }} />
            <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
              Settings
            </Text>
          </Stack>
        </div>

        <div className={settingsGroupStyle}>
          <Stack tokens={{ childrenGap: 16 }}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <Icon iconName="Color" styles={{ root: { fontSize: '16px', color: '#0078d4' } }} />
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                Personalization
              </Text>
            </Stack>
            
            <div className={settingsItemStyle}>
              <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1 } }}>
                <Text variant="medium" styles={{ root: { color: isDark ? '#ffffff' : '#323130' } }}>Theme</Text>
                <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                  Dark mode reduces eye strain
                </Text>
              </Stack>
              <Toggle checked={isDark} onChange={toggleTheme} onText="Dark" offText="Light" />
            </div>

            <div className={settingsItemStyle}>
              <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1 } }}>
                <Text variant="medium" styles={{ root: { color: isDark ? '#ffffff' : '#323130' } }}>Language</Text>
              </Stack>
              <Dropdown
                options={[
                  { key: 'en', text: 'English' },
                  { key: 'es', text: 'Spanish' }
                ]}
                selectedKey={settings.language}
                onChange={(_, option) => saveSettings({ ...settings, language: option.key })}
                styles={{ root: { width: 120 } }}
              />
            </div>

            <div className={settingsItemStyle}>
              <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1 } }}>
                <Text variant="medium" styles={{ root: { color: isDark ? '#ffffff' : '#323130' } }}>Time Format</Text>
              </Stack>
              <Dropdown
                options={[
                  { key: '12', text: '12-hour' },
                  { key: '24', text: '24-hour' }
                ]}
                selectedKey={settings.timeFormat}
                onChange={(_, option) => saveSettings({ ...settings, timeFormat: option.key })}
                styles={{ root: { width: 120 } }}
              />
            </div>
          </Stack>
        </div>

        {(user?.role === 'Librarian' || user?.role === 'Admin') && (
          <div className={settingsGroupStyle}>
            <Stack tokens={{ childrenGap: 16 }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon iconName="BookAnswers" styles={{ root: { fontSize: '16px', color: '#0078d4' } }} />
                <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold, color: isDark ? '#ffffff' : '#323130' } }}>
                  Circulation
                </Text>
              </Stack>

              <div className={settingsItemStyle}>
                <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1 } }}>
                  <Text variant="medium" styles={{ root: { color: isDark ? '#ffffff' : '#323130' } }}>Auto-send overdue notices</Text>
                  <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                    Automatically notify members with overdue items
                  </Text>
                </Stack>
                <Toggle
                  checked={settings.autoOverdueNotices}
                  onChange={(_, checked) => saveSettings({ ...settings, autoOverdueNotices: checked })}
                />
              </div>

              <div className={settingsItemStyle}>
                <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1 } }}>
                  <Text variant="medium" styles={{ root: { color: isDark ? '#ffffff' : '#323130' } }}>Quick checkout</Text>
                  <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                    Enable streamlined checkout process
                  </Text>
                </Stack>
                <Toggle
                  checked={settings.quickCheckout}
                  onChange={(_, checked) => saveSettings({ ...settings, quickCheckout: checked })}
                />
              </div>

              <div className={settingsItemStyle}>
                <Stack tokens={{ childrenGap: 4 }} styles={{ root: { flex: 1 } }}>
                  <Text variant="medium" styles={{ root: { color: isDark ? '#ffffff' : '#323130' } }}>Fine collection</Text>
                  <Text variant="small" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                    Enable fine collection during checkout
                  </Text>
                </Stack>
                <Toggle
                  checked={settings.fineCollection}
                  onChange={(_, checked) => saveSettings({ ...settings, fineCollection: checked })}
                />
              </div>
            </Stack>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default ProfessionalSettings;
