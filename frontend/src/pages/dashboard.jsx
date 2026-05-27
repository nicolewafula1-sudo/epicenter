import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../utils/store';
import FilterBar from '../components/FilterBar';
import StatsDashboard from '../components/StatsDashboard';
import OutbreakMap from '../components/OutbreakMap';
import TrendChart from '../components/TrendChart';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [selectedPathogen, setSelectedPathogen] = useState(null);
  const { token, user, logout, role } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📍 Epicenter</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Welcome, {user?.username} ({role})
            </span>
            {role === 'admin' || role === 'health_official' ? (
              <Link href="/admin" className="hover:bg-blue-700 px-4 py-2 rounded">
                Admin Panel
              </Link>
            ) : null}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Statistics */}
        <StatsDashboard />

        {/* Filters */}
        <FilterBar />

        {/* Map Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Map Visualization</h2>
          <OutbreakMap />
        </div>

        {/* Trends Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Trend Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendChart pathogen="E.coli" />
            <TrendChart pathogen="Cholera" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/submit-report"
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-bold text-center"
            >
              Submit Outbreak Report
            </Link>
            <Link
              href="/my-devices"
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-bold text-center"
            >
              My Devices
            </Link>
            <Link
              href="/analytics"
              className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg font-bold text-center"
            >
              Advanced Analytics
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
