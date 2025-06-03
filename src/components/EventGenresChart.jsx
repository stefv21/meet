import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const EventGenresChart = ({ events }) => {
  // Count how many events mention each genre keyword in their summary
  const genreData = [
    { name: 'React',      value: events.filter(e => e.summary?.includes('React')).length },
    { name: 'JavaScript', value: events.filter(e => e.summary?.includes('JavaScript')).length },
    { name: 'Node',       value: events.filter(e => e.summary?.includes('Node')).length },
    { name: 'jQuery',     value: events.filter(e => e.summary?.includes('jQuery')).length },
    { name: 'AngularJS',  value: events.filter(e => e.summary?.includes('AngularJS')).length }
  ];

  // A simple color palette—one per slice
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={genreData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {genreData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
