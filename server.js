const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Lobby = require('./lobby');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let usedLobbyCodes = [];
let lobbies = [];

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Additional logic to handle disconnection and lobby cleanup
    });

    socket.on('createLobbyRequest', () => {
        const genLobbyCode = generateUniqueLobbyCode();
        console.log(`Lobby code generated: ${genLobbyCode}`);
        const newLobby = new Lobby(genLobbyCode);
        usedLobbyCodes.push(genLobbyCode);
        lobbies.push(newLobby);
        socket.emit('lobbyCreated', newLobby);
    });

    socket.on('joinLobbyRequest', (receivedData) => {
        const lobbyID = parseInt(receivedData.lobbyID);
        const userID = receivedData.userID;
        const lobbyIndex = findLobbyIndex(lobbyID);

        if (lobbyIndex !== -1) {
            lobbies[lobbyIndex].players.push(userID);
            console.log(`${userID} joined lobby with ID ${lobbyID}`);
            socket.emit('lobbyJoinResponse', true);
        } else {
            console.error(`Error: Lobby with ID ${lobbyID} not found.`);
            socket.emit('lobbyJoinResponse', false);
        }
    });

    socket.on('startQuiz', (lID) => {
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        if (lobbyIndex !== -1) {
            const lobby = lobbies[lobbyIndex];
            lobby.began = true;
            console.log(`Quiz started in lobby ${lID}`);
            socket.emit('quizStarted', true);
        } else {
            console.error(`Error: Lobby with ID ${lID} not found.`);
            socket.emit('quizStarted', false);
        }
    });

    socket.on('checkForPlayers', (lID) => {
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        if (lobbyIndex !== -1) {
            const players = lobbies[lobbyIndex].players;
            socket.emit('recentPlayers', players);
        } else {
            socket.emit('recentPlayers', []);
        }
    });

    socket.on('checkForGameStart', (lID) => {
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        if (lobbyIndex !== -1) {
            const msg = lobbies[lobbyIndex].began ? 'started' : 'notStarted';
            socket.emit('gameStartCheck', msg);
        } else {
            socket.emit('gameStartCheck', 'notFound');
        }
    });

    // Utility functions
    function generateUniqueLobbyCode() {
        let code;
        do {
            code = Math.floor(1000 + Math.random() * 9000);
        } while (usedLobbyCodes.includes(code));
        return code;
    }

    function findLobbyIndex(lobbyID) {
        return lobbies.findIndex(lobby => lobby.lobbyCode === lobbyID);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});
