const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ Allow both localhost and production frontend
const allowedOrigins = [
    'http://localhost:5001',
    'https://chatgram-frontend.onrender.com'  // <-- update with your live frontend URL
];

// ✅ CORS setup for express routes
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// ✅ Enable express.json middleware
app.use(express.json());

// ✅ CORS for Socket.IO
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// ✅ CORS preflight handling
app.options('*', cors());

// ✅ Connect MongoDB
connectDB();

// ================= Socket.IO Events =================
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id} at ${new Date().toLocaleTimeString()}`);

    socket.on('joinRoom', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User with ID ${userId} joined room: ${userId}`);
        } else {
            console.error('joinRoom event received without userId');
        }
    });

    socket.on('typing', (userId) => {
        if (userId) {
            console.log(`User ${userId} is typing...`);
            socket.broadcast.emit('typing', userId);
        } else {
            console.error('typing event received without userId');
        }
    });

    socket.on('stopTyping', (userId) => {
        if (userId) {
            console.log(`User ${userId} stopped typing`);
            socket.broadcast.emit('stopTyping', userId);
        } else {
            console.error('stopTyping event received without userId');
        }
    });

    socket.on('sendMessage', ({ message, senderId, receiverId }) => {
        if (message && senderId && receiverId) {
            console.log(`Message: "${message}" from ${senderId} to ${receiverId}`);
            io.to(receiverId).emit('receiveMessage', {
                message,
                senderId,
                timestamp: new Date().toISOString(),
                receiverId,
            });
        } else {
            console.error('Incomplete sendMessage payload:', { message, senderId, receiverId });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/post'));
app.use('/api/comment', require('./routes/comment'));

// ✅ Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
