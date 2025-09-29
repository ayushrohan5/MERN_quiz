import { io } from 'socket.io-client'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://mern-quiz-backend-0v41.onrender.com'
export const createSocket = () => io(SOCKET_URL, { transports: ['websocket'] })