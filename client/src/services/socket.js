import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (!token) return null;

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(window.location.origin, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Socket.IO] Connected to real-time CCMS hub');
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket.IO] Connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
