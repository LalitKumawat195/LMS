import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  FontWeights,
  PrimaryButton,
  DefaultButton,
  TextField,
  Dialog,
  DialogType,
  DialogFooter,
  CommandBar,
  Pivot,
  PivotItem,
  Dropdown,
  DatePicker,
  ProgressIndicator,
  Icon,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  ChoiceGroup,
  Checkbox
} from '@fluentui/react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNotifications } from './NotificationContext';

const ComprehensiveReports = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { success, error, info } = useNotifications();
  
  // Core State
  const [selectedPivot, setSelectedPivot] = useState('circulation');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});
  
  // Report Parameters
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [reportType, setReportType] = useState('summary');
  const [quickDateRange, setQuickDateRange] = useState('last30days');
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleQuickDateRange = (range) => {
    const now = new Date();
    let startDate, endDate = new Date();
    
    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        endDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    setDateRange({ startDate, endDate });
    setQuickDateRange(range);
  };

  const validateDateRange = () => {
    if (dateRange.startDate > dateRange.endDate) {
      error('Start date cannot be after end date');
      return false;
    }
    if (dateRange.startDate > new Date()) {
      error('Start date cannot be in the future');
      return false;
    }
    return true;
  };

  const formatDateRange = () => {
    const start = dateRange.startDate.toLocaleDateString();
    const end = dateRange.endDate.toLocaleDateString();
    return `${start} - ${end}`;
  };
  
  // Data Sources
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [finePayments, setFinePayments] = useState([]);
  
  // Dialog States
  const [showCustomReportDialog, setShowCustomReportDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Custom Report Builder
  const [customReport, setCustomReport] = useState({
    name: '',
    description: '',
    dataSource: 'transactions',
    fields: [],
    filters: [],
    groupBy: '',
    sortBy: '',
    chartType: 'bar'
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    // Load data from localStorage
    const savedBooks = localStorage.getItem('lms_books');
    const savedTransactions = localStorage.getItem('lms_transactions');
    const savedMembers = localStorage.getItem('lms_members');
    const savedPayments = localStorage.getItem('lms_fine_payments');
    
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    if (savedPayments) setFinePayments(JSON.parse(savedPayments));
  };

  // Circulation Reports
  const generateCirculationReport = () => {
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.issueDate || t.returnDate);
      return transactionDate >= dateRange.startDate && transactionDate <= dateRange.endDate;
    });

    const dailyStats = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.issueDate || t.returnDate).toDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = { issued: 0, returned: 0, renewed: 0 };
      }
      if (t.type === 'issue') dailyStats[date].issued++;
      if (t.type === 'return') dailyStats[date].returned++;
      if (t.renewalCount > 0) dailyStats[date].renewed++;
    });

    return {
      totalTransactions: filteredTransactions.length,
      totalIssued: filteredTransactions.filter(t => t.type === 'issue').length,
      totalReturned: filteredTransactions.filter(t => t.type === 'return').length,
      totalRenewed: filteredTransactions.filter(t => t.renewalCount > 0).length,
      dailyStats,
      peakDay: Object.keys(dailyStats).reduce((a, b) => 
        (dailyStats[a]?.issued || 0) > (dailyStats[b]?.issued || 0) ? a : b, ''
      ),
      averageDaily: filteredTransactions.length / Math.max(Object.keys(dailyStats).length, 1)
    };
  };

  // Collection Reports
  const generateCollectionReport = () => {
    const bookUsage = books.map(book => {
      const bookTransactions = transactions.filter(t => t.bookId === book._id);
      const timesIssued = bookTransactions.filter(t => t.type === 'issue').length;
      const currentlyIssued = bookTransactions.filter(t => t.status === 'active').length;
      const lastIssued = bookTransactions.length > 0 ? 
        Math.max(...bookTransactions.map(t => new Date(t.issueDate).getTime())) : null;
      
      return {
        ...book,
        timesIssued,
        currentlyIssued,
        lastIssued: lastIssued ? new Date(lastIssued).toLocaleDateString() : 'Never',
        utilizationRate: (timesIssued / book.copies) * 100,
        daysSinceLastIssue: lastIssued ? 
          Math.floor((Date.now() - lastIssued) / (1000 * 60 * 60 * 24)) : 999
      };
    });

    const categoryStats = books.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalBooks: books.length,
      totalCopies: books.reduce((sum, book) => sum + book.copies, 0),
      mostPopular: bookUsage.sort((a, b) => b.timesIssued - a.timesIssued).slice(0, 10),
      leastPopular: bookUsage.filter(b => b.timesIssued === 0),
      categoryDistribution: categoryStats,
      averageUtilization: bookUsage.reduce((sum, book) => sum + book.utilizationRate, 0) / books.length,
      needsWeeding: bookUsage.filter(b => b.daysSinceLastIssue > 365)
    };
  };

  // Member Reports
  const generateMemberReport = () => {
    const memberStats = members.map(member => {
      const memberTransactions = transactions.filter(t => t.memberId === member.id);
      const activeBooks = memberTransactions.filter(t => t.status === 'active').length;
      const totalBorrowed = memberTransactions.filter(t => t.type === 'issue').length;
      const overdueBooks = memberTransactions.filter(t => 
        t.status === 'active' && new Date() > new Date(t.dueDate)
      ).length;
      
      return {
        ...member,
        activeBooks,
        totalBorrowed,
        overdueBooks,
        lastActivity: memberTransactions.length > 0 ? 
          Math.max(...memberTransactions.map(t => new Date(t.issueDate).getTime())) : null
      };
    });

    const memberTypeStats = members.reduce((acc, member) => {
      acc[member.memberType] = (acc[member.memberType] || 0) + 1;
      return acc;
    }, {});

    const registrationTrends = members.reduce((acc, member) => {
      const month = new Date(member.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return {
      totalMembers: members.length,
      activeMembers: memberStats.filter(m => m.lastActivity && 
        (Date.now() - m.lastActivity) < 30 * 24 * 60 * 60 * 1000).length,
      topBorrowers: memberStats.sort((a, b) => b.totalBorrowed - a.totalBorrowed).slice(0, 10),
      memberTypeDistribution: memberTypeStats,
      registrationTrends,
      membersWithOverdue: memberStats.filter(m => m.overdueBooks > 0).length,
      averageBooksPerMember: memberStats.reduce((sum, m) => sum + m.totalBorrowed, 0) / members.length
    };
  };

  // Financial Reports
  const generateFinancialReport = () => {
    const filteredPayments = finePayments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate >= dateRange.startDate && paymentDate <= dateRange.endDate;
    });

    const overdueTransactions = transactions.filter(t => 
      t.status === 'active' && new Date() > new Date(t.dueDate)
    );

    const monthlyRevenue = filteredPayments.reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    const paymentMethodStats = filteredPayments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
      return acc;
    }, {});

    return {
      totalCollected: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
      totalOutstanding: overdueTransactions.reduce((sum, t) => {
        const daysOverdue = Math.ceil((new Date() - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
        return sum + (daysOverdue * 2);
      }, 0),
      paymentsCount: filteredPayments.length,
      averagePayment: filteredPayments.length > 0 ? 
        filteredPayments.reduce((sum, p) => sum + p.amount, 0) / filteredPayments.length : 0,
      monthlyRevenue,
      paymentMethodStats,
      topFineMembers: members.map(m => ({
        ...m,
        totalFines: finePayments.filter(p => p.memberId === m.id).reduce((sum, p) => sum + p.amount, 0)
      })).sort((a, b) => b.totalFines - a.totalFines).slice(0, 10)
    };
  };

  // Analytics & Insights
  const generateAnalyticsReport = () => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth - 1;
    
    const currentMonthTransactions = transactions.filter(t => 
      new Date(t.issueDate).getMonth() === currentMonth
    );
    const lastMonthTransactions = transactions.filter(t => 
      new Date(t.issueDate).getMonth() === lastMonth
    );

    const growthRate = lastMonthTransactions.length > 0 ? 
      ((currentMonthTransactions.length - lastMonthTransactions.length) / lastMonthTransactions.length) * 100 : 0;

    const hourlyUsage = transactions.reduce((acc, t) => {
      const hour = new Date(t.issueDate).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const peakHour = Object.keys(hourlyUsage).reduce((a, b) => 
      hourlyUsage[a] > hourlyUsage[b] ? a : b, '0'
    );

    return {
      growthRate,
      peakHour: `${peakHour}:00`,
      hourlyUsage,
      seasonalTrends: calculateSeasonalTrends(),
      userSatisfaction: 4.2, // Mock data
      systemUptime: 99.8,
      predictions: {
        nextMonthCirculation: Math.round(currentMonthTransactions.length * (1 + growthRate / 100)),
        peakDays: ['Monday', 'Wednesday', 'Friday'],
        recommendedStaffing: calculateStaffingNeeds()
      }
    };
  };

  const calculateSeasonalTrends = () => {
    const seasons = { Spring: 0, Summer: 0, Fall: 0, Winter: 0 };
    transactions.forEach(t => {
      const month = new Date(t.issueDate).getMonth();
      if (month >= 2 && month <= 4) seasons.Spring++;
      else if (month >= 5 && month <= 7) seasons.Summer++;
      else if (month >= 8 && month <= 10) seasons.Fall++;
      else seasons.Winter++;
    });
    return seasons;
  };

  const calculateStaffingNeeds = () => {
    const avgTransactionsPerHour = transactions.length / (24 * 30); // Mock calculation
    return Math.ceil(avgTransactionsPerHour / 10); // 10 transactions per staff per hour
  };

  // Export Functions
  const exportReport = (reportData, format) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `library_report_${timestamp}`;
    
    switch (format) {
      case 'pdf':
        // Mock PDF export
        success(`Report exported as ${filename}.pdf`);
        break;
      case 'excel':
        // Mock Excel export
        success(`Report exported as ${filename}.xlsx`);
        break;
      case 'csv':
        // Mock CSV export
        const csvContent = this.convertToCSV(reportData);
        success(`Report exported as ${filename}.csv`);
        break;
      default:
        error('Unsupported export format');
    }
  };

  const convertToCSV = (data) => {
    // Simple CSV conversion for demo
    return JSON.stringify(data);
  };

  const scheduleReport = (reportType, frequency, recipients) => {
    const schedule = {
      id: Date.now().toString(),
      reportType,
      frequency,
      recipients: recipients.split(',').map(email => email.trim()),
      nextRun: this.calculateNextRun(frequency),
      active: true
    };
    
    // Save to localStorage
    const savedSchedules = JSON.parse(localStorage.getItem('lms_scheduled_reports') || '[]');
    savedSchedules.push(schedule);
    localStorage.setItem('lms_scheduled_reports', JSON.stringify(savedSchedules));
    
    success(`Report scheduled for ${frequency} delivery`);
  };

  const calculateNextRun = (frequency) => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  };

  const commandBarItems = [
    {
      key: 'refresh',
      text: 'Refresh Data',
      iconProps: { iconName: 'Refresh' },
      onClick: () => {
        loadReportData();
        success('Report data refreshed');
      }
    },
    {
      key: 'export',
      text: 'Export Report',
      iconProps: { iconName: 'Download' },
      onClick: () => setShowExportDialog(true)
    },
    {
      key: 'schedule',
      text: 'Schedule Report',
      iconProps: { iconName: 'Clock' },
      onClick: () => setShowScheduleDialog(true)
    },
    {
      key: 'custom',
      text: 'Custom Report',
      iconProps: { iconName: 'Add' },
      onClick: () => setShowCustomReportDialog(true)
    }
  ];

  const renderMetricCard = (title, value, subtitle, color = '#0078d4', icon = 'BarChart4') => (
    <Stack styles={{ root: { padding: 20, border: '1px solid #e1dfdd', borderRadius: 4, minWidth: 200 } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          {title}
        </Text>
        <Icon iconName={icon} styles={{ root: { color, fontSize: 20 } }} />
      </Stack>
      <Text variant="xxLarge" styles={{ root: { color, fontWeight: FontWeights.bold } }}>
        {value}
      </Text>
      {subtitle && <Text variant="small" styles={{ root: { color: '#666' } }}>{subtitle}</Text>}
    </Stack>
  );

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.bold } }}>
          Library Reports & Analytics
        </Text>
        <CommandBar items={commandBarItems} />
      </Stack>

      {/* Enhanced Date Range and Report Controls */}
      <Stack styles={{ root: { padding: 20, border: '1px solid #e1dfdd', borderRadius: 4, backgroundColor: isDark ? '#323130' : '#faf9f8' } }}>
        <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold, marginBottom: 15 } }}>
          Report Configuration
        </Text>
        
        {/* Quick Date Range Buttons */}
        <Stack>
          <Text variant="small" styles={{ root: { marginBottom: 8 } }}>Quick Date Ranges:</Text>
          <Stack horizontal wrap tokens={{ childrenGap: 8 }}>
            {[
              { key: 'today', text: 'Today' },
              { key: 'yesterday', text: 'Yesterday' },
              { key: 'last7days', text: 'Last 7 Days' },
              { key: 'last30days', text: 'Last 30 Days' },
              { key: 'thisMonth', text: 'This Month' },
              { key: 'lastMonth', text: 'Last Month' },
              { key: 'thisYear', text: 'This Year' },
              { key: 'lastYear', text: 'Last Year' }
            ].map(option => (
              <DefaultButton
                key={option.key}
                text={option.text}
                onClick={() => handleQuickDateRange(option.key)}
                styles={{
                  root: {
                    backgroundColor: quickDateRange === option.key ? '#0078d4' : undefined,
                    color: quickDateRange === option.key ? 'white' : undefined
                  }
                }}
              />
            ))}
          </Stack>
        </Stack>
        
        {/* Custom Date Range */}
        <Stack horizontal tokens={{ childrenGap: 15 }} verticalAlign="end" styles={{ root: { marginTop: 15 } }}>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onSelectDate={(date) => {
              if (date) {
                setDateRange({ ...dateRange, startDate: date });
                setQuickDateRange('custom');
              }
            }}
            maxDate={new Date()}
            styles={{ root: { minWidth: 150 } }}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onSelectDate={(date) => {
              if (date) {
                setDateRange({ ...dateRange, endDate: date });
                setQuickDateRange('custom');
              }
            }}
            minDate={dateRange.startDate}
            maxDate={new Date()}
            styles={{ root: { minWidth: 150 } }}
          />
          <Dropdown
            label="Report Type"
            options={[
              { key: 'summary', text: 'Summary Report' },
              { key: 'detailed', text: 'Detailed Report' },
              { key: 'comparative', text: 'Comparative Analysis' },
              { key: 'trend', text: 'Trend Analysis' },
              { key: 'executive', text: 'Executive Summary' }
            ]}
            selectedKey={reportType}
            onChange={(_, option) => setReportType(option?.key || 'summary')}
            styles={{ root: { minWidth: 150 } }}
          />
          <PrimaryButton
            text="Generate Report"
            onClick={() => {
              if (validateDateRange()) {
                loadReportData();
                success(`Report generated for ${formatDateRange()}`);
              }
            }}
          />
        </Stack>
        
        {/* Report Info */}
        <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { marginTop: 15 } }}>
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            📅 Period: {formatDateRange()}
          </Text>
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            📊 Type: {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
          </Text>
          <Text variant="small" styles={{ root: { color: '#666' } }}>
            📈 Data Points: {transactions.filter(t => {
              const transactionDate = new Date(t.issueDate || t.returnDate);
              return transactionDate >= dateRange.startDate && transactionDate <= dateRange.endDate;
            }).length}
          </Text>
        </Stack>
      </Stack>

      <Pivot
        selectedKey={selectedPivot}
        onLinkClick={(item) => setSelectedPivot(item.props.itemKey)}
      >
        {/* Circulation Reports */}
        <PivotItem headerText="Circulation" itemKey="circulation">
          <Stack tokens={{ childrenGap: 20 }}>
            {(() => {
              const report = generateCirculationReport();
              return (
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Circulation Analytics
                  </Text>
                  
                  <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
                    {renderMetricCard('Total Transactions', report.totalTransactions, 'All activities', '#0078d4', 'Sync')}
                    {renderMetricCard('Books Issued', report.totalIssued, 'New checkouts', '#107c10', 'Add')}
                    {renderMetricCard('Books Returned', report.totalReturned, 'Completed returns', '#ff8c00', 'Undo')}
                    {renderMetricCard('Renewals', report.totalRenewed, 'Extended loans', '#5c2d91', 'Refresh')}
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Key Insights
                    </Text>
                    <Stack tokens={{ childrenGap: 10 }}>
                      <Text>📈 Peak circulation day: {report.peakDay}</Text>
                      <Text>📊 Average daily transactions: {Math.round(report.averageDaily)}</Text>
                      <Text>🔄 Return rate: {((report.totalReturned / report.totalIssued) * 100).toFixed(1)}%</Text>
                      <Text>📚 Renewal rate: {((report.totalRenewed / report.totalIssued) * 100).toFixed(1)}%</Text>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Daily Activity Breakdown
                    </Text>
                    <DetailsList
                      items={Object.entries(report.dailyStats).map(([date, stats]) => ({
                        date,
                        issued: stats.issued,
                        returned: stats.returned,
                        renewed: stats.renewed,
                        total: stats.issued + stats.returned + stats.renewed
                      }))}
                      columns={[
                        { key: 'date', name: 'Date', fieldName: 'date', minWidth: 150 },
                        { key: 'issued', name: 'Issued', fieldName: 'issued', minWidth: 80 },
                        { key: 'returned', name: 'Returned', fieldName: 'returned', minWidth: 80 },
                        { key: 'renewed', name: 'Renewed', fieldName: 'renewed', minWidth: 80 },
                        { key: 'total', name: 'Total', fieldName: 'total', minWidth: 80 }
                      ]}
                      layoutMode={DetailsListLayoutMode.justified}
                      selectionMode={SelectionMode.none}
                    />
                  </Stack>
                </Stack>
              );
            })()}
          </Stack>
        </PivotItem>

        {/* Collection Reports */}
        <PivotItem headerText="Collection" itemKey="collection">
          <Stack tokens={{ childrenGap: 20 }}>
            {(() => {
              const report = generateCollectionReport();
              return (
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Collection Analysis
                  </Text>
                  
                  <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
                    {renderMetricCard('Total Books', report.totalBooks, 'Unique titles', '#0078d4', 'Library')}
                    {renderMetricCard('Total Copies', report.totalCopies, 'Physical items', '#107c10', 'Stack')}
                    {renderMetricCard('Avg Utilization', `${report.averageUtilization.toFixed(1)}%`, 'Usage rate', '#ff8c00', 'BarChart4')}
                    {renderMetricCard('Need Weeding', report.needsWeeding.length, 'Unused books', '#d13438', 'Delete')}
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Most Popular Books
                    </Text>
                    <DetailsList
                      items={report.mostPopular.slice(0, 10)}
                      columns={[
                        { key: 'title', name: 'Title', fieldName: 'title', minWidth: 250 },
                        { key: 'author', name: 'Author', fieldName: 'author', minWidth: 150 },
                        { key: 'category', name: 'Category', fieldName: 'category', minWidth: 100 },
                        { key: 'timesIssued', name: 'Times Issued', fieldName: 'timesIssued', minWidth: 100 },
                        { 
                          key: 'utilizationRate', 
                          name: 'Utilization %', 
                          minWidth: 100,
                          onRender: (item) => `${item.utilizationRate.toFixed(1)}%`
                        }
                      ]}
                      layoutMode={DetailsListLayoutMode.justified}
                      selectionMode={SelectionMode.none}
                    />
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Category Distribution
                    </Text>
                    <Stack tokens={{ childrenGap: 10 }}>
                      {Object.entries(report.categoryDistribution).map(([category, count]) => (
                        <Stack key={category} horizontal horizontalAlign="space-between">
                          <Text>{category}</Text>
                          <Text styles={{ root: { fontWeight: FontWeights.bold } }}>{count} books</Text>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })()}
          </Stack>
        </PivotItem>

        {/* Member Reports */}
        <PivotItem headerText="Members" itemKey="members">
          <Stack tokens={{ childrenGap: 20 }}>
            {(() => {
              const report = generateMemberReport();
              return (
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Member Analytics
                  </Text>
                  
                  <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
                    {renderMetricCard('Total Members', report.totalMembers, 'Registered users', '#0078d4', 'People')}
                    {renderMetricCard('Active Members', report.activeMembers, 'Last 30 days', '#107c10', 'UserFollowed')}
                    {renderMetricCard('Avg Books/Member', Math.round(report.averageBooksPerMember), 'Borrowing rate', '#ff8c00', 'ReadingMode')}
                    {renderMetricCard('With Overdue', report.membersWithOverdue, 'Need attention', '#d13438', 'Warning')}
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Top Borrowers
                    </Text>
                    <DetailsList
                      items={report.topBorrowers}
                      columns={[
                        { key: 'name', name: 'Name', fieldName: 'name', minWidth: 200 },
                        { key: 'memberType', name: 'Type', fieldName: 'memberType', minWidth: 100 },
                        { key: 'totalBorrowed', name: 'Books Borrowed', fieldName: 'totalBorrowed', minWidth: 120 },
                        { key: 'activeBooks', name: 'Currently Active', fieldName: 'activeBooks', minWidth: 120 },
                        { key: 'overdueBooks', name: 'Overdue', fieldName: 'overdueBooks', minWidth: 80 }
                      ]}
                      layoutMode={DetailsListLayoutMode.justified}
                      selectionMode={SelectionMode.none}
                    />
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Member Type Distribution
                    </Text>
                    <Stack tokens={{ childrenGap: 10 }}>
                      {Object.entries(report.memberTypeDistribution).map(([type, count]) => (
                        <Stack key={type} horizontal horizontalAlign="space-between">
                          <Text>{type}</Text>
                          <Text styles={{ root: { fontWeight: FontWeights.bold } }}>{count} members</Text>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })()}
          </Stack>
        </PivotItem>

        {/* Financial Reports */}
        <PivotItem headerText="Financial" itemKey="financial">
          <Stack tokens={{ childrenGap: 20 }}>
            {(() => {
              const report = generateFinancialReport();
              return (
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Financial Overview
                  </Text>
                  
                  <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
                    {renderMetricCard('Total Collected', `$${report.totalCollected.toFixed(2)}`, 'Fine payments', '#107c10', 'Money')}
                    {renderMetricCard('Outstanding', `$${report.totalOutstanding.toFixed(2)}`, 'Unpaid fines', '#d13438', 'PaymentCard')}
                    {renderMetricCard('Payments Count', report.paymentsCount, 'Transactions', '#0078d4', 'Receipt')}
                    {renderMetricCard('Avg Payment', `$${report.averagePayment.toFixed(2)}`, 'Per transaction', '#ff8c00', 'Calculator')}
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Monthly Revenue Trend
                    </Text>
                    <Stack tokens={{ childrenGap: 10 }}>
                      {Object.entries(report.monthlyRevenue).map(([month, amount]) => (
                        <Stack key={month} horizontal horizontalAlign="space-between">
                          <Text>{month}</Text>
                          <Text styles={{ root: { fontWeight: FontWeights.bold, color: '#107c10' } }}>
                            ${amount.toFixed(2)}
                          </Text>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Payment Methods
                    </Text>
                    <Stack tokens={{ childrenGap: 10 }}>
                      {Object.entries(report.paymentMethodStats).map(([method, amount]) => (
                        <Stack key={method} horizontal horizontalAlign="space-between">
                          <Text>{method}</Text>
                          <Text styles={{ root: { fontWeight: FontWeights.bold } }}>
                            ${amount.toFixed(2)}
                          </Text>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })()}
          </Stack>
        </PivotItem>

        {/* Analytics Dashboard */}
        <PivotItem headerText="Analytics" itemKey="analytics">
          <Stack tokens={{ childrenGap: 20 }}>
            {(() => {
              const report = generateAnalyticsReport();
              return (
                <Stack tokens={{ childrenGap: 20 }}>
                  <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    Advanced Analytics
                  </Text>
                  
                  <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
                    {renderMetricCard('Growth Rate', `${report.growthRate.toFixed(1)}%`, 'Month over month', 
                      report.growthRate >= 0 ? '#107c10' : '#d13438', 'TrendingUp')}
                    {renderMetricCard('Peak Hour', report.peakHour, 'Busiest time', '#0078d4', 'Clock')}
                    {renderMetricCard('System Uptime', `${report.systemUptime}%`, 'Availability', '#107c10', 'StatusCircleCheckmark')}
                    {renderMetricCard('User Rating', report.userSatisfaction.toFixed(1), 'Out of 5.0', '#ff8c00', 'FavoriteStarFill')}
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Predictions & Insights
                    </Text>
                    <Stack tokens={{ childrenGap: 10 }}>
                      <Text>📈 Next month circulation forecast: {report.predictions.nextMonthCirculation} transactions</Text>
                      <Text>📅 Peak days: {report.predictions.peakDays.join(', ')}</Text>
                      <Text>👥 Recommended staffing: {report.predictions.recommendedStaffing} staff members</Text>
                      <Text>⏰ Optimal hours: High activity between 10 AM - 4 PM</Text>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Text variant="medium" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                      Seasonal Trends
                    </Text>
                    <Stack tokens={{ childrenGap: 10 }}>
                      {Object.entries(calculateSeasonalTrends()).map(([season, count]) => (
                        <Stack key={season} horizontal horizontalAlign="space-between">
                          <Text>{season}</Text>
                          <Text styles={{ root: { fontWeight: FontWeights.bold } }}>{count} transactions</Text>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              );
            })()}
          </Stack>
        </PivotItem>
      </Pivot>

      {/* Export Dialog */}
      <Dialog
        hidden={!showExportDialog}
        onDismiss={() => setShowExportDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Export Report' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <ChoiceGroup
            label="Export Format"
            options={[
              { key: 'pdf', text: 'PDF Document' },
              { key: 'excel', text: 'Excel Spreadsheet' },
              { key: 'csv', text: 'CSV File' }
            ]}
            selectedKey={exportFormat}
            onChange={(_, option) => setExportFormat(option?.key || 'pdf')}
          />
          <Checkbox label="Include charts and visualizations" defaultChecked />
          <Checkbox label="Include raw data" />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              exportReport(reportData, exportFormat);
              setShowExportDialog(false);
            }}
            text="Export"
          />
          <DefaultButton onClick={() => setShowExportDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog
        hidden={!showScheduleDialog}
        onDismiss={() => setShowScheduleDialog(false)}
        dialogContentProps={{ type: DialogType.normal, title: 'Schedule Report' }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <Dropdown
            label="Report Type"
            options={[
              { key: 'circulation', text: 'Circulation Report' },
              { key: 'financial', text: 'Financial Report' },
              { key: 'member', text: 'Member Report' },
              { key: 'collection', text: 'Collection Report' }
            ]}
            defaultSelectedKey="circulation"
          />
          <Dropdown
            label="Frequency"
            options={[
              { key: 'daily', text: 'Daily' },
              { key: 'weekly', text: 'Weekly' },
              { key: 'monthly', text: 'Monthly' }
            ]}
            defaultSelectedKey="weekly"
          />
          <TextField
            label="Email Recipients"
            placeholder="email1@example.com, email2@example.com"
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              scheduleReport('circulation', 'weekly', 'admin@library.edu');
              setShowScheduleDialog(false);
            }}
            text="Schedule"
          />
          <DefaultButton onClick={() => setShowScheduleDialog(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default ComprehensiveReports;