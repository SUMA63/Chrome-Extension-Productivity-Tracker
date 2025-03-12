
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the productivity chart
const data = [
  { time: '9 AM', productive: 65, distracted: 20 },
  { time: '10 AM', productive: 85, distracted: 10 },
  { time: '11 AM', productive: 75, distracted: 25 },
  { time: '12 PM', productive: 50, distracted: 40 },
  { time: '1 PM', productive: 30, distracted: 60 },
  { time: '2 PM', productive: 80, distracted: 10 },
  { time: '3 PM', productive: 90, distracted: 5 },
  { time: '4 PM', productive: 70, distracted: 15 },
];

const ProductivityChart = () => {
  return (
    <Card className="w-full animate-scale-in shadow-soft transition-all hover:shadow-medium">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Productivity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorProductive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorDistracted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -1px rgba(0,0,0,0.02)'
                }}
                itemStyle={{ padding: 0 }}
                labelStyle={{ marginBottom: '0.5rem', fontWeight: 500 }}
              />
              <Area 
                type="monotone" 
                dataKey="productive" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorProductive)" 
                name="Productive"
              />
              <Area 
                type="monotone" 
                dataKey="distracted" 
                stroke="#F87171" 
                fillOpacity={1} 
                fill="url(#colorDistracted)" 
                name="Distracted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityChart;
