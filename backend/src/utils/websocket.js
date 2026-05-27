import { logger } from './logger.js';

const connectedClients = new Set();

export const setupWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    logger.info('WebSocket client connected');
    connectedClients.add(ws);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        logger.debug('WebSocket message received:', message);
        // Handle specific message types here
      } catch (error) {
        logger.error('WebSocket message parsing error:', error);
      }
    });

    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
      connectedClients.delete(ws);
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });
  });
};

export const broadcastUpdate = (data) => {
  const message = JSON.stringify(data);
  connectedClients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
};

export const broadcastOutbreakUpdate = (outbreak) => {
  broadcastUpdate({
    type: 'outbreak_update',
    data: outbreak,
    timestamp: new Date(),
  });
};

export const getConnectedClientsCount = () => connectedClients.size;
