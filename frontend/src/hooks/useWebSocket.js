import { useEffect, useState, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

export const useWebSocket = () => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [outbreakUpdates, setOutbreakUpdates] = useState([]);

  useEffect(() => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'outbreak_update') {
          setOutbreakUpdates((prev) => [data.data, ...prev.slice(0, 99)]);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setWs(null);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        // Reconnection logic
      }, 5000);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  return { isConnected, outbreakUpdates };
};

export const useOutbreakData = () => {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isConnected, outbreakUpdates } = useWebSocket();

  useEffect(() => {
    // Add new updates to the list
    if (outbreakUpdates.length > 0) {
      setOutbreaks((prev) => [outbreakUpdates[0], ...prev]);
    }
  }, [outbreakUpdates]);

  return { outbreaks, loading, error, isConnected };
};
