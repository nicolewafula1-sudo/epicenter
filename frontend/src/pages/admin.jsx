import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { adminService } from '../services/api';
import { useAuthStore } from '../utils/store';
import Link from 'next/link';

export default function AdminPanel() {
  const router = useRouter();
  const { token, role } = useAuthStore();
  const [systemHealth, setSystemHealth] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || (role !== 'admin' && role !== 'health_official')) {
      router.push('/dashboard');
    }
  }, [token, role, router]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [health, logs, dups] = await Promise.all([
          adminService.getSystemHealth(),
          adminService.getAuditLogs(50),
          adminService.getDuplicateReport(),
        ]);

        setSystemHealth(health.data.system_health);
        setAuditLogs(logs.data.logs);
        setDuplicates(dups.data.duplicates);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminData();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">⚙️ Admin Panel</h1>
          <Link href="/dashboard" className="hover:bg-red-700 px-4 py-2 rounded">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* System Health */}
        {systemHealth && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="stat-box">
                <div className="value">{systemHealth.active_devices || 0}</div>
                <div className="label">Active Devices</div>
              </div>
              <div className="stat-box">
                <div className="value">{systemHealth.total_outbreaks || 0}</div>
                <div className="label">Total Outbreaks</div>
              </div>
              <div className="stat-box">
                <div className="value">{systemHealth.unique_outbreaks || 0}</div>
                <div className="label">Unique Outbreaks</div>
              </div>
              <div className="stat-box">
                <div className="value">
                  {systemHealth.avg_confidence ? systemHealth.avg_confidence.toFixed(2) : 0}
                </div>
                <div className="label">Avg Confidence</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Audit Logs */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Recent Audit Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Device ID</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{log.device_id}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Duplicate Tracking */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Duplicate Detection Report</h2>
          <p className="text-gray-600 mb-4">
            Found {duplicates.length} potential duplicates merged
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Outbreak 1</th>
                  <th className="px-4 py-2 text-left">Outbreak 2</th>
                  <th className="px-4 py-2 text-left">Pathogen</th>
                  <th className="px-4 py-2 text-left">Similarity</th>
                </tr>
              </thead>
              <tbody>
                {duplicates.slice(0, 10).map((dup) => (
                  <tr key={`${dup.outbreak_id_1}-${dup.outbreak_id_2}`} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{dup.outbreak_id_1}</td>
                    <td className="px-4 py-2">{dup.outbreak_id_2}</td>
                    <td className="px-4 py-2">{dup.pathogen}</td>
                    <td className="px-4 py-2">
                      {(dup.similarity_score * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
