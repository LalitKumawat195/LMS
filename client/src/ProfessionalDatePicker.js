import React, { useState, useRef } from 'react';
import {
  Stack,
  Text,
  IconButton,
  Callout,
  Calendar,
  mergeStyles,
  FontWeights,
  DirectionalHint,
  FocusTrapZone,
  getTheme
} from '@fluentui/react';
import { useTheme } from './ThemeContext';

const ProfessionalDatePicker = ({ label, value, onSelectDate, required = false }) => {
  const { isDark } = useTheme();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const buttonRef = useRef(null);
  const theme = getTheme();

  const containerStyle = mergeStyles({
    position: 'relative',
    width: '100%'
  });

  const fieldStyle = mergeStyles({
    position: 'relative',
    border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
    borderRadius: '2px',
    background: theme.palette.white,
    padding: '12px 16px',
    cursor: 'pointer',
    minHeight: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'inset 0 0 0 1px transparent',
    ':hover': {
      borderColor: theme.palette.neutralSecondary,
      boxShadow: `inset 0 0 0 1px ${theme.palette.neutralSecondary}`
    },
    ':focus-within': {
      borderColor: theme.palette.themePrimary,
      boxShadow: `inset 0 0 0 2px ${theme.palette.themePrimary}`
    },
    selectors: {
      '&.is-open': {
        borderColor: theme.palette.themePrimary,
        boxShadow: `inset 0 0 0 2px ${theme.palette.themePrimary}`
      }
    }
  });

  const labelStyle = mergeStyles({
    fontSize: '14px',
    fontWeight: FontWeights.semibold,
    color: theme.palette.neutralPrimary,
    marginBottom: '8px',
    display: 'block',
    fontFamily: theme.fonts.medium.fontFamily
  });

  const valueStyle = mergeStyles({
    fontSize: '14px',
    fontFamily: theme.fonts.medium.fontFamily,
    color: value ? theme.palette.neutralPrimary : theme.palette.neutralSecondary,
    flex: 1,
    textAlign: 'left'
  });

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date) => {
    onSelectDate(date);
    setIsCalendarVisible(false);
  };

  const handleClearDate = (e) => {
    e.stopPropagation();
    onSelectDate(null);
  };

  return (
    <div className={containerStyle}>
      <Text className={labelStyle}>
        {label}
        {required && <span style={{ color: theme.palette.red, marginLeft: '4px' }}>*</span>}
      </Text>
      
      <div
        ref={buttonRef}
        className={`${fieldStyle} ${isCalendarVisible ? 'is-open' : ''}`}
        onClick={() => setIsCalendarVisible(!isCalendarVisible)}
        role="button"
        tabIndex={0}
        aria-expanded={isCalendarVisible}
        aria-haspopup="dialog"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsCalendarVisible(!isCalendarVisible);
          }
        }}
      >
        <span className={valueStyle}>
          {value ? formatDate(value) : 'Select date'}
        </span>
        
        <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
          {value && (
            <IconButton
              iconProps={{ iconName: 'Clear' }}
              onClick={handleClearDate}
              styles={{
                root: {
                  width: '24px',
                  height: '24px',
                  color: theme.palette.neutralSecondary,
                  ':hover': {
                    backgroundColor: theme.palette.neutralLighter,
                    color: theme.palette.neutralPrimary
                  }
                },
                icon: { fontSize: '12px' }
              }}
              title="Clear date"
            />
          )}
          <IconButton
            iconProps={{ iconName: 'Calendar' }}
            styles={{
              root: {
                width: '24px',
                height: '24px',
                color: theme.palette.neutralSecondary,
                ':hover': {
                  backgroundColor: theme.palette.neutralLighter,
                  color: theme.palette.themePrimary
                }
              },
              icon: { fontSize: '16px' }
            }}
          />
        </Stack>
      </div>

      {isCalendarVisible && (
        <Callout
          target={buttonRef}
          onDismiss={() => setIsCalendarVisible(false)}
          directionalHint={DirectionalHint.bottomLeftEdge}
          isBeakVisible={true}
          beakWidth={16}
          gapSpace={8}
          styles={{
            calloutMain: {
              background: theme.palette.white,
              border: `1px solid ${theme.palette.neutralLight}`,
              borderRadius: '2px',
              boxShadow: theme.effects.elevation16,
              padding: '20px',
              minWidth: '320px'
            },
            beak: {
              backgroundColor: theme.palette.white,
              border: `1px solid ${theme.palette.neutralLight}`
            }
          }}
        >
          <FocusTrapZone>
            <Stack tokens={{ childrenGap: 16 }}>
              <Text 
                variant="mediumPlus" 
                styles={{ 
                  root: { 
                    fontWeight: FontWeights.semibold,
                    color: theme.palette.neutralPrimary,
                    textAlign: 'center',
                    fontFamily: theme.fonts.mediumPlus.fontFamily
                  } 
                }}
              >
                Select Date
              </Text>
              
              <Calendar
                value={value || new Date()}
                onSelectDate={handleDateSelect}
                showGoToToday={true}
                today={new Date()}
                highlightCurrentMonth={true}
                highlightSelectedMonth={true}
                showWeekNumbers={false}
                firstDayOfWeek={0}
                strings={{
                  months: [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ],
                  shortMonths: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                  ],
                  days: [
                    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
                    'Thursday', 'Friday', 'Saturday'
                  ],
                  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                  goToToday: 'Today'
                }}
                styles={{
                  root: {
                    backgroundColor: theme.palette.white,
                    color: theme.palette.neutralPrimary,
                    fontFamily: theme.fonts.medium.fontFamily
                  },
                  dayPicker: {
                    backgroundColor: theme.palette.white
                  },
                  headerToggleView: {
                    color: theme.palette.neutralPrimary,
                    fontSize: '16px',
                    fontWeight: FontWeights.semibold,
                    fontFamily: theme.fonts.mediumPlus.fontFamily,
                    ':hover': {
                      backgroundColor: theme.palette.neutralLighter,
                      color: theme.palette.themePrimary
                    }
                  },
                  monthAndYear: {
                    color: theme.palette.neutralPrimary,
                    fontSize: '16px',
                    fontWeight: FontWeights.semibold,
                    fontFamily: theme.fonts.mediumPlus.fontFamily
                  },
                  dayButton: {
                    width: '40px',
                    height: '40px',
                    borderRadius: '2px',
                    fontSize: '14px',
                    fontWeight: FontWeights.regular,
                    fontFamily: theme.fonts.medium.fontFamily,
                    color: theme.palette.neutralPrimary,
                    border: 'none',
                    ':hover': {
                      backgroundColor: theme.palette.neutralLighter,
                      color: theme.palette.themePrimary,
                      border: `1px solid ${theme.palette.themePrimary}`
                    }
                  },
                  dayIsToday: {
                    backgroundColor: theme.palette.themePrimary,
                    color: theme.palette.white,
                    fontWeight: FontWeights.semibold,
                    border: `2px solid ${theme.palette.themePrimary}`,
                    ':hover': {
                      backgroundColor: theme.palette.themeDark,
                      color: theme.palette.white,
                      border: `2px solid ${theme.palette.themeDark}`
                    }
                  },
                  dayIsSelected: {
                    backgroundColor: theme.palette.themeDark,
                    color: theme.palette.white,
                    fontWeight: FontWeights.semibold,
                    border: `2px solid ${theme.palette.themeDark}`,
                    ':hover': {
                      backgroundColor: theme.palette.themeDarker,
                      color: theme.palette.white,
                      border: `2px solid ${theme.palette.themeDarker}`
                    }
                  },
                  dayIsDisabled: {
                    color: theme.palette.neutralTertiary,
                    backgroundColor: 'transparent'
                  },
                  navigationButton: {
                    color: theme.palette.neutralPrimary,
                    backgroundColor: 'transparent',
                    border: 'none',
                    ':hover': {
                      backgroundColor: theme.palette.neutralLighter,
                      color: theme.palette.themePrimary
                    }
                  },
                  goTodayButton: {
                    color: theme.palette.themePrimary,
                    fontWeight: FontWeights.semibold,
                    fontSize: '14px',
                    fontFamily: theme.fonts.medium.fontFamily,
                    padding: '8px 16px',
                    borderRadius: '2px',
                    border: `1px solid ${theme.palette.themePrimary}`,
                    backgroundColor: 'transparent',
                    ':hover': {
                      backgroundColor: theme.palette.themePrimary,
                      color: theme.palette.white
                    }
                  }
                }}
              />
            </Stack>
          </FocusTrapZone>
        </Callout>
      )}
    </div>
  );
};

export default ProfessionalDatePicker;