import React, { useState, useEffect } from 'react';
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
    <ResponsiveContainer width="99%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          fill="#8884d8"
          labelLine={false}
          label
          outerRadius={130}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
