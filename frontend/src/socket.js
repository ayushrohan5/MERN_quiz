import { io } from 'socket.io-client'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'mern-quizwalsis-steel.vercel.app'
export const createSocket = () => io(SOCKET_URL, { transports: ['websocket'] })