
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCaseCrud } from '@/hooks/case-management/useCaseCrud';
import { useCaseAnalytics } from '@/hooks/case-management/useCaseAnalytics';
import CaseStatsCards from '@/components/case-management/analytics/CaseStatsCards';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CaseAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const { loadCases } = useCaseCrud();
  const { 
    casesByStatus,
    casesByPriority,
    casesOverTime,
    caseStats,
    upcomingDeadlines,
    calculateStats
  } = useCaseAnalytics();

  useEffect(() => {
    loadCases();
    calculateStats(timeRange);
  }, [loadCases, calculateStats, timeRange]);

  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Case Analytics</h1>
              <p className="text-muted-foreground">Track and analyze your case management metrics</p>
            </div>
            
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <CaseStatsCards stats={caseStats} />
          
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="status">Status Analysis</TabsTrigger>
              <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cases by Status</CardTitle>
                    <CardDescription>Distribution of cases by their current status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={casesByStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {casesByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cases by Priority</CardTitle>
                    <CardDescription>Distribution of cases by priority level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={casesByPriority}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>Case Creation Over Time</CardTitle>
                  <CardDescription>Number of cases created over the selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={casesOverTime}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="active" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="pending" stroke="#ffc658" />
                        <Line type="monotone" dataKey="closed" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deadlines">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Cases with upcoming deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingDeadlines.map((deadline) => (
                        <div 
                          key={deadline.id}
                          className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <h3 className="font-medium">{deadline.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {deadline.status} • {deadline.priority} priority
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              deadline.daysUntilDeadline < 3 ? 'text-red-500' : 
                              deadline.daysUntilDeadline < 7 ? 'text-amber-500' : 'text-green-500'
                            }`}>
                              {deadline.daysUntilDeadline > 0 
                                ? `${deadline.daysUntilDeadline} days remaining` 
                                : deadline.daysUntilDeadline === 0 
                                  ? 'Due today' 
                                  : `Overdue by ${Math.abs(deadline.daysUntilDeadline)} days`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {deadline.deadlineFormatted}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No upcoming deadlines found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default CaseAnalytics;
