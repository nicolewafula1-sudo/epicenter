import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../services/api';

const TrendChart = ({ pathogen }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrend = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getPathogenTrend(pathogen, 30);
        setData(response.data.data || []);
      } catch (error) {
        console.error('Error fetching trend:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pathogen) {
      fetchTrend();
    }
  }, [pathogen]);

  if (!pathogen || loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">{pathogen} Trend (30 days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            name="Cases"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
