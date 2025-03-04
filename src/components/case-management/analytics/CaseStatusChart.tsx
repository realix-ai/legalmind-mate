
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CaseStatusChartProps {
  activeCases: number;
  pendingCases: number;
  closedCases: number;
}

const CaseStatusChart = ({ activeCases, pendingCases, closedCases }: CaseStatusChartProps) => {
  const data = [
    { name: 'Active', value: activeCases, color: '#3b82f6' },
    { name: 'Pending', value: pendingCases, color: '#f59e0b' },
    { name: 'Closed', value: closedCases, color: '#10b981' }
  ].filter(item => item.value > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Cases by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No case data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} cases`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseStatusChart;
