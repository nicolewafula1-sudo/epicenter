import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { analyticsService } from '../services/api';
import { useMapStore, useFilterStore } from '../utils/store';

const customIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iI2RjMjYyNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const OutbreakMap = () => {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { center, zoom, heatmapEnabled } = useMapStore();
  const { startDate, endDate } = useFilterStore();

  useEffect(() => {
    const fetchOutbreaks = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getHeatmap(startDate, endDate);
        setOutbreaks(response.data.data || []);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutbreaks();
  }, [startDate, endDate]);

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={zoom} className="w-full h-96">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {loading && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded shadow-lg z-999">
            Loading map data...
          </div>
        )}

        {outbreaks.map((outbreak, idx) => (
          <div key={idx}>
            <Marker
              position={[outbreak.latitude, outbreak.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{outbreak.pathogen}</p>
                  <p>Confidence: {(outbreak.count * 100).toFixed(1)}%</p>
                  <p>Location: ({outbreak.latitude.toFixed(3)}, {outbreak.longitude.toFixed(3)})</p>
                </div>
              </Popup>
            </Marker>

            {heatmapEnabled && (
              <Circle
                center={[outbreak.latitude, outbreak.longitude]}
                radius={outbreak.count * 1000}
                fillOpacity={0.3}
                color="#dc2626"
              />
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default OutbreakMap;
