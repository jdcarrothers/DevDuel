const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Lobby = require('./lobby');
const Player = require('./player');
const csv = require('csv-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require("openai");
require('dotenv').config();


let usedLobbyCodes = [];
let lobbies = [];

corsOptions = {
    origin: '*', // or use '*' to allow all origins
};
async function initializeApp() {
  const firebaseModule = await import('./firebaseconfig.mjs');
  const db = firebaseModule.db;
  const collection = firebaseModule.collection;
  const addDoc = firebaseModule.addDoc;
  const getDocs = firebaseModule.getDocs;
  const query = firebaseModule.query;
  const where = firebaseModule.where;
  const updateDoc = firebaseModule.updateDoc;
  const doc = firebaseModule.doc;
  const getDoc = firebaseModule.getDoc;
//   const setDoc = firebaseModule.setDoc;

  const app = express();
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  const openai = new OpenAI({apiKey: `${process.env.VUE_APP_OPENAI_KEY}`});
  app.post('/api/evaluate-code', async (req, res) => {
    try {
        const { question, language, codeSnippet, expectedOutput } = req.body;
        aiModelAsk();
        async function aiModelAsk() {
        
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                  role: "system",
                  content: `You are tasked with evaluating the cleanliness and quality of provided code snippets. Each snippet offers a solution to a specified question. Your evaluation should focus on the code's cleanliness and overall quality, rated on a scale from 0 to 100%, where 100% signifies exceptionally clean and well-structured code. Your response must be concise and in a parsable JSON format, if the code doesnt answer the question correctly and simply hard codes the expected output, then the rating will be a 0. You must include only a rating and reasoning for that rating.
          
                  **Question:** ${question}
                  **Language:** ${language}
                  **Code Snippet:**
                  ${codeSnippet}
                  \`\`\`
                  **Expected Output:** ${expectedOutput}
                  
                  Please provide your assessment in the following JSON structure:
                  {
                    "Rating": "<Insert rating as a interager, 1 to 100>",
                    "Reasoning": "<Insert concise reasoning for the given rating>"
                  }`
                }]
              });
            console.log(JSON.parse(completion.choices[0].message.content));
            res.status(200).send(JSON.parse(completion.choices[0].message.content));
          }
    } catch (error) {
        console.error('Error in /api/evaluate-code:', error);
        res.status(500).send(error.toString());
    }
});

app.post('/api/updateDB', async (req, res) => {
    try {
        const { username, newCodeRating } = req.body;
        console.log(req.body)
        if (typeof newCodeRating !== 'number') {
            return res.status(400).send({ message: "newCodeRating must be a number" });
        }
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("username", "==", username));
        const userQuerySnapshot = await getDocs(q);

        if (userQuerySnapshot.empty) {
            return res.status(404).send({ message: "User not found" });
        }
        const userDoc = userQuerySnapshot.docs[0];
        const statsRef = collection(db, `Users/${userDoc.id}/Stats`);
        const statsQuerySnapshot = await getDocs(statsRef);

        if (statsQuerySnapshot.empty) {
            return res.status(404).send({ message: "Stats not found for user" });
        }

        const statsDoc = statsQuerySnapshot.docs[0];
        const statsData = statsDoc.data().userStats;
        let codeRating = statsData.codeRating;
        let gamesPlayed = statsData.gamesPlayed; 
        gamesPlayed += 1;
        codeRating = (codeRating * (gamesPlayed - 1) + newCodeRating) / gamesPlayed;

        await updateDoc(statsDoc.ref, {
            'userStats.codeRating': codeRating,
            'userStats.gamesPlayed': gamesPlayed
        });

        return res.status(200).send({ message: "User stats updated", codeRating, gamesPlayed });
    } catch (e) {
        console.error("Error in /api/updateDB:", e);
        res.status(500).send({ message: "Error updating user stats", error: e.message });
    }
});


app.post('/api/signup', async (req, res) => {
    try {
        console.log(req.body);
        const userData = req.body;
        userData.codeRating = 0.0;
        userData.gamesPlayed = 0;
        userData.Wins = 0;
        const docRef = await addDoc(collection(db, "Users"), userData);
        res.status(200).send({ message: "User added", id: docRef.id });
    } catch (e) {
        res.status(500).send({ message: "Error adding user", error: e.message });
    }
});

  const server = http.createServer(app);
  const io = socketIO(server, {
    cors: {
      origin: `*`, // Specify the client's origin
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', socket => {

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
        if(lobby.leaderboardPlayers.Length == 2)
        {
            console.log("leaderboard is full");
        }
        else{
            lobby.leaderboardPlayers.push(player.username);
        }
    });

    socket.on('endGame', (lID) => {
        const lobbyIndex = findLobbyIndex(parseInt(lID));
        if (lobbyIndex !== -1) {
            const lobby = lobbies[lobbyIndex];
            const array = lobby.leaderboardPlayers;
            lobbies.splice(lobbyIndex);
            console.log(`Game ended in lobby ${lID}`);
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

  const PORT = process.env.SERVER_PORT;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

initializeApp().catch(error => console.error('Error initializing app:', error));

