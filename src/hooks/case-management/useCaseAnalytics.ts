
import { useState, useCallback } from 'react';
import { format, differenceInDays, subDays, isAfter } from 'date-fns';
import { getCases } from '@/utils/documents';
import { Case as CaseType } from '@/utils/documents/types';

type TimeRange = '7days' | '30days' | '90days' | 'all';

type CaseStats = {
  total: number;
  active: number;
  pending: number;
  closed: number;
  highPriority: number;
  deadlinesThisWeek: number;
};

type PieChartData = {
  name: string;
  value: number;
};

type LineChartData = {
  date: string;
  active: number;
  pending: number;
  closed: number;
};

type DeadlineCase = CaseType & {
  daysUntilDeadline: number;
  deadlineFormatted: string;
};

export const useCaseAnalytics = () => {
  const [casesByStatus, setCasesByStatus] = useState<PieChartData[]>([]);
  const [casesByPriority, setCasesByPriority] = useState<PieChartData[]>([]);
  const [casesOverTime, setCasesOverTime] = useState<LineChartData[]>([]);
  const [caseStats, setCaseStats] = useState<CaseStats>({
    total: 0,
    active: 0,
    pending: 0,
    closed: 0,
    highPriority: 0,
    deadlinesThisWeek: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<DeadlineCase[]>([]);

  const calculateStats = useCallback((timeRange: TimeRange) => {
    const now = new Date();
    const cases = getCases();
    
    // Filter cases by time range
    const filteredCases = timeRange === 'all' 
      ? cases 
      : cases.filter(c => {
          const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
          const cutoffDate = subDays(now, days);
          return isAfter(new Date(c.createdAt), cutoffDate);
        });
    
    // Case by status
    const statusCount = filteredCases.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    
    // Cases by priority
    const priorityCount = filteredCases.reduce((acc, c) => {
      acc[c.priority] = (acc[c.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const priorityData = Object.entries(priorityCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    
    // Cases over time
    const datesMap = new Map<string, { active: number, pending: number, closed: number }>();
    
    // Initialize with empty dates for the last n days
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    
    if (timeRange !== 'all') {
      for (let i = days; i >= 0; i--) {
        const date = subDays(now, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        datesMap.set(dateStr, { active: 0, pending: 0, closed: 0 });
      }
    }
    
    // Count cases by date and status
    filteredCases.forEach(c => {
      const dateStr = format(new Date(c.createdAt), 'yyyy-MM-dd');
      
      if (!datesMap.has(dateStr)) {
        datesMap.set(dateStr, { active: 0, pending: 0, closed: 0 });
      }
      
      const current = datesMap.get(dateStr)!;
      current[c.status as keyof typeof current] += 1;
    });
    
    // Convert map to array
    const timeData = Array.from(datesMap.entries())
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, counts]) => ({
        date: format(new Date(date), 'MMM dd'),
        ...counts
      }));
    
    // Overall stats
    const stats: CaseStats = {
      total: filteredCases.length,
      active: statusCount['active'] || 0,
      pending: statusCount['pending'] || 0,
      closed: statusCount['closed'] || 0,
      highPriority: priorityCount['high'] || 0,
      deadlinesThisWeek: 0
    };
    
    // Upcoming deadlines
    const deadlineCases: DeadlineCase[] = filteredCases
      .filter(c => c.deadline && c.status !== 'closed')
      .map(c => {
        const deadlineDate = new Date(c.deadline!);
        const daysUntil = differenceInDays(deadlineDate, now);
        
        return {
          ...c,
          daysUntilDeadline: daysUntil,
          deadlineFormatted: format(deadlineDate, 'MMM dd, yyyy')
        };
      })
      .filter(c => c.daysUntilDeadline > -30) // Show deadlines up to 30 days overdue
      .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
    
    stats.deadlinesThisWeek = deadlineCases.filter(c => 
      c.daysUntilDeadline >= 0 && c.daysUntilDeadline <= 7
    ).length;
    
    setCasesByStatus(statusData);
    setCasesByPriority(priorityData);
    setCasesOverTime(timeData);
    setCaseStats(stats);
    setUpcomingDeadlines(deadlineCases);
  }, []);

  return {
    casesByStatus,
    casesByPriority,
    casesOverTime,
    caseStats,
    upcomingDeadlines,
    calculateStats
  };
};
