import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  ResponsiveContainer
} from 'recharts';

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);

  const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'AngularJS'];

  const getData = () => {
    if (!Array.isArray(events)) return [];
    
    return genres.map((genre) => {
      const filteredEvents = events.filter((event) =>
        event?.summary && typeof event.summary === 'string' && event.summary.includes(genre)
      );

      return {
        name: genre,
        value: filteredEvents.length
      };
    });
  };

  useEffect(() => {
    try {
      setData(getData());
    } catch (error) {
      setData([]);
    }
  }, [events]);

  
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const LABEL_OFFSET = 1.07; // Distance multiplier for label positioning
    const x = cx + outerRadius * Math.cos(-midAngle * RADIAN) * LABEL_OFFSET;
    const y = cy + outerRadius * Math.sin(-midAngle * RADIAN) * LABEL_OFFSET;

    return percent ? (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <ResponsiveContainer width="99%" height={400}>
      <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
        <Pie
          data={data}
          dataKey="value"
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel} 
          outerRadius={120} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
