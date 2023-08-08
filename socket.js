import io from 'socket.io-client';
const socket = io('https://chat-back-4n4o.onrender.com', {
  // const socket = io("http://localhost:9999", {
  transports: ['websocket'],
});

export default socket;
