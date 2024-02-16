const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Lobby = require('../lobby');
const Player = require('../player');
const fs = require('fs');
const csv = require('csv-parser');
const { json } = require('body-parser');
const csvFilePath = "tasks.csv";
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
            const newPlayer = new Player(userID);
            lobbies[lobbyIndex].players.push(newPlayer);
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
    
    socket.on("requestRandomQuestion", (lID) => {
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        const lobby = lobbies[lobbyIndex];
        const csvFilePath = "tasks.csv";
    
        populateJSONObjectFromCSV(csvFilePath)
            .then(result => {
                lobby.currentQuestion = result;
                console.log(lobby)
                socket.emit('questionSent', result);
                console.log(result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    
    });
    socket.on('getQuestion', (lID) => {
        console.log("get q test");
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        console.log(lobbyIndex);
        const lobby = lobbies[lobbyIndex];
        console.log(lobby);
        console.log(lobby.currentQuestion);
        socket.emit('receivedQuetion', lobby.currentQuestion);
    });

    socket.on('correctAnswerAlert', (receivedData) => {
        const lID = receivedData.lobbyID;
        console.log(lID);
        const username = receivedData.username;
        console.log(username)
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        const lobby = lobbies[lobbyIndex];
        const playerIndex = lobby.players.findIndex(player => player.username === username);
        const player = lobby.players[playerIndex]; 
        lobby.players[playerIndex].correct = true;
        console.log(lobby)
        if(lobby.leaderboardPlayers.Length == 3)
        {
            console.log("leaderboard is full");
        }
        else{
            lobby.leaderboardPlayers.push(player);
        }
    });

    socket.on('endGame', (lID) => {
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        if (lobbyIndex !== -1) {
            const lobby = lobbies[lobbyIndex];
            const array = lobby.leaderboardPlayers;
            lobbies.splice(lobbyIndex);
            socket.emit('gameEnded', array);
        }
        else {
            console.error(`Error: Lobby with ID ${lID} not found.`);
            socket.emit('gameEnded', false);
        }
    }
    );



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

    async function populateJSONObjectFromCSV(csvFilePath) {
        return new Promise((resolve, reject) => {
            const rows = [];
    
            const stream = fs.createReadStream(csvFilePath)
                .pipe(csv());
    
            stream.on('data', (row) => {
                rows.push(row);
            });
    
            stream.on('end', () => {
                if (rows.length === 0) {
                    reject(new Error('CSV file is empty'));
                } else {
                    const randomIndex = Math.floor(Math.random() * rows.length);
                    const randomRow = rows[randomIndex];
                    resolve(randomRow);
                }
            });
    
            stream.on('error', (error) => {
                reject(error);
            });
        });
    }
});

const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});
