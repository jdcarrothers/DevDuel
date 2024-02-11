const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

usedLobbyCodes = [];
// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Handle createLobbyRequest request from the connected user
  socket.on('createLobbyRequest', () => {
    console.log('createLobbyRequest received');
    let lobbyCode
    do{
        lobbyCode = Math.floor(1000 + Math.random() * 9000);
    }while(usedLobbyCodes.includes(lobbyCode));
    console.log(lobbyCode);
    usedLobbyCodes.push(lobbyCode);
    console.log(usedLobbyCodes);
    socket.emit('lobbyCreated',lobbyCode);
    });
  
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
