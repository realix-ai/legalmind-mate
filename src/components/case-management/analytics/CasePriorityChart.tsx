
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CasePriorityChartProps {
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

const CasePriorityChart = ({ highPriority, mediumPriority, lowPriority }: CasePriorityChartProps) => {
  const data = [
    { name: 'High', value: highPriority, color: '#ef4444' },
    { name: 'Medium', value: mediumPriority, color: '#f59e0b' },
    { name: 'Low', value: lowPriority, color: '#3b82f6' }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Cases by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        {data.every(item => item.value === 0) ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No case priority data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value} cases`, 'Count']} />
              <Bar dataKey="value" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CasePriorityChart;
