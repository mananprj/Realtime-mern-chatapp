import {Server} from 'socket.io';
import express from 'express';
import http from 'http';    

const app = express();
const server = http.createServer(app);

const io = new Server(server , {
    cors: {
        origin: "https://realtime-mern-chatapp-frontend.onrender.com",
    }
});

// used to store online users
const userSocketMap = {};    // {userId: socketId}

export function getReceiverSockrtId(userId) {
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId;  // get userId from query params
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send message to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export {io, server, app};
