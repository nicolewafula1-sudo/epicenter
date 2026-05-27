import React, { useState } from 'react';
import { useFilterStore } from '../utils/store';

const FilterBar = () => {
  const {
    startDate,
    endDate,
    selectedPathogen,
    setStartDate,
    setEndDate,
    setPathogen,
    reset,
  } = useFilterStore();

  const pathogens = [
    'E.coli',
    'Salmonella',
    'Cholera',
    'Typhoid',
    'Influenza',
    'COVID-19',
    'Ebola',
    'Dengue',
    'Malaria',
    'Tuberculosis',
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pathogen</label>
          <select
            value={selectedPathogen || ''}
            onChange={(e) => setPathogen(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Pathogens</option>
            {pathogens.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
