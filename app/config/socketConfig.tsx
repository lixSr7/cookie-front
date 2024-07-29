import { io } from "socket.io-client";

const URL = 'https://cookie-rest-api-8fnl.onrender.com';

const socket = io(URL, {
  autoConnect: true, 
  transports: ['websocket'], 
});

socket.on('connect', () => {
  console.log('Connected to the server successfully!');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

export default socket;