import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  DatePicker,
  DetailsList,
  SelectionMode,
  MessageBar,
  MessageBarType,
  mergeStyles,
  FontWeights,
  Icon,
  Separator
} from '@fluentui/react';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const ComprehensiveReports = () => {
  const { isDark } = useTheme();
  const { success, error } = useNotifications();
  const [reportType, setReportType] = useState('circulation');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const cardStyle = mergeStyles({
    background: isDark ? '#323130' : '#ffffff',
    border: `1px solid ${isDark ? '#484644' : '#d2d0ce'}`,
    borderRadius: '8px',
    padding: '20px',
    boxShadow: isDark 
      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 4px 16px rgba(0, 0, 0, 0.05)'
  });

  const reportOptions = [
    { key: 'circulation', text: 'Circulation Report' },
    { key: 'overdue', text: 'Overdue Books Report' },
    { key: 'members', text: 'Member Activity Report' },
    { key: 'fines', text: 'Fine Collection Report' }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      let endpoint = '';
      switch (reportType) {
        case 'circulation':
          endpoint = '/api/transactions';
          break;
        case 'overdue':
          endpoint = '/api/books/overdue';
          break;
        case 'members':
          endpoint = '/api/users';
          break;
        case 'fines':
          endpoint = '/api/payments';
          break;
        default:
          endpoint = '/api/transactions';
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
        success(`${reportOptions.find(r => r.key === reportType)?.text} generated successfully`);
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (err) {
      error('Failed to generate report');
      console.error('Report generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = () => {
    const csvContent = convertToCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Report exported successfully');
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    
    // Flatten objects and convert to strings
    const flattenedData = data.map(row => {
      const flattened = {};
      Object.keys(row).forEach(key => {
        const value = row[key];
        if (typeof value === 'object' && value !== null) {
          // Handle nested objects
          if (value._id) {
            flattened[key] = value.name || value.title || value._id;
          } else {
            flattened[key] = JSON.stringify(value);
          }
        } else {
          flattened[key] = value || '';
        }
      });
      return flattened;
    });
    
    const headers = Object.keys(flattenedData[0]).join(',');
    const rows = flattenedData.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const getColumns = () => {
    if (!reportData.length) return [];
    
    const keys = Object.keys(reportData[0]);
    return keys.map(key => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      fieldName: key,
      minWidth: 100,
      isResizable: true,
      onRender: (item) => {
        const value = item[key];
        if (typeof value === 'object' && value !== null) {
          return value.name || value.title || value._id || JSON.stringify(value);
        }
        return value || '';
      }
    }));
  };

  return (
    <Stack tokens={{ childrenGap: 24 }}>
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="xxLarge" styles={{ 
          root: { 
            fontWeight: FontWeights.bold,
            color: isDark ? '#ffffff' : '#323130'
          } 
        }}>
          Reports & Analytics
        </Text>
        <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Generate comprehensive reports for library operations and analytics.
        </Text>
      </Stack>

      <div className={cardStyle}>
        <Stack tokens={{ childrenGap: 16 }}>
          <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
            Report Configuration
          </Text>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 200px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', height: '20px', color: isDark ? '#ffffff' : '#323130' }}>Report Type</label>
              <Dropdown
                options={reportOptions}
                selectedKey={reportType}
                onChange={(e, option) => setReportType(option.key)}
                styles={{ root: { height: '32px' } }}
              />
            </div>
            
            <div style={{ flex: '0 0 150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', height: '20px', color: isDark ? '#ffffff' : '#323130' }}>Start Date</label>
              <DatePicker
                value={startDate}
                onSelectDate={setStartDate}
                styles={{ root: { height: '32px' } }}
              />
            </div>
            
            <div style={{ flex: '0 0 150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', height: '20px', color: isDark ? '#ffffff' : '#323130' }}>End Date</label>
              <DatePicker
                value={endDate}
                onSelectDate={setEndDate}
                styles={{ root: { height: '32px' } }}
              />
            </div>
          </div>

          <Stack horizontal tokens={{ childrenGap: 12 }}>
            <PrimaryButton
              text={isGenerating ? "Generating..." : "Generate Report"}
              onClick={generateReport}
              disabled={isGenerating}
              iconProps={{ iconName: 'BarChart4' }}
            />
            
            {reportData.length > 0 && (
              <DefaultButton
                text="Export CSV"
                onClick={exportReport}
                iconProps={{ iconName: 'Download' }}
              />
            )}
          </Stack>
        </Stack>
      </div>

      {reportData.length > 0 && (
        <div className={cardStyle}>
          <Stack tokens={{ childrenGap: 16 }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                Report Results
              </Text>
              <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
                {reportData.length} records found
              </Text>
            </Stack>
            
            <DetailsList
              items={reportData.slice(0, 100)}
              columns={getColumns()}
              selectionMode={SelectionMode.none}
              styles={{
                root: {
                  maxHeight: '400px',
                  overflow: 'auto'
                }
              }}
            />
            
            {reportData.length > 100 && (
              <MessageBar messageBarType={MessageBarType.info}>
                Showing first 100 records. Export to CSV to view all {reportData.length} records.
              </MessageBar>
            )}
          </Stack>
        </div>
      )}

      {reportData.length === 0 && !isGenerating && (
        <div className={cardStyle}>
          <Stack tokens={{ childrenGap: 16 }} horizontalAlign="center" styles={{ root: { padding: '40px' } }}>
            <Icon iconName="BarChart4" styles={{ root: { fontSize: '48px', color: isDark ? '#605e5c' : '#a19f9d' } }} />
            <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
              No Report Generated
            </Text>
            <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
              Select report type and date range, then click "Generate Report" to view data.
            </Text>
          </Stack>
        </div>
      )}
    </Stack>
  );
};

export default ComprehensiveReports;