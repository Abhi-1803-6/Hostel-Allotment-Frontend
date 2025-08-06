import { io } from 'socket.io-client';

// Use the VITE_API_URL from environment variables
const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const socket = io(URL, {
    autoConnect: false // We will connect manually from the component
});

export default socket;