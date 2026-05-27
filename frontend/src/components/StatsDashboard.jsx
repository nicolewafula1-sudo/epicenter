import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getDashboard();
        setStats(response.data.statistics);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="stat-box">
        <div className="value">{stats.total_outbreaks || 0}</div>
        <div className="label">Total Outbreaks</div>
      </div>

      <div className="stat-box">
        <div className="value">{stats.unique_pathogens || 0}</div>
        <div className="label">Unique Pathogens</div>
      </div>

      <div className="stat-box">
        <div className="value">{stats.affected_counties || 0}</div>
        <div className="label">Affected Counties</div>
      </div>

      <div className="stat-box">
        <div className="value">{stats.reporting_devices || 0}</div>
        <div className="label">Active Devices</div>
      </div>
    </div>
  );
};

export default StatsDashboard;
