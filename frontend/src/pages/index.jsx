import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Epicenter</h1>
        <p className="text-xl mb-8">Outbreak Mapping & Monitoring System</p>

        <div className="space-y-4">
          <p className="text-lg">Real-time disease surveillance across Kenya</p>

          <div className="flex gap-4 justify-center mt-12">
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400 border border-white"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="bg-blue-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">📍 Interactive Map</h3>
            <p>Real-time visualization of outbreak locations across Kenya</p>
          </div>

          <div className="bg-blue-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">📊 Analytics</h3>
            <p>Comprehensive dashboards with trends and forecasting</p>
          </div>

          <div className="bg-blue-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">🔒 Secure</h3>
            <p>End-to-end encryption and role-based access control</p>
          </div>
        </div>
      </div>
    </div>
  );
}
